/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REGION: string
  readonly VITE_API_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}