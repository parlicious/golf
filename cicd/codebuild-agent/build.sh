#!/bin/bash

docker build -t codebuild-agent:latest -f cicd/codebuild-agent/Dockerfile $* .
