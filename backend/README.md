# Backend de AquaLife C2

Backend de las doce historias de usuario de AquaLife, implementado con **Django REST Framework y PostgreSQL**. La entrega C2 quedó integrada mediante ocho PR fusionados en `main` y se verificó con **84 pruebas** antes de publicar el último bloque.

## Instalar y ejecutar

La [guía principal del proyecto](../README.md#ejecutar-el-backend) contiene la preparación completa: Python 3.13, PostgreSQL 17, entorno virtual, base local y cuentas de demostración. Todos los comandos siguientes se ejecutan desde la raíz del repositorio.

En una instalación ya configurada:

```powershell
& "./.venv/Scripts/python.exe" backend/manage.py migrate --noinput
& "./.venv/Scripts/python.exe" backend/manage.py preparar_demo
& "./.venv/Scripts/python.exe" backend/manage.py runserver 127.0.0.1:8000
```

API local: `http://127.0.0.1:8000/api/v1/`. Requiere HTTP Basic con las cuentas de desarrollo. `preparar_demo` guarda las claves en `.aqualife-demo.local`; la conexión PostgreSQL se configura en `.aqualife-backend.local`. Ambos archivos son privados y están ignorados por Git.

## Separación en tres capas

| Carpeta | Responsabilidad |
|---|---|
| `public_api/` | Recibir HTTP, validar JSON y parámetros, autenticar y transformar errores en respuestas. |
| `aggregation/` | Coordinar casos de uso y componer datos de los servicios privados. |
| `domain/` | Aplicar reglas de negocio, consultar modelos y escribir mediante el ORM. |

Los dominios son foro, usuarios, peces, ranking y avisos. Las capas funcionan dentro de un solo proceso Django. La prueba `tests/test_capas.py` comprueba sus dependencias.

## Verificar

```powershell
& "./.venv/Scripts/python.exe" backend/manage.py test tests --noinput --verbosity 1
& "./.venv/Scripts/python.exe" backend/manage.py makemigrations --check --dry-run
```

La suite contiene 84 pruebas. PostgreSQL debe estar en ejecución y el rol de desarrollo debe poder crear `test_aqualife`. Django elimina esa base temporal al terminar. Los errores HTTP registrados para entradas inválidas forman parte de la verificación; el resultado global debe ser `OK`.

Comprobación HTTP de HU1, con persistencia confirmada desde otra conexión SQL:

```powershell
& "./.venv/Scripts/python.exe" backend/scripts/smoke_http.py
```

El script levanta y detiene su propio servidor. Deja una publicación real de demostración en la base local. Su alcance es publicaciones; las demás historias se comprueban mediante la suite.

## Contratos

La especificación completa está en [docs/api/c2.openapi.json](../docs/api/c2.openapi.json). Describe 15 rutas y 21 operaciones. Los contratos por bloque y las fichas de revisión en `docs/` conservan la evolución de la implementación.

## Configuración y datos de demostración

- Usar el ejecutable `./.venv/Scripts/python.exe` si el Python general no encuentra Django.
- La autenticación Basic solo funciona con `DEBUG=true` y loopback. React y JWT aún no están integrados con este backend.
- Las cuentas `joaquin_demo` y `kenneth_demo` tienen claves generadas localmente. No copiar los archivos de credenciales a otros equipos.
- La ficha inicial de especie es sintética; las categorías de arranque son ejemplos. Los avisos son internos, sin correo ni push.
- `bootstrap_local.py` administra exclusivamente `aqualife` y `aqualife_dev`. Si encuentra esos nombres sin una configuración local existente, se detiene para evitar sobrescribirlos.
- No subir `.venv`, archivos `.local`, `.env` ni contraseñas.

## Contribuciones C2

Joaquín: PR #19, #20, #22 y #24. Kenneth: PR #21, #23, #25 y #26. **Ocho creados y ocho fusionados**, cuatro por integrante. Enlaces y reparto por historias en el [README principal](../README.md#aportes-de-la-entrega-c2).
