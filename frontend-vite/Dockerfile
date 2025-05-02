# Development stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend-vite/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend project files
COPY frontend-vite/ .

# Create directory for blockchain artifacts
RUN mkdir -p /blockchain-hardhat/artifacts/

# Copy blockchain artifacts if they exist (using shell to handle missing files)
RUN mkdir -p /blockchain-hardhat/artifacts/ && \
    cp -r /app/blockchain-hardhat/artifacts/* /blockchain-hardhat/artifacts/ 2>/dev/null || true

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]