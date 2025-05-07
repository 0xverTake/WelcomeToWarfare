require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const axios = require('axios');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Vérification des variables d'environnement critiques
if (!DISCORD_TOKEN || !MISTRAL_API_KEY || !CLIENT_ID || !GUILD_ID) {
    console.error("❌ Une ou plusieurs variables d'environnement sont manquantes (.env). Vérifiez DISCORD_TOKEN, MISTRAL_API_KEY, CLIENT_ID, GUILD_ID.");
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function askMistral(prompt) {
    try {
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
    } catch (err) {
        console.error("Erreur lors de l'appel à Mistral:", err?.response?.data || err.message);
        return "❌ Impossible d'obtenir une réponse de l'IA pour le moment.";
    }
}

// Utilitaire pour tronquer à 1024 caractères (Discord embed field limit)
function truncateField(text) {
    if (!text) return '';
    return text.length > 1024 ? text.slice(0, 1021) + '...' : text;
}

// Enregistrement des slash commands
const commands = [
    new SlashCommandBuilder().setName('help').setDescription('Affiche le menu d\'aide'),
    new SlashCommandBuilder().setName('steuff').setDescription('Astuces pour se steuffer rapidement'),
    new SlashCommandBuilder().setName('astuce').setDescription('Obtiens une astuce personnalisée').addStringOption(opt => opt.setName('question').setDescription('Ta question').setRequired(false)),
    new SlashCommandBuilder().setName('map').setDescription('Lien vers une map interactive gratuite'),
    new SlashCommandBuilder().setName('mistral').setDescription('Pose une question sur le jeu').addStringOption(opt => opt.setName('question').setDescription('Ta question').setRequired(true)),
    new SlashCommandBuilder().setName('quete').setDescription('Astuces pour une quête').addStringOption(opt => opt.setName('nom').setDescription('Nom de la quête').setRequired(true)),
    new SlashCommandBuilder().setName('serveur').setDescription('Affiche le statut des serveurs Gray Zone Warfare'),
    new SlashCommandBuilder().setName('conseil').setDescription('Affiche un conseil du jour pour progresser'),
    new SlashCommandBuilder().setName('notify')
        .setDescription('Envoie une notification spéciale à tout le monde')
        .addStringOption(opt => opt.setName('message').setDescription('Message à notifier').setRequired(true)),
    new SlashCommandBuilder().setName('progress')
        .setDescription('Affiche votre progression de quêtes'),
    new SlashCommandBuilder().setName('addprogress')
        .setDescription('Ajoute une quête à votre progression')
        .addStringOption(opt => opt.setName('quete').setDescription('Nom de la quête').setRequired(true)),
    new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Obtiens un conseil personnalisé selon ton style de jeu')
        .addStringOption(opt => opt.setName('style').setDescription('Ton style de jeu (ex: sniper, assaut, soutien, etc.)').setRequired(false)),
    new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Affiche les 3 dernières vidéos Gray Zone Warfare sur YouTube'),
    new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Affiche les 3 derniers posts du subreddit GrayZoneWarfare'),
    // Ajoutez d'autres commandes ici si besoin
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Slash commands enregistrées.');
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des commandes slash:", error?.response?.data || error);
        process.exit(1);
    }
})();

client.on('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    client.user.setActivity('Gray Zone Warfare | /help', { type: 'PLAYING' });
});

