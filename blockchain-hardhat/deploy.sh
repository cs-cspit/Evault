#!/bin/sh

# Wait for Hardhat node to be ready
echo "Waiting for Hardhat node to be ready..."

# Simple retry loop with basic wget
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    echo "Attempt $((RETRY_COUNT+1))/$MAX_RETRIES: Connecting to Hardhat node..."
    
    # Simple wget command compatible with BusyBox
    if wget -q -T 5 -O /dev/null http://blockchain-node:8545; then
        echo "Hardhat node is ready!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "Error: Failed to connect to Hardhat node after $MAX_RETRIES attempts"
        exit 1
    fi
    sleep 2
done

# Check if contracts are already deployed
if [ -f "/app/artifacts/deployed-contracts.json" ]; then
    echo "Contracts already deployed, skipping deployment"
    exit 0
fi

# Run deployment script
echo "Running deployment script..."
echo "This will:"
echo "1. Deploy the main EVault contract"
echo "2. Register test judges, lawyers, and clients"
echo "3. Create test cases"
echo "4. Update case progress"

# Set the correct network URL
export HARDHAT_NETWORK=localhost
export HARDHAT_NETWORK_URL=http://blockchain-node:8545

npx hardhat run scripts/deploy_fetchCaseDetailsByAClient.js --network localhost

if [ $? -ne 0 ]; then
    echo "Error: Deployment failed"
    exit 1
fi

# Save deployment info
echo "Saving deployment information..."
mkdir -p /app/artifacts
touch /app/artifacts/deployed-contracts.json

echo "Deployment completed successfully!"