.DEFAULT_GOAL := all

LOCAL_REGISTRY := kubernetes.docker.internal:5000
LOCAL_REGISTRY_DIRECTORY := $(HOME)/Development/registry
CLOUD_REGISTRY := registry.digitalocean.com/jonline

local: 
	cargo build

create_local_registry:
	docker run -d -p 5000:5000 --restart=always --name local-registry -v $(LOCAL_REGISTRY_DIRECTORY):/var/lib/registry registry:2

stop_local_registry:
	docker stop local-registry
	docker rm local-registry

destroy_local_registry: stop_local_registry
	rm -rf $(LOCAL_REGISTRY_DIRECTORY)/docker

start:
	docker-compose up -d

stop:
	docker-compose down

release: build_release server_docker

create_pod:
	kubectl create -f kubernetes.yaml

delete_pod:
	kubectl delete -f kubernetes.yaml

build_jonline_build:
	docker build . -t $(LOCAL_REGISTRY)/jonline-build  -f dockers/build/Dockerfile
	docker push $(LOCAL_REGISTRY)/jonline-build

build_release:
	docker run -v $$(pwd):/opt -w /opt/src $(LOCAL_REGISTRY)/jonline-build:latest /bin/bash -c "cargo build --release"

server_docker:
	docker build . -t $(LOCAL_REGISTRY)/jonline-tonic -f dockers/server/Dockerfile
	docker push $(LOCAL_REGISTRY)/jonline-tonic
