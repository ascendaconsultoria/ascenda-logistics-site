# Observabilidade
Para um site institucional estático, carregar Sentry + Datadog + New Relic + OpenTelemetry simultaneamente seria excesso de peso e duplicação.

Implementado:
- captura leve de `error` e `unhandledrejection`
- sinais de LCP e CLS via PerformanceObserver
- envio para `dataLayer`
- endpoint opcional via `OBSERVABILITY_ENDPOINT`

Produção recomendada:
1. Escolher **um** vendor de frontend error monitoring (Sentry é uma boa primeira opção).
2. Manter GA4/GTM para analytics e conversões.
3. Usar Lighthouse CI em PRs.
4. Adotar OpenTelemetry apenas quando existir backend/serviços distribuídos que justifiquem tracing.
