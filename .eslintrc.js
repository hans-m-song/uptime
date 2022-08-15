module.exports = {
  parser: "@typescript-eslint/parser",
  env: { node: true, es6: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["simple-import-sort"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: { jsx: true },
        sourceType: "module",
        project: [
          "./tsconfig.eslint.json",
          "./lib/tsconfig.json",
          "./services/tsconfig.json",
          "./web/tsconfig.json",
        ],
      },
      plugins: ["@typescript-eslint"],
      rules: { "react/react-in-jsx-scope": "off" },
    },
  ],
  rules: {},
};
