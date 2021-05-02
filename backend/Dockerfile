FROM node:14.16.1

WORKDIR /app

COPY ["../waitforit.sh", "package.json", "yarn.lock", "tsconfig.json", "./"]
RUN yarn install
RUN ls
COPY ./src ./src
RUN ls
RUN yarn tsc 

EXPOSE 4000
CMD ["node", "dist/index.js"]