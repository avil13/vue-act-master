export function getExampleActTemplate(): string {
  return `
import type { ActMasterAction } from 'act-master';

export type ValidationErrors = {
  [k: string]: string[] | undefined;
};

export type ErrorParsedDetails = {
  details?: string | null;
  alertMessage?: string | null;
  validationErrors?: ValidationErrors | null;
};

export class OnErrorAct implements ActMasterAction {
  readonly name = 'OnError';

  async exec(error: Error | string): Promise<ErrorParsedDetails> {
    if (!navigator.onLine) {
      const alertMessage = 'No internet connection, check your connection.';

      return {
        alertMessage,
      };
    }

    if (error instanceof Error) {
      console.error('Error:', error);
    }

    return {
      details: error.toString(),
    };
  }
}
`;
}
