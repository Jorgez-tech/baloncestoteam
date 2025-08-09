# Servicios/API del Frontend

Base URL
- REACT_APP_API_URL (por defecto http://localhost:5000/api/v1)

Auth
- POST /auth/login
- POST /auth/register
- POST /auth/logout

Jugadores (ejemplo)
- GET /players
- GET /players/:id

Notas
- Se recomienda estrategia Bearer Token en Authorization.
- Si prefieres cookies httpOnly, habilitar withCredentials y configurar CORS en backend.
