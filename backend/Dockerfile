# Étape 1 : base image
FROM node:18-alpine

# Étape 2 : dossier de travail
WORKDIR /app

# Étape 3 : installer curl pour le healthcheck
RUN apk add --no-cache curl

# Étape 4 : copier les fichiers de dépendances
COPY package*.json ./

# Étape 5 : installer les dépendances
RUN npm install --only=production

# Étape 6 : copier le reste des fichiers
COPY . .

# Étape 7 : créer un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Étape 8 : exposer port
EXPOSE 5000

# Étape 9 : lancer l'app
CMD ["node", "server.js"]
