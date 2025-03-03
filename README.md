# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

INSTALL NODE V14 IT COMPATIBLE WITH CURRENT LIB 2.27
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
source ~/.bashrc
nvm install 14
nvm use 14
nvm alias default 14
node -v
npm -v

INSTALL YARN
npm install -g yarn
yarn -v

yarn add @heroicons/react
yarn add sweetalert2



INSTALL REACT USING REACT-RAILS

Add react-rails
bundle install
rails webpacker:install
rails webpacker:install:react
rails g react:install

create component
rails g react:component NameofComponent propsName:propsDataType
