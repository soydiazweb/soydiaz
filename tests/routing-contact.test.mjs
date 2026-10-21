import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.mjs';
import {buildInquiry, inquiryLink} from '../js/contact.js';

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

test('El correo conserva Unicode y saltos de línea sin inyectar parámetros adicionales',()=>{
  const fields=new Map([['company','Empresa & equipo'],['service','drupal'],['goals','Portal en Guatemala\nPermisos y APIs: ¿cómo empezar?'],['budget','Por revisar']]);
  const text=buildInquiry(fields);
  const uri=new URL(inquiryLink(text,'drupal'));
  assert.equal(uri.protocol,'mailto:');
  assert.equal(uri.searchParams.get('body'),text);
  assert.equal(uri.searchParams.get('subject'),'Proyecto web · Drupal');
  assert.equal([...uri.searchParams.keys()].length,2);
  assert.match(text,/Portal en Guatemala\nPermisos y APIs/);
  assert.match(text,/Plazo deseado: Por definir/);
});

test('Un servicio desconocido usa la opción de orientación y el mensaje tiene longitud limitada',()=>{
  const text=buildInquiry(new Map([['service','constructor'],['goals','x'.repeat(3000)]]));
  assert.match(text,/Servicio: Necesito orientación/);
  assert.ok(!text.includes('x'.repeat(1201)));
  assert.equal(new URL(inquiryLink(text,'__proto__')).searchParams.get('subject'),'Proyecto web · Necesito orientación');
});
