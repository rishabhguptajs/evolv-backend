FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Clean npm cache before installing dependencies
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Copy environment variables file (if needed)
COPY .env ./

# Expose port 8080 for the application
EXPOSE 8080:8080

# Start the application
CMD ["npm", "start"]