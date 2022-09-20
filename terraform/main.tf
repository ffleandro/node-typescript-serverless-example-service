provider "aws" {
  region = var.region

  # Make it faster by skipping these
  skip_get_ec2_platforms      = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_credentials_validation = true

  # skip_requesting_account_id should be disabled to generate valid ARN in apigatewayv2_api_execution_arn
  skip_requesting_account_id = false
}

module "infrastructure" {
    source = "./infrastructure"
    stage = var.stage
}

module "service" {
    source = "./service"
    stage = var.stage
    region = var.region
    cognito_pool_id = module.infrastructure.cognito_pool_id
}