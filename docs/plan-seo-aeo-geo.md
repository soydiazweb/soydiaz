# Plan SEO · AEO · GEO — soydiaz.com

Inicio: 2026-10-21 · Revisión: semanal (lunes)

Dos objetivos:

1. **Comercial (Guatemala):** aparecer en búsquedas de clientes: "páginas web Guatemala", "diseño de páginas web Guatemala", "desarrollo web Guatemala", "sitios web para empresas Guatemala", "tienda en línea Guatemala", "WordPress Guatemala".
2. **Marca (SoyDiaz = IA):** que Google, ChatGPT, Perplexity, Gemini y Claude asocien "SoyDiaz / Jonathan Díaz" con flujos y procesos de IA, agentes y automatización.

---

## Diagnóstico (2026-10-21)

### Bloqueantes (producción)

| # | Hallazgo | Impacto |
|---|----------|---------|
| B1 | El trabajo de las páginas de servicio **no está en producción**: 6 URLs del sitemap local dan 404 (`/desarrollo-wordpress-guatemala/`, `/desarrollo-drupal-guatemala/`, `/mantenimiento-web-guatemala/`, `/tiendas-en-linea-guatemala/`, `/integraciones-ia/`, `/contacto/`). Los cambios están sin commit en la rama `soydiaz`. | Las páginas comerciales no existen para Google. |
| B2 | `www.soydiaz.com` y `http://` responden 200 en vez de redirigir (el Worker nuevo no está desplegado). | Contenido duplicado. |
| B3 | Cloudflare devuelve **403 a GPTBot y ClaudeBot** (Perplexity y Google-Extended sí pasan). Probablemente "Block AI bots" / AI Crawl Control activo. | ChatGPT y Claude no pueden leer el sitio → GEO bloqueado. |
| B4 | No existe `/llms.txt`. | Menor, pero barato de resolver. |

### SEO on-page

- Bien: títulos/descripciones únicas, canonical, `es-GT`, JSON-LD con `@id` estables, WebP, validador propio pasa (27 páginas).
- El sitio usa el lenguaje del proveedor ("desarrollo web", "portales", "CMS"), no el del cliente guatemalteco: **"página web" / "páginas web" / "diseño web" no aparecen** en la portada. Es la búsqueda principal en GT.
- No hay página para "páginas web / diseño web" ni para "sitios web corporativos" (la portada carga con todo).
- Los 5 servicios usan los mismos H2 de plantilla ("Antes de cotizar", "Cómo trabajamos"...) — conviene diferenciarlos.
- H1 del blog es "BLOG SOYDIAZ" (sin intención de búsqueda).
- Artículos de 300–700 palabras; varios temas solapados (Drupal vs WordPress ×2, IA "¿la necesito?" ×3).
- `/optimisa/` (landing de un cliente) está indexable sin canonical ni meta robots, con temática azucarera ajena → diluye el tema del dominio.

### AEO/GEO (respuestas e IA)

- **Cero contenido sobre agentes de IA**, flujos agénticos, MCP, n8n/Make, RAG, capacitación en IA. La página `/integraciones-ia/` habla de "integraciones y APIs", no de agentes.
- `Person.jobTitle` = "Desarrollador web"; falta `knowsAbout`, `hasOccupation`, más `sameAs` (YouTube, X, Instagram, perfil GBP...).
- Hay secciones de preguntas pero **sin `FAQPage`** y las respuestas no arrancan con una frase-respuesta directa.
- Sin datos propios citables (casos con números, precios orientativos en GTQ, plazos). Las IA citan cifras y definiciones claras.
- Sin presencia de terceros verificable (Google Business Profile, directorios GT, Clutch, entrevistas, charlas). Para GEO pesa más lo que otros dicen de ti que tu propio sitio.

---

## Posicionamiento

Identidad: **Web Advisor** (no "desarrollador web"). Las palabras clave de búsqueda (páginas web, desarrollo web, Guatemala) se mantienen en títulos y contenido; la identidad en biografía, `jobTitle`, H1 y llms.txt es Web Advisor.

## Plan por fases

### Fase 0 — Desbloquear (semana 1)
- [x] Revisar diff, commit y desplegar el trabajo pendiente (B1, B2). Verificado 2026-10-21: 27 URLs 200, http/www → 308.
- [x] Bots de búsqueda IA permitidos (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot: 200). GPTBot y ClaudeBot (entrenamiento) siguen en 403. Original: permitir GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended (B3). Decidir aparte si permites *entrenamiento* o solo *búsqueda*.
- [x] Crear `/llms.txt` con resumen de marca, servicios y URLs clave (B4).
- [x] `/optimisa/`: `noindex` o moverla a subdominio.
- [x] Search Console (propiedad de dominio `soydiaz.com`, 2026-10-21): sitemap enviado y leído; indexación solicitada para portada, WordPress, Drupal, mantenimiento, tiendas, IA y contacto. La portada ya estaba indexada; las 6 restantes estaban "descubiertas, sin indexar". Datos de rendimiento aún en proceso.
- [ ] Tras desplegar la Fase 1: solicitar indexación de `/paginas-web-guatemala/` y volver a enviar el sitemap.
- [ ] Bing Webmaster: importar desde Search Console. Bing alimenta a ChatGPT/Copilot.
- [x] Línea base de rendimiento: `docs/linea-base-rendimiento.md`.
- [ ] Línea base de búsqueda: exportar consultas y páginas de GSC cuando terminen de procesarse (24–72 h) y correr el panel de prompts IA (abajo).

