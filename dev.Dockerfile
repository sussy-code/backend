FROM node:20-alpine
WORKDIR /app

# wait script for development
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

VOLUME [ "/app" ]
CMD npm i && /wait && npm run dev
