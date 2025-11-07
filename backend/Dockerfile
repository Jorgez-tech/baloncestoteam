# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install only production dependencies using npm ci for reproducible builds
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Install PM2 for process management
RUN npm install -g pm2

# Expose the port the app runs on
EXPOSE 5000

# Add healthcheck for the /health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Create a non-root user and switch to it for better security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Command to run the application with PM2 for better production reliability
CMD [ "pm2-runtime", "start", "server.js" ]
