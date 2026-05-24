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
npx prisma migrate dev
npm run db:seed
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

- **Client / Compagnie** : http://localhost:5173/auth
  - Client → après succès : `/dashboard-client`
  - Compagnie → après succès : `/dashboard-compagnie`
- **Administration** (URL directe uniquement) : http://localhost:5173/admin-login
  - Admin → après succès : `/admin-dashboard`
  - Compte seed : `admin@fasobus.bf` / `admin123` (`npm run db:seed`)
- Mots de passe hashés (bcrypt), token JWT avec `role` renvoyé par l’API
- Modèle Prisma unifié : `User` avec rôles `CLIENT` | `COMPANY` | `ADMIN`

### Routes frontend

| Route | Accès |
|-------|-------|
| `/` | Public (visiteurs) |
| `/auth` | Connexion client / compagnie |
| `/dashboard-client` | Guard CLIENT |
| `/dashboard-compagnie` | Guard COMPANY |
| `/admin-login` | Connexion admin (non liée depuis l’accueil) |
| `/admin-dashboard` | Guard ADMIN |

### Routes API

| Méthode | Route |
|---------|-------|
| GET | `/api/health` |
| POST | `/api/auth/register-client` |
| POST | `/api/auth/login-client` |
| POST | `/api/auth/register-company` |
| POST | `/api/auth/login-company` |
| POST | `/api/auth/login-admin` |

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
