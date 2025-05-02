#!/bin/sh

# Function to cleanup on exit
cleanup() {
    echo "Shutting down Hardhat node..."
    kill -TERM "$child" 2>/dev/null
    exit 0
}

# Trap SIGTERM and SIGINT
trap cleanup SIGTERM SIGINT

# Compile contracts first
echo "Compiling smart contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "Error: Contract compilation failed"
    exit 1
fi

echo "Contracts compiled successfully!"

# Start Hardhat node
echo "Starting Hardhat node..."
echo "The node will continue running. Use Ctrl+C to stop it."
echo "Deployment script will run in a separate container."

# Run the node with specific network config
npx hardhat node \
    --hostname 0.0.0.0 \
    --port 8545 \
    --network hardhat &

child=$!

# Wait for the node process
wait "$child" 