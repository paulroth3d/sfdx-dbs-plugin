module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"globals": {
    "describe": true,
    "it": true
	},
	"rules": {
		"indent": [
			"warn",
			2
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"no-console": 0, // 'warn' or 'error' are also valid options
		"no-unused-vars": 0
		//,"no-debugger": 'warn'
	}
};
