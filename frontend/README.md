# NEKOread

The React/Vite frontend reuses the site's existing UI assets and dashboard behavior from the sibling `public` folder. The API remains in the repository-root `server.js`.

## Run locally

1. In the repository root, run `npm install` once, then `node server.js` to start the MangaDex API at `http://localhost:3000`.
2. In `vite-project`, run `npm install` once, then `npm run dev`.
3. Open the Vite URL shown in the terminal.

The frontend requests API data from port 3000. Keep the API server running while using the app.
