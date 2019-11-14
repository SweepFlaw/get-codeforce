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

# Get a little diff code pair
- Need docker
- Need .env file for key data of dynamodb  
  ```
  AccessKeyId=${your_access_key_id}
  SecretAccessKey=${your_secret_access_key}
  ```
```bash
$ docker pull rhfktj/get-codeforce:0.2.0
$ docker run -it --name get-codeforce -d rhfktj/get-codeforce:0.2.0
$ docker exec -it get-codeforce /bin/bash
# inside docker
$ yarn scan
$ yarn lex-parse
$ yarn diff lex
$ exit
```

# Embedding column info
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


# Examples
```javascript
/newdisk/autofix/get-codeforce/src/utils/../../datas/1200/coelho/C/61338850OK/meta.json
{
  "code": "",
  "relativeTimeSeconds": 2147483647,
  "problem": "1200-C-61338850",
  "memoryConsumedBytes": 0,
  "verdict": "OK",
  "passedTestCount": 50,
  "programmingLanguage": "GNU C++11",
  "submissionTime": 1569522967,
  "user": "coelho",
  "timeConsumedMillis": 62
}

/newdisk/autofix/get-codeforce/src/utils/../../datas/1200/coelho/C/61336651WA/meta.json
{
  "code": "",
  "relativeTimeSeconds": 2147483647,
  "problem": "1200-C-61336651",
  "memoryConsumedBytes": 0,
  "verdict": "WRONG_ANSWER",
  "passedTestCount": 1,
  "programmingLanguage": "GNU C++11",
  "submissionTime": 1569516261,
  "user": "coelho",
  "timeConsumedMillis": 15
}

submitted file number between two is 1

submissionTime diff = 6706

이 문제는 29번째 줄의
if(a2%(n/g) == 0) sec1--;을
if(a2%(m/g) == 0) sec1--;로 바꾸면 되는 간단한 문제였지만
2번의 error와 1번의 wrong answer을 거쳐 6706초만에 문제를 해결하였다.
```

```javascript
/newdisk/autofix/get-codeforce/src/utils/../../datas/1200/qhq../C/61216408OK/meta.json
{
  "code": "",
  "relativeTimeSeconds": 2147483647,
  "problem": "1200-C-61216408",
  "memoryConsumedBytes": 0,
  "verdict": "OK",
  "passedTestCount": 50,
  "programmingLanguage": "GNU C++17",
  "submissionTime": 1569329476,
  "user": "qhq..",
  "timeConsumedMillis": 62
}

/newdisk/autofix/get-codeforce/src/utils/../../datas/1200/qhq../C/61215397WA/meta.json
{
  "code": "",
  "relativeTimeSeconds": 2147483647,
  "problem": "1200-C-61215397",
  "memoryConsumedBytes": 0,
  "verdict": "WRONG_ANSWER",
  "passedTestCount": 1,
  "programmingLanguage": "GNU C++17",
  "submissionTime": 1569328562,
  "user": "qhq..",
  "timeConsumedMillis": 15
}

submitted file number between two is 

time diff = 914

이 문제는 26번째 줄
z1=y2/b1; -> z1=y1/b1;
29번째 줄
z2=y1/a1; -> z2=y2/a1;
로 바꾸면 되는 문제인데

먼저 29줄 수정하는데 746초, 그 후 26줄 오류를 찾아내는데 추가로 109초가 걸려 문제를 해결
```

```javascript
/newdisk/autofix/get-codeforce/src/utils/../../datas/1204/AChusky/C/59175205OK/meta.json
/newdisk/autofix/get-codeforce/src/utils/../../datas/1204/AChusky/C/59169263WA/meta.json
submitted file number between two is 1

time diff = 1626

이 문제는 7번째 줄을
int p[maxn]; -> int p[maxm];
로 바꾸면 되는 문제인데

1517초 후 37번째 조건 및 tmp 증가율을 바꾸는 등의 시도를 했다가
추가로 109초 후 문제를 하였다.
```

```javascript
/newdisk/autofix/get-codeforce/src/utils/../../datas/1204/BigBang_19/C/59185600OK/meta.json
/newdisk/autofix/get-codeforce/src/utils/../../datas/1204/BigBang_19/C/59185503WA/meta.json
submitted file number between two is 1

time diff = 124

26c26
bool del[N];
> bool del[R];
28c28
int ans[N], tot;
> int ans[R], tot;
등 두 개의 변수가 잘못 되었는데

26줄을 73초 28줄을 51초에 해결하여 문제를 해결함
```