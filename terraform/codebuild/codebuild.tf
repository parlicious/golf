resource "aws_s3_bucket" "parlicious_cicd_cache" {
  bucket = "parlicious-cicd-cache-${data.aws_caller_identity.current.account_id}"
  acl    = "private"
}

resource "aws_codebuild_project" "parlicious_uat" {
  name          = "parlicious-uat"
  description   = "parlicious uat pipeline"
  build_timeout = "10"
  service_role  = "${aws_iam_role.parlicious_cicd_role.arn}"
  badge_enabled = true

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type     = "S3"
    location = "${aws_s3_bucket.parlicious_cicd_cache.bucket}"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "${aws_ecr_repository.parlicious_cicd_agent.repository_url}"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/parlicious/golf.git"
    git_clone_depth = 1
    buildspec       = "cicd/buildspecs/uat.buildspec.yaml"

    auth = {
      type     = "OAUTH"
    }
  }
}

resource "aws_codebuild_project" "parlicious_dev" {
  name          = "parlicious-dev"
  description   = "parlicious dev pipeline"
  build_timeout = "10"
  service_role  = "${aws_iam_role.parlicious_cicd_role.arn}"
  badge_enabled = true

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type     = "S3"
    location = "${aws_s3_bucket.parlicious_cicd_cache.bucket}"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "${aws_ecr_repository.parlicious_cicd_agent.repository_url}"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/parlicious/golf.git"
    git_clone_depth = 1
    buildspec       = "cicd/buildspecs/dev.buildspec.yaml"

    auth = {
      type     = "OAUTH"
    }
  }
}

resource "aws_codebuild_project" "parlicious_prod" {
  name          = "parlicious-prod"
  description   = "parlicious prod pipeline"
  build_timeout = "10"
  service_role  = "${aws_iam_role.parlicious_cicd_role.arn}"
  badge_enabled = true

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type     = "S3"
    location = "${aws_s3_bucket.parlicious_cicd_cache.bucket}"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "${aws_ecr_repository.parlicious_cicd_agent.repository_url}"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/parlicious/golf.git"
    git_clone_depth = 1
    buildspec       = "cicd/buildspecs/prod.buildspec.yaml"

    auth = {
      type     = "OAUTH"
    }
  }
}

resource "aws_codebuild_webhook" "parlicious_uat" {
  project_name  = "${aws_codebuild_project.parlicious_uat.name}"
  branch_filter = "master"
}

resource "aws_codebuild_webhook" "parlicious_dev" {
  project_name  = "${aws_codebuild_project.parlicious_dev.name}"
  branch_filter = "^(?!.*master).*$"
}
