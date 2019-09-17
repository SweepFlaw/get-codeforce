FROM node:12.10.0

SHELL ["/bin/bash", "-c"]

COPY . ./get-codeforce
WORKDIR /get-codeforce
RUN npm install -g yarn \
    && yarn install