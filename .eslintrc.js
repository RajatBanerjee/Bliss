module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "node": true,
        "jquery": true,
    },
    "globals":{
      "ItemData":true,
      "ItemType":true,
      "firebaseui":true,
      "firebase":true,
      "ui":true,
      "Router":true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        }
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
    }
};