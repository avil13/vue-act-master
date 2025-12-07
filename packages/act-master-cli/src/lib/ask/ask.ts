import readline from 'readline';
import { color } from '../log-messages/log-result';

export function ask(questionMessage: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(questionMessage, (answer) => {
      rl.close();
      const normalizedAnswer = answer.trim().toLowerCase();
      const result: boolean =
        normalizedAnswer === 'y' ||
        normalizedAnswer === 'yes' ||
        normalizedAnswer === 'да';

      console.log(result ? color.g('✓') : color.r('×'));

      resolve(result);
    });
  });
}
