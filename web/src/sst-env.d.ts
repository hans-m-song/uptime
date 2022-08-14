/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REGION: string
  readonly API_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}