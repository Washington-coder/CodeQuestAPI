import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  // Testes e helpers de teste não devem ir para o build de produção
  external: ['vitest'],
  // Só inclui o que é importado a partir do entry (server.ts -> app.ts -> rotas)
  skipNodeModulesBundle: true,
  clean: true,
  // Sem code splitting: gera apenas dist/server.cjs, sem arquivos soltos
  splitting: false,
})
