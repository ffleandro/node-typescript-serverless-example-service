module "lambda_service" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 2.0"
  depends_on = [module.s3_bucket]

  function_name = "node-typescript-serverless-example-service-${var.stage}-lambda"
  description   = "Node Typescript Serverless Example - Acronym Lambda Function (${var.stage})"
  handler       = "index.httpHandler"
  runtime       = "nodejs16.x"
  publish       = true

  create_package = false
  s3_existing_package = {
    bucket = module.s3_bucket.s3_bucket_id
    key    = local.app_package_name
  }

  attach_tracing_policy    = true
  attach_policy_statements = true

  policy_statements = {
    dynamodb = {
      effect    = "Allow",
      actions   = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
        ],
      resources = [module.dynamodb_table.dynamodb_table_arn]
    }
  }

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*/*"
    }
  }

  environment_variables = {
    COGNITO_REGION=var.region
    COGNITO_POOL_ID=var.cognito_pool_id
    DYNAMODB_REGION=var.region
    ACRONYMS_TABLE = local.dynamodb_acronyms_table_name
  }
}
