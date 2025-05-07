# 🤖 Gray Zone Warfare Discord Bot

Ton assistant intelligent pour **Gray Zone Warfare** !  
Obtiens des astuces, des conseils, des maps interactives et bien plus grâce à l’IA Mistral.

---

## ✨ Fonctionnalités

- **Astuces pour se steuffer rapidement**
- **Conseils personnalisés**
- **Maps interactives gratuites**
- **Réponses IA sur tout le jeu**
- **Menu d’aide stylé**

---

## 🛠️ Installation

### Avec Node.js

1. Installez les dépendances :
   ```
   npm install discord.js axios
   ```

2. Remplacez `VOTRE_TOKEN_DISCORD` et `VOTRE_CLE_MISTRAL` dans `bot.js` par vos clés respectives.

3. Lancez le bot :
   ```
   node bot.js
   ```

### Avec Docker

1. Construisez l'image Docker (à la racine du projet) :
   ```
   docker build -t gzw-bot .
   ```

2. Lancez le conteneur avec vos variables d'environnement :
   ```
   docker run -d --name gzw-bot \
     -e DISCORD_TOKEN=VOTRE_TOKEN_DISCORD \
     -e MISTRAL_API_KEY=VOTRE_CLE_MISTRAL \
     -e CLIENT_ID=VOTRE_CLIENT_ID_DISCORD \
     -e GUILD_ID=VOTRE_GUILD_ID_DISCORD \
     -e YOUTUBE_API_KEY=VOTRE_CLE_API_YOUTUBE \
     gzw-bot
   ```

3. Pour voir les logs du bot :
   ```
   docker logs -f gzw-bot
   ```

4. Pour arrêter et supprimer le conteneur :
   ```
   docker stop gzw-bot && docker rm gzw-bot
   ```

---

## ⚡ Installation automatisée

Vous pouvez utiliser le script interactif pour tout installer, nettoyer et lancer :

```bash
node install-helper.js
```

Ce script vous guide pour :
- Nettoyer les fichiers inutiles et images Docker
- Installer les dépendances Node.js
- Construire et lancer le bot avec Docker ou Node.js
- Afficher des logs clairs avec des icônes

---

## ⚡ Installation automatisée et assistée

Lancez ce script pour tout gérer simplement :

```bash
node install-helper.js
```

- Nettoyage automatique (node_modules, Docker)
- Installation des dépendances
- Création du fichier `.env` si besoin
- Build et lancement Docker **ou** lancement Node.js natif
- Logs colorés et icônes pour chaque étape

---

### ❗ Dépannage : Erreur de variables d'environnement

Si vous voyez une erreur du type :
```
❌ Une ou plusieurs variables d'environnement sont manquantes (.env). Vérifiez DISCORD_TOKEN, MISTRAL_API_KEY, CLIENT_ID, GUILD_ID.
```
ou
```
TokenInvalid / 401 Unauthorized
```
**Vérifiez les points suivants :**
- Le fichier `.env` est bien à la racine du projet (même dossier que `bot.js`).
- Chaque variable est bien renseignée, sans espace ni guillemet autour du `=`.
- Si vous utilisez Docker, les variables doivent être passées explicitement avec `-e` ou présentes dans le `.env` copié dans l'image.
- Redémarrez le bot après toute modification du `.env`.
- Pour Docker, si vous modifiez `.env`, il faut reconstruire l'image ou relancer le conteneur avec les bonnes variables.

