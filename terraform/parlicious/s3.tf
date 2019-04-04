resource "aws_s3_bucket" "parlicious_data_bucket" {
  bucket = "${var.data_bucket_name}"

  policy = <<EOF
{
  "Id": "${var.data_bucket_name}",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_main",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.data_bucket_name}/*",
      "Principal": "*"
    }
  ]
}
EOF

  tags = {
    Name      = "Parlicious Data ${var.lifecycle}"
    Lifecycle = "${var.lifecycle}"
  }
}

resource "aws_s3_bucket" "parlicious_website" {
  bucket = "${var.lifecycle}.parlicious.com"

  policy = <<EOF
{
  "Id": "${var.lifecycle}.parlicious.com",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_main",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.lifecycle}.parlicious.com/*",
      "Principal": "*"
    }
  ]
}
EOF

  website {
    index_document = "index.html"
  }
}

resource "aws_route53_record" "parlicious_record" {
  name    = "${var.lifecycle}.${data.aws_route53_zone.parlicious.name}"
  zone_id = "${data.aws_route53_zone.parlicious.zone_id}"
  type    = "A"

  alias {
    name                   = "s3-website-${data.aws_region.current.name}.amazonaws.com"
    zone_id                = "${aws_s3_bucket.parlicious_website.hosted_zone_id}"
    evaluate_target_health = true
  }
}
