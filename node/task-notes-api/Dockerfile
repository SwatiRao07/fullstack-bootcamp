FROM node:22-slim AS base

FROM base AS build
WORKDIR /usr/src/app

# install tools required for native node modules
RUN apt-get update && apt-get install -y python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM base AS prod
WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]