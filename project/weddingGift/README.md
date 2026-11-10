# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Stripe Connect checkout (test mode)

The backend creates a Stripe Checkout Session from the selected product ID. It
loads the price and product name from `public/data.json` and sends the payment
to the connected account configured on the server using a destination charge.
The browser cannot choose the amount or recipient. This setup uses one
connected account for all gift contributions.

1. In Stripe test mode, create/onboard the recipient as a connected account and
   make sure it can receive payments.
2. Copy `backend/.env.example` to `backend/.env` and set `STRIPE_SECRET_KEY` to
   your test secret key and `STRIPE_CONNECTED_ACCOUNT_ID` to the recipient's
   `acct_...` ID. Set `FRONTEND_URL` if the frontend is not running on
   `http://localhost:5173`.
3. Start the API with `cd backend && npm start`, then start the frontend from
   the project directory with `npm run dev`.
4. Open a product and choose Stripe Checkout. Use Stripe's test card
   `4242 4242 4242 4242` with a future expiry and any CVC to complete a test
   payment. Verify the payment and transfer in the Stripe test dashboard.

Keep the Stripe secret key and connected account ID in the backend environment;
never add them to frontend code. Run backend checks with `cd backend && npm test`.
