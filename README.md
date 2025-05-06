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

1. Construisez l'image :
   ```
   docker build -t gzw-bot . 
   ```

2. Lancez le conteneur (remplacez les variables d'environnement) :
   ```
   docker run -e DISCORD_TOKEN=VOTRE_TOKEN_DISCORD -e MISTRAL_API_KEY=VOTRE_CLE_MISTRAL gzw-bot
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

## 📚 Commandes disponibles

| Commande                        | Description                                                      |
|----------------------------------|------------------------------------------------------------------|
| ⚡ `!steuff`                     | Astuces pour se steuffer rapidement                              |
| 💡 `!astuce <question>`          | Obtiens une astuce personnalisée                                 |
| 🗺️ `!map`                       | Lien vers une map interactive gratuite                           |
| 🤔 `!mistral <question>`         | Pose n'importe quelle question sur le jeu                        |
| 📜 `!quete <nom>`                | Toutes les astuces, vidéos, maps pour une quête                  |
| 📖 `!help`                       | Affiche le menu d’aide stylé                                     |
| 🚨 `!notify`                     | (Démo) Notification d'événement spécial                          |
| 📈 `!progress`                   | Affiche votre progression de quêtes                              |
| ➕ `!addprogress <quête>`         | Ajoute une quête à votre progression                             |
| 🏆 `!classement`                 | Affiche un classement fictif                                     |
| 🎯 `!suggestion <style>`         | Suggestion personnalisée selon votre style de jeu                |
| 🎫 `!ticket <problème>`          | Crée un ticket d'aide ou de bug                                  |
| 🤖 `!gpt <question>`             | (Démo) Intégration d'une autre IA                                |
| 🌐 `!lang <fr/en>`               | Change la langue du bot (démo)                                   |
| / `!slash`                       | Infos sur les commandes slash Discord                            |
| 🖼️ `!image`                     | Exemple de réponse enrichie avec image                           |
| 🎲 `!quiz`                       | Lance un mini-quiz                                               |
| ❓ `!reponse <réponse>`           | Répond au quiz                                                   |

---

## 🎨 Exemple de rendu

![Aperçu du bot](https://i.imgur.com/4M34hi2.png) <!-- Remplace par une capture réelle si possible -->

---

## 🔒 Sécurité

Pense à utiliser les variables d’environnement pour tes clés API.

## 🔑 Configuration des variables d’environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```
DISCORD_TOKEN=VOTRE_TOKEN_DISCORD
MISTRAL_API_KEY=VOTRE_CLE_MISTRAL
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
