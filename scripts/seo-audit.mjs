import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const config = JSON.parse(
  fs.readFileSync(path.join(root, "site.config.json"), "utf8"),
);
const errors = [];
const report = [];

const fail = (message) => errors.push(message);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const count = (source, expression) => [...source.matchAll(expression)].length;
const formUrl = "https://forms.fillout.com/t/a1tgNciQp6us";

const requiredMeta = [
  /<meta name="description" content="[^"]+">/,
  /<meta name="robots" content="index,follow,[^"]+">/,
  /<meta property="og:type" content="website">/,
  /<meta property="og:locale" content="pt_BR">/,
  /<meta property="og:site_name" content="Ascenda Logistics">/,
  /<meta property="og:title" content="[^"]+">/,
  /<meta property="og:description" content="[^"]+">/,
  /<meta property="og:image" content="https:\/\/[^\s"]+">/,
  /<meta property="og:image:width" content="1200">/,
  /<meta property="og:image:height" content="630">/,
  /<meta property="og:image:alt" content="[^"]+">/,
  /<meta name="twitter:card" content="summary_large_image">/,
  /<meta name="twitter:title" content="[^"]+">/,
  /<meta name="twitter:description" content="[^"]+">/,
  /<meta name="twitter:image" content="https:\/\/[^\s"]+">/,
  /<meta name="twitter:image:alt" content="[^"]+">/,
];

for (const page of config.indexablePages) {
  const html = read(page.file);
  const canonical = `${config.siteUrl}${page.path === "/" ? "/" : page.path}`;
  const prefix = `${page.file}:`;

  if (!/^<!doctype html>/i.test(html)) fail(`${prefix} doctype ausente.`);
  if (!html.includes(`<html lang="${config.language}">`))
    fail(`${prefix} idioma divergente da configuração central.`);
  if (count(html, /<title>[^<]+<\/title>/g) !== 1)
    fail(`${prefix} deve ter exatamente um title.`);
  if (count(html, /<h1(?:\s|>)/g) !== 1)
    fail(`${prefix} deve ter exatamente um h1.`);

  for (const expression of requiredMeta) {
    if (!expression.test(html))
      fail(`${prefix} metadado obrigatório ausente: ${expression}.`);
  }

  const canonicalTag = `<link rel="canonical" href="${canonical}">`;
  const hreflangTag = `<link rel="alternate" hreflang="pt-BR" href="${canonical}">`;
  if (!html.includes(canonicalTag)) fail(`${prefix} canonical incorreto.`);
  if (!html.includes(hreflangTag)) fail(`${prefix} hreflang incorreto.`);
  if (!html.includes(`<meta property="og:url" content="${canonical}">`))
    fail(`${prefix} og:url incorreto.`);
  if (/rel="canonical" href="[^"]*[?#]/.test(html))
    fail(`${prefix} canonical não pode conter query string ou fragmento.`);

  const scripts = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  const schemaTypes = [];
  for (const script of scripts) {
    try {
      const data = JSON.parse(script[1]);
      const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
      for (const node of nodes) schemaTypes.push(node["@type"]);
    } catch (error) {
      fail(`${prefix} JSON-LD inválido: ${error.message}`);
    }
  }
  if (!schemaTypes.includes(page.schemaType))
    fail(`${prefix} schema ${page.schemaType} ausente.`);
  if (schemaTypes.includes("FAQPage"))
    fail(`${prefix} FAQPage não autorizado.`);
  if (page.path === "/") {
    for (const type of ["Organization", "WebSite", "Service"])
      if (!schemaTypes.includes(type)) fail(`${prefix} schema ${type} ausente.`);
  } else if (!schemaTypes.includes("BreadcrumbList")) {
    fail(`${prefix} BreadcrumbList ausente.`);
  }

  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = image[0];
    if (!/\salt="[^"]*"/.test(tag)) fail(`${prefix} imagem sem alt: ${tag}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag))
      fail(`${prefix} imagem sem dimensões explícitas: ${tag}`);
    const source = tag.match(/\ssrc="([^"]+)"/)?.[1];
    if (source?.startsWith("/")) {
      const asset = source.slice(1).split(/[?#]/)[0];
      if (!fs.existsSync(path.join(root, asset)))
        fail(`${prefix} imagem local inexistente: ${source}`);
    }
    const srcset = tag.match(/\ssrcset="([^"]+)"/)?.[1];
    if (srcset?.startsWith("/")) {
      const asset = srcset.slice(1).split(/[\s?#]/)[0];
      if (!fs.existsSync(path.join(root, asset)))
        fail(`${prefix} alternativa de imagem inexistente: ${srcset}`);
    }
  }

  for (const anchor of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/\srel="[^"]*noopener[^"]*"/.test(anchor[0]))
      fail(`${prefix} link externo em nova aba sem noopener: ${anchor[0]}`);
  }

  for (const anchor of html.matchAll(/<a\b[^>]*data-form-link[^>]*>/g)) {
    const tag = anchor[0];
    if (!tag.includes(`href="${formUrl}"`))
      fail(`${prefix} CTA não possui fallback direto para o Fillout: ${tag}`);
    if (!tag.includes('target="_blank"') || !tag.includes('rel="noopener"'))
      fail(`${prefix} CTA externo sem proteção de nova aba: ${tag}`);
  }

  report.push(`${page.path} -> ${canonical}`);
}

const sitemap = read("sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
const expectedUrls = config.indexablePages.map(
  (page) => `${config.siteUrl}${page.path === "/" ? "/" : page.path}`,
);
if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls))
  fail("sitemap.xml diverge das rotas canônicas da configuração central.");
if (/<(?:lastmod|changefreq|priority)>/.test(sitemap))
  fail("sitemap.xml contém sinal temporal ou prioridade artificial.");

const robots = read("robots.txt");
if (!robots.includes(`Sitemap: ${config.siteUrl}/sitemap.xml`))
  fail("robots.txt aponta para sitemap incorreto.");
if (/Disallow:\s*\/$/m.test(robots)) fail("robots.txt bloqueia todo o site.");

const llms = read("llms.txt");
if (!llms.startsWith("# Ascenda Logistics"))
  fail("llms.txt não começa com o nome oficial.");
if (!llms.includes(config.siteUrl)) fail("llms.txt não informa a URL oficial.");

const notFound = read("404.html");
if (!/<meta name="robots" content="noindex,nofollow,noarchive">/.test(notFound))
  fail("404.html precisa permanecer noindex, nofollow e noarchive.");
if (/rel="canonical"/.test(notFound))
  fail("404.html não deve declarar canonical próprio.");

if (errors.length > 0) {
  console.error(`Auditoria SEO falhou com ${errors.length} problema(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Auditoria SEO aprovada: ${report.length} rotas indexáveis.`);
for (const item of report) console.log(`- ${item}`);
