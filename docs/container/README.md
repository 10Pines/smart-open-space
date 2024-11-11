# Container section

This section is to build and run fast app context with dev tools. 

### Supporting

- Back-app
- Postgres
- Pgadmin (UI client for postgress)

### Step by step

1. Build back app image:
```bash
docker build -t smart-open-space
```

2. Review env variables (such as, PORT, SPRING_PROFILE, DB PORT, forwarding ports for each service, etc) at [`docker-compose.yml`](/docs/container/docker-compose.yml).

3. Execute command:
```bash
docker-compose -p 'tesis' up -d --build
```
