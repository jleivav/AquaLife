# HU3 — buscar publicaciones por tema (P4)

Responsable previsto: Joaquín. Depende de P1 y se verifica junto a P3. Fuente: Anexo A del informe C1; escenarios de búsqueda con resultados y sin resultados. El enlace individual de Taiga está pendiente de verificación.

## Operación

GET /api/v1/publicaciones?tema=acuarios

Se amplía la lectura existente; no se agrega una ruta duplicada. Conserva Basic local, paginación y orden de publicaciones de P1.

- tema es opcional: si se omite, funciona el listado anterior.
- Si se envía, debe contener texto no vacío después de recortar espacios exteriores; máximo técnico de 200 caracteres.
- Busca una subcadena literal en contenido, sin distinguir mayúsculas/minúsculas. Conserva distinción de tildes: no promete búsqueda semántica ni corrección de escritura.
- No busca en autores ni comentarios, porque esta HU busca publicaciones por tema.
- %, _ y comillas se tratan como texto, no como comodines SQL o instrucciones.
- limite (1–100, default 20) y desplazamiento (0–2147483647, default 0) se aplican después de filtrar. total es el número de coincidencias antes de paginar.
- Un parámetro tema repetido se rechaza con 400 para evitar búsquedas ambiguas.

## Respuestas

200 con total, limite, desplazamiento y resultados, usando el esquema de publicación ya definido en HU1. Mantiene creada_en DESC e ID DESC.

Si no existe ninguna coincidencia:

```json
{
  "total": 0,
  "limite": 20,
  "desplazamiento": 0,
  "resultados": [],
  "mensaje": "No se encontraron publicaciones relacionadas."
}
```

No encontrar resultados no es un error 404. Si existen coincidencias pero el desplazamiento excede la última, la página queda vacía con total positivo; no se afirma que el tema carezca de resultados.

400 para tema vacío, superior al límite técnico, texto no codificable, NUL o parámetros inválidos/desconocidos. Sin identidad válida devuelve 401. Resto de códigos y envoltura de errores: contrato HU1.

## Recorrido y trazabilidad

1. Cliente envía GET con tema y paginación.
2. Entrada pública valida los parámetros y llama a agregación.
3. Servicio privado valida tema y filtra contenido mediante ORM parametrizado de Django.
4. Cuenta coincidencias, pagina y devuelve datos.
5. Agregación combina publicaciones con autores y agrega el mensaje solo si no hay ninguna coincidencia.
6. Entrada responde 200. No se escribe ni modifica información.

| Escenario | Papel de origen | Prueba |
|---|---|---|
| HU3-E1: resultados relacionados | Foto 2 HU3 y Foto 6 HU3 | test_hu3_e1_busca_tema_y_devuelve_solo_relacionadas |
| HU3-E2: sin resultados | Foto 2 HU3 rama No; alternativa a explicitar en secuencia | test_hu3_e2_sin_coincidencias_informa_sin_escribir |

El límite de longitud es una decisión técnica de esta API, no un puntaje o requisito histórico del equipo. Las validaciones y diagramas en papel siguen pendientes de revisión humana.
