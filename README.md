# mds_backend
## Technologies utilisées :
Node.js , Express, Sql

## Pré-requis pour lancer le projet :
- Installer node v18.13.0 & npm v8.19.3 :
  - https://nodejs.org/en/download (installe node et node package manager => npm)
- Facultatif :
  -  Installer nodemon local ou global:
  -  local : npm install --save-dev nodemon
  -  global : npm install -g nodemon
## Créer la database: 
1. Lancer MAMP
2. Créer la base de données à l'aide de l'export database.sql
Attention: Le projet fonctionnera uniquement si la base de donnée est lancée via MAMP
## Pour installer le projet :
1. Cloner le repository
2. Effectuer la commande npm install dans le répertoire principal pour installer toutes les dépendances
3. Renommer le fichier .env.example se trouvant dans le dossier config en fichier .env et renseigner :
  - DATABASE_USER = userName MongoDb => ne rien renseigné le projet fonctionnera uniquement via mysql
  - DATABASE_PASSWORD = MDP MongoDb => ne rien renseigné le projet fonctionnera uniquement via mysql
  - DB_USER = userName mySQL
  - DB_TYPE = mysql
  - DB_PASSWORD = MDP mySQL
  - PORT = 3000
  - DATABASE_PORT = port mysql DB
  - DATABASE_HOST = adresse IP mysql DB
  - DATABASE_NAME = nom mysql DB
  - OPENAI_API_KEY = votre clé API OPENAI
  - STABLE_API_KEY = votre clé STABLE DIFFUSION
  - HOST = http://localhost:3000
  - OPENAI_MODEL = openAI model fourni
  - TOKEN_SECRET = token secret key fournie
## Lancer le projet :
- Lancer le server via la commande 'node server' via la commande 'nodemon server' si vous avez installé nodemon
## Tester le projet :
- Pour tester le projet vous pouvez utiliser postman ou insomnia
