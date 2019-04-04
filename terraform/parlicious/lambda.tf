resource "aws_lambda_function" "parlicious_lambdas" {
  count            = "${length(var.lambda_folders)}"
  filename         = "../../lambdas/${var.lambda_folders[count.index]}/${var.lambda_folders[count.index]}.zip"
  function_name    = "${var.lambda_folders[count.index]}-${var.lifecycle}"
  role             = "${aws_iam_role.parlicious_lambdas_role.arn}"
  handler          = "index.js"
  source_code_hash = "${filebase64sha256("../../lambdas/${var.lambda_folders[count.index]}/${var.lambda_folders[count.index]}.zip")}"
  runtime          = "nodejs8.10"

  environment {
    variables = {
      DATA_BUCKET_NAME = "${var.data_bucket_name}"
    }
  }
}
