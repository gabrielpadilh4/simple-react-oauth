#!/bin/bash

client_id=test
username=gab
password=gab
scopes="openid offline_access"
rhsso_url="http://localhost:8080/auth"

refresh_token="JUST A TEST FOR REFRESH TOKEN OFFLINE_ACCESS"

## issue a new refresh token every 20sec using the previous refresh token
for i in $(seq 1 50);
do
    echo
    echo "###### TENTATIVE $i"
    echo
    echo "###### GET NEW REFRESH OFFLINE TOKEN $(date)"
    response_token=`curl -s -d "client_id=$client_id" -d "grant_type=refresh_token" -d "scope=offline_access" "$rhsso_url/realms/test/protocol/openid-connect/token" \
 -d "refresh_token=$refresh_token" | jq`
    echo
    echo "########## RESPONSE"
    echo
    echo $response_token
    echo
    echo "########### REFRESH TOKEN"
    refresh_token=`echo $response_token | jq -r '.refresh_token'`
    echo $refresh_token
    sleep 20
done
