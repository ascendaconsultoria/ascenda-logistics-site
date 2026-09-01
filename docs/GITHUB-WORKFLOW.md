# Workflow GitHub
O padrão desejado é Issue → branch → PR → deploy.

Este ZIP não cria Issues em um repositório remoto porque não possui conexão/autorização com o GitHub. Os templates e a governança já estão prontos. Ao conectar o repositório, transforme o backlog em Issues e passe a bloquear merge direto na branch principal.

Recomendado:
- branch protection em `main`
- PR obrigatório
- pelo menos 1 aprovação
- checks de lint, Playwright e Lighthouse CI
- `Closes #N` em todos os PRs
