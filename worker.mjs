const productionHosts = new Set(['soydiaz.com', 'www.soydiaz.com']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (productionHosts.has(url.hostname) &&
        (url.protocol !== 'https:' || url.hostname !== 'soydiaz.com')) {
      url.protocol = 'https:';
      url.hostname = 'soydiaz.com';
      url.port = '';
      return Response.redirect(url.toString(), 308);
    }
    return env.ASSETS.fetch(request);
  }
};
