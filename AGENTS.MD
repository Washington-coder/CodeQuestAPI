# AGENTS.md

## Projeto

Boilerplate de API em **Node.js (>= 20) + Fastify 5 + TypeScript 5.9 (strict) + ESM** (`"type": "module"`).
É um **template de ponto de partida**: será copiado e adaptado ao iniciar novos projetos. Mantenha o código genérico (sem regra de negócio embutida) e siga as escolhas já feitas (tsx, tsup, pino, ESLint type-checked, Prettier, zod, vitest, LF).

## Comandos

```bash
npm install          # instala dependências
npm run dev          # servidor com hot-reload (tsx watch) + pino-pretty — http://localhost:3333
npm run build        # compila com tsup (ver 'Gotchas')
npm run start        # roda o build de produção (node dist/server.cjs)
npm run lint         # ESLint (flat config com type-checking)
npm run lint:fix     # corrige lint automaticamente
npm run format       # formata tudo com Prettier
npm run format:check # verifica formatação (Prettier)
npm test             # roda a suíte de testes (vitest) uma única vez
npm run test:watch   # roda os testes em modo watch
npx vitest run src/config/env.test.ts  # roda apenas um arquivo de teste
```

> ⚠️ **Regra obrigatória**: sempre que um comando for **inserido, alterado ou removido** — seja no `package.json` ou em qualquer outra ferramenta/atalho do projeto — atualize **o** `README.md` e esta seção de comandos do `AGENTS.md` no mesmo commit/PR. O README deve refletir com precisão o que cada comando faz e o artefato que produz (ex.: `npm start` roda `node dist/server.cjs`). O inverso também vale: nunca remover um script do `package.json` sem removê-lo de ambos.

## Estrutura (monolito modular)

```
src/
  server.ts         # bootstrap: cria o app, registra módulos, escuta na porta (env.PORT)
  config/
    env.ts          # carrega e valida variáveis de ambiente (dotenv + zod)
    env.test.ts     # testes unitários da validação de env
  modules/          # um módulo por domínio/feature
    <modulo>/
      routes.ts     # declara as rotas + validação (JSON Schema do Fastify)
      controller.ts # recebe a request, chama o service, monta a resposta HTTP
      service.ts    # regra de negócio
      repository.ts # acesso a dados (banco, filas, APIs externas)
      types.ts      # tipos/entidades do módulo
  shared/           # código reutilizável entre módulos (utils, erros, middlewares)
```

Regra do monólito modular: **cada pasta tem uma responsabilidade clara** e nenhum arquivo acumula dois papéis. Em módulos simples, camadas intermediárias podem ser omitidas — o requisito é responsabilidade definida, não ter todas as camadas. Um módulo não deve conhecer a implementação interna de outro; importe só o que ele expõe.

## Diretrizes de arquitetura e código

- **Sempre sugira remover código morto/inútil ou refatorar** código existente quando encontrar oportunidades (duplicação, funções sem uso, complexidade desnecessária) — DRY e SOLID na medida do possível, sem perder o foco da tarefa atual.
- **SOLID na medida do possível**: aplique quando tornar o código mais claro (ex.: injeção simples de dependências nos services), sem over-engineering.
- **TypeScript sempre**: todo código novo deve ser tipado. `strict` está ativo; evite `any` (warning no lint) e casts desnecessários.
- **Erros HTTP específicos**: trate erros de forma específica e retorne a resposta adequada — `400` validação, `401/403` autenticação, `404` não encontrado, `409` conflito, `422` regra de negócio, `500` inesperado. Use o `setErrorHandler` do Fastify para dar um formato padrão de erro e **nunca** vaze stack trace em respostas.
- **Validação de entrada**: use JSON Schema nas rotas (o Fastify retorna `400` automaticamente) em vez de validar manualmente no controller.
- **Variáveis de ambiente**: sempre definidas no schema zod de `src/config/env.ts`; novas variáveis exigem atualização do schema e do `.env.example`. O valor (ex.: `env.PORT`) é tipado e validado em tempo de execução.
- **Rotas como plugins**: registre rotas/hooks como plugins do Fastify (encapsulamento) — facilita testes e isolamento entre módulos.
- **Logs**: use sempre `app.log` (pino), nunca `console.log` (lint emite warning).
- **Async**: handlers e hooks assíncronos devem tratar as próprias promessas — `no-floating-promises` e `no-misused-promises` são erro no lint.
- **Commits**: Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `style:`, `build:`, `ci:`. Mensagens curtas e no imperativo (ex.: `feat: adiciona rota de listagem de usuários`).
- **Formatação**: sem ponto e vírgula, aspas simples, printWidth 100, EOL **LF** (forçado por `.gitattributes` e VS Code).

## O que NÃO fazer

- **Não instale dependências de terceiros sem antes perguntar** ao usuário.
- **Não altere a estrutura do banco de dados sem criar a migration adequada**.
- **Não desative, remova ou comente um teste antigo** para fazer uma nova feature passar — testes existentes são a especificação do comportamento esperado.
- Não edite arquivos gerados (saída de build) nem arquivos de ambiente (`.env`).

## Critérios de pronto (Definition of Done)

O código só é considerado pronto quando:

- Passa em `npm run lint` e `npm run format:check` (ESLint + Prettier).
- **Toda funcionalidade nova tem um teste unitário novo** cobrindo o comportamento esperado (framework: vitest).
- **Todos os testes passam** (`npm test`).
- `npm run build` termina sem erros.

## Gotchas

- **Testes com dotenv**: `src/config/env.ts` roda o `process.exit` em caso de env inválido — mantenha a validação testável na função pura `parseEnv` e não nos efeitos de módulo.
- **Build gera bundle único**: `npm run build` (tsup) gera `dist/server.cjs` (CJS, bundle único consolidando o grafo de imports de `src/server.ts`). O `npm start` executa exatamente esse arquivo — se o pipeline de build mudar, alinhe os dois.
