import { generateCommand } from './commands/generate';
import { helpCommand } from './commands/help';
import { initConfig } from './commands/init-config';

const command = process.argv[2];

const run = async () => {
  if (command === 'init') {
    await initConfig();
    return;
  }

  if (command === 'generate' || command === 'g') {
    await generateCommand();
    return;
  }

  helpCommand();
};

run();
