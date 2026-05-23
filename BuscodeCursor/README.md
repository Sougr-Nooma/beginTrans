# BuscodeCursor — FasoBus (architecture séparée)

Projet en **deux applications indépendantes** :

| Dossier | Rôle | Port |
|---------|------|------|
| `backend/` | API Express + Prisma SQLite + JWT | **5000** |
| `frontend/` | React + Vite + React Router | **5173** |

## Installation

### 1. Backend

```powershell
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
```

### 2. Frontend

```powershell
cd ..\frontend
npm install
copy .env.example .env
```

## Lancer les deux serveurs

**Terminal 1 — API :**

```powershell
cd backend
npm run dev
```

→ http://localhost:5000/api/health

**Terminal 2 — Interface :**

```powershell
cd frontend
npm run dev
```

→ http://localhost:5173

## Authentification

- Page : http://localhost:5173/auth
- **Client** → après succès : `/dashboard-client`
- **Compagnie** → après succès : `/dashboard-compagnie`
- Mots de passe hashés (bcrypt), token JWT renvoyé par l’API
- Modèle Prisma unifié : `User` avec rôles `CLIENT` | `COMPANY` | `ADMIN`

### Routes API

| Méthode | Route |
|---------|-------|
| GET | `/api/health` |
| POST | `/api/auth/register-client` |
| POST | `/api/auth/login-client` |
| POST | `/api/auth/register-company` |
| POST | `/api/auth/login-company` |

## Variables d'environnement

**backend/.env**

```
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="votre-secret"
FRONTEND_URL="http://localhost:5173"
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5000/api
```

## Scripts utiles

```powershell
# Backend
cd backend && npm run db:studio

# Frontend
cd frontend && npm run lint
```
