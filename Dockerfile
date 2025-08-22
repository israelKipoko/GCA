FROM php:8.3 as php

RUN apt-get update -y && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install zip pdo_mysql

WORKDIR /var/www
COPY . .

COPY --from=composer:2.8.10 /usr/bin/composer /usr/bin/composer

ENV PORT=8000
COPY Docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]


# node
FROM node:22 as node

WORKDIR /var/www
COPY . .

RUN npm install

VOLUME /var/www/node_modules