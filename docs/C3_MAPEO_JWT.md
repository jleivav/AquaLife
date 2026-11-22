# Mapeo JWT para dibujar en papel

Dibujar seis columnas: usuario, React, proxy Vite, API Django y Simple JWT, dominio/ORM y PostgreSQL. Marcar que Vite reenvía y que el ORM pertenece a Django.

| Paso | Flecha y datos | Resultado |
|---|---|---|
| 1 | React → proxy → Django · `GET /api/v1/auth/csrf` | 200, token CSRF y cookie CSRF. |
| 2 | React → Django · `POST /api/v1/auth/login` con credenciales y `X-CSRFToken` | Django comprueba origen, CSRF y credenciales. |
| 3 | Django → React · respuesta de login | 200, access en JSON y refresh en cookie HttpOnly. React conserva el access en memoria. El login actualiza CSRF. |
| 4 | React → Django · `POST /api/v1/publicaciones` con `Authorization: Bearer …` y JSON de contenido | Django valida JWT e identifica al usuario. |
| 5 | Django → dominio → PostgreSQL · validación y escritura | 201 con el registro. React muestra texto y autor. |
| 6 | React → Django · `GET /api/v1/publicaciones` con Bearer | 200, listado desde PostgreSQL. |
| 7 | React → Django · `POST /api/v1/auth/refresh` con cookie HttpOnly y CSRF | Valida y rota el refresh, revoca el anterior y entrega un nuevo access. La restauración tras recargar usa esta ruta. |
| 8 | React → Django · `POST /api/v1/auth/logout` con cookie y CSRF | 204, revocación y limpieza de cookie. React descarta el access local. |

Añadir ramas laterales: credenciales incorrectas → **401**; access ausente, alterado o expirado → **401**; CSRF inválido u origen ajeno → **403**; voto propio → **403**; pez ajeno → **404**; refresh revocado → **401** y formulario de acceso. El refresh se envía automáticamente con la cookie. Las rutas de negocio reciben el access por cabecera. Cerrar sesión no invalida anticipadamente los access ya emitidos.

En la defensa, explicar la diferencia entre autenticar una identidad y autorizar una acción. Usar HU1 para seguir los datos y HU8 o HU6 para mostrar un rechazo aplicado por Django.
