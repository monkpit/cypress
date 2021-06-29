# Springboard (React)

Springboard is next-gen react application that is rendered by Electron. This acts as the visual user interface you see when running: `cypress open`.

It replaces the original electron app, `desktop-gui`.

**Springbord has the following responsibilities:**

- Allow users to log in through the Dashboard Service.
- Select testing mode (E2E, Component, Node.js)

## Building

### For development

```bash
## from repo root
yarn workspace @packages/springboard-react build
```

## Developing

```bash
## from repo root
yarn workspace @packages/springboard-react dev
```

You probably want to start webpack in watch mode, too:

```bash
## from repo root
yarn workspace @packages/springboard-react watch
```

## Testing

### In Cypress

This project is tested with Cypress itself. It acts exactly like any other Cypress project.

E2E tests:

```bash
## from repo root
yarn workspace @packages/springboard-react cypress:open
```

Component Tests:

```bash
## from repo root
yarn workspace @packages/springboard-react cypress:open:ct
```