FROM php:7.4-fpm

SHELL ["/bin/bash", "-oeux", "pipefail", "-c"]

ENV COMPOSER_ALLOW_SUPERUSER=1 \
  COMPOSER_HOME=/composer
COPY --from=composer:2.0 /usr/bin/composer /usr/bin/composer

RUN apt-get update && \
  apt-get -y install git unzip libzip-dev libicu-dev libonig-dev curl && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  docker-php-ext-install intl pdo_mysql zip bcmath

RUN useradd -m -s /bin/sh -u 1000 nginx

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm install n -g
RUN n 12

COPY ./php.ini /usr/local/etc/php/php.ini

USER nginx

WORKDIR /workspace