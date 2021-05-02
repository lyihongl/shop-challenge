FROM node:14.16.1

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
RUN ls
RUN pwd
RUN yarn tsc ./backend
COPY . .

EXPOSE 4000
CMD ["node", "dist/index.js"]