# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Bundle app source
COPY . .

# Build the TypeScript code
RUN npm run build

# Your app binds to port 5000, so expose it
EXPOSE 5000

# Define the command to run your app
CMD [ "node", "dist/index.js" ]
