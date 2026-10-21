# Línea base de rendimiento — 2026-10-21

Medición de laboratorio con Lighthouse 12.2.1, el motor de PageSpeed Insights, con su configuración por defecto: móvil emulado con red 4G lenta, y preset de escritorio. Se midió producción **antes del despliegue de la Fase 1**. La API pública de PageSpeed devolvió 429 (cupo sin clave agotado).

No hay datos de campo (CrUX): el sitio todavía no tiene tráfico suficiente para que Chrome publique métricas reales. Cuando aparezcan, se verán en Search Console → Métricas web principales.

Umbrales de Google (percentil 75 de usuarios reales): LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1. En laboratorio, TBT sustituye a INP.

## Resultados

| Página | Perf. móvil | LCP móvil | CLS móvil | Perf. escritorio | LCP escritorio | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|---|---|---|---|
| Portada `/` | **82** | **3,8 s** | 0,011 | 91 | 1,4 s | 100 / 96 | 96 | 100 |
| Blog `/blog/` | **85** | **4,0 s** | 0,022 | 91 | 1,7 s | 98 | 96 | 100 |
| WordPress | n/d* | 2,0 s | 0,012 | 97 | 1,0 s | 100 | 96 | 100 |
| Drupal | 97 | 2,0 s | 0,042 | 98 | 0,9 s | 100 | 96 | 100 |
| Mantenimiento | 97 | 2,0 s | 0,029 | 98 | 0,9 s | 100 | 96 | 100 |
| Tiendas en línea | 97 | 2,1 s | 0,002 | 95 | 1,1 s | 100 | 96 | 100 |
| Integraciones IA | 97 | 2,1 s | 0,019 | 94 | 1,2 s | 100 | 96 | 100 |
| Contacto | 97 | 2,1 s | 0,037 | 94 | 1,2 s | 100 | 96 | 100 |

TBT = 0–10 ms en todas las páginas (JavaScript no es problema).
\* La ejecución no devolvió puntuación global aunque sí las métricas. Repetir.

## Diagnóstico

Las páginas de servicio cumplen los umbrales. **La portada y el blog no cumplen LCP en móvil.**

1. **Portada, LCP 3,8 s.** El 82 % es *render delay*: la imagen del hero tarda 0,2 s en descargar, pero el bloque no se pinta hasta que terminan las animaciones de entrada (`rise`) y cargan las fuentes de Google. → Mostrar el H1 y el hero sin esperar a la animación, o acortarla.
2. **Blog, LCP 4,0 s.** La primera portada del listado tiene `loading="lazy"`, y es el elemento LCP. → `loading="eager"` + `fetchpriority="high"` en la primera tarjeta; servir las imágenes del listado a su tamaño real (≈ 64 KiB de ahorro).
3. **Recursos que bloquean el render (≈ 1 s):** Google Fonts (3 familias) + `services.css` + `main.js` sin `defer`. → Alojar las fuentes en el sitio o cargarlas con `preload` + `font-display: swap`, y añadir `defer` a `main.js`.
4. Menores: `styles.css` sin minificar (3 KiB), orden de encabezados en el listado del blog (H3 sin H2), y un error de consola de DNS que conviene revisar en producción.

## Seguimiento

Repetir esta medición después de cada cambio de plantilla y una vez al mes. Meta: LCP móvil ≤ 2,5 s y puntuación ≥ 90 en todas las páginas comerciales.
