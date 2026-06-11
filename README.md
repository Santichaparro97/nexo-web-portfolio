# NEXO WEB — Portafolio

Portafolio brutalist en HTML/CSS/JS puro. Sin build, sin dependencias.

## Archivos

- `index.html` — Estructura
- `styles.css` — Estilos (paleta fucsia/lima/negro)
- `projects.js` — **Acá editás los proyectos** (sin tocar el HTML)
- `script.js` — Lógica (render de proyectos, animaciones, menú)

## Cómo agregar un proyecto

Abrí `projects.js` y agregá un objeto al array `PROJECTS`:

```js
{
  title: "Nombre del proyecto",
  tag: "E-Commerce",
  desc: "Descripción breve del trabajo.",
  image: "img/proyecto1.jpg",   // o "" para placeholder
  link: "https://misitio.com"   // o "" para "Próximamente"
}
```

Las imágenes podés guardarlas en una carpeta `img/` al lado del HTML.

## Personalizar

- **WhatsApp**: en `index.html` buscá `wa.me/5491100000000` y reemplazá por tu número (formato internacional, sin `+`).
- **Email**: buscá `hola@nexoweb.com` en `index.html`.
- **Colores**: en `styles.css` arriba de todo están las variables `--fucsia`, `--lime`, `--black`.

## Ver localmente

Abrí `index.html` con doble click, o levantá un server simple:

```bash
python -m http.server 8000
# luego abrir http://localhost:8000
```

## Deploy

Subí los 4 archivos a cualquier hosting estático: Netlify, Vercel, GitHub Pages, Cloudflare Pages.
