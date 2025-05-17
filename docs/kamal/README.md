# Kamal Deploy

Oficial Kamal documentation [here](https://kamal-deploy.org/docs/installation/)


## Guide installation

Requirements:
- A Ruby environment (or alternatively, a Docker container installation [docs info](https://kamal-deploy.org/docs/installation/dockerized/)).
- SSH keys configured for the servers and users, as specified in each `deploy.yml` file, to enable connections.
- Docker installed
- Set up image registry (eg: dockerhub) password in env `$KAMAL_REGISTRY_SECRET` configured.


1. Install kamal globally (if run Kamal with docker, skip this step)

```bash
gem install kamal
```


2. Go to folder to deploy (back or front) and set up secrets environments


3. Execute deploy

```bash
kamal setup
```

This will (in order):

- Connect to the servers over SSH (using root by default, authenticated by your SSH key).
- Install Docker on any server that might be missing it (using get.docker.com): root access is needed via SSH for this.
- Log into the registry both locally and remotely.
- Build the image using the standard Dockerfile in the root of the application.
- Push the image to the registry.
- Pull the image from the registry onto the servers.
- Ensure kamal-proxy is running and accepting traffic on ports 80 and 443.
- Start a new container with the version of the app that matches the current Git version hash.
- Tell kamal-proxy to route traffic to the new container once it is responding with 200 OK to GET /up.
- Stop the old container running the previous version of the app.
- Prune unused images and stopped containers to ensure servers don’t fill up.





