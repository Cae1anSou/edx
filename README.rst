edx (Spring Refactor Branch)
============================

This branch has removed legacy Django runtime code and is now organized with a frontend/backend split:

- ``backend-java/``: Spring Boot backend services and API contracts.
- ``frontend-app-studio-dashboard/``: standalone React + Vite + TypeScript Studio Dashboard MFE.
- ``common/static/``, ``xmodule/static/``: legacy shared static assets still in use.
- ``xmodule/js/`` and ``xmodule/assets/``: legacy frontend block assets retained during migration.

Directory guide
---------------

- ``PROJECT_STRUCTURE.md``: canonical top-level layout and placement conventions for new code.

Quick start (backend)
---------------------

::

   cd backend-java
   ./mvnw spring-boot:run

Project notes
-------------

- Django runtime, app modules, and settings code have been removed on this branch.
- Frontend static pipeline config was pruned to remove references to deleted Django app paths.

Studio Dashboard MFE (new)
--------------------------

A new standalone React + Vite + TypeScript micro-frontend lives in
``frontend-app-studio-dashboard/``.

Run it with:

::

   npm --prefix frontend-app-studio-dashboard ci
   npm run studio-dashboard-dev
   npm run build
   npm run test
