// index.js – mit Konfigurationsdatei
import { createInterface } from 'readline';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// Unterstützte Sprachen
const validLanguages = ['de', 'en', 'es', 'fr'];
const greetings = {
  de: (name) => chalk.green(`Hallo ${name}!`),
  en: (name) => chalk.blue(`Hello ${name}!`),
  es: (name) => chalk.yellow(`¡Hola ${name}!`),
  fr: (name) => chalk.magenta(`Bonjour ${name}!`),
};

// Pfad zur Konfigurationsdatei
const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.hallo.json');

// Hilfetext
const helpText = `
${chalk.bold('hallo [Optionen]')}

${chalk.underline('Optionen:')}
  --name, -n <Name>     Dein Name (optional, wird sonst abgefragt)
  --language, -l <Sprache>  Sprache wählen: ${validLanguages.join(', ')}
  --version             Zeigt die Version an
  --help, -h            Zeigt diese Hilfe an
  --save-config         Speichert die aktuelle Sprache als Standard

${chalk.underline('Beispiele:')}
  hallo --name Max
  hallo -n Max -l en --save-config   # speichert "en" als Standard
  hallo --help
`;

const args = process.argv.slice(2);

// --help
if (args.includes('--help') || args.includes('-h')) {
  console.log(helpText.trim());
  process.exit(0);
}

// --version
if (args.includes('--version')) {
  const version = process.env.npm_package_version || '1.0.5';
  console.log(chalk.cyan(`hallo v${version}`));
  process.exit(0);
}

// Funktion: Wert nach Option extrahieren
function getValueAfterOption(options, args) {
  for (const option of options) {
    const index = args.indexOf(option);
    if (index !== -1 && args[index + 1] && !args[index + 1].startsWith('-')) {
      return args[index + 1];
    }
    const longForm = args.find(arg => arg.startsWith(`${option}=`));
    if (longForm) {
      return longForm.split('=', 2)[1];
    }
  }
  return null;
}

// Lies Konfiguration (falls vorhanden)
let defaultLanguage = 'de';
if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (validLanguages.includes(config.defaultLanguage)) {
      defaultLanguage = config.defaultLanguage;
    }
  } catch (err) {
    console.warn(chalk.yellow('⚠️  Konfigurationsdatei ungültig – nutze Standardsprache.'));
  }
}

// Sprache verarbeiten
let language = defaultLanguage; // Starte mit der gespeicherten Sprache
const langArg = getValueAfterOption(['--language', '-l'], args);
if (langArg) {
  const lang = langArg.toLowerCase();
  if (validLanguages.includes(lang)) {
    language = lang;
  } else {
    console.warn(chalk.yellow(`⚠️  Sprache '${lang}' nicht unterstützt. Nutze: ${validLanguages.join(', ')}`));
    console.log(chalk.gray(`➡️  Fallback: ${defaultLanguage}\n`));
  }
}

// Name verarbeiten
let name = null;
const nameArg = getValueAfterOption(['--name', '-n'], args);
if (nameArg) {
  name = nameArg.trim();
}

// Interaktive Eingabe, falls Name fehlt
if (!name) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  name = await new Promise(resolve => {
    rl.question(chalk.bold('Was ist dein Name? '), (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Option: Konfiguration speichern
if (args.includes('--save-config')) {
  try {
    fs.writeFileSync(configPath, JSON.stringify({ defaultLanguage: language }, null, 2));
    console.log(chalk.green(`✅ Sprache '${language}' wurde als Standard gespeichert.`));
  } catch (err) {
    console.warn(chalk.red(`❌ Konnte Konfiguration nicht speichern: ${err.message}`));
  }
}

// Ausgabe
console.log(`\n${greetings[language](name)}\n`);