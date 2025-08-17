# Production Snapshot (Artifact)

This captures the deployed site at a point in time. **It is NOT full source** (JS is minified; build scripts, tests, and comments are gone). Prefer restoring the exact Git commit that produced the live build. Use this only to get the app running while you repair dev.

**DO NOT commit secrets**. This process only mirrors public files.