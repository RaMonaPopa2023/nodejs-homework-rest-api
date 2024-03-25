# Fetching the minified node image on alpine linux
FROM node:slim

# Setting up the work directory
WORKDIR /docker-express

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

# Starting our application
CMD [ "node", "index.js" ]

# COMENZI DE RULAT IN TERMINAL:

# Build the image, run in terminal:
# docker build -t express-app .

# Run the image
# docker run -dp 127.0.0.1:3000:3000 express-app