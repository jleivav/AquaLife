# AquaLife

Proyecto de **Desarrollo Web y Móvil · Universidad Andrés Bello**, desarrollado por **Joaquín Leiva y Kenneth Qian**.

AquaLife reúne un foro para acuaristas, registros de peces, información de especies, rankings de peceras y notificaciones. El repositorio incluye la interfaz de C1 y el backend persistente de C2.

## Estado de la entrega C2

- **12 historias de usuario implementadas** en el backend.
- **84 pruebas aprobadas sobre PostgreSQL** en la verificación final previa a la publicación de P8.
- **8 Pull Requests fusionados**, cuatro por integrante.
- API REST documentada con **OpenAPI** y organizada en **tres capas**.

La versión integrada de C2 corresponde al merge [`b0f08a6`](https://github.com/jleivav/AquaLife/commit/b0f08a6). El frontend y el backend se ejecutan por separado: **la interfaz de C1 todavía utiliza datos de demostración locales y no consume la API**.

## Funcionalidades

| Módulo | Backend C2 |
|---|---|
| Foro · HU1–HU3 | Crear publicaciones, comentar y buscar publicaciones por contenido sin distinguir mayúsculas. |
| Peces · HU4–HU6 | Registrar peces propios, consultar especies y editar nombre o especie de un pez propio. |
| Ranking · HU7–HU9 | Registrar peceras, inscribirlas por categoría, votar y consultar posiciones con empates. |
| Notificaciones · HU10–HU12 | Avisos internos por respuestas y cambios de posición, con preferencias por usuario. |

Las reglas incluyen rechazo de contenido vacío, validación de propiedad de los datos y protección contra votos propios o repetidos. Las transacciones mantienen consistentes las operaciones y sus avisos; el ranking bloquea la categoría durante las modificaciones concurrentes.

La interfaz de C1 conserva las pantallas **Inicio**, **Simulación** y **Comunidad**. Permite navegación, ajuste local de parámetros del acuario, filtros e interacciones comunitarias de demostración. Los gráficos, resultados de simulación y cambios de esa interfaz son ilustrativos; no representan cálculos científicos ni persistencia en el servidor.

## Tecnologías

| Área | Herramientas |
|---|---|
| Frontend | React, TypeScript, Vite, pnpm, CSS y SVG. |
| Backend | Python 3.13, Django 5.2.18 y Django REST Framework 3.16.1. |
| Base de datos | PostgreSQL 17; verificación realizada con PostgreSQL 17.11. |
| Conexión SQL | psycopg 3.3.6. |
| Organización | GitHub para código y PR; Taiga para planificación e historias. |

Las dependencias del frontend están en [`package.json`](package.json) y las del backend están fijadas en [`backend/requirements.txt`](backend/requirements.txt).

## Clonar el repositorio

```powershell
git clone https://github.com/jleivav/AquaLife.git
cd AquaLife
```

## Ejecutar el frontend

Requiere Node.js y pnpm instalados.

```sh
pnpm install
pnpm dev
```

Abrir la dirección local que muestra Vite. En PowerShell, si se bloquea `pnpm.ps1`, utilizar `pnpm.cmd install` y `pnpm.cmd dev`.

| Comando | Función |
|---|---|
| `pnpm lint` | Revisar el código del frontend. |
| `pnpm build` | Comprobar TypeScript y generar la compilación en `dist/`. |
| `pnpm preview` | Servir la compilación para una revisión local. |

## Ejecutar el backend

Requiere **Python 3.13** y un servidor **PostgreSQL 17** local en el puerto `5432`. La primera configuración crea la base de desarrollo y las tablas. Los comandos se ejecutan desde la raíz del repositorio.

### Primera instalación en Windows

Crear el entorno e instalar las dependencias:

```powershell
py -3.13 -m venv .venv
& "./.venv/Scripts/python.exe" -m pip install -r backend/requirements.txt
```

Preparar PostgreSQL con la contraseña elegida para el usuario `postgres` durante su instalación. Se ingresa en la ventana de credenciales:

```powershell
$adminAqua = Get-Credential -UserName postgres -Message "Contraseña de PostgreSQL"
try {
    $env:AQUALIFE_ADMIN_PASSWORD = $adminAqua.GetNetworkCredential().Password
    & "./.venv/Scripts/python.exe" backend/scripts/bootstrap_local.py
}
finally {
    Remove-Item Env:AQUALIFE_ADMIN_PASSWORD -ErrorAction SilentlyContinue
    $adminAqua = $null
}
```

El preparador configura exclusivamente la base `aqualife` y el rol `aqualife_dev`. Guarda la configuración privada en `.aqualife-backend.local`. El rol tiene permiso `CREATEDB` para que Django pueda crear y eliminar la base temporal de pruebas.

Aplicar migraciones, preparar los datos de demostración y levantar la API:

```powershell
& "./.venv/Scripts/python.exe" backend/manage.py migrate --noinput
& "./.venv/Scripts/python.exe" backend/manage.py preparar_demo
& "./.venv/Scripts/python.exe" backend/manage.py runserver 127.0.0.1:8000
```

La API queda disponible en `http://127.0.0.1:8000/api/v1/`. `preparar_demo` configura las cuentas locales `joaquin_demo` y `kenneth_demo`; sus claves se guardan en `.aqualife-demo.local`. Las operaciones requieren autenticación **HTTP Basic local**.

Estos comandos llaman directamente al Python del entorno y no requieren activar `.venv`. Si `python` muestra `No module named 'django'`, utilizar las rutas completas de los ejemplos anteriores.

### Una instalación ya configurada

Con la copia de trabajo limpia, actualizar `main`, aplicar migraciones y ejecutar el servidor. No repetir la instalación de dependencias salvo que cambie `backend/requirements.txt`.

```powershell
git switch main
git pull --ff-only origin main
& "./.venv/Scripts/python.exe" backend/manage.py migrate --noinput
& "./.venv/Scripts/python.exe" backend/manage.py runserver 127.0.0.1:8000
```

Más detalles y solución de problemas: [guía del backend](backend/README.md).

## Pruebas y comprobaciones

Con PostgreSQL en ejecución y el backend configurado:

```powershell
& "./.venv/Scripts/python.exe" backend/manage.py test tests --noinput --verbosity 1
& "./.venv/Scripts/python.exe" backend/manage.py makemigrations --check --dry-run
```

La suite de la entrega tiene **84 pruebas**. Django utiliza una base temporal `test_aqualife`, que elimina al terminar. Cubre escenarios de aceptación, entradas inválidas, acceso por propietario, paginación, aislamiento de notificaciones, empates, votos concurrentes y rollback. Durante las pruebas, mensajes como `Bad Request`, `Unauthorized`, `Forbidden`, `Not Found` o `Conflict` corresponden a casos de rechazo esperados; el resultado global debe ser `OK`.

Para comprobar publicaciones mediante un servidor HTTP real y una conexión SQL independiente, después de `preparar_demo`:

```powershell
& "./.venv/Scripts/python.exe" backend/scripts/smoke_http.py
```

Ese script inicia y detiene su propio servidor y deja una publicación de demostración en la base local. Su alcance es HU1; la suite comprueba el resto del backend.

## Arquitectura y organización

```text
src/                      Interfaz React de C1
  components/             Elementos visuales reutilizables
  pages/                  Inicio, Simulación y Comunidad
  data/                   Datos de demostración del frontend
public/                   Recursos estáticos
backend/
  public_api/             Capa pública: HTTP, serializers y errores
  aggregation/            Capa de agregación: coordinación y composición
  domain/                 Capa privada: reglas, modelos y persistencia
    foro/
    usuarios/
    peces/
    ranking/
    avisos/
  config/                 Configuración y rutas principales
  scripts/                Preparación local y comprobación HTTP
  tests/                  Pruebas automatizadas
  requirements.txt        Dependencias fijadas del backend
docs/
  api/                    Contratos OpenAPI
```

Recorrido de una solicitud: **cliente HTTP → pública → agregación → privada → PostgreSQL**. La agregación funciona como una fachada lógica dentro de un solo proceso Django; no hay un servidor Gateway separado. Las clases públicas delegan los casos de uso y no acceden directamente al ORM.

## Contrato de la API

Contrato conjunto: [`docs/api/c2.openapi.json`](docs/api/c2.openapi.json). Contiene **15 rutas y 21 operaciones**. Todas usan el prefijo `/api/v1`.

| Recurso | Operaciones principales |
|---|---|
| `/publicaciones` y `/publicaciones/{id}` | Crear, listar, buscar por `tema` y consultar detalle. |
| `/publicaciones/{publicacion_id}/comentarios` | Crear y listar comentarios; consultar detalle por `comentario_id`. |
| `/especies` y `/especies/{id}` | Buscar y consultar fichas de especies. |
| `/peces` y `/peces/{id}` | Crear, listar, consultar y editar peces propios. |
| `/peceras` y `/categorias` | Crear y listar peceras propias; consultar categorías. |
| `/inscripciones` y `/inscripciones/{id}/votos` | Inscribir peceras y registrar votos. |
| `/ranking` | Consultar posiciones con el parámetro `categoria`, por ejemplo `/ranking?categoria=1`. |
| `/preferencias-notificaciones` y `/notificaciones` | Consultar o editar preferencias; listar avisos del usuario. |

Los contratos especifican cuerpos JSON, parámetros, respuestas y errores de cada operación. Las fichas `C2_P*_REVISION.md` y `C2_P*_TRASPASO.md` de `docs/` registran el alcance de cada incremento.

## Aportes de la entrega C2

| Integrante | Historias | Pull Requests fusionados |
|---|---|---|
| Joaquín Leiva | HU1, HU3, HU6 y HU8 | [#19](https://github.com/jleivav/AquaLife/pull/19), [#20](https://github.com/jleivav/AquaLife/pull/20), [#22](https://github.com/jleivav/AquaLife/pull/22), [#24](https://github.com/jleivav/AquaLife/pull/24). |
| Kenneth Qian | HU2, HU4, HU5, HU7, HU9 y HU10–HU12 | [#21](https://github.com/jleivav/AquaLife/pull/21), [#23](https://github.com/jleivav/AquaLife/pull/23), [#25](https://github.com/jleivav/AquaLife/pull/25), [#26](https://github.com/jleivav/AquaLife/pull/26). |

**Contador C2: Joaquín 4/4, Kenneth 4/4; grupo 8/8 PR creados y fusionados.** Estos totales corresponden a los ocho bloques de implementación de C2.

Planificación: [Aqua Life en Taiga](https://tree.taiga.io/project/jleivav-aqua-life/timeline).

## Alcance y configuración local

- El backend se demuestra por API; la integración con React y JWT queda para una etapa posterior.
- HTTP Basic está limitado a desarrollo con `DEBUG=true` y conexiones loopback. No es una configuración de despliegue productivo.
- `preparar_demo` incluye una ficha sintética de especie y categorías de ejemplo; no son información biológica verificada.
- Las notificaciones son internas y consultables por API; no se envían por correo ni push.
- `.venv`, los archivos `.local` y `.env`, contraseñas y cabeceras de autorización no se incluyen en Git. Cada equipo prepara su propia configuración local.
