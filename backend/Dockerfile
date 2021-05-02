FROM node:14.16.1

WORKDIR /app

RUN yarn tsc
COPY ["package.json", "package-lock.json", "yarn.lock", "./dist/"]
RUN ls
RUN yarn install
COPY . .

EXPOSE 4000
CMD ["node", "dist/index.js"]