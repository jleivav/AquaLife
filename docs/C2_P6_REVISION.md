# P6 para Kenneth

HU7 inscribir pecera y HU9 consultar ranking. Base técnica de este paquete: P2 y P5 aplicados después de PR #20. El orden conserva compatibilidad de configuración/rutas compartidas. Incluye categorías, registro auxiliar de pecera incompleta/completa, inscripción propia, consulta por categoría, empates y diez pruebas nuevas.

La migración crea también la tabla Voto como soporte de la consulta de conteos. P6 no expone una operación pública de voto ni genera notificaciones: P7 implementa votar y P8 añade avisos. El catálogo de categorías inicial (General/Plantadas) es de demostración.

GET /categorias; GET/POST /peceras; POST /inscripciones {pecera_id}; GET /ranking?categoria=ID. Inscripción requiere nombre, litros positivos y categoría; ajena/inexistente 404; incompleta 400; duplicada 409. Ranking vacío responde 200 con mensaje; inexistente 404. Empates comparten posición densa (1,1,2). Ver p6.openapi.json.

Agregar enlaces individuales reales de HU7 y HU9 en Taiga antes de publicar; no se adivinan sus números.
