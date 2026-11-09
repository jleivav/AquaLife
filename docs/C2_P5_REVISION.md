# P5 Edición de peces propios

Responsable Joaquín. Depende de P2 de Kenneth fusionado; rama sugerida codex/c2-editar-peces. Solo añade edición, su composición pez/especie, PATCH al detalle y seis pruebas. El GET heredado se conserva. No modifica migraciones ni autorías de P2.

PATCH /api/v1/peces/{id} admite nombre y/o especie_id, no body vacío ni propietario. Responde 200 con el pez y su especie; 400 datos inválidos, 404 pez ajeno/inexistente o especie inexistente, 401 sin identidad. Valida todo antes de guardar para conservar datos anteriores en el escenario inválido. Agregar enlace individual real de HU6 en Taiga al publicar.
