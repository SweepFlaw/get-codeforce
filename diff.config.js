module.exports = {
  apps: [
    {
      "name": "diff codeforce",
      "script": "yarn scan && yarn lex-parse && yarn diff lex",
      "restart_delay": 600000
    }
  ]
}