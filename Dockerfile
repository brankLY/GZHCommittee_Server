FROM node:8.11.2

RUN mkdir /app

ADD . /app

WORKDIR /app

RUN yarn && \
    yarn tsc && \
    yarn cache clean

EXPOSE 3003

ENV DEBUG=GZHCommittee_Server*
ENV PORT=3003
CMD yarn start
