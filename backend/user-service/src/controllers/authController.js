const User = require('../models/User');
const logger = require('../utils/logger');
const { sendEmail } = require('../services/emailService');
const { generateTokens, verifyRefreshToken } = require('../utils/tokenUtils');
const { getClientInfo } = require('../utils/helpers');

class AuthController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      const clientInfo = getClientInfo(req);

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phone,
        metadata: {
          registrationIP: clientInfo.ip,
          userAgent: clientInfo.userAgent
        }
      });

      // Generate email verification token
      const verificationToken = user.getEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      // Send verification email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Email Verification',
          template: 'emailVerification',
          data: {
            name: user.fullName,
            verificationToken,
            verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
          }
        });
      } catch (emailError) {
        logger.error('Email sending failed:', emailError);
        // Don't fail registration if email fails
      }

      logger.info(`User registered: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification.',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified
          }
        }
      });

    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during registration'
      });
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const clientInfo = getClientInfo(req);

      // Check for user and include password
      const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          error: 'Account temporarily locked due to too many failed login attempts'
        });
      }

      // Check if account is suspended
      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          error: 'Account has been suspended'
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Update last login info
      user.lastLogin = new Date();
      user.metadata.lastLoginIP = clientInfo.ip;
      user.metadata.userAgent = clientInfo.userAgent;
      await user.save({ validateBeforeSave: false });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
          }
        }
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during login'
      });
    }
  }

  // @desc    Logout user
  // @route   POST /api/auth/logout
  // @access  Private
  async logout(req, res) {
    try {
      // In a production app, you might want to blacklist the token
      // For now, we'll just return success
      logger.info(`User logged out: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during logout'
      });
    }
  }

  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin,
            preferences: user.preferences,
            createdAt: user.createdAt
          }
        }
      });

    } catch (error) {
      logger.error('Get me error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  // @desc    Forgot password
  // @route   POST /api/auth/forgot-password
  // @access  Public
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'No user found with that email'
        });
      }

      // Generate reset token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });

      // Send reset email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Request',
          template: 'passwordReset',
          data: {
            name: user.fullName,
            resetToken,
            resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
          }
        });

        res.json({
          success: true,
          message: 'Password reset email sent'
        });

      } catch (emailError) {
        logger.error('Password reset email failed:', emailError);
        
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
          success: false,
          error: 'Email could not be sent'
        });
      }

    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  // @desc    Reset password
  // @route   PUT /api/auth/reset-password/:token
  // @access  Public
  async resetPassword(req, res) {
    try {
      const { password } = req.body;
      const { token } = req.params;

      // Find user by reset token
      const user = await User.findByResetToken(token);

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token'
        });
      }

      // Set new password
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      logger.info(`Password reset successful: ${user.email}`);

      res.json({
        success: true,
        message: 'Password reset successful'
      });

    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  // @desc    Verify email
  // @route   GET /api/auth/verify-email/:token
  // @access  Public
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // Find user by verification token
      const user = await User.findByVerificationToken(token);

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired verification token'
        });
      }

      // Update user
      user.emailVerified = true;
      user.status = 'active';
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });

      logger.info(`Email verified: ${user.email}`);

      res.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  // @desc    Resend verification email
  // @route   POST /api/auth/resend-verification
  // @access  Public
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'No user found with that email'
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email is already verified'
        });
      }

      // Generate new verification token
      const verificationToken = user.getEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      // Send verification email
      try {
        await sendEmail({
          email: user.email,
          subject: 'Email Verification',
          template: 'emailVerification',
          data: {
            name: user.fullName,
            verificationToken,
            verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
          }
        });

        res.json({
          success: true,
          message: 'Verification email sent'
        });

      } catch (emailError) {
        logger.error('Verification email failed:', emailError);
        return res.status(500).json({
          success: false,
          error: 'Email could not be sent'
        });
      }

    } catch (error) {
      logger.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  // @desc    Refresh token
  // @route   POST /api/auth/refresh-token
  // @access  Private
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token required'
        });
      }

      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      // Generate new tokens
      const tokens = generateTokens(user);

      res.json({
        success: true,
        data: {
          tokens
        }
      });

    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  }

  // Additional methods for admin operations...
  async getUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};
      if (req.query.role) query.role = req.query.role;
      if (req.query.status) query.status = req.query.status;
      if (req.query.search) {
        query.$or = [
          { firstName: { $regex: req.query.search, $options: 'i' } },
          { lastName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  async updateUserStatus(req, res) {
    try {
      const { status } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      logger.info(`User status updated: ${user.email} -> ${status}`);

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      logger.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      logger.info(`User role updated: ${user.email} -> ${role}`);

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      logger.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
}

module.exports = new AuthController();