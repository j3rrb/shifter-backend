FROM node:16 as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:16-slim
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env .

EXPOSE 3000

CMD [ "node", "dist/main.js" ]