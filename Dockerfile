FROM node:18-bullseye-slim

WORKDIR /home/root/api

# Copy package.json and yarn.lock to container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy package.json and yarn.lock to container
COPY . .

EXPOSE 3333

CMD [ "yarn", "dev" ]