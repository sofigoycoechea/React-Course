import js from "@eslint/js";
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js, stylistic }, extends: ["js/recommended"], languageOptions: { globals: globals.node }},
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  globalIgnores(['./dist/'])

]);
