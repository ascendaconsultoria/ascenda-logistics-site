# Ascenda Logistics: Site institucional

Site institucional e de aquisição comercial do Ascenda Logistics.

## Teste local
### Opção 1 — Python
```bash
cd ascenda-logistics-site
python -m http.server 8080
```
Abra `http://localhost:8080`.

### Opção 2 — Node
```bash
npm install
npm run serve
```

## Formulário
Todos os CTAs comerciais usam o Fillout configurado em `FORM_URL`, no arquivo `assets/js/config.js`. O mesmo destino é aplicado à página inicial e às páginas internas, enquanto links de navegação continuam levando às respectivas seções.

## Escala e conversão
O desktop usa dimensões, tipografia e espaçamentos adaptados por componente para uma composição equivalente a 90%, sem aplicar `zoom` ou transformação no documento. A página inicial mantém os cards de resultados e operações mais altos, centraliza linhas incompletas de logos e inclui CTAs contextuais, WhatsApp circular e links sociais no rodapé. Os CTAs seguem um padrão pill com seta integrada e movimento discreto; o WhatsApp usa pulso leve, com as animações desativadas quando o visitante prefere movimento reduzido.

## SEO
Inclui:
- domínio e rotas indexáveis centralizados em `site.config.json`;
- `sitemap.xml`, `robots.txt` e `llms.txt` sincronizados;
- canonical, hreflang, Open Graph e Twitter Cards;
- `Organization`, `WebSite`, `WebPage`, `Service` e `BreadcrumbList` em JSON-LD;
- URLs crawlable, barra final consistente e navegação interna;
- WebP com PNG de fallback para os ativos pesados e vídeo da hero sem faixa de áudio;
- headers de segurança e cache em `vercel.json`;
- auditoria automatizada com `npm run seo:audit`.

Os detalhes técnicos e o checklist pós-domínio estão em `docs/SEO.md`.

**Importante:** nenhuma implementação técnica garante primeiro lugar no Google. Ranking depende também de conteúdo contínuo, autoridade, backlinks, Google Business Profile, concorrência, histórico e sinais de usuário.

## Engenharia
Leia `AGENTS.md`, `PROJECT.md` e `docs/`.

## Redes de captação
A seção da página inicial usa a arte aprovada armazenada localmente, sem depender de hospedagem externa. A renderização equilibra a altura disponível com uma largura mínima proporcional ao viewport, evitando que a composição fique pequena em telas desktop mais baixas. O navegador recebe WebP quando compatível e mantém PNG como fallback.

## A diferença começa aqui
A seção apresenta em HTML e SVG as cinco etapas Operação, Perfil, Filtro, Match e Oportunidade, preservando a composição visual de referência e a legibilidade responsiva.

## O que chega ao comercial
A seção `#dados` demonstra Leads, Kanban, Funil comercial e Insights em HTML/CSS/SVG nítidos, usando dados simulados definidos em `assets/js/crm-showcase.js`. As referências originais com dados reais não fazem parte dos assets do site. Empresas, contatos e indicadores podem ser editados no arquivo da demonstração; os estilos estão isolados em `assets/css/crm-showcase.css`.

O carrossel alterna automaticamente a cada 5 segundos enquanto está visível e retorna ao primeiro mockup em loop. As bolinhas abaixo indicam a tela atual e permitem selecionar outra sem interromper a reprodução; o botão de pausa fica disponível para teclado. Os mockups são quadros estáticos, sem rolagem ou interação interna.

## Resultados
A seção `#resultados` apresenta os cases da TPL Logística e da Solução Locação e Transportes, com indicadores agregados de perfil, links oficiais do Instagram e uma vitrine compacta de empresas atendidas. Os logos ficam armazenados localmente em `assets/img/clientes/` e os estilos da seção estão isolados em `assets/css/results-showcase.css`. Os cards exibem recortes de campanha informados pelo projeto, incluindo decisores, região e tipo de operação.

Os resultados exibidos são históricos de operações específicas e não representam garantia de contatos, reuniões ou contratos.

Execute `npm run build` e `npm run test:e2e`. O build executa lint, verificação sintática e auditoria SEO antes de gerar o pacote estático de publicação em `dist/`. Os testes usam um servidor isolado na porta 8093 para não validar outro projeto que esteja aberto na porta 8080. As capturas do carrossel e dos mockups em escala 2× são geradas em `test-results/`.
