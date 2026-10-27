# DESIGNVERSE — REST API DOCUMENTATION (v2.0)

## 1. Base URL
`http://localhost:8000/api/v1`

## 2. Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | User authentication & JWT issuance |
| `POST` | `/projects` | Create a new room design project |
| `GET` | `/projects` | List active user projects |
| `POST` | `/analysis/room` | Upload room photograph & run CV object analysis |
| `POST` | `/reconstruction/generate` | Generate 3D spatial scene graph (`Room3DScene` v2.0) |
| `POST` | `/voice/command` | Parse voice/text intent & return Unity command |
| `GET` | `/furniture/recommendations` | Get product recommendations (prices in INR) |
| `POST` | `/budget/estimate` | Estimate room renovation budget by style tier |
| `GET` | `/3d/scene/{scene_id}` | Fetch Unity 3D scene payload |
| `GET` | `/diagnostics/providers` | Query AI provider status (`REAL`, `MOCK`, `UNAVAILABLE`) |
