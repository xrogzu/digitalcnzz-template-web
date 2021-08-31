module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true
  },
  globals: {
    process: true,
    require: true,
    AMap: true
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2015,
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  rules: {
    // 代码风格
    'block-spacing': [0, 'always'],
    'brace-style': [0, '1tbs', {
      'allowSingleLine': true
    }],
    'comma-spacing': [0, {
      'before': false,
      'after': true
    }],
    'comma-dangle': [0, 'never'],
    'comma-style': [0, 'last'],
    'computed-property-spacing': [0, 'never'],
    'indent': [0, 4, {
      'SwitchCase': 1
    }],
    'key-spacing': [0, {
      'beforeColon': false,
      'afterColon': true
    }],
    'keyword-spacing': [0, {
      'before': true,
      'after': true
    }],
    'linebreak-style': 0,
    'multiline-ternary': [0, 'always-multiline'],
    'no-multiple-empty-lines': [0, {
      'max': 1
    }],
    'no-unneeded-ternary': [0, {
      'defaultAssignment': false
    }],
    'quotes': [0, 'single'],
    'semi': [0, 'never'],
    'space-before-blocks': [0, 'always'],
    'space-before-function-paren': [0, 'always'],
    'space-in-parens': [0, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': [0, {
      'words': true,
      'nonwords': false
    }],
    'spaced-comment': [0, 'always', {
      'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
    }],
    'switch-colon-spacing': [0, {
      'after': true,
      'before': false
    }],
    // ES6
    'arrow-parens': [0, 'as-needed'],
    'arrow-spacing': [0, {
      'before': true,
      'after': true
    }],
    // Vue - https://github.com/vuejs/eslint-plugin-vue
    'vue/html-indent': [0, 4],
    'vue/max-attributes-per-line': 0,
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/attributes-order': 2,
    'vue/order-in-components': 2,
    'vue/this-in-template': 2,
    'vue/script-indent': [0, 4, {
      'switchCase': 1
    }]
  }
};
