// index.js – Hallo-CLI mit Farben, Kurzoptionen und sicherer Argumente-Verarbeitung
import { createInterface } from 'readline';
import chalk from 'chalk';

// Unterstützte Sprachen
const validLanguages = ['de', 'en', 'es', 'fr'];
const greetings = {
  de: (name) => chalk.green(`Hallo ${name}!`),
  en: (name) => chalk.blue(`Hello ${name}!`),
  es: (name) => chalk.yellow(`¡Hola ${name}!`),
  fr: (name) => chalk.magenta(`Bonjour ${name}!`),
};

// Hilfetext
const helpText = `
${chalk.bold('hallo [Optionen]')}

${chalk.underline('Optionen:')}
  --name, -n <Name>     Dein Name (optional, wird sonst abgefragt)
  --language, -l <Sprache>  Sprache: ${validLanguages.join(', ')}
  --version             Zeigt die Version an
  --help, -h            Zeigt diese Hilfe an

${chalk.underline('Beispiele:')}
  hallo --name Max
  hallo -n Max -l en
  hallo --name=Max --language=de
  hallo --help
  hallo --version
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

// Funktion: Wert nach Option extrahieren (mit -l und --language=)
function getValueAfterOption(options, args) {
  for (const option of options) {
    // 1. --name Max
    const index = args.indexOf(option);
    if (index !== -1 && args[index + 1] && !args[index + 1].startsWith('-')) {
      return args[index + 1];
    }
    // 2. --name=Max
    const longForm = args.find(arg => arg.startsWith(`${option}=`));
    if (longForm) {
      return longForm.split('=', 2)[1];
    }
  }
  return null;
}

// Sprache verarbeiten
let language = 'de';
const langArg = getValueAfterOption(['--language', '-l'], args);
if (langArg) {
  const lang = langArg.toLowerCase();
  if (validLanguages.includes(lang)) {
    language = lang;
  } else {
    console.warn(chalk.yellow(`⚠️  Sprache '${lang}' nicht unterstützt. Nutze: ${validLanguages.join(', ')}`));
    console.log(chalk.gray(`➡️  Fallback: Deutsch\n`));
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

// Ausgabe
console.log(`\n${greetings[language](name)}\n`);