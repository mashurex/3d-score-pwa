module.exports = {
    root: true,
    env: {
      node: true,
      browser: true,
    },
    extends: [
      'plugin:vue/recommended',
      'eslint:recommended',      
    ],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    },
    plugins: ['vue'],
    parserOptions: {
      parser: 'babel-eslint',
    },
  };
  