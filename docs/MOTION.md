# Motion
Referência pesquisada: kylezantos/design-motion-principles.

Aplicação no site:
- motion de entrada curto e discreto
- microfeedback em botões
- animação funcional da peneira
- órbita ambiente lenta no perfil logístico, com textos sempre legíveis
- nenhuma animação infinita que dispute atenção com o conteúdo
- `prefers-reduced-motion`
- sem lazy-load na hero
- sem skeleton artificial em conteúdo síncrono

A diretriz original de “skeleton, lazyloading, loading e progresso em todos os elementos” foi adaptada: isso é correto apenas quando há espera real. Em um site estático, skeleton em tudo adicionaria ruído e poderia piorar CLS/performance.
