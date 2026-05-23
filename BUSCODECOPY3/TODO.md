# BUSCODECOPY3 - TODO (sync backend/frontend + DB)

- [ ] Change backend port to avoid EADDRINUSE (use PORT env default 3001) and restart server
- [ ] Verify backend health endpoint via curl
- [ ] Add missing API endpoints for auth + companies + trips + bookings (Prisma+SQLite)
- [ ] Connect frontend to backend (replace mocks with real API calls) and implement JWT auth flow
- [ ] End-to-end test: register/login (CLIENT + COMPANY) -> dashboard -> DB persistence check
