const express = require('express');
const { body, query } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('preferences.language')
    .optional()
    .isIn(['en', 'vi'])
    .withMessage('Language must be en or vi'),
  body('preferences.timezone')
    .optional()
    .isString()
    .withMessage('Timezone must be a valid string')
], validate, userController.updateProfile);

router.post('/upload-avatar', userController.uploadAvatar);
router.delete('/avatar', userController.deleteAvatar);

// User preferences
router.get('/preferences', userController.getPreferences);
router.put('/preferences', [
  body('language')
    .optional()
    .isIn(['en', 'vi'])
    .withMessage('Language must be en or vi'),
  body('timezone')
    .optional()
    .isString()
    .withMessage('Timezone must be a valid string'),
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification setting must be boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification setting must be boolean')
], validate, userController.updatePreferences);

// Admin only routes
router.get('/', authorize('admin', 'super_admin'), [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['user', 'admin', 'agent'])
    .withMessage('Role must be user, admin, or agent'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended', 'pending'])
    .withMessage('Status must be active, inactive, suspended, or pending'),
  query('search')
    .optional()
    .isString()
    .trim()
    .withMessage('Search must be a string')
], validate, userController.getUsers);

router.get('/:id', authorize('admin', 'super_admin'), userController.getUserById);

router.put('/:id', authorize('admin', 'super_admin'), [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'agent'])
    .withMessage('Role must be user, admin, or agent'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended')
], validate, userController.updateUser);

router.delete('/:id', authorize('super_admin'), userController.deleteUser);

// User statistics (admin only)
router.get('/stats/overview', authorize('admin', 'super_admin'), userController.getUserStats);
router.get('/stats/activity', authorize('admin', 'super_admin'), userController.getUserActivity);

module.exports = router;