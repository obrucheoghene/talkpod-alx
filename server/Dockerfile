# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app
# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install build-essential and other necessary dependencies for building the mediasoup worker
RUN apt-get update && \
    apt-get install -y git build-essential python3 pkg-config libssl-dev python3-pip && \
    apt-get install -y net-tools valgrind && \
    apt-get clean 


# Install Node.js dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

RUN npx prisma generate

RUN npm run build

COPY ./src/certs ./dist/certs

EXPOSE 8000
EXPOSE 2000-2300

CMD ["npm", "run", "start"]
