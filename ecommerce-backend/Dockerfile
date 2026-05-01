FROM node:19.6-alpine As base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base as dev

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm install

COPY . .

CMD ["npm", "run", "dev"]

FROM base as production

ENV NODE_ENV production

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production

# use non-root user for security
USER node

# copy remaining source code AFTER installing dependencies. 
# Again, copy only the necessary files
COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "server.js"]