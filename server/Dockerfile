FROM node

WORKDIR usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# this is the port that the app will run on in the container
EXPOSE 8080 

CMD ["node", "index.js"]
