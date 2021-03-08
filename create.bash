#!/bin/bash

#initialize project with yarn
# git init
#yarn init -y
# npm init -y

#create git repository
touch .gitignore
echo "node_modules" >> .gitignore
echo "yarn.lock" >> .gitignore
echo ".env" >> .gitignore

#make new directories
mkdir config middlewares helpers controllers routes constants models src

for folder in $(ls -d */)
do
    
    touch $folder/index.js
    
done

#add dependencies
yarn add express router dotenv mongoose cors helmet esm node-cache axios bcrypt body-parser cookie-parser crypto-js express-ws imap imap-simple jsonwebtoken mailparser moment mongoose multer node-rsa nodemailer socket.io
yarn add -D morgan 

#create server and index file
touch index.js server.js

#eslint initialize
#./node_modules/.bin/eslint --init