FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

RUN npm install -g nodemon

COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3000

CMD ["nodemon", "server.js"]