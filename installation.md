# 🚀 Installation Party Hoster

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- MySQL (Laragon, XAMPP, ou MySQL natif)
- Git

## 🗄️ 1. Installation de la base de données

- Créer une base de données nommée `reservations_salles` dans votre serveur MySQL
- Importer le fichier `reservations_salles.sql` situé à la racine du projet

## 💻 2. Installation depuis GitHub

### Méthode recommandée : Git Clone

```bash
# Cloner le dépôt depuis GitHub
git clone git@github.com:kelfaoui/Party_Hoster_APP.git

# Entrer dans le dossier du projet
cd Party_Hoster_APP
```

### Alternative : Téléchargement direct

- Télécharger le ZIP depuis GitHub
- Extraire le contenu du fichier `party_hoster.zip`
- Dans le dossier extrait, vous trouverez deux dossiers : `/frontend` et `/backend`

## 🔧 3. Installation des dépendances

### Backend
```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Démarrer le serveur backend
npm start
```
Le backend démarrera sur `http://localhost:5000`

### Frontend
```bash
# Ouvrir un nouveau terminal
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur frontend
npm run dev
```
Le frontend démarrera sur `http://localhost:5173`

## 🌐 4. Accès à l'application

- **Frontend** : http://localhost:5173
- **API Backend** : http://localhost:5000
- **Documentation API** : http://localhost:5000/api-docs

## 👤 5. Comptes de démonstration

### Utilisateurs disponibles pour tester :

**Administrateur**
- Email : kelfaoui@email.com
- Mot de passe : 123456Ab#

**Propriétaire**
- Email : gabriel@email.com  
- Mot de passe : 123456Ab#

**Client**
- Email : oussamaHadjFekhar@gmail.com
- Mot de passe : 123456Ab#


## 🔍 6. Vérification de l'installation

1. **Backend** : Visitez `http://localhost:5000/health` - devrait retourner `{"status":"OK"}`
2. **Frontend** : Visitez `http://localhost:5173` - devrait afficher la page d'accueil
3. **API Docs** : Visitez `http://localhost:5000/api-docs` - documentation Swagger
