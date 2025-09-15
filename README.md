## Project info


There are several ways of editing your application.


Simply visit the (https://lovable.dev/projects/ad783b00-b97e-47af-85c9-15b58cb52987) and start prompting.

Changes made will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ad783b00-b97e-47af-85c9-15b58cb52987) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## Deploying to Vercel (Frontend)

This app is a Vite + React + TypeScript SPA. The repository includes `vercel.json` to build and serve the SPA with index.html fallback.

### Environment variables

Set the following in Vercel Project → Settings → Environment Variables:

- `VITE_CLERK_PUBLISHABLE_KEY` (required)
- `VITE_API_URL` (recommended): URL to your backend API, e.g. `https://api.example.com` or your deployed functions path like `https://your-app.vercel.app/api`
- `VITE_WS_URL` (optional)

### API base URL behavior

`src/lib/apiBaseUrl.ts` resolves in this order:

1. If `VITE_API_URL` is set → use it.
2. If on localhost → `http://localhost:4000`.
3. Else (e.g., Vercel) → same-origin `/api`. Configure a proxy/rewrites if you want to hit a backend from the same domain.

### Build

Vercel uses `@vercel/static-build` via `vercel.json` to run `vite build` and serve `dist/`.

Local:

```sh
npm run build
npm run preview
```