**Exemple de contenu correct :**
```
DISCORD_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MISTRAL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_ID=123456789012345678
GUILD_ID=123456789012345678
YOUTUBE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Si le problème persiste, affichez les variables d'environnement dans le code avant le lancement du bot pour vérifier leur chargement.

---

## 📚 Commandes disponibles

| Commande                        | Description                                                       |
|-----------------------------------|-----------------------------------------------------------------|
| ⚡ `/steuff`                     | Astuces pour se steuffer rapidement                              |
| 💡 `/astuce [question]`          | Obtiens une astuce personnalisée                                 |
| 🗺️ `/map`                        | Lien vers une map interactive gratuite                           |
| 🤔 `/mistral <question>`         | Pose n'importe quelle question sur le jeu                        |
| 📜 `/quete <nom>`                | Toutes les astuces, vidéos, maps pour une quête                  |
| 📖 `/help`                       | Affiche le menu d’aide stylé                                     |
| 🌐 `/serveur`                    | Statut des serveurs en temps réel                                |
| 💡 `/conseil`                    | Conseil du jour aléatoire                                        |
| 🔔 `/notify <message>`           | Notification spéciale (admin)                                    |
| 📈 `/progress`                   | Affiche votre progression de quêtes                              |
| ➕ `/addprogress <quête>`         | Ajoute une quête à votre progression                             |
| 🎯 `/suggestion [style]`         | Conseil personnalisé selon votre style de jeu                    |
| 🎬 `/youtube`                    | 3 dernières vidéos Gray Zone Warfare sur YouTube                 |
| 📰 `/reddit`                     | 3 derniers posts du subreddit r/GrayZoneWarfare                  |
|------------------------------------------------------------------------------------------------------|

---

## 🎨 Exemple de rendu

![Aperçu du bot](https://imgur.com/a/ZzyWdr7)

---

## 🔒 Sécurité

Pense à utiliser les variables d’environnement pour tes clés API.

## 🔑 Configuration des variables d’environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```
DISCORD_TOKEN=VOTRE_TOKEN_DISCORD
MISTRAL_API_KEY=VOTRE_CLE_MISTRAL
CLIENT_ID=VOTRE_CLIENT_ID_DISCORD
GUILD_ID=VOTRE_GUILD_ID_DISCORD
YOUTUBE_API_KEY=VOTRE_CLE_API_YOUTUBE
```

---

## 🚀 Idées d'améliorations et fonctionnalités avancées

- **Notifications automatiques** : Alerte lors d'événements spéciaux ou de mises à jour du jeu.
- **Suivi de progression** : Permettre aux utilisateurs de suivre l'avancement de leurs quêtes.
- **Classement et statistiques** : Afficher les meilleurs joueurs ou les statistiques de la communauté.
- **Suggestions personnalisées** : Conseils adaptés au style de jeu ou à la faction de l'utilisateur.
- **Système de tickets** : Pour demander de l'aide ou signaler un bug directement sur le serveur.
- **Intégration d'autres IA** : Ajouter d'autres modèles ou sources d'astuces.
- **Support multilingue** : Réponses en plusieurs langues selon la préférence de l'utilisateur.
- **Commandes slash (/) Discord** : Pour une expérience utilisateur moderne et intuitive.
- **Réponses enrichies** : Images, vidéos, liens cliquables, et pings de zones sur la map.
- **Mini-jeux ou quiz** : Pour animer la communauté autour de Gray Zone Warfare.
- **Logs et analytics** : Suivi de l'utilisation du bot et des commandes les plus populaires.

N'hésitez pas à proposer d'autres idées ou à contribuer !

---

## ❤️ Développé avec Discord.js & Mistral AI

## 📝 Description pour Discord

Un assistant intelligent pour **Gray Zone Warfare** sur Discord !  
Obtenez des astuces, conseils personnalisés, maps interactives, statut serveur, et bien plus grâce à l’IA Mistral.  
Utilisez simplement les commandes slash `/` pour interagir avec le bot.

## 🖥️ Panel info sur le bot

- **Nom** : Gray Zone Warfare Helper
- **Fonctionnalités principales** :
  - Astuces et conseils IA pour progresser dans le jeu
  - Statut des serveurs en temps réel
  - Map interactive accessible rapidement
  - Conseils du jour et aide personnalisée
  - Interface moderne avec commandes slash Discord
- **Technos** : Node.js, discord.js, Mistral AI, Docker-ready
