/* ============================================
   PROYECTOS — Editá este archivo para agregar/quitar trabajos.

   Cada proyecto tiene:
   - title:     Nombre del proyecto
   - category:  Etiqueta de rubro (E-commerce, Gastronomía, etc.)
   - subtitle:  Una línea descriptiva
   - image:     Ruta al screenshot (poner el archivo en /portadaproyecto/)
   - video:     Ruta al video de portada (.mp4)
   - link:      URL al sitio en vivo
   - instagram: URL al Instagram del cliente
   - challenge: Desafío que tenía el cliente
   - solution:  Qué hicimos
   - result:    Resultado final
   ============================================ */

const PROJECTS = [
  {
    title: "De la Ostia Perfumes",
    category: "E-commerce",
    subtitle: "Tienda online de perfumería",
    image: "portadaproyecto/perfumes.png",
    video: "portadaproyecto/perfu.mp4",
    link: "https://delaostia.vercel.app/#categories",
    instagram: "https://www.instagram.com/dlo_perfumeria",
    challenge: "El cliente necesitaba vender perfumes online con una experiencia premium que transmita confianza y exclusividad.",
    solution: "Le armamos un e-commerce minimalista con catálogo por categorías, carrito y checkout fluido. Foco total en la imagen del producto.",
    result: "Una tienda lista para escalar, con navegación clara y un look de marca que invita a comprar."
  },
  {
    title: "Alimeythor",
    category: "Infantil",
    subtitle: "Sitio temático para chicos",
    image: "portadaproyecto/alimeythor.png",
    video: "portadaproyecto/alimey.mp4",
    link: "https://alimeythro.vercel.app/index.html",
    instagram: "https://www.instagram.com/alimeythor/?hl=es",
    challenge: "Crear un sitio infantil colorido y divertido que enganche a los chicos sin perder la confianza de los padres.",
    solution: "Diseñamos una web con identidad visual juvenil, secciones temáticas, animaciones suaves y navegación intuitiva.",
    result: "Un sitio que combina diversión y profesionalismo — los chicos lo disfrutan y los padres lo aprueban."
  },
  {
    title: "ZAMI Empanadas",
    category: "Gastronomía",
    subtitle: "Empanadas salteñas hechas a mano",
    image: "",
    video: "portadaproyecto/empanadas.mp4",
    link: "https://zamiempanadas.vercel.app/",
    instagram: "https://www.instagram.com/zamiempanadas/?hl=es",
    challenge: "Construir una identidad digital que reflejara el carácter auténtico de Zami Empanadas, transmitiendo tradición, cercanía y pasión por las recetas artesanales.",
    solution: "Diseñamos una experiencia visual inspirada en la cultura argentina, destacando el proceso artesanal, los ingredientes seleccionados y la personalidad única de la marca.",
    result: "Una web que no solo exhibe productos, sino que comunica la esencia de Zami Empanadas y fortalece su conexión con los clientes."
  }
];
