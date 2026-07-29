const config = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential"
    ],
    "overrides": [{
        "files": [
            "*.vue"
        ],
        "rules": {
            "indent": "off"
        }
    }],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "vue"
    ],
    "globals": {
        "browserMD5File": true,
        "AMap": true,
        "BMapGL": true,
        "window": true,
        "TMap": true,
        "TM": true,
        "getValueSource": true
    },
    "rules": {
        "no-useless-escape": "off",
        "vue/no-reserved-component-names": "off",
        "no-debugger": "off",
        "no-console": "off",
        "no-empty": "off",
        "no-unused-vars": "off",
        "no-prototype-builtins": "off",
        "vue/multi-word-component-names": "off",
        "semi": [
            "error",
            "always"
        ],
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "vue/script-indent": [
            "error",
            4,
            {
                "baseIndent": 1,
                "switchCase": 1,
                "ignores": []
            }
        ],
        "vue/html-indent": [
            "error",
            4,
            {
                "baseIndent": 1,
                "switchCase": 0,
                "ignores": []
            }
        ]
    }
};

module.exports = config;
