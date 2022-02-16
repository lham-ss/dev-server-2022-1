FROM node:14-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password123 \
    HTTP_PORT=4000	

RUN mkdir -p /home/server

COPY ./app /home/server

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/server

# will execute npm install in /home/server because of WORKDIR
RUN npm install

# no need for /home/server/server.js because of WORKDIR
CMD ["node", "server.js"]