resource "aws_ecr_repository" "parlicious_cicd_agent" {
  name = "parlicious/codebuild-agent"
}

resource "aws_ecr_repository_policy" "parlicious_cicd_agent_policy" {
  repository = "${aws_ecr_repository.parlicious_cicd_agent.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CodeBuildAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "${aws_iam_role.parlicious_cicd_role.arn}"  
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability"
      ]
    }
  ]
}
EOF
}
