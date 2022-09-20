##################
# Cognito
##################

output "cognito_arn" {
  description = "The ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.user_pool.arn
}

output "cognito_pool_id" {
  description = "The pool id of the Cognito User Pool"
  value       = aws_cognito_user_pool.user_pool.id
}

output "cognito_endpoint" {
  description = "The endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.user_pool.endpoint
}

output "cognito_domain" {
  description = "The domain of the Cognito User Pool"
  value       = aws_cognito_user_pool_domain.user_pool_domain.domain
}

output "app_client_id" {
  description = "The App Client client_id"
  value       = aws_cognito_user_pool_client.app_client.id
}

output "postman_client_id" {
  description = "The Postman Client client_id"
  value       = aws_cognito_user_pool_client.postman_client.id
}