#!/bin/bash

while getopts l: flag
do
    case "${flag}" in
        l) local=${OPTARG};;
    esac
done

## Create Tables request
create_tables="{
    \"TableName\": \"node-typescript-serverless-example-service-acronyms-dev\",
    \"KeySchema\": [
      { \"AttributeName\": \"acronym\", \"KeyType\": \"HASH\" }
    ],
    \"AttributeDefinitions\": [
      { \"AttributeName\": \"acronym\", \"AttributeType\": \"S\" }
    ],
    \"ProvisionedThroughput\": {
      \"ReadCapacityUnits\": 1,
      \"WriteCapacityUnits\": 1
    }
}"

# Make the create tables request
AWS_PAGER="" aws dynamodb create-table --cli-input-json "$create_tables" --endpoint-url http://localhost:8000

## Process the input json file
items=()
while read item; do
  ## Put each item into an array
  items+=("$item")
done < <(jq -c '.[]' acronyms.json)

## Process the items array
for((i=0; i < ${#items[@]}; i+=1))
do
  # Process the splitted array and prepare the request format
  request=$(echo "${items[i]}" | jq -c '{acronym: {"S": keys[]}, description: {"S": values[]}, searchable_description: {"S": values[]}}')
  
  # Inser item
  AWS_PAGER="" aws dynamodb put-item --table-name "node-typescript-serverless-example-service-acronyms-dev" --item "$request" --endpoint-url http://localhost:8000
done

echo "database seed complete"
