# Contrato P2

Basic local de P1; sin barra final. POST /api/v1/peces recibe nombre no vacío (máximo 120) y especie_id existente, responde 201 con id, nombre, propietario, especie y especie_detalle. Campos adicionales se rechazan. GET /peces lista solo los del usuario; GET /peces/{id} muestra su pez o 404 si no es propio/existe. GET /especies admite busqueda (hasta 200), limite 1–100 y desplazamiento >=0; GET /especies/{id} muestra características y cuidados o 404. Las listas tienen total/resultados; especies agrega mensaje. Sin coincidencias: 200, colección vacía y mensaje. Validación: 400; identidad: 401; no encontrado: 404; métodos no implementados: 405. Envoltura de errores heredada de P1.

PATCH no está implementado hasta P5. El catálogo inicial es sintético, no consejos biológicos reales.
