
FROM node:14.16.1

WORKDIR /app

COPY ["package.json", "package-lock.json", "yarn.lock", "./"]
RUN ls
RUN npm install --production
COPY . .

EXPOSE 3000

CMD ["yarn", "start"]