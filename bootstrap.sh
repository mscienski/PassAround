#!/usr/bin/env bash

apt-get update
apt-get install lamp-server^
cd /vagrant
curl -s https://getcomposer.org/installer | php
php composer.phar install
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi