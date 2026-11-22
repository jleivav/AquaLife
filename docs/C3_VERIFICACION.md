# Verificación de C3

## Entorno y comandos

La base de trabajo es `94ec255`. Usar el entorno Windows con PostgreSQL 17 y la configuración local descrita en `C3_HU1.md`. Con el entorno virtual del backend y dependencias frontend disponibles, ejecutar:

```powershell
.\.venv\Scripts\python.exe backend/manage.py test tests --noinput
pnpm.cmd lint
pnpm.cmd build
```

## Demostración automatizada en Edge

`scripts/c3_browser.cjs` usa Playwright Core y la instalación local de Edge. Instalar el ejecutor en una carpeta ignorada con `npm.cmd install --prefix .venv/browser --no-save --no-package-lock playwright-core`. Iniciar Django y Vite en loopback con una base exclusiva de demostración y preparar las cuentas con `preparar_demo`. El recorrido escribe publicaciones, peces, peceras y votos de prueba. Prepara dos categorías nuevas para que el ranking inicial esté vacío.

```powershell
$tag = [guid]::NewGuid().ToString('N').Substring(0, 10)
$env:AQUALIFE_CATEGORY = "C3 ranking $tag"
$env:AQUALIFE_EMPTY_CATEGORY = "C3 vacia $tag"
.\.venv\Scripts\python.exe backend/manage.py shell -c 'import os; from domain.ranking.models import Categoria; Categoria.objects.get_or_create(nombre=os.environ["AQUALIFE_CATEGORY"]); Categoria.objects.get_or_create(nombre=os.environ["AQUALIFE_EMPTY_CATEGORY"])'
node scripts/c3_browser.cjs
```

El recorrido usa dos contextos separados. Revisa HU1–HU12 y la duración e intervalo de Simulación. Las pruebas HTTP de Django también cubren acceso anónimo, CSRF, expiración, revocación, datos no válidos y escritura rechazada.

## Evidencia registrada

- PostgreSQL 17.11 y Django 5.2.18. Suite de Django: **85 pruebas aprobadas**.
- ESLint, compilación TypeScript y compilación Vite: **aprobadas** usando los ejecutables del proyecto.
- Edge: recorrido aprobado para **HU1–HU12** con dos cuentas de demostración. Incluye persistencia tras recarga, búsqueda vacía, aviso por respuesta, aislamiento de peces, categoría vacía, inscripción incompleta, rechazos de voto, aviso de cambio de posición y supresión de avisos desactivados.
- Edge, ventana de 390 × 844: la vista de Simulación aplicó un día, un intervalo de seis horas y pasó de la hora cero a la hora 24 al recorrer el control.
- Se verificaron secuencialmente los parches sobre el árbol base con un índice Git temporal antes de preparar el material de publicación.
