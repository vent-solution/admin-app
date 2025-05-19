#!/bin/bash

cd /var/www/html/admin-app

ls -la

cp -arp build/. . && rm -rf build 

systemctl reload nginx