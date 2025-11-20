# P-Harmonía

Bienestar, belleza, fitness, finanzas y comunidad para mujeres empoderadas.

## Cómo desplegar en GitHub Pages

1. Asegúrate de tener Node.js instalado
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Actualiza las rutas para GitHub Pages:
   ```bash
   node fix-paths.js
   ```
4. Haz commit y push de los cambios a tu repositorio
5. Ve a la configuración de GitHub Pages en tu repositorio
6. Selecciona la rama `main` y la carpeta `/docs` o `/Public` según corresponda
7. Tu sitio estará disponible en: `https://tunombredeusuario.github.io/P-Harmon-a/`

## Estructura del proyecto

- `/Public` - Archivos estáticos del sitio web
  - `/assets` - Recursos estáticos (CSS, JS, imágenes)
  - `/components` - Componentes reutilizables
  - `/pages` - Otras páginas
- `/functions` - Funciones de Firebase (si aplica)
- `index.html` - Página principal

## Soporte

Si encuentras algún problema, por favor crea un issue en el repositorio.
