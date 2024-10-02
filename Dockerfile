FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# ENV VITE_BASE_API_URL=https://furbar.shop/api

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
    