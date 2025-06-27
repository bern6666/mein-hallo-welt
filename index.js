import { createInterface } from 'readline';

// Lies die Argumente aus der Kommandozeile
const args = process.argv.slice(2);

// Lies die Version aus der Umgebungsvariable (funktioniert nach npm install -g)
const version = process.env.npm_package_version || '1.0.0';

let name;
let language = 'de'; // Standard ist Deutsch

// Prüfe auf --help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
hallo [Optionen]

Optionen:
  --name <Name>       Gibt deinen Namen an
  --language <Sprache> Sprache wählen (de, en, es, fr)
  --version           Zeigt die Version an
  --help, -h          Zeigt diese Hilfe an

Beispiele:
  hallo
  hallo --name Max
  hallo --name Anna --language en
  hallo --version
  hallo --help
`);
  process.exit(0);
}

// Prüfe auf --version
if (args.includes('--version')) {
  console.log(`Version: ${version}`);
  process.exit(0);
}

// Prüfe auf --language
const langIndex = args.indexOf('--language');
if (langIndex !== -1 && args[langIndex + 1]) {
  language = args[langIndex + 1].toLowerCase();
}

// Prüfe auf --name
const nameIndex = args.indexOf('--name');
if (nameIndex !== -1 && args[nameIndex + 1]) {
  name = args[nameIndex + 1];
}

// Wenn kein Name gegeben, frage interaktiv
if (!name) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  name = await new Promise((resolve) => {
    readline.question('Was ist dein Name? ', (answer) => {
      resolve(answer);
      readline.close();
    });
  });
}

// Sprachabhängige Begrüßung
const greetings = {
  de: `Hallo ${name}!`,
  en: `Hello ${name}!`,
  es: `¡Hola ${name}!`,
  fr: `Bonjour ${name}!`,
};

const greeting = greetings[language] || greetings['de'];

console.log(greeting);