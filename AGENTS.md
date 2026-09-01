# AGENTS.md — Ascenda Logistics

## Regra principal de marca
- Nome oficial: **Ascenda Logistics**.
- Sempre usar o artigo masculino: **o Ascenda**, **do Ascenda**, **no Ascenda**.
- Nunca usar “Ascenda Assessoria”, “Ascenda Consultoria” ou “Ascenda Logística” como nome oficial.
- A marca vende **aquisição comercial especializada em transportadoras**. Tráfego pago é ferramenta, não o produto inteiro.

## Fluxo obrigatório de trabalho
1. Toda correção, melhoria ou nova função deve nascer em uma **Issue do GitHub**.
2. Trabalhar em branch própria vinculada à Issue.
3. Todo deploy deve ser gerenciado por **Pull Request**.
4. A descrição do PR deve mencionar e fechar a Issue correspondente (`Closes #123`).
5. Mudanças visuais precisam de screenshot antes/depois quando possível.
6. Mudanças de SEO devem informar impacto esperado, URLs afetadas e validação.
7. Não fazer deploy direto em produção fora do fluxo Issue → branch → PR, salvo emergência documentada.

## Motion
Referência adotada: `kylezantos/design-motion-principles`.
- Marketing site: priorizar polish de produção e criatividade controlada.
- Motion deve explicar fluxo, hierarquia e mudança de estado; não animar por decorar.
- Evitar hover-scale em tudo, stagger excessivo, pulsing infinito e fade uniforme em toda seção.
- Interações frequentes: rápidas e discretas.
- `prefers-reduced-motion` é obrigatório.
- Não animar o LCP de forma que atrase leitura.
- Skeleton apenas quando existe espera real de conteúdo; não usar skeleton artificial em conteúdo estático.
- Lazy-load apenas abaixo da dobra. Elementos críticos da hero não devem ser lazy-loaded.
- O site usa barra de progresso de leitura, reveal sutil e animações funcionais da peneira/método.

## SEO
- Preservar title/description únicos, canonical, headings semânticos, links crawlable e structured data.
- Manter `robots.txt`, `sitemap.xml` e `llms.txt`.
- Não criar páginas thin/duplicadas apenas para keywords.
- URLs em português, curtas e permanentes.
- Toda nova página indexável deve entrar no sitemap e, se estratégica, no llms.txt.
- Nunca prometer posição #1; trabalhar para relevância, autoridade, experiência e indexabilidade.

## Qualidade
- Biome para JS/JSON/CSS suportado pelo fluxo.
- Playwright para smoke/e2e.
- Lighthouse CI recomendado antes de deploy relevante.
- Commitlint / Conventional Commits.
- Observabilidade deve ser leve e configurável; não carregar múltiplos vendors simultaneamente.

## Conversão
- Um único destino primário de formulário.
- WhatsApp flutuante é canal secundário.
- Claims devem separar oportunidade, reunião e cliente fechado.
- Não publicar nome/logo de cliente sem autorização.
