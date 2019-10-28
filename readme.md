Get codeforce PS code with codeforce api
- http://codeforces.com/apiHelp

# model
use dynamodb

# docker
### Pull
```bash
docker pull rhfktj/get-codeforce:0.1
```
### Build
```bash
docker build --tag rhfktj/get-codeforce:0.1 .
```
### Run temporarily
```bash
docker run -it --rm rhfktj/get-codeforce:0.1 /bin/bash
```

```
docker run -it --name get-codeforce -d rhfktj/get-codeforce:0.1
docker exec -it get-codeforce /bin/bash
```

# scripts
```bash
# execute crawl with pm2
$ yarn pm2-crawl
# analysis code and save information of tokens
$ yarn lex-parse
# save token embedding result with lex-parse result
$ yarn embed
# crawling codeforce and save them to dynamodb
$ yarn crawl
# call dynamodb data to local directory
$ yarn scan
# diff compare the code result of OK and ERROR
$ yarn diff
```

# How To Embed
```
the origin line - first Declare
the origin column - first Declare
the origin offset - first Declare
now line - this token position
now column - this token position
now offset - this token position
cursor kind - detail kind of token
token kind - comprehensive kind of token
```