##################
# Cognito
##################
output "cognito_user_pool_arn" {
  description = "The ARN of the Cognito User Pool"
  value       = module.infrastructure.cognito_arn
}

output "cognito_user_pool_endpoint" {
  description = "The endpoint of the Cognito User Pool"
  value       = module.infrastructure.cognito_endpoint
}

output "cognito_user_pool_url" {
  description = "The domain of the Cognito User Pool"
  value       = "https://${module.infrastructure.cognito_domain}.auth.${var.region}.amazoncognito.com"
}

output "cognito_user_pool_app_client_id" {
  description = "The App Client client_id"
  value       = module.infrastructure.app_client_id
}

output "cognito_user_pool_postman_client_id" {
  description = "The Postman Client client_id"
  value       = module.infrastructure.postman_client_id
}

###############
# API Gateway
###############
output "apigatewayv2_api_id" {
  description = "The API identifier"
  value       = module.service.apigatewayv2_api_id
}

output "apigatewayv2_api_api_endpoint" {
  description = "The URI of the API"
  value       = module.service.apigatewayv2_api_api_endpoint
}

output "apigatewayv2_api_arn" {
  description = "The ARN of the API"
  value       = module.service.apigatewayv2_api_arn
}

output "apigatewayv2_api_execution_arn" {
  description = "The ARN prefix to be used in an aws_lambda_permission's source_arn attribute or in an aws_iam_policy to authorize access to the @connections API."
  value       = module.service.apigatewayv2_api_execution_arn
}

output "default_apigatewayv2_stage_execution_arn" {
  description = "The ARN prefix to be used in an aws_lambda_permission's source_arn attribute or in an aws_iam_policy to authorize access to the @connections API."
  value       = module.service.default_apigatewayv2_stage_execution_arn
}