// eslint-disable-next-line import/no-commonjs
module.exports = {
    env: {
        es2021: true
    },
    extends: [
        'react-app',
        // "plugin:prettier/recommended",
        // 'eslint:recommended',
        'standard',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime'
    ],
    plugins       : [ 'arca' ],
    parserOptions : {
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        // 'react/react-in-jsx-scope'              : 0,
        'no-unused-vars'                        : 1,
        indent                                  : [ 'warn', 4 ],
        semi                                    : [ 'warn', 'always' ],
        'keyword-spacing'                       : 2,
        'object-shorthand'                      : 1,
        'prefer-template'                       : 2,
        camelcase                               : 0,
        'import/no-commonjs'                    : 2,
        'func-names'                            : 0,
        'func-style'                            : 0,
        'prefer-arrow-callback'                 : 0,
        'default-case'                          : 0,
        'more/no-numeric-endings-for-variables' : 0,
        'standard/no-callback-literal'          : 0,
        'no-return-assign'                      : 0,
        'max-len'                               : [
            'error',
            {
                comments               : 800,
                code                   : 120,
                ignoreUrls             : true,
                ignoreTemplateLiterals : true,
                ignoreStrings          : true
            }
        ],
        'key-spacing': [
            'error',
            {
                align: {
                    beforeColon : true,
                    afterColon  : true,
                    on          : 'colon'
                }
            }
        ],
        'no-multi-spaces': [
            'error',
            {
                exceptions: {
                    VariableDeclarator: true
                }
            }
        ],
        'object-curly-spacing'               : [ 'error', 'always' ],
        'array-bracket-spacing'              : [ 'error', 'always' ],
        'react/jsx-closing-bracket-location' : 2,
        'react/jsx-closing-tag-location'     : 2,
        'react/jsx-indent'                   : 1,
        'react/jsx-indent-props'             : 1
    },
    settings: {
        linkComponents: [
            // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
            { name: 'Link', linkAttribute: 'to' },
            { name: 'NavLink', linkAttribute: 'to' }
        ]
    }
};
