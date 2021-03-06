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

## 문제 별 풀이 통계
```
P.A total: 57381
P.A one time solve ratio: 0.6305397256931737
P.A cannot solve ratio: 0.07627960474721597
P.A little diff ratio: 0.021296247886931213
P.B total: 50966
P.B one time solve ratio: 0.4867166346191579
P.B cannot solve ratio: 0.13881803555311384
P.B little diff ratio: 0.020288035160695366
P.C total: 34576
P.C one time solve ratio: 0.4883734382230449
P.C cannot solve ratio: 0.1400393336418325
P.C little diff ratio: 0.015964831096714482
P.E total: 6646
P.E one time solve ratio: 0.34501956063797773
P.E cannot solve ratio: 0.2016250376166115
P.E little diff ratio: 0.03535961480589828
P.D total: 19623
P.D one time solve ratio: 0.31361157825001273
P.D cannot solve ratio: 0.2364062579625949
P.D little diff ratio: 0.03266574937573256
P.F total: 2230
P.F one time solve ratio: 0.23094170403587444
P.F cannot solve ratio: 0.24260089686098654
P.F little diff ratio: 0.03094170403587444
P.D2 total: 1888
P.D2 one time solve ratio: 0.7182203389830508
P.D2 cannot solve ratio: 0.08739406779661017
P.D2 little diff ratio: 0.005296610169491525
P.D1 total: 2323
P.D1 one time solve ratio: 0.5794231597072751
P.D1 cannot solve ratio: 0.25871717606543265
P.D1 little diff ratio: 0.002582866982350409
P.G total: 413
P.G one time solve ratio: 0.4043583535108959
P.G cannot solve ratio: 0.11380145278450363
P.G little diff ratio: 0.048426150121065374
P.H total: 141
P.H one time solve ratio: 0.24113475177304963
P.H cannot solve ratio: 0.41843971631205673
P.H little diff ratio: 0.02127659574468085
P.G1 total: 1395
P.G1 one time solve ratio: 0.6781362007168459
P.G1 cannot solve ratio: 0.06953405017921147
P.G1 little diff ratio: 0.02078853046594982
P.E1 total: 2087
P.E1 one time solve ratio: 0.2606612362242453
P.E1 cannot solve ratio: 0.4000958313368472
P.E1 little diff ratio: 0.01772879731672257
P.E2 total: 953
P.E2 one time solve ratio: 0.19517313746065057
P.E2 cannot solve ratio: 0.38195173137460653
P.E2 little diff ratio: 0.022035676810073453
P.G2 total: 58
P.G2 one time solve ratio: 0.3620689655172414
P.G2 cannot solve ratio: 0.1724137931034483
P.G2 little diff ratio: 0
P.F1 total: 4
P.F1 one time solve ratio: 0.5
P.F1 cannot solve ratio: 0.5
P.F1 little diff ratio: 0
P.F2 total: 1
P.F2 one time solve ratio: 1
P.F2 cannot solve ratio: 0
P.F2 little diff ratio: 0
```

## 한 개의 단어가 치환 or 생성 or 삭제된 경우의 가짓수
- 965개의 쌍
```json
// 부등식/ 등식 잘못 씀
{"message":"equality diff case count: 172","level":"info"}
{"message":"equality diff average seconds: 741.7848837209302","level":"info"}
// 숫자 잘못 씀
{"message":"constant diff case count: 233","level":"info"}
{"message":"constant diff average seconds: 428.31330472103","level":"info"}
// 영문자 잘못 씀(예약어 포함): ^[a-zA-Z_$][a-zA-Z_$0-9]*
{"message":"variable diff case count: 406","level":"info"}
{"message":"variable diff average seconds: 506.1527093596059","level":"info"}
// 영문자 숫자 잘못 씀 (영문자 => 숫자 or 숫자 => 영문자)
{"message":"variable and constant diff case count: 39","level":"info"}
{"message":"variable and constant diff average seconds: 609.3076923076923","level":"info"}
// operator 잘못 씀 except (in)equality
{"message":"operator diff case count: 29","level":"info"}
{"message":"operator diff average seconds: 388.7241379310345","level":"info"
```

## 오직 add or remove만 있을 때
```json
{"message":"only add in a line case count: 833","level":"info"}
{"message":"only add in a line average seconds: 556.5774309723889","level":"info"}
{"message":"only remove in a line case count: 105","level":"info"}
{"message":"only remove in a line average seconds: 770.2190476190476","level":"info"}
```

# 특정 문제마다 반복되는 패턴
## max(0, x)
- 한 줄만 다른 207개 62개
## int -> long long
- 한 줄만 다른 158개 중 106개
=> n - max(0ll, x)
=> n - max(0ll, x1 - max(0ll, x2))
=> max(0ll, n-x)


# 사람의 코딩 실수 예제들
## 한 줄 전체를 주석처리
```json
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/Chem_Than/B/60651791WA/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/Chem_Than/B/60651812OK/code.cpp","level":"info"}
{"message":[{"line":11,"count":1,"removed":true,
"value":"    freopen(\"input.txt\",\"r\",stdin);\n"},{"line":11,"count":1,"added":true,
"value":"    //freopen(\"input.txt\",\"r\",stdin);\n"}],"level":"info"}
{"message":[{"count":1,"added":true,"value":"//"}],"level":"info"}
{"message":"Time diff: 49","level":"info"}
{"message":"other submission between them: 0","level":"info"}
```

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

{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/pk10/C/60554782WA/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1209/pk10/C/60557405OK/code.cpp","level":"info"}
{"message":[{"line":22,"count":1,"removed":true,"value":"                w[j]=w[j]+1;\n"},{"line":22,"count":1,"added":true,"value":"                w[j]=w[j+1];\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"]"},{"count":1,"added":true,"value":"]"}],"level":"info"}
{"message":"Time diff: 656","level":"info"}
{"message":"other submission between them: 0","level":"info"}

{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/xiayuhandalao/C/60613819WA/code.cpp","level":"info"}
{"message":"/newdisk/get-codeforce/src/diff/../../datas/1215/xiayuhandalao/C/60615165OK/code.cpp","level":"info"}
{"message":[{"line":41,"count":1,"removed":true,"value":"            cout<<v1[i]<<\" \"<<v1[i]+1<<endl;\n"},{"line":41,"count":1,"added":true,"value":"            cout<<v1[i]<<\" \"<<v1[i+1]<<endl;\n"}],"level":"info"}
{"message":[{"count":1,"removed":true,"value":"]"},{"count":1,"added":true,"value":"]"}],"level":"info"}
{"message":"Time diff: 285","level":"info"}
{"message":"other submission between them: 0","level":"info"}
```