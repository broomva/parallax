import type { NextConfig } from "next";

// GitHub Pages serves this repository at https://broomva.github.io/parallax/,
// so every absolute URL the framework emits has to carry that prefix. It is an
// env var rather than a literal because the day this moves to a custom domain
// the correct value is the empty string, and a hard-coded "/parallax" would
// then break every asset on the page at once with no obvious cause.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // This app sits inside a repository that has its own bun.lock at the root,
  // and the inferred workspace root picks the wrong one.
  turbopack: { root: import.meta.dirname },
  // Pages has no Node server. Everything is emitted as files at build time.
  output: "export",
  basePath,
  // /proof -> /proof/index.html. Without this the export writes /proof.html,
  // which Pages will serve but which breaks every relative URL inside it.
  trailingSlash: true,
  images: { unoptimized: true },
  // A build that type-errors should fail here, not in a browser.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