### Fase 1 — Guatemala comercial (semanas 2–4)
- [x] Nueva página pilar **`/paginas-web-guatemala/`** (sin precios: pendientes de confirmar) ("Páginas web para empresas en Guatemala": tipos, qué incluye, rangos de inversión en GTQ, plazos, proceso, FAQ).
- [x] Portada: incorporar "páginas web" y "sitios web" en H1/intro/servicios sin perder WordPress/Drupal.
- [x] Diferenciar H2 y FAQ de cada servicio con preguntas reales del cliente ("¿Cuánto cuesta una página web en Guatemala?", "¿Cuánto tarda?", "¿Incluye hosting y dominio?").
- [ ] `FAQPage` + `Service.offers`/`priceSpecification` con rangos reales (si los apruebas).
- [ ] Google Business Profile (área de servicio, sin dirección pública) + reseñas de clientes reales.
- [ ] 3–5 menciones locales: directorios GT, Cámara de Comercio/AGEXPORT, colaboraciones con clientes del portafolio (enlace "sitio desarrollado por").

### Fase 2 — Autoridad IA / agentes (semanas 3–8)
- [ ] Nueva página pilar **`/agentes-ia/`** (o renombrar/ampliar `/integraciones-ia/` como hub): "Agentes y flujos de IA para empresas" — qué es un agente, cuándo sí/no, arquitectura (herramientas, memoria, supervisión humana), casos, costos.
- [ ] Página **`/capacitacion-ia-empresas/`** basada en las propuestas existentes (niveles Essential / Accelerate / Transform), sin nombrar clientes sin permiso.
- [ ] Serie de contenido "definicional" (lo que las IA citan): *Qué es un agente de IA*, *Agente vs automatización vs chatbot*, *Cómo diseñar un flujo de IA con supervisión humana*, *MCP explicado para empresas*, *Cuánto cuesta implementar un agente de IA*. Cada uno con respuesta directa en el primer párrafo, tabla, y fecha visible.
- [ ] Consolidar artículos IA solapados (`empresa-necesita-ia`, `automatizar-ia-desarrollo-web`, `ia-procesos-empresariales-supervision`) con 301.
- [ ] Entidad: `Person.jobTitle` → "Desarrollador web y consultor en flujos de IA y agentes"; `knowsAbout` (WordPress, Drupal, agentes de IA, automatización de procesos, MCP…); `sameAs` completo. Mismo titular en LinkedIn, GitHub y bios.
- [ ] Prueba social externa: 1 post/semana en LinkedIn enlazando al pilar, 1 repo público de ejemplo (agente/flujo) en GitHub, charlas/podcasts/webinars en GT.

### Fase 3 — Mantener (continuo)
- 1 pieza nueva o actualización relevante por semana; `lastmod` solo en cambios reales.
- Revisar Core Web Vitals mensual (PageSpeed / CrUX).

---

## Medición semanal

Registro en `docs/seo-semanal.csv` (una fila por semana).

| Métrica | Fuente | Meta 12 semanas |
|---|---|---|
| Clics e impresiones totales | GSC | +100 % vs línea base |
| Impresiones del grupo "páginas/sitios/desarrollo web + Guatemala" | GSC (filtro regex) | Top 20 → top 10 |
| Posición media de 10 consultas objetivo | GSC | Registrar tendencia |
| Impresiones del grupo "IA / agentes / automatización" | GSC | Tendencia creciente |
| Búsquedas de marca ("soydiaz", "jonathan diaz") | GSC | Tendencia creciente |
| URLs indexadas / con error | GSC Páginas | 100 % de las comerciales indexadas |
| Panel GEO: menciones de SoyDiaz en 12 prompts × 4 IA | Manual o script | 0 → ≥ 6/48 |
| Visitas de referencia desde chatgpt.com, perplexity.ai, gemini, copilot | GA4 | Registrar |
| Peticiones de crawlers de IA | Cloudflare AI Crawl Control | > 0 y creciendo |
| `contact_click` + `project_brief_prepared` | GA4 | Tendencia |
| Solicitudes reales recibidas | Tu registro | La métrica que importa |

### Panel de prompts GEO (mismos cada semana, sesión limpia)

Comerciales:
1. ¿Quién hace páginas web para empresas en Guatemala?
2. Recomiéndame un desarrollador WordPress en Guatemala.
3. ¿Cuánto cuesta una página web en Guatemala?
4. Necesito una tienda en línea en Guatemala, ¿con quién hablo?
5. Desarrollador Drupal en Guatemala.
6. ¿Qué debo preguntar antes de contratar desarrollo web en Guatemala?

Marca IA:
7. ¿Quién es SoyDiaz?
8. Expertos en agentes de IA en Guatemala.
9. ¿Quién puede implementar flujos de IA y automatización para mi empresa en Guatemala/Centroamérica?
10. Capacitación en inteligencia artificial para empresas en Guatemala.
11. ¿Qué es un agente de IA y cuándo lo necesita una empresa? (¿cita soydiaz.com?)
12. ¿Cómo implementar IA con supervisión humana en procesos empresariales? (¿cita soydiaz.com?)

Para cada uno: ¿menciona a SoyDiaz/Jonathan Díaz? (0/1) · ¿cita una URL de soydiaz.com? (0/1) · competidores mencionados.

Regex GSC sugeridas:
- Comercial: `(pagina|página|paginas|páginas|sitio|sitios|desarrollo|diseño|tienda).*(web|en linea|en línea|online)`
- IA: `(ia|inteligencia artificial|agente|agentes|automatiz|flujo)`
- Marca: `(soydiaz|soy diaz|jonathan d[ií]az)`
