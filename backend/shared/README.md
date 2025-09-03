# Shared Backend Utilities

Common utilities, configurations, and middleware shared across all backend services.

## Structure

- `config/` - Shared configuration files
- `middleware/` - Common middleware functions
- `utils/` - Utility functions and helpers
- `models/` - Shared data models
- `database/` - Database connection and migration utilities

## Usage

Services can import shared utilities:

```javascript
const { logger } = require('../shared/utils');
const { authMiddleware } = require('../shared/middleware');
const { connectDB } = require('../shared/database');
```
