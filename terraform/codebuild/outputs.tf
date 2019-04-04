output "parlicious_cicd_agent_ecr_url" {
  value = "${aws_ecr_repository.parlicious_cicd_agent.repository_url}"
}
