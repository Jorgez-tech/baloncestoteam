# Rutas Frontend (React Router v6)

Publicas
- /               Inicio
- /gallery        Galería
- /players        Jugadores
- /players/:id    Perfil de jugador
- /login          Iniciar sesión (redirige a / si ya estás logueado)
- /signup         Registro (redirige a / si ya estás logueado)

Protegidas
- /admin          Panel Admin (requiere user.role === 'admin')

Notas
- ProtectedRoute: redirige a /login si no hay usuario.
- PublicOnlyRoute: redirige a / si ya hay usuario.
