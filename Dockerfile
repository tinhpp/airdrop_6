
FROM node:18

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Installing dependencies
RUN  npm install --legacy-peer-deps

RUN npm install -g ts-node

EXPOSE 4000

CMD ["/bin/sh","dockerrun.sh"]