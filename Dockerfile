FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --prod

FROM nginx:alpine
EXPOSE 80

COPY --from=build /app/dist/desercion-frontend/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

