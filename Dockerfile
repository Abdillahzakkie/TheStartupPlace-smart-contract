FROM node:16.4
WORKDIR /src
COPY package.json .
RUN npm install
COPY . .

FROM node:16.14-alpine
WORKDIR /src
COPY --from=0 /src .
ENTRYPOINT ["npm"]