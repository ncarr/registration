FROM node:8

EXPOSE 80 443

WORKDIR /opt/lunarhacks

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json package.json
RUN npm install --quiet

COPY . .

# Build
RUN npm run build

# Run MEAN.JS server
CMD ["npm", "start"]
