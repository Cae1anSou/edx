Preparing static assets for edx-platform
########################################

This branch uses a frontend/backend split.
Frontend development is centered on the standalone Studio Dashboard MFE under
``frontend-app-studio-dashboard/``.

Branch-local commands
*********************

Install dependencies first::

    npm ci
    npm --prefix frontend-app-studio-dashboard ci

Use these commands from repository root:

.. list-table::
   :header-rows: 1

   * - Command
     - Meaning
   * - ``npm run build``
     - Build the Studio Dashboard MFE production assets.
   * - ``npm run build-dev``
     - Build the Studio Dashboard MFE with ``development`` mode.
   * - ``npm run watch``
     - Start Studio Dashboard MFE dev server.
   * - ``npm run test``
     - Run Studio Dashboard frontend build + E2E TypeScript compilation checks.
   * - ``npm run studio-dashboard-e2e-headless``
     - Run headless E2E checks.
   * - ``npm run studio-dashboard-e2e-release``
     - Run release-readiness E2E checks.
