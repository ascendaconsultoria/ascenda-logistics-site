# Decisões de engenharia

## Stack
HTML + CSS + JavaScript sem framework.
Motivos: site institucional, melhor crawlabilidade, carga inicial pequena, nenhuma hidratação e fácil deploy.

## O que foi adotado das sugestões
- Motion Principles: sim, com adaptação a marketing site.
- Biome: sim.
- Playwright: sim.
- Commitlint: sim.
- Lighthouse CI: sim/recomendado no package.
- Codecov: não é útil sem suíte unitária relevante e CI configurado.
- Knip: baixo retorno num projeto estático pequeno.
- Stryker: mutation testing é desproporcional para esta fase.
- Datadog/New Relic/Sentry simultâneos: não. Recomenda-se escolher um.
- OpenTelemetry: somente se houver backend/arquitetura distribuída.
- “Arch-contract”: não incorporado por não haver necessidade clara nesta arquitetura.

A regra é adicionar ferramentas quando elas reduzem risco real, não para inflar a stack.
