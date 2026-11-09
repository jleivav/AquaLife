# P7 Votos para Joaquín

Base P6 de Kenneth. Agrega POST /api/v1/inscripciones/{id}/votos con body {}. Un voto por usuario/pecera; voto propio 403, repetido 409, inscripción inexistente 404, identidad inválida 401, body que intenta indicar usuario 400. Rechazos no alteran votos ni posiciones. Transacción y bloqueo por categoría serializan las escrituras; la restricción única de P6 protege el par usuario/inscripción.

No requiere migración nueva; P6 creó la tabla Voto como soporte del conteo de ranking. Añade ocho pruebas HTTP/dominio y una de concurrencia real entre conexiones. Los avisos se agregan después en P8, sin incluirlos en la contribución P7.

Rama sugerida codex/c2-votos, desde main con P6 fusionado. Adjuntar enlace real de HU8 antes de abrir PR. Ver p7.openapi.json.
