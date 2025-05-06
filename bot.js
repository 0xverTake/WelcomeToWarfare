require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID; // Ajoutez votre client ID dans .env
const GUILD_ID = process.env.GUILD_ID;   // Ajoutez votre guild ID dans .env (pour test rapide)

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
        console.error(error);
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
        embed.addFields([{ name: 'Conseils', value: reply }]);
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
        embed.addFields([{ name: 'Astuce', value: reply }]);
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
        embed.addFields([{ name: 'Réponse', value: reply }]);
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
            .setDescription(reply)
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
    // ...ajoutez d'autres commandes slash ici...
});

client.login(DISCORD_TOKEN);
