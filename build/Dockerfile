FROM node:13.7.0-buster-slim as builder
RUN echo 'Acquire::http::Proxy "http://proxies.labs:3142/apt-cacher/";' > /etc/apt/apt.conf.d/01proxy
RUN apt-get update && apt-get install --no-install-recommends -y git openssh-client ca-certificates python2 make g++
RUN mkdir /root/.ssh/ && chmod 700 /root/.ssh
ADD key_for_recipes /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN ssh-keyscan -H -p 2222 gogs.davidventura.com.ar  > /root/.ssh/known_hosts
ARG TAG
RUN git clone ssh://git@gogs.davidventura.com.ar:2222/tati/kitchn.git && cd /kitchn && git checkout $TAG
RUN cd /kitchn/ktchn && npm install && npm run build
RUN cd /kitchn/recipes && npm install && npm run build
RUN cd /kitchn/recipes/build && tar czf /front.tar.gz .
RUN echo '/front.tar.gz' > /artifacts
RUN echo '/kitchn/ktchn/dist/bundle.js' >> /artifacts
