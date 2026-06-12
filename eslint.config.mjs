import promisePlugin from "eslint-plugin-promise";

export default [
  {
    files: ["**/*.js","**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module"
    },
    plugins: { promise: promisePlugin },
    rules: {
      "promise/catch-or-return": "error",
      "no-unused-expressions": ["error", { "allowShortCircuit": false, "allowTernary": false }]
    }
  }
];