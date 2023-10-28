# how to use docker development?

## How to setup?
 1. have docker installed
 2. create a `config.env` in `/.docker/development`. inspire its contents from `example.config.env`

## how to run?
 1. while in directory `/.docker/development` run `docker compose up -d`
 1.1 if running first time in docker, make sure you have no node_modules folder present in `/`.

## not working? try this:
 1. while in directory `/.docker/development` run `docker compose down -v`
 2. remove `node_modules` directory in `/` if it exists
 3. remove `.env` and `config.json` file in `/` if any of them exist
 4. while in directory `/.docker/development` run `docker compose up -d --build`

## how to stop?
 1. while in directory `/.docker/development` run `docker compose down`
> NOTE: if you want also delete all saved data for a full reset, run `docker compose down -v` instead

## how do I access the terminal for the backend service?
make sure the docker services are running, then run `docker attach mw_backend-1`.
this will appear to show nothing at first, but all new logs will show up,
and anything you type in the terminal now affect the backend service.
> Warning: doing CTRL+C will shut down the backend service, it will not kick your terminal back to its original shell.

## how do I read logs?
 1. while in directory `/.docker/development` run `docker compose ps`
 2. note the name of the service you want to see the logs of
 3. while in directory `/.docker/development` run `docker compose logs <NAME>`. fill in the name of the service without the brackets.

## Exposed ports
 - http://localhost:8081 - backend API
 - http://localhost:8082 - postgres web UI
 - postgres://localhost:5432 - postgres
