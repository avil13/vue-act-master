import { ActEventName } from './types';

export class NotFoundActionError extends Error {
  constructor(public readonly eventName: ActEventName) {
    super(`Can't find "${eventName}" action`);
  }
}

export class ActinonAlreadyExistingError extends Error {
  constructor(public readonly eventName: ActEventName) {
    super(`Action "${eventName}" already existing`);
  }
}

export class KeyAlreadyExistsInDIError extends Error {
  constructor(public readonly key: string) {
    super(`"${key}" already exists in DI`);
  }
}

export class InvalidDITypeError extends Error {
  constructor() {
    super(`"di" can't be array`);
  }
}
