FROM node:20-alpine
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# build source
COPY . ./
RUN npm run build

# start server
EXPOSE 80
ENV MWB_SERVER__PORT=80
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
