import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Lint all JS files in src folder
    files: ["src/**/*.{js}"],

    // Use JS plugin and recommended rules
    plugins: { js },
    extends: ["js/recommended"],

    // Node environment
    languageOptions: {
      globals: globals.node, // Node.js globals like process, Buffer
      ecmaVersion: 2021,     // Modern JS features
      sourceType: "module",  // Use 'script' if using CommonJS
    },

    rules: {
      "no-console": "off",
    },
  },
]);
