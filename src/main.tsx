import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY && typeof window !== 'undefined') {
  // Don't crash production if key is missing; render app without Clerk.
  // Sign-in routes will not function until the env var is configured.
  console.warn("Clerk disabled: missing VITE_CLERK_PUBLISHABLE_KEY. Set it in Vercel Project Settings → Environment Variables.");
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{PUBLISHABLE_KEY ? (
			<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
				<App />
			</ClerkProvider>
		) : (
			<App />
		)}
	</StrictMode>
);
