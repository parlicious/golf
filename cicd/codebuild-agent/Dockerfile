FROM node:8-alpine

ARG TERRAFORM_VERSION=0.11.13

RUN apk add --update \
    ca-certificates \
    zip \
    bash \
    python \
    python-dev \
    py-pip \
    build-base \
    && pip install awscli --upgrade \
    && apk --purge -v del py-pip \
    && rm -rf /var/cache/apk/*

RUN cd /tmp && \
    wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -O terraform.zip && \
    unzip terraform.zip && \
    mv terraform /usr/local/bin/terraform && \
    rm terraform.zip
