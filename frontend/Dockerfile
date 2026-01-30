# Utiliser Node.js
FROM node:20-slim

WORKDIR /app

# Copier uniquement les fichiers de dépendances pour mettre en cache cette étape
COPY package.json package-lock.json* /app/

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . /app/

# Exposer le port de développement de Vite ou Create React App
EXPOSE 5173

# Lancer l'application
CMD ["npm", "dev", "run"]