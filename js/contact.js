export const serviceLabels = Object.freeze({
  no_definido: 'Necesito orientación',
  wordpress: 'WordPress',
  drupal: 'Drupal',
  mantenimiento: 'Mantenimiento web',
  ecommerce: 'Tienda en línea',
  ia: 'Integraciones con IA',
  php: 'Sistema PHP o integración API'
});

export function buildInquiry(data) {
  const field = (name, limit) => String(data.get(name) ?? '').trim().slice(0, limit);
  const key = field('service', 30);
  const service = Object.hasOwn(serviceLabels, key) ? serviceLabels[key] : serviceLabels.no_definido;
  return [
    'Hola Jonathan, quiero conversar sobre un proyecto web.', '',
    `Empresa o equipo: ${field('company', 120) || 'Por definir'}`,
    `Servicio: ${service}`,
    `Web actual: ${field('website', 250) || 'No tengo web / por definir'}`, '',
    'Objetivo y funcionalidades:', field('goals', 1200), '',
    `Plazo deseado: ${field('timeline', 120) || 'Por definir'}`,
    `Presupuesto orientativo: ${field('budget', 120) || 'Por definir'}`
  ].join('\n');
}

export function inquiryLink(text, service) {
  const subject = `Proyecto web · ${Object.hasOwn(serviceLabels, service) ? serviceLabels[service] : serviceLabels.no_definido}`;
  return 'mailto:jonathan.policarpio@gmail.com?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(text);
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('projectBrief');
  const review = document.getElementById('briefReview');
  const preview = document.getElementById('briefPreview');
  const mailLink = document.getElementById('briefMailLink');
  if (form && review && preview && mailLink) {
    const selected = new URLSearchParams(window.location.search).get('servicio');
    if (Object.hasOwn(serviceLabels, selected)) form.elements.service.value = selected;
    form.hidden = false;
    let preparedLink;
    mailLink.addEventListener('click', () => {
      if (!preparedLink) return;
      if (typeof window.gtag === 'function') window.gtag('event', 'contact_click', {
        contact_method: 'email', page_path: window.location.pathname, transport_type: 'beacon'
      });
      window.location.href = preparedLink;
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const text = buildInquiry(data);
      preview.value = text;
      preparedLink = inquiryLink(text, data.get('service'));
      review.hidden = false;
      review.focus();
      // Solo datos del evento; nunca contenido del formulario ni datos personales.
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'project_brief_prepared', {
          service: Object.hasOwn(serviceLabels, data.get('service')) ? data.get('service') : 'no_definido',
          page_path: window.location.pathname
        });
      }
    });
  }
}
