# OK 제출 이전의 wrong code와의 비교
- 시간 계산은 7200초 이상 걸릴 경우 7200초로 간주한다.

## 정답에 가까운 코드 조건
- 같은 위치의 줄 1개가 다른 경우: 79827개의 code들 중 2579개의 쌍(중복 가능)
- total code count: 79827
- solved case count: 36585
- cannot solve case count: 5632
- solve at once case count: 23350
- 틀리고 풀었던 개수: 13235
- a line diff problem case count : 2427 (about 18.3%)
- a word diff problem case count : 891 (about 6.7%)
- a line diff case count, can exist multiple pairs in one problem : 2579
- a word diff case count, can exist multiple pairs in one problem : 965
- a word diff average seconds, can exist multiple pairs in one problem : 497.2507772020725

## 차이의 정도를 보기
- jsdiff라이브러리의 diffWords 함수를 사용 단어가 몇개나 차이가 나는가
- word 파서를 별도로 사용하는 듯(나름 정확)

## 한 개의 단어가 치환 or 생성 or 삭제된 경우의 가짓수
- 965개의 쌍
```json
// 부등식/ 등식 잘못 씀
{"message":"equality diff case count: 172","level":"info"}
{"message":"equality diff average seconds: 741.7848837209302","level":"info"}
// 상수 잘못 씀
{"message":"constant diff case count: 233","level":"info"}
{"message":"constant diff average seconds: 428.31330472103","level":"info"}
// 변수 잘못 씀
{"message":"variable diff case count: 406","level":"info"}
{"message":"variable diff average seconds: 506.1527093596059","level":"info"}
// 변수 상수 잘못 씀 (변수 => 상수 or 상수 => 변수)
{"message":"variable and constant diff case count: 39","level":"info"}
{"message":"variable and constant diff average seconds: 609.3076923076923","level":"info"}
// operator 잘못 씀 except (in)equality
{"message":"operator diff case count: 29","level":"info"}
{"message":"operator diff average seconds: 388.7241379310345","level":"info"
```

# 사람의 코딩 실수 예제들

## 최댓값 제한
- n - x => max(0ll, n-x)로 고침
- 3번의 고침 이후 4번째 정답
- 총 378초 걸림

### 수정과정
```javascript
n - x
=> n - max(0, x) // type error
=> n - max(0ll, x)
=> n - max(0ll, x1 - max(0ll, x2))
=> max(0ll, n-x)

"    ll mini=n-(a1*(k1-1))-(k2==1?0:(a2*(k2-1)));\n"
"    ll mini=n-max(0,(a1*(k1-1))-(k2==1?0:(a2*(k2-1))));\n"
"    ll mini=n-max(0ll,(a1*(k1-1))-(k2==1?0:(a2*(k2-1))));\n"
"    ll mini=n-max(0ll,(a1*(k1-1)))-max(0ll,(k2==1?0:(a2*(k2-1))));\n"
"    ll mini=max(0ll,n-(a1*(k1-1))-(k2==1?0:(a2*(k2-1))));\n"
```

### Detail Log
```json
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/programmisstt/A/60689406OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/programmisstt/A/60689131WA/code.cpp","level":"info"}
{"message":[{"line":41,"count":1,"removed":true,
"value":"    ll mini=n-(a1*(k1-1))-(k2==1?0:(a2*(k2-1)));\n"},{"line":41,"count":1,"added":true,
"value":"    ll mini=max(0ll,n-(a1*(k1-1))-(k2==1?0:(a2*(k2-1))));\n"}],"level":"info"}
{"message":[{"count":4,"added":true,"value":"max(0ll,"},{"count":1,"added":true,"value":")"}],"level":"info"}
{"message":"Time diff: 378","level":"info"}
{"message":"other submission between them: 3","level":"info"}

{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/programmisstt/A/60689406OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/programmisstt/A/60689198WA/code.cpp","level":"info"}
{"message":[{"line":41,"count":1,"removed":true,
"value":"    ll mini=n-max(0ll,(a1*(k1-1))-(k2==1?0:(a2*(k2-1))));\n"},{"line":41,"count":1,"added":true,
"value":"    ll mini=max(0ll,n-(a1*(k1-1))-(k2==1?0:(a2*(k2-1))));\n"}],"level":"info"}
{"message":[{"count":2,"removed":true,"value":"n-"},{"count":2,"added":true,"value":"n-"}],"level":"info"}
{"message":"Time diff: 256","level":"info"}
{"message":"other submission between them: 1","level":"info"}

{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/programmisstt/A/60689406OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/programmisstt/A/60689293WA/code.cpp","level":"info"}
{"message":[{"line":41,"count":1,"removed":true,
"value":"    ll mini=n-max(0ll,(a1*(k1-1)))-max(0ll,(k2==1?0:(a2*(k2-1))));\n"},{"line":41,"count":1,"added":true,
"value":"    ll mini=max(0ll,n-(a1*(k1-1))-(k2==1?0:(a2*(k2-1))));\n"}],"level":"info"}
{"message":[{"count":2,"removed":true,"value":"n-"},{"count":2,"added":true,"value":"n-"},{"count":1,"removed":true,"value":")"},{"count":1,"removed":true,"value":"max"},{"count":3,"removed":true,"value":"0ll,("}],"level":"info"}
{"message":"Time diff: 146","level":"info"}
{"message":"other submission between them: 0","level":"info"}
```

