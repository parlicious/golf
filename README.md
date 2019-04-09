# Parlicious

![Codebuild Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiS0pGVDV6MWhyZ0Q5UVJpQVh2VjBwODFFVVZnS1NsSFE4UFN4bU5tTEVTb0FuVmUrUHpXdGVkYjRyZ3NhM2k4SWdXVjB4a3p6ekpXMUIyRFBQWTNNR3NFPSIsIml2UGFyYW1ldGVyU3BlYyI6Ii9GeVVKdTFzVm5DZ1UrZWciLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

## Web

The web app is found under [web](/web) and is written in Vue. 

## Mobile

The mobile app is an angular / ionic app found under [mobile](/mobile)

## APIs

Those apps are served by a combination of AWS Lambdas (typically node) and static
JSON files stored in S3. The templates for those static files are found under 
[datatemplates](/datatemplates). The lambdas themselves are found under 
[lambdas](/lambdas)

## CI/CD

We're using codebuild as a build server and terraform to manage our infrastructure.
Unsurprisingly you can find these under [terraform](/terraform), [cicd](/cicd), 
and [scripts](/scripts).

## Development

We have kanban boards setup for the different projects [here](https://github.com/orgs/parlicious/projects)

