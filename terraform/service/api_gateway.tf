module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "~> 1.0"

  name          = "node-typescript-serverless-example-service-${var.stage}-api-gateway-http"
  description   = "Node Typescript Serverless Example Service - HTTP API Gateway (${var.stage})"
  protocol_type = "HTTP"

  create_api_domain_name = false

  integrations = {
    "GET /acronym" = {
      lambda_arn             = module.lambda_service.lambda_function_arn
      payload_format_version = "2.0"
    }

    "POST /acronym" = {
      lambda_arn             = module.lambda_service.lambda_function_arn
      payload_format_version = "2.0"
    }

    "GET /acronym/{acronym}" = {
      lambda_arn             = module.lambda_service.lambda_function_arn
      payload_format_version = "2.0"
    }

    "PUT /acronym/{acronym}" = {
      lambda_arn             = module.lambda_service.lambda_function_arn
      payload_format_version = "2.0"
    }

    "DELETE /acronym/{acronym}" = {
      lambda_arn             = module.lambda_service.lambda_function_arn
      payload_format_version = "2.0"
    }
  }

}
