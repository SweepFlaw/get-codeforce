FROM node:12.10.0

SHELL ["/bin/bash", "-c"]

COPY . ./get-codeforce
WORKDIR /get-codeforce
RUN apt update && apt install vim -y
RUN npm install -g yarn \
    && npm install -g pm2 \
    && yarn install \
    && mkdir -p logs