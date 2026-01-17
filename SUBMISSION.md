# Submission Notes

## What I implemented

### Backend (NestJS + TypeORM + SQLite)

#### Multiple roles per user
- Replaced the single `role` column with `roles`, stored as a JSON array.
- Updated the `User` entity to expose `roles: string[]`.

#### User status enum
- Replaced the old boolean status with a string enum: `Enabled`, `Disabled`, `Deleted`.
- Updated the `User` entity to expose `status` as the enum value.

#### Migrations
- Added a migration that upgrades the existing `users` table:
  - Creates a new table with `roles` (JSON) and `status` (TEXT)
  - Copies existing users while converting:
    - `Admin` → `["admin"]`
    - `Editor` → `["editor"]`
    - `User` → `["regular"]`
  - Converts old status values into `Enabled` / `Disabled`
  - Renames the new table back to `users`

#### Authorization
- The protected endpoint `GET /` reads the `token` request header as the username.
- If the user is not found → returns 401.
- If the user’s status is `Deleted` → returns 401.
- I applied the same check to the login endpoint as well, so deleted users can’t log in.

### Frontend (Vue + Vuex + Vue Router)

#### Vuex as the single place for HTTP + state
- All HTTP calls are done inside Vuex actions.
- The store keeps:
  - `token` (username) persisted in `localStorage`
  - `user` loaded from the backend
  - `loading` and `error` for basic UI feedback
- On page refresh, the app restores the session by calling the backend with the stored token.

#### Role-based route guards
- Routes define `meta.allowedRoles`.
- A global router guard enforces access:
  - Home: `regular`, `editor`, `admin`
  - Editor: `editor`, `admin`
  - Admin: `admin`
- If the user is not authenticated → redirect to `/`.
- If the user lacks the required role → redirect to `/home`.

#### UI tweaks (bonus)
- Updated the navbar to be cleaner and show only links the user is allowed to access.
- Displayed the username on each page in the welcome message.
