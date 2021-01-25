# preguntify  👩🏻‍💻 
Final project for Hack a Boss bootcamp. Preguntify is an API web where you can consult experts for programming questions. Registered users have access to the experts' answers and can also post their own questions.
### Download and install node modules
```
npm install
```
### Create a new mysql database
_Run mysql with your user and password
```
mysql -u user -p
```
_Create project_preguntify database
```
CREATE DATABASE IF NOT EXISTS preguntify_project character set="utf8mb4" collate="utf8mb4_unicode_ci";
```
### Configure an env file
```
PORT=
MYSQL_HOST=localhost
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=project_preguntify
SECRET=mysecret
DEFAULT_ADMIN_PASSWORD=contra123
PUBLIC_DOMAIN=localhost:
EMAIL_API_KEY=
```
### How to install
```
node initDatabase.js
```
### How to run the project
```
node index.js
```
### Ready!
