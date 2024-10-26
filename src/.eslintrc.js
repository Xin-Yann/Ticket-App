module.exports = {
  parser: '@babel/eslint-parser', // Use Babel parser
  parserOptions: {
    requireConfigFile: true, // Require Babel config file
  },
  env: {
    es2021: true,
    node: true,
    browser: true,
    react: true,
  },
  extends: ['eslint:recommended'],
  rules: {
    // Add any custom rules here
  },
};
