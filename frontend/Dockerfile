# Étape 1 : utiliser node pour build
FROM node:18-alpine as builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers
COPY . .

# Build l'application
RUN npm run build

# Étape 2 : utiliser nginx pour servir
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Créer les répertoires nécessaires et définir les permissions
RUN mkdir -p /var/cache/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/run \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# Passer à l'utilisateur non-root
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
