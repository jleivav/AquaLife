# Backend AquaLife C2 — primer cambio (HU1)

Implementa crear publicaciones y consultarlas para comprobar que aparecen en el foro. Es Django modular en un proceso, con PostgreSQL. La búsqueda por tema (HU3) y las otras historias se implementarán en los siguientes cambios.

## Cómo se divide

| Capa | Archivos | Responsabilidad |
|---|---|---|
| Pública | public_api/foro.py, serializers.py, authentication.py, errors.py | HTTP, formato, identidad de pruebas y respuestas |
| Agregación | aggregation/foro.py | Coordina publicación y consulta de autores; construye el resultado combinado |
| Privada | domain/foro/services.py, models.py; domain/usuarios/services.py | Contenido válido, lectura y escritura en PostgreSQL |

El adaptador de autenticación usa el mecanismo de contraseñas de Django; es una responsabilidad transversal de entrada. Las vistas funcionales no acceden al ORM. La agregación usa funciones internas Python; no realiza peticiones HTTP a sí misma.

## Ejecutar en el equipo ya preparado

Todos los comandos siguientes se ejecutan en PowerShell desde la raíz AquaLifeR:

```powershell
.\.venv\Scripts\python.exe backend/manage.py check
.\.venv\Scripts\python.exe backend/manage.py runserver 127.0.0.1:8000
```

El segundo comando mantiene el servidor abierto; detenerlo con Ctrl+C. No cambia ni inicia React.

En otra terminal:

```powershell
$cuentas = Get-Content -LiteralPath '.\.aqualife-demo.local' -Raw | ConvertFrom-Json
$par = 'joaquin_demo:' + $cuentas.joaquin_demo
$cabeceras = @{ Authorization = 'Basic ' + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($par)) }
$json = @{ contenido = 'Mi primera publicación desde la API de AquaLife' } | ConvertTo-Json
$publicacion = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/publicaciones' -Method Post -Headers $cabeceras -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($json))
$publicacion
Invoke-RestMethod -Uri ('http://127.0.0.1:8000/api/v1/publicaciones/' + $publicacion.id) -Headers $cabeceras
Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/publicaciones' -Headers $cabeceras
$par = $null
$cuentas = $null
$cabeceras = $null
```

El autor se obtiene de la cuenta autenticada; el JSON no admite autor_id. No imprimir las variables de credenciales. Estas cuentas y Basic solo sirven en desarrollo local (DEBUG=true y origen loopback). No hay registro/login público, JWT ni integración con React.

## Pruebas

Desde la raíz:

```powershell
.\.venv\Scripts\python.exe backend/manage.py test tests --noinput --verbosity 2
.\.venv\Scripts\python.exe backend/manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe backend/scripts/smoke_http.py
```

La suite usa una base PostgreSQL temporal llamada test_aqualife. Django la crea y elimina; no usa SQLite ni borra publicaciones de la base aqualife. No crear bases propias con ese nombre de pruebas. El script smoke_http inicia y detiene su propio servidor, comprueba HTTP y SQL, y deja una publicación de demostración real en aqualife en cada ejecución.

Alternativamente, desde backend/, usar `..\.venv\Scripts\python.exe manage.py test tests --noinput --verbosity 2`.

## Preparar el equipo de Kenneth

Requiere Python 3.13 y PostgreSQL 17 funcionando localmente. Cada integrante usa sus propias contraseñas. Desde la raíz:

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
```

Para crear la base y el rol local de desarrollo:

```powershell
$credencialAdmin = Get-Credential -UserName postgres -Message 'Contraseña del administrador de PostgreSQL de TU equipo'
try {
    $env:AQUALIFE_ADMIN_PASSWORD = $credencialAdmin.GetNetworkCredential().Password
    .\.venv\Scripts\python.exe backend/scripts/bootstrap_local.py
} finally {
    Remove-Item Env:AQUALIFE_ADMIN_PASSWORD -ErrorAction SilentlyContinue
    $credencialAdmin = $null
}
.\.venv\Scripts\python.exe backend/manage.py migrate --noinput
.\.venv\Scripts\python.exe backend/manage.py preparar_demo
```

El preparador crea únicamente aqualife y aqualife_dev. El rol de desarrollo no es superusuario ni puede crear roles; tiene CREATEDB para que Django pueda crear su base temporal de pruebas. No es una configuración de producción.

Si ya existen el rol/base sin el archivo local, el preparador se detiene para evitar sobrescribir configuraciones. Para una instalación ya preparada, usar backend/local-config.example.json como referencia y configurar las variables DB_* y DJANGO_SECRET_KEY o el archivo .aqualife-backend.local manualmente, sin copiar secretos al repositorio.

## Archivos privados

- .aqualife-postgres.local: credencial administrativa cifrada para el usuario Windows original; no la necesita Django.
- .aqualife-backend.local: configuración privada de Django y contraseña generada del rol aqualife_dev, en JSON local.
- .aqualife-demo.local: contraseñas generadas de las dos cuentas demo, en JSON local.
- .venv/: dependencias instaladas localmente.

Los dos JSON locales contienen secretos en texto y quedan ignorados por Git. No adjuntarlos a PR ni compartirlos por Discord. Las variables de entorno tienen prioridad sobre la configuración local. Las contraseñas de las cuentas se almacenan con hash en PostgreSQL.

## Documentación del cambio

Contrato y diagramas: ../docs/C2_HU1_CONTRATO.md. Especificación: ../docs/api/hu1.openapi.json. Explicación para revisión y borrador de PR: ../docs/C2_P1_REVISION.md.
