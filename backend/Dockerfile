# 1. Choose the environment. We are using a lightweight version of Node 18.
FROM node:18-alpine

# 2. Tell Docker to create a folder inside the container named /app to hold your code.
WORKDIR /app

# 3. Copy ONLY your package files first. 
# (This is a pro-trick: it caches your dependencies so future builds are lightning fast).
COPY package*.json ./

# 4. Install the dependencies inside the container.
RUN npm install

# 5. Copy the rest of your actual application code into the container.
COPY . .

# 6. Expose the port that your Express app listens on.
EXPOSE 5000

# 7. The final command Docker runs to start your server.
CMD ["node", "server.js"]