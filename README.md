# Aqua Life

Frontend de **Aqua Life**, desarrollado con **React + TypeScript + Vite + pnpm** a partir de los mockups en papel realizados para el proyecto.

La aplicación cuenta actualmente con tres pantallas principales:

- Inicio / Dashboard
- Simulación
- Comunidad

La implementación se enfoca en la arquitectura visual, navegación, responsividad y fidelidad con los diseños definidos para el proyecto. Se utiliza CSS propio, sin librerías externas de interfaz.

## Ejecutar

```sh
pnpm install
pnpm dev
```

Abrir la dirección local que muestra Vite.

En PowerShell, si Windows bloquea `pnpm.ps1`, se puede utilizar:

```sh
pnpm.cmd dev
```

También se puede ejecutar desde Command Prompt en VS Code.

Comandos disponibles:

```sh
pnpm lint     # Revisión del código
pnpm build    # Comprobación de TypeScript y compilación en dist/
pnpm preview  # Vista previa de la compilación
```

## Tecnologías

- React
- TypeScript
- Vite
- pnpm
- CSS
- SVG para elementos visuales y gráficos ilustrativos

## Organización

```text
src/
  components/
    Avatar.tsx
    AquariumScene.tsx
    CommunitySidebar.tsx
    FilterSidebar.tsx
    Header.tsx
    Icon.tsx
    PostCard.tsx
    PostComposer.tsx
    ResultPreview.tsx
    SimulationParameters.tsx

  data/
    community.ts
    simulation.ts

  pages/
    CommunityPage.tsx
    DashboardPage.tsx
    SimulationPage.tsx

  types/
    community.ts

  App.tsx
  App.css
  navigation.ts
  index.css
  main.tsx

public/
  favicon.svg
```

Los componentes reutilizables contienen elementos visuales y controles utilizados por las diferentes pantallas, mientras que los archivos de `data` contienen información ficticia utilizada para representar el funcionamiento del frontend.

## Pantalla de Inicio

La pantalla de Inicio funciona como dashboard principal de Aqua Life.

Incluye:

- Cabecera con navegación entre las principales secciones.
- Presentación general de Aqua Life.
- Acceso destacado a la Simulación.
- Tarjetas de parámetros, resultados y comunidad.
- Accesos rápidos a diferentes secciones del sistema.
- Resumen visual relacionado con el ecosistema acuático.
- Diseño adaptado para diferentes tamaños de pantalla.

El objetivo del dashboard es entregar una vista general del sistema y facilitar el acceso a sus principales herramientas.

## Pantalla de Simulación

La pantalla de Simulación representa visualmente la configuración y seguimiento de un ecosistema acuático.

Incluye:

- Selección de pecera.
- Control de temperatura.
- Control de pH.
- Control de oxígeno.
- Control de iluminación.
- Selección de duración.
- Selección de intervalo.
- Restablecimiento de parámetros.
- Representación visual del acuario mediante `AquariumScene`.
- Resultados ilustrativos de temperatura, pH, calidad del agua y oxígeno.
- Gráficos de evolución.
- Alertas de ejemplo.
- Historial de simulaciones anteriores.
- Acciones visuales para exportar, guardar y compartir.
- Acceso directo a Comunidad.

Los parámetros utilizan estado local únicamente para representar la interacción de la interfaz.

Los gráficos, alertas e historial utilizan datos ficticios y no corresponden todavía a resultados calculados por un servidor.

Las acciones que requieren procesamiento o persistencia se mantienen deshabilitadas, ya que corresponden a funcionalidades de una etapa posterior.

## Pantalla de Comunidad

La pantalla de Comunidad representa el espacio de interacción entre usuarios de Aqua Life.

### Cabecera

Incluye:

- Aqua Life
- Inicio
- Simulación
- Comunidad
- Búsqueda
- Ranking
- Notificaciones
- Perfil

### Columna izquierda

Incluye herramientas para explorar y filtrar contenido:

- Buscador.
- Categorías.
- Tipos de contenido.
- Etiquetas.
- Acceso a publicaciones guardadas.

### Feed principal

Permite interactuar localmente con publicaciones de demostración.

Incluye:

- Formulario para crear publicaciones.
- Ordenamiento de publicaciones.
- Comentarios.
- Me gusta.
- Guardado de publicaciones.
- Resultados gráficos ilustrativos.
- Publicaciones creadas durante la sesión.

### Columna derecha

Incluye:

- Ranking de usuarios.
- Selector de período.
- Conexiones.
- Notificaciones.
- Vista previa de mensajes.

## Qué se puede probar

### Navegación

- Navegar entre Inicio, Simulación y Comunidad.
- Acceder a secciones internas mediante enlaces de la interfaz.

### Simulación

- Seleccionar una pecera.
- Modificar temperatura, pH, oxígeno e iluminación.
- Cambiar duración e intervalo.
- Restablecer los parámetros.
- Consultar gráficos ilustrativos.
- Revisar alertas.
- Consultar el historial de simulaciones.
- Acceder directamente a Comunidad.

### Comunidad

- Buscar publicaciones por autor, texto o etiqueta.
- Combinar filtros por categoría, tipo y etiqueta.
- Ordenar publicaciones.
- Crear publicaciones.
- Adjuntar imágenes JPG, PNG o WebP de hasta 3 MB.
- Dar o quitar me gusta.
- Guardar publicaciones.
- Ver publicaciones guardadas.
- Agregar comentarios.
- Cambiar el período del ranking.
- Marcar notificaciones como leídas.
- Escribir un mensaje de demostración a una conexión.

## Diseño responsive

La interfaz utiliza **CSS Grid, Flexbox y Box Model** para adaptar la estructura de las pantallas a diferentes resoluciones.

En pantallas grandes se mantiene la distribución definida en los mockups.

En resoluciones intermedias, los paneles se reorganizan para conservar la legibilidad.

En dispositivos móviles, las diferentes secciones pasan a una distribución principalmente vertical de una columna.

## Estado actual

El proyecto corresponde actualmente a una implementación de frontend.

Las funcionalidades interactivas disponibles funcionan localmente en el navegador y sirven como demostración de la experiencia de usuario.

**No existe todavía integración con backend.**

Actualmente no se incluye:

- Autenticación real.
- API.
- Base de datos.
- Persistencia de información.
- Cálculo científico real de simulaciones.
- Envío real de mensajes.
- Exportación de resultados.
- Guardado permanente de simulaciones.

Los perfiles, publicaciones, métricas, simulaciones, puntajes, alertas e historial utilizados en la interfaz son datos ficticios.

Al recargar la aplicación, los cambios realizados localmente durante la demostración pueden restablecerse.
