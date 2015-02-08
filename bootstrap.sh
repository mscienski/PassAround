#!/usr/bin/env bash

sudo curl -sL https://deb.nodesource.com/setup | sudo bash -
cd ~/passaround
sudo cp /vagrant/000-default.conf /etc/apache2/sites-available/000-default.conf -f
sudo curl -s https://getcomposer.org/installer | php
sudo php composer.phar install
sudo apt-get install -y nodejs
sudo apt-get install -y git
sudo npm i -g bower nodemon gulp yo generator-hottowel
sudo yo hottowel passaround
if ! [ -L /var/www ]; then
  sudo rm -rf /var/www
  sudo ln -fs ~/passaround/ /var/www
fi

sudo service apache2 restart