# Aqua Life — Frontend

Tres pantallas de Aqua Life (Inicio, Simulación y Comunidad), construidas con **React + TypeScript + Vite + pnpm** a partir de los mockups del proyecto. Conserva las dependencias originales y usa CSS propio, sin librerías de interfaz.

## Ejecutar

```sh
pnpm install
pnpm dev
```

Abrir la dirección local que muestra Vite. En PowerShell, si Windows bloquea `pnpm.ps1`, usar `pnpm.cmd dev` o la terminal Command Prompt de VS Code.

```sh
pnpm lint     # Revisión del código
pnpm build    # Comprobación de TypeScript y compilación en dist/
pnpm preview  # Vista previa de la compilación
```

## Organización

```text
src/
  components/          Componentes visuales reutilizables
    Avatar.tsx         Iniciales y colores de los perfiles
    Icon.tsx           Iconos SVG locales
    Header.tsx         Marca, navegación y búsqueda
    FilterSidebar.tsx  Categorías, tipos, etiquetas y guardados
    PostComposer.tsx   Formulario para crear publicaciones
    PostCard.tsx       Publicación, reacciones y comentarios
    ResultPreview.tsx  Gráfico ilustrativo de ejemplo
    CommunitySidebar.tsx  Ranking, conexiones y notificaciones
  data/community.ts    Datos ficticios y opciones de los filtros
  pages/CommunityPage.tsx  Estado de la pantalla y coordinación
  types/community.ts   Tipos de publicaciones, perfiles y filtros
  App.tsx              Punto de entrada de la interfaz
  App.css              Estilos de componentes y tamaños de pantalla
  index.css            Estilos globales, colores y accesibilidad
  main.tsx             Montaje de React
public/favicon.svg     Identidad de Aqua Life
```

## Correspondencia con el mockup

- Cabecera: Aqua Life, Inicio, Simulación, Comunidad, búsqueda, ranking, notificaciones y perfil.
- Columna izquierda: buscador, categorías, tipos de contenido y etiquetas. Se añade un acceso a las publicaciones guardadas.
- Centro: formulario para publicar, orden de publicaciones, tarjetas con comentarios, me gusta y guardar. La segunda tarjeta incluye un gráfico ilustrativo, siguiendo el resultado dibujado en el mockup.
- Columna derecha: ranking con selector de período, conexiones y notificaciones.
- La paleta verde agua, la tipografía del sistema y los espacios completan el dibujo en papel, que no especificaba colores.
- En tablet, los paneles de actividad bajan del feed. En móvil, se usa una sola columna y un botón despliega los filtros.

## Qué se puede probar

- Buscar por autor, texto o etiqueta, sin distinguir acentos ni mayúsculas.
- Combinar categoría, tipo y etiqueta; ordenar por fecha o cantidad de me gusta.
- Crear una publicación con texto y tipo, y adjuntar opcionalmente una imagen JPG, PNG o WebP de hasta 3 MB.
- Dar o quitar me gusta, guardar publicaciones, ver guardados y agregar comentarios.
- Cambiar el período del ranking de ejemplo y marcar notificaciones como leídas.
- Escribir un mensaje de prueba a una conexión: se muestra una vista previa, sin envío.
- Recorrer los controles con el teclado y usar “Saltar a las publicaciones”.

**Todo funciona en memoria.** Los perfiles, puntajes y datos del gráfico son ficticios. Al recargar se restablece la demostración, incluidas las publicaciones, imágenes y comentarios. No hay autenticación, API, base de datos, cálculo científico ni envío de mensajes. Las funciones de Comunidad se conservan. Las nuevas pantallas usan datos de ejemplo y no ejecutan una simulación real.

## Inicio y Simulación: estructura para la defensa

- **Inicio:** CSS Grid de 12 columnas. Bienvenida de ancho completo, tres tarjetas de 4 columnas (parámetros, resultados y comunidad), y una fila de seis accesos rápidos. El dibujo de montañas y agua es un SVG local.
- **Simulación:** Grid de 12 columnas. Parámetros en 3 columnas; preview y resultados en las 9 restantes; debajo, alertas en 3 e historial en 6. Las acciones ocupan las 12 columnas.
- **Flexbox:** distribuye etiquetas, valores, cabeceras de tarjetas y botones.
- **Box Model:** el tamaño incluye bordes y padding gracias a `box-sizing: border-box`; `gap` separa las zonas.
- **Responsividad:** en tablet se reorganizan accesos, gráficos y paneles inferiores. Hasta 700 px las zonas principales se apilan; los accesos y gráficos conservan dos columnas.
- **Navegación:** enlaces con fragmentos (`#inicio`, `#simulacion`, `#comunidad`). `navigation.ts` identifica la pantalla y `App.tsx` escucha los cambios; funcionan recargar, atrás y adelante sin instalar un router. Los accesos a resultados, historial, ranking y conexiones llevan a sus secciones.
- Ranking, conexiones y guías se consultan dentro de Comunidad; esta entrega tiene tres pantallas.

### Archivos de las nuevas pantallas

- `pages/DashboardPage.tsx` y `.css`: bienvenida, tres tarjetas y accesos.
- `data/dashboard.ts`: valores y perfiles ilustrativos del mockup.
- `components/WaterLandscape.tsx`: ilustración de bienvenida.
- `pages/SimulationPage.tsx` y `.css`: zonas del simulador, gráficos, avisos e historial.
- `components/SimulationParameters.tsx`: cuatro controles, pecera, duración e intervalo. Solo guarda selecciones en estado de React y permite restablecerlas.
- `components/AquariumScene.tsx`: ilustración de la pecera.
- `data/simulation.ts`: series y registros estáticos.

### Alcance de la demostración

Los parámetros de Inicio reproducen el mockup y son independientes del ejemplo de Simulación. Mover los controles no cambia la pecera, los gráficos, las alertas ni el historial. Ejecutar, guardar, exportar y compartir resultados aparecen deshabilitados: no se simula ni se persiste información. Los avisos se pueden desplegar y los enlaces permiten navegar. Al salir de una pantalla se reinicia su estado local; al recargar se reinicia toda la demostración.

### Validar en Windows

```powershell
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd dev
```

Comprobar las tres pantallas en escritorio, tablet y móvil; probar navegación, recarga, atrás/adelante, controles con teclado y restablecimiento.
