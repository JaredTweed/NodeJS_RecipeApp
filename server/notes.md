## Setup

Install docker, postgreSQL, and node.js

Add `C:\Program Files\PostgreSQL\<version>\bin` as a path in your PC's environment variables.

If necessary, open pgAdmin from you desktop.

### JSON setup for project creation:

```
npm init
npm i express pg cors
```

## Run The Program

### Run the docker instructions:

```powershell
docker-compose build --no-cache # This line is not always necessary, but can prevent errors
docker compose up
```

Download and open Postman. Create a new http workspace. From this workspace, send GET `http://localhost:8081/recipes` to access the database. Input `{"title":"Butter Chicken", "ingredients":"Butter and chicken", "directions":"Cook it!"}` into the body in raw JSON format then send POST `http://localhost:8081/recipes` to add it to the database. Send DELETE `http://localhost:8081/recipes/<recipe_id>` to delete that recipe. Send PUT `http://localhost:8081/recipes/<recipe_id>` with a new JSON recipe to update the recipe in the database.

If you already have container running on a port, your GET, POST, DELETE, and PUT commands will return an error, and you will need to delete the other container using the same port from the docker application. (This is likely to happen if you rename container). Sometimes you need to open your docker and manually click the play button to get it to run. Often errors are resolved by restarting docker.

### Run the application:

```powershell
node index.js
```

Open http://localhost:8081/ in the browser.

Delete the node_modules folder if desired.

## Check the database in a seperate powershell terminal:

```powershell
psql -h localhost -U postgres -p 4444
root # This is the password.
\dt # This is the datatable.
```