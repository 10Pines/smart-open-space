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

4. Available services:

- Backend app server: `localhost:8080` (example: [ping url](http://localhost:8080/ping))
- Frontend app server: `not-available-by-now`
- Postgresql db: `localhost:6543`
- [Pgadmin](http://localhost:8888): `localhost:8888`
    - email: postgres@asd.com
    - password: postgres