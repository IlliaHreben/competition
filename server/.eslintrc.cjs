/* eslint-disable import/no-commonjs */
module.exports = {
  env: {
    commonjs : true,
    es2021   : true
  },
  extends: [
    'standard',
    'plugin:import/recommended'
  ],
  plugins: [
    'import'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    semi                                    : [ 'error', 'always' ],
    'keyword-spacing'                       : 2,
    'object-shorthand'                      : 1,
    'prefer-template'                       : 2,
    camelcase                               : 0,
    'import/no-commonjs'                    : 1,
    'func-names'                            : 0,
    'func-style'                            : 0,
    'prefer-arrow-callback'                 : 0,
    'default-case'                          : 0,
    'more/no-numeric-endings-for-variables' : 0,
    'standard/no-callback-literal'          : 0,
    'no-return-assign'                      : 0,
    'max-len'                               : [ 'error', {
      comments               : 800,
      code                   : 120,
      ignoreUrls             : true,
      ignoreTemplateLiterals : true,
      ignoreStrings          : true
    } ],
    'key-spacing': [ 'error', {
      align: {
        beforeColon : true,
        afterColon  : true,
        on          : 'colon'
      }
    } ],
    'no-multi-spaces': [ 'error', {
      exceptions: {
        VariableDeclarator : true,
        ImportDeclaration  : true
      }
    } ],
    'object-curly-spacing'     : [ 'error', 'always' ],
    'array-bracket-spacing'    : [ 'error', 'always' ],
    'node/no-callback-literal' : 0
  }
};
