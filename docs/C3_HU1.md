# C3 · Sesión y publicaciones

El navegador usa el mismo origen para React y la API. Vite reenvía `/api` a Django en `127.0.0.1:8000`. El frontend guarda el Access Token en memoria y recarga el listado desde PostgreSQL después de restaurar sesión. La API de publicaciones conserva el cuerpo `{"contenido":"…"}` y las respuestas de C2. El contrato OpenAPI C2 documenta el estado histórico.

## Ejecutar en Windows

En una copia de C3 con PostgreSQL configurado, instalar las dependencias de `backend/requirements.txt` en el entorno virtual y las del frontend con `pnpm.cmd install`. El arranque nuevo de PostgreSQL prepara una clave JWT independiente. Si la configuración local ya existe, agregar `JWT_SIGNING_KEY` con un valor aleatorio privado en `.aqualife-backend.local`. Usar `DJANGO_DEBUG=true` para la demostración en HTTP de loopback. Fuera de ese perfil, las cookies se envían exclusivamente por HTTPS.

```powershell
.\.venv\Scripts\python.exe backend/manage.py migrate --noinput
.\.venv\Scripts\python.exe backend/manage.py preparar_demo
.\.venv\Scripts\python.exe backend/manage.py runserver 127.0.0.1:8000
```

En otra terminal, ejecutar `pnpm.cmd dev --port 5173 --strictPort`. Abrir `http://127.0.0.1:5173/#comunidad`. Usar una cuenta local de demostración y su contraseña de `.aqualife-demo.local`. Publicar un texto distintivo, comprobar el autor y recargar. Deben reaparecer la sesión y el texto guardado. Cerrar sesión devuelve el formulario de acceso.

## Sesión

1. `GET /api/v1/auth/csrf` entrega el token CSRF enmascarado. React lo envía en `X-CSRFToken` al iniciar, renovar y cerrar sesión.
2. `POST /api/v1/auth/login` recibe usuario y contraseña. La respuesta incluye el access de cinco minutos y un refresh de un día en cookie HttpOnly. El login renueva el token CSRF.
3. `POST /api/v1/auth/refresh` usa la cookie, invalida el refresh anterior y entrega otro access. `POST /api/v1/auth/logout` revoca el refresh y limpia la cookie. Un access emitido expira por su propia vigencia.
4. `GET /api/v1/publicaciones` lista publicaciones y `POST /api/v1/publicaciones` guarda una publicación. Se usa la cabecera `Authorization: Bearer` y Django obtiene el autor del usuario autenticado.

Las pruebas se ejecutan con `.\.venv\Scripts\python.exe backend/manage.py test tests --noinput`. La base temporal de Django debe estar separada de la base de demostración.

## Evidencia del 20 de noviembre de 2026

- Django y PostgreSQL 17: 85 pruebas aprobadas. Se verificaron CSRF, credenciales, expiración, revocación, datos inválidos y persistencia.
- Frontend: ESLint, compilación de TypeScript y compilación de Vite aprobadas.
- Edge, con React servido por Vite: credenciales incorrectas `401`, inicio correcto `200`, cookie HttpOnly, publicación `201`, renovación tras recarga `200`, publicación visible, lectura anónima `401` y cierre `204`.
- PostgreSQL: publicación de demostración `1` confirmada desde otra conexión y asociada a la cuenta que inició sesión.
