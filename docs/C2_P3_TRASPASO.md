# P3 Comentarios para Kenneth

Este incremento está preparado sobre la secuencia P2 → P5 → P6 → P7. Aunque HU2 solo requiere publicaciones funcionalmente, el orden indicado evita conflictos entre las versiones de rutas/modelos compartidos. Implementa HU2-E1/E2, doce pruebas y tres operaciones: POST/GET /publicaciones/{publicacion_id}/comentarios y GET /publicaciones/{publicacion_id}/comentarios/{comentario_id}.

Texto obligatorio y autor autenticado. Comentario ajeno al hilo solicitado no aparece. Sin eventos de notificación hasta P8. Mantiene las otras operaciones y no requiere peces/ranking para su regla de negocio. Responsable Kenneth, rama codex/c2-hu2-comentarios. Confirmar enlace real de HU2 en Taiga antes del PR.
