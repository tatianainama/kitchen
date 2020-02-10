FROM node:13.7.0-buster-slim
RUN echo 'Acquire::http::Proxy "http://proxies.labs:3142/apt-cacher/";' > /etc/apt/apt.conf.d/01proxy
RUN apt-get update && apt-get install --no-install-recommends -y git openssh-client ca-certificates s4cmd
RUN mkdir /root/.ssh/ && chmod 700 /root/.ssh
ADD key_for_recipes /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN ssh-keyscan -H -p 2222 gogs.davidventura.com.ar  > /root/.ssh/known_hosts
ARG TAG
RUN git clone ssh://git@gogs.davidventura.com.ar:2222/tati/kitchn.git && cd /kitchn && git checkout $TAG
RUN cd /kitchn/ktchn && npm install && npm run build
RUN cd /kitchn/recipes && npm install && npm run build
RUN cd /kitchn/recipes/build && tar czf /front.tar.gz .
ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ENV http_proxy=
RUN s4cmd --endpoint-url=http://ci.labs:9000 ls s3://recipes/${TAG}/ || s4cmd --endpoint-url=http://ci.labs:9000 mb s3://recipes/${TAG}/
RUN s4cmd --endpoint-url=http://ci.labs:9000 put --force /front.tar.gz s3://recipes/${TAG}/
RUN s4cmd --endpoint-url=http://ci.labs:9000 put --force /kitchn/ktchn/dist/bundle.js s3://recipes/${TAG}/
ENTRYPOINT /bin/false
