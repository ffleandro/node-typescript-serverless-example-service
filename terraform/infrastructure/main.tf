locals {
  user_pool_name = "example-user-pool-${var.stage}"
}


// Resources
resource "aws_cognito_user_pool" "user_pool" {
  name = local.user_pool_name

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]
  password_policy {
    minimum_length = 6
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject = "Account Confirmation"
    email_message = "Your confirmation code is {####}"
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
}

resource "aws_cognito_user_pool_domain" "user_pool_domain" {
  domain       = local.user_pool_name
  user_pool_id = "${aws_cognito_user_pool.user_pool.id}"
}

resource "aws_cognito_resource_server" "resource" {
  identifier = "example-service"
  name       = "Example Service"

  scope {
    scope_name        = "update-acronym"
    scope_description = "Permission to update an acronym"
  }

  scope {
    scope_name        = "delete-acronym"
    scope_description = "Permission to delete an acronym"
  }

  user_pool_id = aws_cognito_user_pool.user_pool.id
}

resource "aws_cognito_user_pool_client" "app_client" {
  name = "example-microservice-client"

  user_pool_id = aws_cognito_user_pool.user_pool.id
  generate_secret = false
  refresh_token_validity = 90
  prevent_user_existence_errors = "ENABLED"
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = ["openid", "email", "profile"]
  allowed_oauth_flows = ["code", "implicit"]
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]
  callback_urls = ["https://my.app"]
}

resource "aws_cognito_user_pool_client" "postman_client" {
  name = "postman-client"
  depends_on = [aws_cognito_resource_server.resource]

  user_pool_id = aws_cognito_user_pool.user_pool.id
  generate_secret = true
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = ["example-service/update-acronym", "example-service/delete-acronym"]
  allowed_oauth_flows = ["client_credentials"]
}