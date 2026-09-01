# Protocolo de reconstrução visual

Este documento registra decisões reutilizáveis para reconstruir referências visuais sem transformar capturas de tela em imagens de fundo.

## Princípios

- Medir primeiro a hierarquia, as proporções, os alinhamentos e os pontos de quebra da referência.
- Manter textos, ícones e estados editáveis em HTML e CSS.
- Usar SVG apenas para ilustrações, conexões e formas que dependam de desenho vetorial.
- Separar grupos semânticos no SVG para que cada parte possa ser ajustada ou animada isoladamente.
- Fazer comparações por captura de tela em um viewport equivalente ao da referência.
- Validar desktop, mobile, navegação por teclado e `prefers-reduced-motion`.

## Complex Flow Sections

Seções que explicam um fluxo complexo devem ser construídas em três camadas independentes:

1. Conteúdo editável: títulos, descrições, cards, etapas e resultado final em HTML.
2. Relações: caminhos e conectores em SVG, identificados com atributos `data-path`.
3. Cena: ilustração em alta resolução isolada dos conteúdos e conectores, sem textos incorporados ao bitmap.

Na seção **A diferença começa aqui**, os critérios `profile`, `route`, `cargo` e `qualification` convergem para um hub central. A cena logística usa um render 3D próprio em alta resolução sobre o mesmo fundo da seção; cards, textos, ícones, conexões, hub e resultado permanecem independentes e editáveis. O movimento só é ativado depois da inicialização do JavaScript; sem JavaScript, o estado estático permanece completo e legível.

Em telas pequenas, os critérios formam uma grade de duas colunas e as conexões complexas são substituídas por uma ligação vertical simples. Essa adaptação preserva a ordem de leitura e evita reduzir a composição até torná-la ilegível.

### Checklist de validação

- A seção não usa a referência como background ou conteúdo rasterizado.
- Todos os textos permanecem selecionáveis e editáveis.
- Critérios, caminhos e conteúdo da cena podem ser alterados de forma independente.
- A animação explica a convergência e encerra em um estado final estável.
- `prefers-reduced-motion` apresenta imediatamente o estado final.
- Não há overflow horizontal em 390 px.
