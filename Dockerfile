FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /
COPY ./package*.json ./
RUN npm install -g npm@8.13.1
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN chown -R node app.js
USER node
CMD ["npm", "start"]
