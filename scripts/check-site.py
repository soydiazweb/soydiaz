#!/usr/bin/env python3
"""Validar las páginas indexables y enlaces locales sin acceder a producción."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
import json,re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
ORIGIN='https://soydiaz.com'

class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=True)
  self.ids=[];self.links=[];self.images=[];self.h1=0;self.title=[];self.in_title=False
  self.meta={};self.canonical=[];self.schemas=[];self.in_schema=False;self.schema=''
  self.lang=None;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag=='html':self.lang=a.get('lang')
  if tag=='title':self.in_title=True
  if tag=='h1':self.h1+=1
  if tag=='meta':self.meta[a.get('name') or a.get('property')]=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if tag in ('a','link') and a.get('href'):self.links.append(a['href'])
  if tag in ('img','script') and a.get('src'):self.links.append(a['src'])
  if tag=='img':self.images.append(a)
  if tag=='script' and a.get('type')=='application/ld+json':self.in_schema=True;self.schema=''
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='script' and self.in_schema:
   self.schemas.append(json.loads(self.schema));self.in_schema=False
 def handle_data(self,data):
  if self.in_title:self.title.append(data)
  if self.in_schema:self.schema+=data

def local_path(url):
 path=ROOT/unquote(urlsplit(url).path).lstrip('/')
 return path/'index.html' if path.is_dir() else path

errors=[];parsed={};titles=set();count=0
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
entries=ET.parse(ROOT/'sitemap.xml').findall('s:url',ns)
urls=[x.find('s:loc',ns).text for x in entries]
assert len(urls)==len(set(urls)), 'URLs repetidas en sitemap'
for url in urls:
 path=local_path(url)
 if not path.is_file():errors.append(f'Falta {url}');continue
 try:page=Page(path.read_text())
 except Exception as e:errors.append(f'HTML/JSON-LD {url}: {e}');continue
 parsed[url]=page;count+=1
 def check(ok,msg):
  if not ok:errors.append(f'{url}: {msg}')
 title=''.join(page.title)
 check(page.lang=='es-GT','idioma incorrecto');check(page.h1==1,'debe tener un H1')
 check(bool(title) and title not in titles,'título vacío o repetido');titles.add(title)
 check(page.canonical==[url],'canonical no coincide con sitemap')
 check(bool(page.meta.get('description')),'falta descripción')
 check('noindex' not in page.meta.get('robots',''),'URL del sitemap con noindex')
 check(len(page.ids)==len(set(page.ids)),'IDs repetidos')
 check(bool(page.schemas),'falta JSON-LD')
 for img in page.images:
  check('alt' in img,'imagen sin alt')
  check(str(img.get('width','')).isdigit() and str(img.get('height','')).isdigit(),'dimensiones inválidas de imagen '+img.get('src',''))

for url,page in parsed.items():
 for href in page.links:
  target=urlsplit(urljoin(url,href))
  if target.scheme not in ('http','https') or target.hostname not in ('soydiaz.com','www.soydiaz.com'):continue
  path=local_path(target.geturl())
  if not path.is_file():errors.append(f'{url}: enlace/recurso inexistente {href}');continue
  if target.fragment and path.suffix=='.html':
   other=parsed.get(ORIGIN+target.path)
   if other is None:other=Page(path.read_text())
   if unquote(target.fragment) not in other.ids:errors.append(f'{url}: ancla inexistente {href}')
 for data in page.schemas:
  nodes=data.get('@graph',[data])
  for node in nodes:
   if node.get('@type')=='Article':
    if node.get('dateModified','')<node.get('datePublished',''):errors.append(f'{url}: modificación anterior a publicación')
 for src in re.findall(r"url\(['\"]?([^)\'\"]+)",(ROOT/'css/styles.css').read_text()):
  if src.startswith(('data:','http:','https:')):continue
  if not (ROOT/'css'/src).resolve().is_file():errors.append('Recurso CSS inexistente '+src)

if errors:
 print('\n'.join(sorted(set(errors))));raise SystemExit(1)
print(f'OK: {count} páginas, títulos únicos, canonical, JSON-LD, imágenes, enlaces y anclas locales.')
