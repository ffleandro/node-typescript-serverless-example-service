module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 2.0"

  bucket        = "node-typescript-serverless-example-service-builds-bucket"
  acl           = "private"
  force_destroy = true

  # S3 bucket-level Public Access Block configuration
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_object" "app_dist_zip" {
  bucket = module.s3_bucket.s3_bucket_id
  key    = local.app_package_name
  acl    = "private"
  source = "../dist/${local.app_package_name}"
  etag = filemd5("../dist/${local.app_package_name}")
}