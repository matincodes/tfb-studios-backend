# Use latest LTS Node version
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npx prisma generate

# Copy the entire project
COPY . .

# Expose backend port
EXPOSE 5001

# Start server
CMD ["npm", "run", "dev"]
