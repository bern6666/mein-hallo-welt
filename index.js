import { createInterface } from 'readline';

const args = process.argv.slice(2);
const nameFlagIndex = args.indexOf('--name');

let name;

if (nameFlagIndex !== -1 && args[nameFlagIndex + 1]) {
  name = args[nameFlagIndex + 1];
}

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

console.log(`Hallo ${name}!`);