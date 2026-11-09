# AquaLife Backend C2 publicado por etapas

Versión conjunta de los parches P2 → P5 → P6 → P7 → P3 → P8, sobre main con #19/#20 fusionados. Backend de doce historias en tres capas; archivos de entrada/agrupación separados por dominio (foro, comentarios, peces, ranking, avisos). Contrato conjunto: docs/api/c2.openapi.json.

## Equipo nuevo

Requiere Python 3.13 y PostgreSQL 17. En la raíz:

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
$credencial = Get-Credential -UserName postgres
try {
    $env:AQUALIFE_ADMIN_PASSWORD = $credencial.GetNetworkCredential().Password
    .\.venv\Scripts\python.exe backend/scripts/bootstrap_local.py
} finally { Remove-Item Env:AQUALIFE_ADMIN_PASSWORD -ErrorAction SilentlyContinue; $credencial = $null }
.\.venv\Scripts\python.exe backend/manage.py migrate --noinput
.\.venv\Scripts\python.exe backend/manage.py preparar_demo
.\.venv\Scripts\python.exe backend/manage.py test tests --noinput --verbosity 1
.\.venv\Scripts\python.exe backend/manage.py runserver 127.0.0.1:8000
```

Basic es solo local (DEBUG=true y loopback), no JWT. preparar_demo genera dos cuentas y sus claves locales; una ficha sintética de especie y categorías de ejemplo. No enviar .local a otra persona ni subir .venv/contraseñas. Las preferencias y avisos persistentes se consultan por API; no requieren React ni correo.

Revisar resultados reales de etapas en el paquete de publicación, con evidencia propia por cada PR. Los números de pruebas de este árbol incremental difieren de la primera copia conjunta de revisión de 64 tests porque cada bloque ahora tiene módulos de pruebas independientes. Los escenarios de aceptación son los mismos.

Cada archivo C2_P*_REVISION/TRASPASO y contrato OpenAPI por bloque describe qué se incorpora y qué permanece para después. Conservar ese orden para evitar conflictos. El script smoke_http heredado de P1 demuestra únicamente publicaciones; la suite de este árbol comprueba el resto del backend y la carpeta completa original mantiene su demostración integrada.