## if 조건 추가 예제
- 조건 &&time >= lamb[i].b 추가
- 3번의 실수 및 1927초 만에 해결
### 수정과정
```javascript
1. 변수 확대
  int T = 5000000;
2. 반복문 탈출 조건 변경
	//int T = 5000000;
  while (true)
  
  if (m[s] == 2)
    break;
  m[s]++;
3. 1로 복귀 및 조건 추가, 시간 초과 에러
4. T 복귀 및 해결
```

### Detail log
```json
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/ICEY777/B/60562723OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/ICEY777/B/60555311WA/code.cpp","level":"info"}
{"message":[{"line":58,"count":1,"removed":true,
"value":"\t\t\tif ((time - lamb[i].b) % lamb[i].a == 0)\n"},{"line":58,"count":1,"added":true,
"value":"\t\t\tif ((time - lamb[i].b) % lamb[i].a == 0&&time >= lamb[i].b)\n"}],"level":"info"}
{"message":[{"count":11,"added":true,"value":"&&time >= lamb[i].b"}],"level":"info"}
{"message":"Time diff: 1927","level":"info"}
{"message":"other submission between them: 3","level":"info"}
```

### 다른 케이스
```json
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/TimeEmergency/B/60571433OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/TimeEmergency/B/60537781WA/code.cpp","level":"info"}
{"message":[{"line":25,"count":1,"removed":true,
"value":"\t\t\tif ((i - b[j]) % a[j] == 0)\n"},{"line":25,"count":1,"added":true,
"value":"\t\t\tif (i >= b[j] && (i - b[j]) % a[j] == 0)\n"}],"level":"info"}
{"message":[{"count":11,"added":true,"value":"i >= b[j] && "}],"level":"info"}
{"message":"Time diff: 7869","level":"info"}
{"message":"other submission between them: 3","level":"info"}
```

## for 문의 조건
```json
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/897843079/A/60537290WA/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/897843079/A/60538394OK/code.cpp","level":"info"}
{"message":[{"line":22,"count":1,"removed":true,
"value":"    for(int i=2;i<=100;i++){\n"},{"line":22,"count":1,"added":true,
"value":"    for(int i=1;i<=100;i++){\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"2"},{"count":1,"added":true,"value":"1"}],"level":"info"}
{"message":"Time diff: 165","level":"info"}
{"message":"other submission between them: 0","level":"info"}

{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/AOTime/A/60657773WA/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/AOTime/A/60657804OK/code.cpp","level":"info"}
{"message":[{"line":14,"count":1,"removed":true,
"value":"\t\t\tfor(int j=i*i;j<101;j+=i){\n"},{"line":14,"count":1,"added":true,
"value":"\t\t\tfor(int j=i*2;j<101;j+=i){\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"i"},{"count":1,"added":true,"value":"2"}],"level":"info"}
{"message":"Time diff: 112","level":"info"}
{"message":"other submission between them: 0","level":"info"}

{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/Domnack/A/60537750WA/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/Domnack/A/60543811OK/code.cpp","level":"info"}
{"message":[{"line":12,"count":1,"removed":true,
"value":"\tfor(int i=2;i<=N;i++)\n"},{"line":12,"count":1,"added":true,
"value":"\tfor(int i=1;i<=N;i++)\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"2"},{"count":1,"added":true,"value":"1"}],"level":"info"}
{"message":"Time diff: 1045","level":"info"}
{"message":"other submission between them: 0","level":"info"}
```

## i, j 혼동
```json
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/BestLulu/A/60545466OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/BestLulu/A/60539592WA/code.cpp","level":"info"}
{"message":[{"line":36,"count":1,"removed":true,
"value":"            if (a[i] % a[i] == 0) check = 0;\n"},{"line":36,"count":1,"added":true,
"value":"            if (a[i] % a[j] == 0) check = 0;\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"i"},{"count":1,"added":true,"value":"j"}],"level":"info"}
{"message":"Time diff: 1093","level":"info"}
{"message":"other submission between them: 0","level":"info"}

{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/Supermagzzz/C/60542942OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/Supermagzzz/C/60541895WA/code.cpp","level":"info"}
{"message":[{"line":33,"count":1,"removed":true,
"value":"                    maxPos = i;\n"},{"line":33,"count":1,"added":true,
"value":"                    maxPos = j;\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"i"},{"count":1,"added":true,"value":"j"}],"level":"info"}
{"message":"Time diff: 196","level":"info"}
{"message":"other submission between them: 0","level":"info"}
```

## [] 범위 잘못 둠
```json
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/Rose_max/F/60604351OK/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/Rose_max/F/60604338WA/code.cpp","level":"info"}
{"message":[{"line":56,"count":1,"removed":true,
"value":"\t\tint p=hd;for(;p<tl&&ans[list[p]+1]==ans[list[p]];++p);\n"},{"line":56,"count":1,"added":true,
  "value":"\t\tint p=hd;for(;p<tl&&ans[list[p+1]]==ans[list[p]];++p);\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"]"},{"count":1,"added":true,"value":"]"}],"level":"info"}
{"message":"Time diff: 14","level":"info"}
{"message":"other submission between them: 0","level":"info"}
```