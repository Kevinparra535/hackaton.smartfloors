import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Ignorar dist
  { ignores: ['dist'] },
  
  // Configuración base para archivos JS/JSX
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    settings: {
      react: {
        version: '19.2'
      }
    },
    plugins: {
      react: pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      // Reglas base de JavaScript
      ...js.configs.recommended.rules,

      // Reglas de React
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,

      // Reglas de React Hooks
      ...reactHooks.configs.recommended.rules,

      // Reglas de React Refresh para Vite
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],

      // Reglas personalizadas
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/prop-types': 'off', // Desactivar ya que no usamos TypeScript
      
      // Permitir propiedades de Three.js en JSX
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'args',
            'position',
            'rotation',
            'scale',
            'intensity',
            'castShadow',
            'receiveShadow',
            'emissive',
            'emissiveIntensity',
            'metalness',
            'roughness',
            'wireframe',
            'attach',
            'geometry',
            'material'
          ]
        }
      ]
    }
  },
  
  // Desactivar reglas que entran en conflicto con Prettier
  eslintConfigPrettier
];
