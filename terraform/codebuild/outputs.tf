output "parlicious_cicd_agent_ecr_url" {
  value = "${aws_ecr_repository.parlicious_cicd_agent.repository_url}"
}

output "parlicious_uat_cicd_badge" {
    value = "${aws_codebuild_project.parlicious_uat.badge_url}"
}
