# Rreal Tacos Bar Guide PWA

This is an interactive touch application for tablets, designed to help Rreal Tacos kitchen and bar staff quickly find recipes and checklists without typing.

## Project Structure

- `bar-guide-app/`: Root of the Next.js application.
  - `src/`: Source files.
    - `app/`: Next.js App Router pages and API routes.
      - `api/askNacho/`: API route for LLM interaction.
      - `[category]/page.tsx`: Dynamic page for items within a category.
      - `layout.tsx`: Main app layout.
      - `page.tsx`: Home page displaying categories.
    - `components/`: React components.
      - `ChatPanel.tsx`: Interactive chat panel for LLM communication.
      - `KeepAwake.tsx`: Component to manage screen wake lock.
    - `data/`: Static data files.
      - `seedMenu.json`: Contains all categories, items, and recipes.
    - `lib/`: Utility functions and libraries.
      - `data.ts`: Functions for accessing and processing `seedMenu.json`.
    - `styles/`: Global styles (though most styling is via Tailwind CSS utility classes).
  - `public/`: Static assets.
    - `manifest.json`: PWA manifest file.
    - `icons/`: Placeholder for PWA icons (e.g., `icon-192x192.png`, `icon-512x512.png`). **You need to add these.**
  - `.env.local`: For environment variables (see section below). **You need to create this.**
  - `next.config.mjs`: Next.js configuration.
  - `tailwind.config.ts`: Tailwind CSS configuration.
  - `tsconfig.json`: TypeScript configuration.

## Environment Variables

Create a `.env.local` file in the `bar-guide-app` directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Getting Started

1.  **Navigate to the project directory:**

    ```bash
    cd path/to/your/workspace/"Bar guide interactive"/bar-guide-app
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    This will start the application on a free port (usually `http://localhost:3000`). The front-end and API will be available.

## Building and Deploying

1.  **Build the application:**

    ```bash
    pnpm build
    ```

2.  **Start the production server:**

    ```bash
    pnpm start
    ```

    This command should be run after a successful build.

    Alternatively, for a single command to build and then start (e.g., for some deployment platforms):

    ```bash
    pnpm build && pnpm start
    ```

    (Note: `pnpm run build && pnpm run start` is not standard pnpm syntax; `pnpm build` and `pnpm start` directly use the scripts defined in `package.json`.)

## Kiosk Mode & PWA

- The application is configured to run in fullscreen when added to the home screen as a PWA (`display: "fullscreen"` in `manifest.json`).
- Viewport meta tags are set to prevent zooming and ensure proper scaling.
- A Screen Wake Lock API implementation attempts to keep the screen on.
- To achieve a high Lighthouse PWA score (≥ 90), ensure:
  - You add the required icons in `public/icons/` (e.g., 192x192 and 512x512 PNGs).
  - The app is served over HTTPS (required for Service Workers and PWA installation, usually handled by deployment platforms).
  - Test offline capabilities. Basic asset caching should be handled by Next.js PWA setup if further configured (e.g. with `@ducanh2912/next-pwa`). For this project, a simple manifest is included, full offline support would require a service worker setup.

## LLM Integration

- The app uses OpenAI's GPT-4o model.
- The API key is configured via environment variables.
- The system prompt for the LLM ("Nacho") is defined in `/api/askNacho/route.ts`.
