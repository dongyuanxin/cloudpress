#!/bin/sh

if [ -f .env ];then
    export $(cat .env | sed 's/#.*//g' | xargs)
else 
    echo "未监测到.env, 开发模式请创建.env"
fi

echo N | cloudbase login --apiKeyId $TCB_SECRET_ID --apiKey $TCB_SECRET_KEY