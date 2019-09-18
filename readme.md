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