FROM node:8.11.2

RUN mkdir /app

ADD . /app

WORKDIR /app

RUN yarn && \
    yarn tsc && \
    yarn cache clean

EXPOSE 3002

ENV DEBUG=DappJupiter*
ENV PORT=3002
CMD yarn start
