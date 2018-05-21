FROM ubuntu:latest

EXPOSE 80 443

# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq curl \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /opt/lunarhacks

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json /opt/lunarhacks/package.json
RUN NODE_ENV=development npm install --quiet

# Build
RUN npm build

# Set development environment as default
ENV NODE_ENV production
ENV PORT 80

COPY . /opt/lunarhacks

# Run MEAN.JS server
CMD npm start
