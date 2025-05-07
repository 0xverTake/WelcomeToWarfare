const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const icons = {
  info: 'ℹ️',
  success: '✅',
  error: '❌',
  warn: '⚠️',
  docker: '🐳',
  node: '🟩',
  clean: '🧹',
  rocket: '🚀',
  question: '❓',
  step: '➡️',
  done: '🏁'
};

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  bold: "\x1b[1m"
};

function log(type, msg, color = null) {
  const c = color ? colors[color] : '';
  console.log(`${c}${icons[type] || ''} ${msg}${colors.reset}`);
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(colors.cyan + question + colors.reset, ans => { rl.close(); resolve(ans.trim()); }));
}

function printTitle() {
  console.log(colors.magenta + colors.bold +
    `\n${icons.rocket} Gray Zone Warfare Bot - Installation ${icons.rocket}\n` +
    colors.reset);
}

async function main() {
  printTitle();

  // Nettoyage
  const clean = (await ask(`${icons.clean} Nettoyer node_modules et images Docker inutilisées ? (y/N) `)).toLowerCase() === 'y';
  if (clean) {
    try {
      log('clean', 'Suppression de node_modules...', 'yellow');
      execSync('rm -rf node_modules', { stdio: 'ignore' });
      log('clean', 'Suppression des images Docker non utilisées...', 'yellow');
      execSync('docker system prune -af', { stdio: 'ignore' });
      log('success', 'Nettoyage terminé.', 'green');
    } catch (e) {
      log('warn', 'Nettoyage partiel ou Docker non installé.', 'yellow');
    }
  }

  // Dépendances Node.js
  const installNode = (await ask(`${icons.node} Installer/mettre à jour les dépendances Node.js ? (Y/n) `)).toLowerCase() !== 'n';
  if (installNode) {
    try {
      log('node', 'Installation des dépendances...', 'blue');
      execSync('npm install', { stdio: 'inherit' });
      log('success', 'Dépendances Node.js installées.', 'green');
    } catch (e) {
      log('error', 'Erreur lors de l\'installation des dépendances Node.js.', 'red');
      process.exit(1);
    }
  }

  // Vérification .env
  if (!fs.existsSync('.env')) {
    log('warn', 'Fichier .env manquant. Création...', 'yellow');
    fs.writeFileSync('.env',
      'DISCORD_TOKEN=\n' +
      'MISTRAL_API_KEY=\n' +
      'CLIENT_ID=\n' +
      'GUILD_ID=\n' +
      'YOUTUBE_API_KEY=\n'
    );
    log('info', 'Merci de compléter le fichier .env avec vos clés.', 'cyan');
  } else {
    // Vérifie que toutes les variables sont présentes, sinon les ajoute
    const envContent = fs.readFileSync('.env', 'utf8');
    const requiredVars = [
      'DISCORD_TOKEN',
      'MISTRAL_API_KEY',
      'CLIENT_ID',
      'GUILD_ID',
      'YOUTUBE_API_KEY'
    ];
    let updated = false;
    requiredVars.forEach(v => {
      if (!envContent.includes(v + '=')) {
        fs.appendFileSync('.env', `${v}=\n`);
        updated = true;
      }
    });
    if (updated) log('info', 'Variables manquantes ajoutées au .env.', 'cyan');
    else log('info', 'Fichier .env détecté et complet.', 'cyan');
  }

  // Docker ou Node.js natif
  const docker = (await ask(`${icons.docker} Utiliser Docker pour lancer le bot ? (Y/n) `)).toLowerCase() !== 'n';
  if (docker) {
    try {
      log('docker', 'Construction de l\'image Docker...', 'blue');
      execSync('docker build -t gzw-bot .', { stdio: 'inherit' });
      log('docker', 'Suppression d\'un ancien conteneur (si existant)...', 'yellow');
      try { execSync('docker rm -f gzw-bot', { stdio: 'ignore' }); } catch {}
      log('docker', 'Lancement du conteneur Docker...', 'blue');
      // Utilise --env-file pour passer toutes les variables
      execSync(
        `docker run -d --name gzw-bot --env-file .env gzw-bot`,
        { stdio: 'inherit' }
      );
      log('success', 'Bot lancé dans Docker !', 'green');
      log('info', `Voir les logs : ${colors.bold}docker logs -f gzw-bot${colors.reset}`, 'cyan');
    } catch (e) {
      log('error', 'Erreur lors du build ou du lancement Docker.', 'red');
      process.exit(1);
    }
  } else {
    const run = (await ask(`${icons.rocket} Lancer le bot en local (node bot.js) ? (Y/n) `)).toLowerCase() !== 'n';
    if (run) {
      log('rocket', 'Lancement du bot en local...', 'blue');
      execSync('node bot.js', { stdio: 'inherit' });
    } else {
      log('done', 'Installation terminée. Lancez le bot quand vous le souhaitez.', 'green');
    }
  }
}

main();
