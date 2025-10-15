# mf-react-wc

Minimal monorepo showing:
- React component exposed via Webpack 5 Module Federation
- Same component registered as a Web Component via `react-to-webcomponent`
- Jest + React Testing Library unit tests

## Scripts
- `npm start` – runs remote (hello-lib :3001) and host (:3000)
- `npm run -w hello-lib test` – runs unit tests for the library

## Notes
- In tests, the WC sets the `name` via a property for jsdom reliability.
- React is singleton-shared between host and remote via Module Federation.
