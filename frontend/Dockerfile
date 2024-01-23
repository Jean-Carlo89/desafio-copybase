FROM node:18.17.1-slim

##RUN npm install -g @nestjs/cli@10.1.17

WORKDIR /home/node/app

COPY package.json .



RUN npm install

COPY . .

#CMD ["tail", "-f" ,"/dev/null"]

CMD ["npm", "run" ,"dev"]