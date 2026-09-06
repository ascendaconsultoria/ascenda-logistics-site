# SEO técnico — Ascenda Logistics

## Arquitetura

O site é multipágina, estático e renderizado diretamente em HTML. Não depende de JavaScript para entregar o conteúdo principal aos robôs de busca.

A URL oficial fica em `site.config.json`. Esse arquivo também mantém a lista fechada das rotas indexáveis, o idioma, o padrão de barra final e a imagem social padrão. O comando `npm run seo:audit` verifica se HTML, canonical, Open Graph, sitemap, robots, llms e dados estruturados continuam sincronizados com essa configuração.

Rotas indexáveis:

- `/`
- `/captacao-de-embarcadores/`
- `/marketing-para-transportadoras/`
- `/perfil-logistico/`
- `/sobre/`
- `/politica-de-privacidade/`
- `/termos/`

`404.html`, previews, testes, documentação e arquivos internos não entram no sitemap nem no pacote enviado pela Vercel.

## Sinais de indexação

- canonical absoluto e autorreferente em cada página pública;
- `hreflang="pt-BR"` autorreferente;
- títulos e descrições únicos preservados;
- Open Graph e Twitter Card completos;
- `Organization`, `WebSite`, `WebPage` e `Service` na página inicial;
- `BreadcrumbList` nas páginas internas;
- ausência intencional de `FAQPage`, porque o conteúdo não deve receber marcação artificial;
- sitemap apenas com URLs canônicas, sem prioridade, frequência ou data inventada;
- `robots.txt` liberando o conteúdo público e apontando para o sitemap;
- `llms.txt` curto, factual e restrito a recursos públicos relevantes;
- página 404 com `noindex`, sem canonical e fora do sitemap.

## URLs, redirects e ambientes

O padrão canônico usa HTTPS, host sem `www` e barra final em rotas de página. `vercel.json` aplica a barra final por redirect 308 e configura headers de segurança e cache.

As URLs de preview da Vercel recebem `X-Robots-Tag: noindex` automaticamente pela plataforma. Depois que o domínio for conectado, a versão `www` deve redirecionar permanentemente para `https://ascendalogistics.com.br/` e o domínio sem `www` deve ser marcado como primário na Vercel.

## Performance

- imagens abaixo da dobra usam lazy loading e dimensões explícitas;
- o vídeo crítico da hero não usa lazy loading, possui poster WebP pré-carregado, `faststart` e não carrega faixa de áudio desnecessária;
- PNGs originais permanecem como fallback;
- WebP é servido via `srcset` ou `image-set` para os ativos pesados;
- as imagens WebP podem ser regeneradas com `npm run optimize:images`;
- CSS e JavaScript continuam sem cache imutável porque seus nomes não têm hash;
- imagens recebem cache longo no CDN com revalidação;
- a fonte Inter é hospedada localmente, usa `display=swap` e é pré-carregada sem conexão externa;
- os componentes pesados abaixo da dobra são inicializados apenas quando se aproximam do viewport, sem esconder o conteúdo textual das operações no HTML.

## Conversão e mensuração

Todos os CTAs comerciais já apontam diretamente para o único Fillout, mesmo sem JavaScript, e usam a configuração de `assets/js/config.js` para preservar a origem. Os parâmetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` e `msclkid` são preservados na saída. Parâmetros desconhecidos não são enviados e nunca entram no canonical.

## Segurança e acessibilidade

O deploy aplica CSP, HSTS, `nosniff`, proteção contra iframe, política de referenciador e restrição de permissões. Todas as páginas têm um único `h1`, landmarks semânticos, link para pular ao conteúdo, imagens com `alt` e dimensões, navegação por teclado e tratamento de movimento reduzido.

## Validação local

```bash
npm ci
npm run build
npm run test:e2e
npm run lighthouse
```

O `build` executa lint, verificação sintática e auditoria SEO e gera somente os arquivos públicos em `dist/`. Os testes E2E cobrem desktop e mobile, metadados, schemas, UTMs, imagens modernas, overflow e conversão.

Na auditoria local final de 6 de setembro de 2026, as três execuções do Lighthouse obtiveram SEO 100, boas práticas 100, acessibilidade 96, CLS 0 e performance entre 79 e 95. A variação de performance ocorreu principalmente no LCP da mídia da hero; o resultado de campo deve ser acompanhado após o domínio receber tráfego real.

## Ações manuais após conectar o domínio

1. Adicionar `ascendalogistics.com.br` ao projeto separado do site na Vercel.
2. Adicionar `www.ascendalogistics.com.br` e redirecioná-lo para o host principal.
3. Conferir HTTPS, cadeia de redirects, status 404 e headers no domínio final.
4. Criar ou validar a propriedade do domínio no Google Search Console.
5. Enviar `https://ascendalogistics.com.br/sitemap.xml` no Search Console.
6. Inspecionar a home e as três páginas estratégicas e solicitar indexação.
7. Validar os schemas com o Rich Results Test e o Schema Markup Validator.
8. Validar previews de compartilhamento no LinkedIn Post Inspector e Facebook Sharing Debugger.
9. Medir Core Web Vitals com dados de campo após tráfego real; Lighthouse local é somente laboratório.
10. Configurar analytics apenas depois de definir a ferramenta e a política de consentimento. Nenhum ID fictício deve ser publicado.

SEO técnico melhora rastreabilidade, consolidação e experiência, mas não garante posição específica no Google. Autoridade, conteúdo útil, concorrência e histórico do domínio continuam relevantes.