// Stockage temporaire pour suivi de progression et tickets (à remplacer par une base de données pour production)
const userProgress = {};
const tickets = [];

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    try {
        if (interaction.commandName === 'help') {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('🤖 Gray Zone Warfare Helper')
                .setDescription("Ton assistant ultime pour **Gray Zone Warfare** !\n\nDécouvre toutes les commandes disponibles ci-dessous :")
                .addFields(
                    { name: '/steuff', value: 'Astuces pour se steuffer rapidement.' },
                    { name: '/astuce', value: 'Obtiens une astuce personnalisée.' },
                    { name: '/map', value: 'Lien vers une map interactive gratuite.' },
                    { name: '/mistral', value: 'Pose n\'importe quelle question sur le jeu.' },
                    { name: '/help', value: 'Affiche ce menu d\'aide.' }
                )
                .setFooter({ text: 'Développé avec ❤️ et Mistral AI', iconURL: client.user.displayAvatarURL() })
                .setThumbnail('https://mapgenie.io/_nuxt/img/gray-zone-warfare-logo.3e7e6b6.png');
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.commandName === 'steuff') {
            const embed = new EmbedBuilder()
                .setColor(0x43B581)
                .setTitle('⚡ Astuces pour se steuffer rapidement')
                .setDescription('Voici quelques conseils pour optimiser ton équipement :\n*(générés par Mistral AI)*');
            const prompt = "Donne-moi des astuces pour se steuffer rapidement dans Gray Zone Warfare.";
            const reply = await askMistral(prompt);
            embed.addFields([{ name: 'Conseils', value: truncateField(reply) }]);
            await interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'astuce') {
            const question = interaction.options.getString('question') || '';
            const embed = new EmbedBuilder()
                .setColor(0xF1C40F)
                .setTitle('💡 Astuce personnalisée')
                .setDescription(`Question : ${question || 'Aucune question précisée.'}`);
            const prompt = `Donne-moi une astuce pour Gray Zone Warfare : ${question}`;
            const reply = await askMistral(prompt);
            embed.addFields([{ name: 'Astuce', value: truncateField(reply) }]);
            await interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'map') {
            const embed = new EmbedBuilder()
                .setColor(0x7289DA)
                .setTitle('🗺️ Map interactive gratuite')
                .setDescription('[Clique ici pour accéder à la map complète !](https://mapgenie.io/gray-zone-warfare/maps/lamang)')
                .setThumbnail('https://mapgenie.io/_nuxt/img/gray-zone-warfare-logo.3e7e6b6.png');
            await interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'mistral') {
            const question = interaction.options.getString('question');
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('🤔 Réponse de Mistral AI')
                .setDescription(`Question : ${question}`);
            const prompt = `Tu es un expert de Gray Zone Warfare. ${question}`;
            const reply = await askMistral(prompt);
            embed.addFields([{ name: 'Réponse', value: truncateField(reply) }]);
            await interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'quete') {
            const questName = interaction.options.getString('nom');
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
                .setDescription(truncateField(reply))
                .setFooter({ text: 'Gray Zone Warfare Quest Helper', iconURL: client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'serveur') {
            // Remplacez ce bloc par un appel API réel si disponible
            const status = '🟢 En ligne\nJoueurs connectés : 1234\nDernière mise à jour : il y a 5 min';
            const embed = new EmbedBuilder()
                .setColor(0x2ECC71)
                .setTitle('🌐 Statut des serveurs Gray Zone Warfare')
                .setDescription(status);
            await interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'conseil') {
            // Liste d’astuces, à enrichir
            const conseils = [
                "Explore chaque bâtiment, même les plus petits, pour trouver du loot caché.",
                "Utilise la map interactive pour planifier tes déplacements.",
                "Garde toujours des soins rapides dans ton inventaire.",
                "Travaille en équipe pour sécuriser les zones dangereuses.",
                "Vends les objets inutiles pour acheter de l’équipement rare."
            ];
            const conseil = conseils[Math.floor(Math.random() * conseils.length)];
            const embed = new EmbedBuilder()
                .setColor(0xF39C12)
                .setTitle('💡 Conseil du jour')
                .setDescription(conseil);
            await interaction.reply({ embeds: [embed] });
        }

        // Notification automatique (admin seulement, exemple)
        if (interaction.commandName === 'notify') {
            // Vérifie la permission administrateur (Discord.js v14)
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await interaction.reply({ content: "Vous n'avez pas la permission d'envoyer une notification.", ephemeral: true });
                return;
            }
            const notifMsg = interaction.options.getString('message');
            if (!notifMsg || notifMsg.length > 1800) {
                await interaction.reply({ content: "Le message est vide ou trop long (max 1800 caractères).", ephemeral: true });
                return;
            }
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🚨 Notification spéciale')
                .setDescription(notifMsg);
            await interaction.reply({ content: 'Notification envoyée !', ephemeral: true });
            await interaction.channel.send({ embeds: [embed] });
        }

        // Suivi de progression - voir sa progression
        if (interaction.commandName === 'progress') {
            const progress = userProgress[interaction.user.id] || [];
            let desc = progress.length > 0 ? progress.map(q => `- ${q}`).join('\n') : 'Aucune quête suivie.';
            // Discord limite à 4096 caractères pour description d'embed
            if (desc.length > 4000) desc = desc.slice(0, 3997) + '...';
            const embed = new EmbedBuilder()
                .setColor(0x27AE60)
                .setTitle('📈 Suivi de progression')
                .setDescription(desc);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Suivi de progression - ajouter une quête
        if (interaction.commandName === 'addprogress') {
            const quest = interaction.options.getString('quete');
            if (!userProgress[interaction.user.id]) userProgress[interaction.user.id] = [];
            if (userProgress[interaction.user.id].includes(quest)) {
                await interaction.reply({ content: `La quête "${quest}" est déjà dans votre progression.`, ephemeral: true });
                return;
            }
            userProgress[interaction.user.id].push(quest);
            await interaction.reply({ content: `Quête "${quest}" ajoutée à votre progression.`, ephemeral: true });
        }

        if (interaction.commandName === 'suggestion') {
            const style = interaction.options.getString('style') || 'polyvalent';
            const prompt = `Donne-moi un conseil personnalisé pour un joueur de style "${style}" dans Gray Zone Warfare.`;
            const reply = await askMistral(prompt);
            const embed = new EmbedBuilder()
                .setColor(0x1ABC9C)
                .setTitle('🎯 Suggestion personnalisée')
                .setDescription(truncateField(reply));
            await interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'youtube') {
            if (!YOUTUBE_API_KEY) {
                await interaction.reply({ content: "Clé API YouTube manquante dans `.env`.", ephemeral: true });
                return;
            }
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=Gray%20Zone%20Warfare&key=${YOUTUBE_API_KEY}&order=date`;
            try {
                const res = await axios.get(url);
                const items = res.data.items || [];
                if (items.length === 0) {
                    await interaction.reply({ content: "Aucune vidéo trouvée.", ephemeral: true });
                    return;
                }
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🎬 Dernières vidéos YouTube - Gray Zone Warfare');
                items.forEach(video => {
                    embed.addFields({
                        name: truncateField(video.snippet.title),
                        value: truncateField(`[Voir la vidéo](https://www.youtube.com/watch?v=${video.id.videoId})\n${video.snippet.channelTitle}`)
                    });
                });
                await interaction.reply({ embeds: [embed] });
            } catch (e) {
                await interaction.reply({ content: "Erreur lors de la récupération des vidéos YouTube.", ephemeral: true });
            }
        }

        if (interaction.commandName === 'reddit') {
            try {
                const res = await axios.get('https://www.reddit.com/r/GrayZoneWarfare/new.json?limit=3', {
                    headers: { 'User-Agent': 'GrayZoneWarfareBot/1.0' }
                });
                const posts = res.data.data.children || [];
                if (posts.length === 0) {
                    await interaction.reply({ content: "Aucun post trouvé.", ephemeral: true });
                    return;
                }
                const embed = new EmbedBuilder()
                    .setColor(0xFF5700)
                    .setTitle('📰 Derniers posts Reddit - r/GrayZoneWarfare');
                posts.forEach(post => {
                    embed.addFields({
                        name: truncateField(post.data.title),
                        value: truncateField(`[Voir le post](https://reddit.com${post.data.permalink}) • 👍 ${post.data.ups} • 💬 ${post.data.num_comments}`)
                    });
                });
                await interaction.reply({ embeds: [embed] });
            } catch (e) {
                await interaction.reply({ content: "Erreur lors de la récupération des posts Reddit.", ephemeral: true });
            }
        }
        // ...ajoutez d'autres commandes slash ici...
    } catch (err) {
        console.error("Erreur lors du traitement d'une interaction:", err);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "❌ Une erreur est survenue lors du traitement de la commande.", ephemeral: true });
        } else {
            await interaction.reply({ content: "❌ Une erreur est survenue lors du traitement de la commande.", ephemeral: true });
        }
    }
});

client.login(DISCORD_TOKEN);
