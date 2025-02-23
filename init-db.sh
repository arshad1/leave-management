#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
YELLOW='\033[1;33m'

echo -e "${YELLOW}Starting database initialization...${NC}"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
    echo -e "${GREEN}Loaded environment variables${NC}"
else
    echo -e "${RED}Error: .env file not found${NC}"
    exit 1
fi

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo -e "${RED}Error: PostgreSQL is not running${NC}"
    exit 1
fi
echo -e "${GREEN}PostgreSQL is running${NC}"

# Create database if it doesn't exist
echo -e "${YELLOW}Creating database if it doesn't exist...${NC}"
psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_DATABASE'" | grep -q 1 || psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -c "CREATE DATABASE $DB_DATABASE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database setup completed${NC}"
else
    echo -e "${RED}Error: Database creation failed${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Dependencies installed successfully${NC}"
    else
        echo -e "${RED}Error: Dependencies installation failed${NC}"
        exit 1
    fi
fi

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npm run migration:run
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Migrations completed successfully${NC}"
else
    echo -e "${RED}Error: Migrations failed${NC}"
    exit 1
fi

# Seed database
echo -e "${YELLOW}Seeding database...${NC}"
npm run seed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database seeding completed successfully${NC}"
else
    echo -e "${RED}Error: Database seeding failed${NC}"
    exit 1
fi

echo -e "${GREEN}Database initialization completed successfully!${NC}"
echo -e "${YELLOW}You can now start the application with:${NC}"
echo -e "${GREEN}npm run start:dev${NC}"