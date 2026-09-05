# Ascenda Logistics — Site institucional

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
Os CTAs principais da página inicial usam um único destino externo.
Informe a URL publicada do Fillout em `FORM_URL`, no arquivo `assets/js/config.js`.
Enquanto a URL não estiver preenchida, os botões levam à chamada final da própria página.

## SEO
Inclui:
- sitemap.xml
- robots.txt
- llms.txt
- canonical e hreflang
- Open Graph / Twitter Cards
- Organization / WebSite / Service JSON-LD
- páginas de apoio para cluster semântico
- URLs crawlable e navegação interna
- performance sem frameworks pesados

**Importante:** nenhuma implementação técnica garante primeiro lugar no Google. Ranking depende também de conteúdo contínuo, autoridade, backlinks, Google Business Profile, concorrência, histórico e sinais de usuário.

## Engenharia
Leia `AGENTS.md`, `PROJECT.md` e `docs/`.

## Redes de captação
A seção da página inicial usa a arte aprovada do projeto v0, armazenada localmente em `assets/img/redes-captacao-v0.png` para não depender de hospedagem externa. A renderização equilibra a altura disponível com uma largura mínima proporcional ao viewport, evitando que a composição fique pequena em telas desktop mais baixas.

## A diferença começa aqui
A seção apresenta em HTML e SVG as cinco etapas Operação, Perfil, Filtro, Match e Oportunidade, preservando a composição visual de referência e a legibilidade responsiva.

## O que chega ao comercial
A seção `#dados` demonstra Leads, Kanban, Funil comercial e Insights em HTML/CSS/SVG nítidos, usando apenas dados fictícios definidos em `assets/js/crm-showcase.js`. As referências originais com dados reais não fazem parte dos assets do site. Empresas, contatos e indicadores podem ser editados no arquivo da demonstração; os estilos estão isolados em `assets/css/crm-showcase.css`.

O carrossel alterna a cada 8 segundos quando visível, pausa durante leitura com mouse ou teclado e permite navegação manual. A navegação manual pausa a reprodução. Com movimento reduzido, inicia pausado. Em telas pequenas, tabelas e colunas têm rolagem interna.

Execute `npm run lint` e `npm run test:e2e`. Os testes usam um servidor isolado na porta 8093 para não validar outro projeto que esteja aberto na porta 8080. Não há etapa de build nem typecheck: o site usa arquivos estáticos e JavaScript. As capturas do carrossel e dos mockups em escala 2× são geradas em `test-results/`.
