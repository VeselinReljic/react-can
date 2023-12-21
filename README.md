# react-can

Minimalistic (2.4 kB) 1 dependency permissions library (requires only ts-can)


```js
import { AuthorizationProvider, Can, Cannot, Permissions } from 'react-can';

const mockPermissions: Permissions = {
  moduleA: {
    abilities: { read: true, write: false },
    checks: { isAdmin: (target) => target.isAdmin },
  },
  moduleB: {
    abilities: { read: true, write: true },
    checks: { hasAccess: (target) => target.isValidUser },
  },
};

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
```
