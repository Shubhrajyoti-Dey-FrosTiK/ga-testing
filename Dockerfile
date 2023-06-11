FROM node:20

WORKDIR /server

COPY . /server

RUN npm i -g rimraf typescript

RUN npm i

CMD [ "npm","start" ]

EXPOSE 8080