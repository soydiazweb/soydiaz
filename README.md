# SoyDiaz

Sitio estático de Jonathan Díaz: desarrollo web para empresas en Guatemala y Latinoamérica. Las páginas se entregan en HTML, con CSS y JavaScript compartidos; no requieren un framework ni generar contenido en el navegador.

## Páginas comerciales

- `/`: oferta general, experiencia, portafolio y servicios.
- `/desarrollo-wordpress-guatemala/`: WordPress empresarial, plugins e integraciones.
- `/desarrollo-drupal-guatemala/`: portales, contenido estructurado y permisos.
- `/mantenimiento-web-guatemala/`: revisión de WordPress y Drupal y definición de cobertura.
- `/tiendas-en-linea-guatemala/`: ecommerce con Shopify o WooCommerce.
- `/integraciones-ia/`: APIs, automatización y flujos con supervisión.
- `/contacto/`: contacto directo y preparación de un correo con contexto.
- `/blog/`: guías de arquitectura, desarrollo y operación.

Cada URL comercial tiene título, descripción, canonical, metadatos sociales y JSON-LD. El sitemap incluye 27 URLs. Las entidades de persona, marca y servicios usan IDs estables; no se publican direcciones, valoraciones o resultados no confirmados.

## Editar y verificar

Editar directamente el `index.html` de cada sección. Los estilos comerciales están en `css/services.css`; la portada y el blog conservan `css/styles.css`. Al modificar una URL o su contenido, comprobar metadatos, enlaces relacionados y sitemap. `lastmod` debe representar una modificación real.

Para abrir una vista local con rutas y assets correctos, ejecutar `npx wrangler dev` y abrir la URL indicada por la herramienta.

```sh
python3 scripts/check-site.py
node --test tests/routing-contact.test.mjs
node --check js/main.js
node --check js/contact.js
```

Las pruebas JavaScript requieren Node 22 o superior. El validador Python revisa páginas del sitemap, títulos, canonical, JSON-LD, dimensiones de imágenes y enlaces/anclas internos. Las pruebas de routing verifican redirecciones, delegación a assets y preparación del correo. No sustituyen una revisión visual ni la comprobación posterior en producción.

## Contacto y medición

`js/contact.js` prepara un mensaje y permite abrirlo en la aplicación de correo del visitante. No hay envío automático ni backend de formularios. Hay enlaces directos de correo y LinkedIn disponibles sin JavaScript. El texto del formulario no se guarda en el servidor y no se incluye en los eventos explícitos de analítica.

Se conserva la propiedad GA4 existente. Los eventos añadidos son `contact_click`, `contact_open` cuando se usa un panel, y `project_brief_prepared`. Estos eventos miden interacciones, no solicitudes recibidas ni ventas. No deben etiquetarse como leads calificados sin relacionarlos con el registro comercial. El botón que abre el correo preparado evita colocar el contenido del mensaje en un enlace medible automáticamente.

## Imágenes

Las páginas usan versiones WebP y dimensiones explícitas. Se conservan los originales para no romper referencias externas. Los metadatos sociales usan JPEG. `docs/image-optimization.json` registra los bytes antes y después de las 33 conversiones; la suma no es el peso de descarga inicial ni una medición de Core Web Vitals.

## Cloudflare y publicación

La configuración `wrangler.jsonc` sirve assets y ejecuta `worker.mjs` primero. El Worker unifica HTTP y www hacia `https://soydiaz.com/` con 308, conserva ruta y parámetros y delega el resto a `ASSETS`. Localhost y dominios de preview no se redirigen al sitio público. Se mantiene un 404 real para rutas inexistentes. Al ejecutar el Worker primero, las peticiones pasan por código antes de la entrega de assets; revisar el uso del plan de Workers al publicar.

`.assetsignore` excluye Git, configuración, documentación, pruebas, variables locales y herramientas del paquete público. `.htaccess` ofrece reglas equivalentes para Apache, pero Cloudflare Workers no lo interpreta.

Validación del paquete, sin publicación:

```sh
npx wrangler deploy --dry-run
```

La validación se realizó con Wrangler 4.147.0 y Node 24. Para publicar se necesita acceso a la cuenta Cloudflare correcta y confirmar que el Worker `soydiaz` atiende los dominios de producción. No añadir rutas o dominios de otra cuenta. Después de publicar, comprobar HTTPS, www, rutas comerciales, recursos, sitemap y una ruta inexistente.

## Tareas en cuentas externas

Después de publicar: enviar el sitemap e inspeccionar páginas clave en Search Console y Bing Webmaster; revisar el control de inclusión y reporte de IA de Google; validar los eventos en GA4; comprobar en logs solicitudes reales de crawlers antes de cambiar el WAF. El robots.txt actual permite el rastreo general. No se han cambiado preferencias de entrenamiento ni reglas del CDN.

Los casos de proyecto necesitan confirmar rol, permisos y resultados antes de publicarse. El portafolio conserva la información existente; no se añadieron porcentajes, testimonios o autorías exclusivas.
