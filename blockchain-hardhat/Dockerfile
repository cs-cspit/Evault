FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Make the startup scripts executable
COPY start-node.sh deploy.sh ./
RUN chmod +x start-node.sh deploy.sh

# Expose hardhat network port
EXPOSE 8545

# Default to running the node, can be overridden by docker-compose
CMD ["./start-node.sh"] 