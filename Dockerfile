FROM node:18.12.1-buster-slim AS builder

COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.json ./
COPY public/ public/
COPY src/ src/

RUN npm ci
RUN npm run build

FROM nginx:alpine3.17-slim

COPY --from=builder build /usr/share/nginx/html
COPY  nginx.conf /etc/nginx/nginx.conf

