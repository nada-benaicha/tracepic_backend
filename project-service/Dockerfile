FROM node:12.9
# Create app directory
RUN mkdir -p /usr/src/
WORKDIR /usr/src/

# Install app dependencies
COPY package.json /usr/src/
RUN npm install

# Bundle app source
COPY . /usr/src
EXPOSE 8081
CMD [ "node", "server.js" ]
