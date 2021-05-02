
FROM node:14.16.1

WORKDIR /app

RUN yarn globall install serve
RUN yarn build
COPY ["package.json", "package-lock.json", "yarn.lock", "./dist/"]
RUN ls
RUN yarn install
COPY . .

EXPOSE 3000

CMD ["$(yarn bin)/serve", "-g", "start"]