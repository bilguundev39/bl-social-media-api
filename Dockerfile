FROM node:18.16.0-alpine
RUN mkdir /home/node/social-media-api
WORKDIR /home/node/social-media-api
COPY . /home/node/social-media-api/
ENV NODE_ENV=dev
RUN npm install
RUN npm update
RUN npm audit --fix
CMD ["npm", "run", "start-dev"]