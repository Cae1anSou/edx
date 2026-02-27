edx (Spring Refactor Branch)
============================

This branch has removed legacy Django runtime code and keeps:

- ``backend-java/``: Spring Boot backend services and API contracts.
- ``cms/static/``, ``lms/static/``, ``common/static/``, ``xmodule/static/``: legacy frontend static assets still in use.
- ``xmodule/js/`` and ``xmodule/assets/``: frontend block assets.

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

   npm run studio-dashboard-dev
