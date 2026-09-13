# Aqua Life — Frontend

Primera pantalla de Aqua Life, construida con **React + TypeScript + Vite + pnpm** a partir del mockup en papel de la comunidad. Conserva las dependencias originales y usa CSS propio, sin librerías de interfaz.

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

**Todo funciona en memoria.** Los perfiles, puntajes y datos del gráfico son ficticios. Al recargar se restablece la demostración, incluidas las publicaciones, imágenes y comentarios. No hay autenticación, API, base de datos, cálculo científico ni envío de mensajes. El botón de Simulación aparece deshabilitado con la etiqueta “Pronto”; esa segunda pantalla queda para otra etapa.

## Cómo explicarlo en la defensa

1. `main.tsx` monta React y `App.tsx` muestra `CommunityPage`.
2. `CommunityPage` guarda publicaciones y filtros con `useState`. Calcula qué publicaciones mostrar mediante `filter` y `sort`.
3. Cada componente recibe datos mediante **props**. Cuando el usuario realiza una acción, el componente llama a una función recibida del padre.
4. Las publicaciones se actualizan creando nuevos objetos con `map`; no se modifica directamente el arreglo original.
5. TypeScript define la forma de los datos y ayuda a detectar errores antes de ejecutar. CSS Grid organiza las columnas y las media queries adaptan la pantalla.

No se incluyeron rutas, gestores de estado externos ni una capa de servicios: una sola pantalla no los necesita todavía.
