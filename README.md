# StudyBuddy (SIT725 8.2HD - Docker)

A Node.js, Express and MongoDB app with user register/login and subjects. The whole app (server and database) runs in Docker.

**Student:** Yousuf Sinha (s226032987)

## What you need

- Docker Desktop (or Docker Engine with Docker Compose), installed and running
- Git (to clone the repo)

## How to run

1. Clone the repo:

   git clone https://github.com/sinha105654/725_8.1hd.git
   cd 725_8.1hd

2. Create the settings file by copying the template.

   Mac / Linux:

   cp .env.example .env

   Windows (Command Prompt):

   copy .env.example .env

   No edits are needed. The template already has a working SESSION_SECRET. The database address is set inside docker-compose.yml, so nothing else is required.

3. Build and start everything:

   docker compose up --build

4. Wait until you see these two lines in the terminal:

   MongoDB connected successfully
   Server running on http://localhost:3000

5. Open the app in your browser:

   http://localhost:3000

To stop the app, press Ctrl + C, then run:

docker compose down

## Port

The app runs on **port 3000**: http://localhost:3000

## Student endpoint

Open: http://localhost:3000/api/student

It returns:

{
  "name": "Yousuf Sinha",
  "studentId": "s226032987"
}

## How to check the database works

1. Go to http://localhost:3000/register
2. Register with any email and password.
3. Go to http://localhost:3000/login and log in with the same details.
4. You will be taken to the subjects page. This works only if MongoDB is connected, because the user is saved in and read from the database.

## Configuration and secrets

- The real `.env` file is not stored in the repo (it is in .gitignore).
- `.env.example` is included with a sample SESSION_SECRET so the marker can run the app without asking me for anything.
- No passwords or private keys are used. MongoDB runs inside Docker with no outside access.

## What is in the Docker setup

- Dockerfile: builds the Node.js app
- docker-compose.yml: starts the app and a MongoDB database together and connects them
- .dockerignore: keeps unneeded files out of the container
