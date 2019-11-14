FROM node:12.13.0-buster

SHELL ["/bin/bash", "-c"]

COPY . ./get-codeforce
WORKDIR /get-codeforce
RUN apt update && apt install vim wget software-properties-common -y \
    && wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add - \
    && apt-add-repository "deb http://apt.llvm.org/xenial/ llvm-toolchain-xenial-6.0 main" \
    && apt update && apt install lld-6.0 clang-6.0 -y
RUN npm install -g yarn \
    && npm install -g pm2 \
    && yarn install \
    && mkdir -p logs