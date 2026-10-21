import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.mjs';

test('Variantes de producción conservan ruta y parámetros al pasar a HTTPS sin www', async () => {
  for (const origin of ['http://soydiaz.com','http://www.soydiaz.com','https://www.soydiaz.com']) {
    const response=await worker.fetch(new Request(origin+'/desarrollo-drupal-guatemala/?utm_source=prueba'),{ASSETS:{fetch(){throw Error('No debe servir duplicados');}}});
    assert.equal(response.status,308);
    assert.equal(response.headers.get('location'),'https://soydiaz.com/desarrollo-drupal-guatemala/?utm_source=prueba');
  }
});

test('El dominio canónico y las vistas de desarrollo delegan a assets sin alterar la respuesta',async () => {
  for(const origin of ['https://soydiaz.com','http://localhost:8787','https://soydiaz.example.workers.dev']) {
    const request=new Request(origin+'/ruta-inexistente',{method:'HEAD'});
    const response=new Response(null,{status:404});
    assert.equal(await worker.fetch(request,{ASSETS:{fetch(received){assert.equal(received,request);return response;}}}),response);
  }
});
