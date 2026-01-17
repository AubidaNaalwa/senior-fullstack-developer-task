# Improvements / Next Steps

## Authentication
- in production I’d use real auth (JWT/session).
- I’d also add expiry, refresh handling, and proper logout semantics.

## Validation and error handling
- Add request validation (DTOs) and consistent error messages.
- Improve client errors (show specific messages for 401 vs 404 vs 500).

## Roles and permissions
- Centralize role definitions (constants/shared types) to avoid string drift between FE/BE.
- Potentially support permissions (capabilities) instead of roles only.

## Testing
- Add unit tests for:
  - migration conversion logic
  - auth guard behavior (especially `Deleted`)
  - router guard behavior and Vuex session restore

## API shape
- Add a dedicated endpoint like `/me` instead of using `/` for current user.
- Add a small “health” endpoint for easier environment checks.
