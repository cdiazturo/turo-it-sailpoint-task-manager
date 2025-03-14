FROM node:22.14-alpine

ENV PORT 80
ENV YARN_VERSION 1.21.1
ENV NODE_ENV production

# Install yarn
RUN apk add --no-cache --virtual .build-deps-yarn curl \
  && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz \
  && apk del .build-deps-yarn

# Copies package
WORKDIR /usr/__PROJECT_NAME__

COPY package.json package.json
COPY lib lib
# COPY config config
COPY .npmrc .
COPY .yarnrc .
COPY yarn.lock .
RUN ls -la

RUN --mount=type=secret,id=npm_auth_token,required NPM_AUTH_TOKEN=`cat /run/secrets/npm_auth_token` yarn --pure-lockfile --production
RUN --mount=type=secret,id=npm_auth_token,required NPM_AUTH_TOKEN=`cat /run/secrets/npm_auth_token` yarn cache clean

RUN rm .npmrc

WORKDIR /usr/__PROJECT_NAME__
CMD [ "node", "lib/index.js"]
