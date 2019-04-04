data "aws_region" "current" {}

data "aws_route53_zone" "parlicious" {
  name = "parlicious.com."
}
