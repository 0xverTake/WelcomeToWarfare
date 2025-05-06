require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

async function askMistral(prompt) {
    const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
            model: "mistral-tiny",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300
        },
        {
            headers: {
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data.choices[0].message.content;
}

client.on('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    client.user.setActivity('Gray Zone Warfare | !help', { type: 'PLAYING' });
});

// Stockage temporaire pour suivi de progression et tickets (à remplacer par une base de données pour production)
const userProgress = {};
const tickets = [];

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Commande !help : affiche une aide stylée
    if (message.content.startsWith('!help')) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🤖 Gray Zone Warfare Helper')
            .setDescription("Ton assistant ultime pour **Gray Zone Warfare** !\n\nDécouvre toutes les commandes disponibles ci-dessous :")
            .addFields(
                { name: '⚡ !steuff', value: 'Astuces pour se steuffer rapidement.' },
                { name: '💡 !astuce <question>', value: 'Obtiens une astuce personnalisée.' },
                { name: '🗺️ !map', value: 'Lien vers une map interactive gratuite.' },
                { name: '🤔 !mistral <question>', value: 'Pose n\'importe quelle question sur le jeu.' },
                { name: '📖 !help', value: 'Affiche ce menu d\'aide.' }
            )
            .setFooter({ text: 'Développé avec ❤️ et Mistral AI', iconURL: client.user.displayAvatarURL() })
            .setThumbnail('https://mapgenie.io/_nuxt/img/gray-zone-warfare-logo.3e7e6b6.png');
        message.reply({ embeds: [embed] });
        return;
    }

    // Commande pour astuces de steuff rapide
    if (message.content.startsWith('!steuff')) {
        const embed = new EmbedBuilder()
            .setColor(0x43B581)
            .setTitle('⚡ Astuces pour se steuffer rapidement')
            .setDescription('Voici quelques conseils pour optimiser ton équipement :\n*(générés par Mistral AI)*');
        const prompt = "Donne-moi des astuces pour se steuffer rapidement dans Gray Zone Warfare.";
        const reply = await askMistral(prompt);
        embed.addFields({ name: 'Conseils', value: reply });
        message.reply({ embeds: [embed] });
        return;
    }

    // Commande pour astuces diverses
    if (message.content.startsWith('!astuce')) {
        const question = message.content.replace('!astuce', '').trim();
        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle('💡 Astuce personnalisée')
            .setDescription(`Question : ${question || 'Aucune question précisée.'}`);
        const prompt = `Donne-moi une astuce pour Gray Zone Warfare : ${question}`;
        const reply = await askMistral(prompt);
        embed.addFields({ name: 'Astuce', value: reply });
        message.reply({ embeds: [embed] });
        return;
    }

    // Commande pour maps interactives gratuites
    if (message.content.startsWith('!map')) {
        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('🗺️ Map interactive gratuite')
            .setDescription('[Clique ici pour accéder à la map complète !](https://mapgenie.io/gray-zone-warfare/maps/lamang)')
            .setThumbnail('https://mapgenie.io/_nuxt/img/gray-zone-warfare-logo.3e7e6b6.png');
        message.reply({ embeds: [embed] });
        return;
    }

    // Commande générale pour demander à Mistral
    if (message.content.startsWith('!mistral')) {
        const question = message.content.replace('!mistral', '').trim();
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('🤔 Réponse de Mistral AI')
            .setDescription(`Question : ${question}`);
        const prompt = `Tu es un expert de Gray Zone Warfare. ${question}`;
        const reply = await askMistral(prompt);
        embed.addFields({ name: 'Réponse', value: reply });
        message.reply({ embeds: [embed] });
        return;
    }

    // Commande pour obtenir toutes les astuces sur une quête
    if (message.content.startsWith('!quete')) {
        const questName = message.content.replace('!quete', '').trim();
        if (!questName) {
            message.reply("❗ Merci d’indiquer le nom de la quête. Exemple : `!quete First Recon`");
            return;
        }
        const prompt = `
Tu es un expert de Gray Zone Warfare. Pour la quête "${questName}", donne :
- Un résumé de la quête
- Les meilleures astuces pour la réussir rapidement
- Un lien vers une vidéo utile (YouTube)
- Un lien vers la map interactive avec le ping de la zone concernée si possible
Présente la réponse de façon claire et structurée.
        `;
        const reply = await askMistral(prompt);

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle(`📜 Astuces pour la quête : ${questName}`)
            .setDescription(reply)
            .setFooter({ text: 'Gray Zone Warfare Quest Helper', iconURL: client.user.displayAvatarURL() });

        message.reply({ embeds: [embed] });
        return;
    }

    // Notifications automatiques (exemple de commande pour simuler une notification)
    if (message.content.startsWith('!notify')) {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('🚨 Notification spéciale')
            .setDescription('Un événement spécial ou une mise à jour vient d\'être annoncée !\n*Cette fonctionnalité peut être automatisée.*');
        message.channel.send({ embeds: [embed] });
        return;
    }

    // Suivi de progression (exemple de commande)
    if (message.content.startsWith('!progress')) {
        const progress = userProgress[message.author.id] || [];
        const embed = new EmbedBuilder()
            .setColor(0x27AE60)
            .setTitle('📈 Suivi de progression')
            .setDescription(progress.length > 0 ? progress.map(q => `- ${q}`).join('\n') : 'Aucune quête suivie.');
        message.reply({ embeds: [embed] });
        return;
    }
    if (message.content.startsWith('!addprogress')) {
        const quest = message.content.replace('!addprogress', '').trim();
        if (!quest) {
            message.reply('Merci de préciser la quête à ajouter.');
            return;
        }
        if (!userProgress[message.author.id]) userProgress[message.author.id] = [];
        userProgress[message.author.id].push(quest);
        message.reply(`Quête "${quest}" ajoutée à votre progression.`);
        return;
    }

    // Classement et statistiques (exemple statique)
    if (message.content.startsWith('!classement')) {
        const embed = new EmbedBuilder()
            .setColor(0x8E44AD)
            .setTitle('🏆 Classement des joueurs')
            .setDescription('1. PlayerA - 1200 pts\n2. PlayerB - 1100 pts\n3. PlayerC - 900 pts\n*À connecter à une vraie base de données/statistiques.*');
        message.reply({ embeds: [embed] });
        return;
    }

    // Suggestions personnalisées (exemple simple)
    if (message.content.startsWith('!suggestion')) {
        const style = message.content.replace('!suggestion', '').trim() || 'polyvalent';
        const prompt = `Donne-moi un conseil personnalisé pour un joueur de style "${style}" dans Gray Zone Warfare.`;
        const reply = await askMistral(prompt);
        const embed = new EmbedBuilder()
            .setColor(0x1ABC9C)
            .setTitle('🎯 Suggestion personnalisée')
            .setDescription(reply);
        message.reply({ embeds: [embed] });
        return;
    }

    // Système de tickets (création simple)
    if (message.content.startsWith('!ticket')) {
        const content = message.content.replace('!ticket', '').trim();
        if (!content) {
            message.reply('Merci de décrire votre problème ou demande.');
            return;
        }
        tickets.push({ user: message.author.tag, content });
        message.reply('Votre ticket a été enregistré. Un modérateur vous répondra bientôt.');
        return;
    }

    // Intégration d'autres IA (exemple de commande fictive)
    if (message.content.startsWith('!gpt')) {
        const question = message.content.replace('!gpt', '').trim();
        // Ici, on pourrait appeler une autre API IA, exemple fictif :
        message.reply('Fonctionnalité d\'intégration d\'autres IA à développer.');
        return;
    }

    // Support multilingue (exemple de commande)
    if (message.content.startsWith('!lang')) {
        const lang = message.content.replace('!lang', '').trim().toLowerCase();
        if (lang === 'en') {
            message.reply('Language set to English. (Feature to be fully implemented)');
        } else if (lang === 'fr') {
            message.reply('Langue définie sur le français. (Fonctionnalité à compléter)');
        } else {
            message.reply('Langue non reconnue. Utilisez `!lang fr` ou `!lang en`.');
        }
        return;
    }

    // Commandes slash (/) Discord : à implémenter avec discord.js v14+ (nécessite une autre structure)
    if (message.content.startsWith('!slash')) {
        message.reply('Les commandes slash (/) sont à activer via la configuration Discord et le code.');
        return;
    }

    // Réponses enrichies (exemple d’envoi d’image)
    if (message.content.startsWith('!image')) {
        const embed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setTitle('🖼️ Exemple d\'image')
            .setImage('https://mapgenie.io/_nuxt/img/gray-zone-warfare-logo.3e7e6b6.png');
        message.reply({ embeds: [embed] });
        return;
    }

    // Mini-jeux ou quiz (exemple simple)
    if (message.content.startsWith('!quiz')) {
        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('🎲 Mini-quiz Gray Zone Warfare')
            .setDescription('Quel est le nom de la première zone du jeu ?\nRépondez avec `!reponse <votre réponse>`');
        message.reply({ embeds: [embed] });
        return;
    }
    if (message.content.startsWith('!reponse')) {
        const answer = message.content.replace('!reponse', '').trim().toLowerCase();
        if (answer === 'lamang') {
            message.reply('Bonne réponse ! 🎉');
        } else {
            message.reply('Mauvaise réponse, essayez encore !');
        }
        return;
    }

    // Logs et analytics (exemple de log console)
    console.log(`[LOG] ${message.author.tag} a utilisé : ${message.content}`);
});

client.login(DISCORD_TOKEN);
