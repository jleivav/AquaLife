# P1 — revisión del primer cambio backend

Responsable propuesto: Joaquín. Revisor: Kenneth. Rama local: codex/c2-hu1-publicaciones.

## Problema y resultado

El C1 solo mantenía publicaciones de demostración en la memoria del navegador. P1 agrega una API independiente que guarda publicaciones en PostgreSQL y permite consultarlas. Rechaza contenido vacío sin crear registros y obtiene el autor de una cuenta local autenticada.

El frontend C1 permanece sin cambios. Este backend todavía no implementa comentarios, búsqueda temática, peces, ranking ni avisos.

## Qué entender antes de aprobar

1. public_api/foro.py recibe HTTP y delega el caso de uso; no crea modelos directamente.
2. aggregation/foro.py obtiene el autor y combina sus datos con los de la publicación. Es la agregación real de dos módulos.
3. domain/foro/services.py valida texto y usa el modelo para guardar. La regla se cumple aunque el servicio se invoque sin HTTP.
4. models.py define la relación con autor y una restricción PostgreSQL contra contenido vacío.
5. La migración crea la estructura en la base; no es una copia de datos ficticios.
6. Los GET existen para demostrar que lo creado se puede mostrar en el foro; no incluyen búsqueda HU3.
7. Basic local es un mecanismo de identidad de pruebas, sin JWT ni login público. No funciona con DEBUG=false ni desde IP remota.
8. Los tests se ejecutan en test_aqualife, separada de los datos demo.

## Verificación

Ejecución final del 29 de octubre de 2026:

| Comprobación | Resultado |
|---|---|
| Django check | Sin problemas |
| makemigrations --check --dry-run | Sin cambios pendientes |
| pip check | Sin dependencias rotas |
| manage.py test tests --noinput | 17 pruebas aprobadas sobre PostgreSQL |
| smoke_http.py | POST 201, GET 200, contenido vacío 400; registro confirmado por SQL independiente |
| OpenAPI JSON | Tres operaciones y 19 referencias internas resueltas; sin validación completa de OpenAPI |

Comandos desde la raíz del repositorio:

```powershell
.\.venv\Scripts\python.exe backend/manage.py check
.\.venv\Scripts\python.exe backend/manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe backend/manage.py test tests --noinput --verbosity 2
.\.venv\Scripts\python.exe backend/scripts/smoke_http.py
```

La suite usa una base temporal PostgreSQL. La demostración HTTP dejó una publicación real con ID 1 en aqualife y cerró el servidor que había iniciado. La suite inicial pasó 16 pruebas; al agregar texto no almacenable se corrigió la preparación del caso Unicode para enviar JSON escapado y se aprobó la suite final de 17. También se corrigió la etiqueta de descubrimiento de pruebas para funcionar desde la raíz con test tests.

## Estado y pendientes

- Autorización de comenzar código: Joaquín informó el OK de Kenneth el 29 de octubre de 2026.
- Arquitectura Django modular autorizada para avanzar; confirmar interpretación de microservicios en la siguiente clase.
- Correcciones y validación física del papel: pendientes; no se afirma que el profesor haya validado estos diagramas.
- Referencia individual de HU1 en Taiga: pendiente de verificar.
- Revisión y comprensión del diff por ambos estudiantes: pendiente.
- Sin commit, push, PR remoto ni merge realizados.

## Borrador de PR (todavía sin publicar)

Título: Implementar publicaciones persistentes de HU1 en Django y PostgreSQL

Descripción:

> Agrega creación y consulta de publicaciones mediante una API REST separada en entrada pública, agregación y dominio privado. El autor se obtiene de una cuenta local de pruebas; el contenido vacío o inválido se rechaza sin persistir datos. Incluye migración PostgreSQL, preparación del entorno, contrato OpenAPI y pruebas de HU1.
>
> Trazabilidad: HU1, escenarios E1/E2 del informe C1. Incorporar el enlace individual real de Taiga antes de publicar.
>
> Validación: 17 pruebas PostgreSQL aprobadas, check sin problemas y migraciones coherentes. Demostración HTTP real de creación/consulta/rechazo, con persistencia confirmada por una conexión SQL independiente. Ver C2_P1_REVISION.md.

Mensaje de commit sugerido, sin ejecutar: `feat(backend): implementar publicaciones persistentes de HU1`

No incluir los documentos DOCX originales, .venv ni archivos .local en el futuro commit. Revisar los archivos nuevos explícitamente; no usar git add . indiscriminadamente.
