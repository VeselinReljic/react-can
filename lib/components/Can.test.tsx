import { test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AuthorizationProvider } from './Authorization';
import { Can, Cannot } from './Can';

const mockPermissions = {
  moduleA: {
    abilities: { read: true, write: false },
    checks: { isAdmin: (target: any) => target.isAdmin },
  },
  moduleB: {
    abilities: { read: true, write: true },
    checks: { hasAccess: (target: any) => target.isValidUser },
  },
};

test('Can component renders content when authorized', () => {
  const { container } = render(
    <AuthorizationProvider value={mockPermissions}>
      <Can module="moduleA" abilities={["read"]}>
        <div data-testid="authorized-content">Authorized Content</div>
      </Can>
    </AuthorizationProvider>
  );

  const authorizedContent = container.querySelector('[data-testid="authorized-content"]');
  expect(authorizedContent).not.toBeNull();
  expect(authorizedContent!.textContent).toBe('Authorized Content');
});

test('Can component does not render content when not authorized', () => {
  const { container } = render(
    <AuthorizationProvider value={mockPermissions}>
      <Can module="moduleA" abilities={["write"]}>
        <div data-testid="unauthorized-content">Unauthorized Content</div>
      </Can>
    </AuthorizationProvider>
  );

  const unauthorizedContent = container.querySelector('[data-testid="unauthorized-content"]');
  expect(unauthorizedContent!).toBeNull();
});

test('Cannot component renders fallback content when not authorized', () => {
  const { container } = render(
    <AuthorizationProvider value={mockPermissions}>
      <Cannot module="moduleA" abilities={["write"]}>
        <div data-testid="fallback-content">Fallback Content</div>
      </Cannot>
    </AuthorizationProvider>
  );

  const fallbackContent = container.querySelector('[data-testid="fallback-content"]');
  expect(fallbackContent).not.toBeNull();
  expect(fallbackContent!.textContent).toBe('Fallback Content');
});

test('all Can.Pass are rendered inside Can that is passing', () => {
  const { container } = render(
    <AuthorizationProvider value={mockPermissions}>
      <Can module="moduleA" abilities={["read"]}>
        <Can.Pass>
          Resource
        </Can.Pass>
        <Can.Fail>
          Missing permissions 
        </Can.Fail>
        <Can.Pass>
          -visible
        </Can.Pass>
      </Can>
    </AuthorizationProvider>
  );

  expect(container.textContent).toBe('Resource-visible');
});

test('Cannot.Pass render content inside Cannot that is not passing', () => {
  const { container } = render(
    <AuthorizationProvider value={mockPermissions}>
      <Cannot module="moduleA" abilities={["write"]}>
        <Cannot.Pass>
          Missing permissions,
        </Cannot.Pass>
        <Cannot.Fail>
          Resource
        </Cannot.Fail>
        <Can.Pass>
          Workis with Can.Pass
        </Can.Pass>
        <Can.Fail>
          -Forbiden
        </Can.Fail>
      </Cannot>
    </AuthorizationProvider>
  );

  expect(container.textContent).toBe('Missing permissions,Workis with Can.Pass');
});