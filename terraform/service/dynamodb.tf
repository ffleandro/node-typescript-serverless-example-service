module "dynamodb_table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "~> 1.0"

  name      = local.dynamodb_acronyms_table_name
  hash_key  = "acronym"

  attributes = [
    {
      name = "acronym"
      type = "S"
    }
  ]
}
