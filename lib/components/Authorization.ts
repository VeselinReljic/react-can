import React from 'react';
import { Permissions } from 'ts-can';

const AuthorizationContext = React.createContext<Permissions | undefined>(undefined);

export const AuthorizationProvider: React.Provider<Permissions | undefined> =
  AuthorizationContext.Provider;

export const useAuthorization = (): Permissions => {
  const authorization = React.useContext(AuthorizationContext);
  if (authorization === undefined) {
    throw new Error(
      'useAuthorization must be used within a AuthorizationProvider',
    );
  }
  return authorization;
};
