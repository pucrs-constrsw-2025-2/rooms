# Rooms Module

This module delivers the REST API for managing rooms, exposing CRUD endpoints secured by the `JwtAuthGuard`. The guard currently contains a mock placeholder that must be replaced once the OAuth microservice publishes the official token validation endpoint.

## Features
- `POST /api/v1/rooms` to create rooms honoring capacity, building, and number constraints.
- `GET /api/v1/rooms` with pagination (`page`, `limit`) and filters (`building`, `category`, `status`, `minCapacity`, `maxCapacity`, `number`).
- `GET /api/v1/rooms/:id`, `PUT /api/v1/rooms/:id`, `PATCH /api/v1/rooms/:id`, and `DELETE /api/v1/rooms/:id`.
- `mapRoomToResponse` ensures the Prisma primary key (`id`) is exposed as `_id` in API responses.

## Furnitures Scaffold
The `/api/v1/rooms/:roomId/furnitures` routes are intentionally left as scaffolds returning `501 Not Implemented`. Each handler contains a `// TODO` marker for the future CRUD implementation.

## Resources Integration
Resources remain outside of this service boundary.

```
NOTE: resources are served by another microservice. Do not implement here.
```

When the resources microservice is available, consider adding lightweight read-only projections or the necessary orchestration hooks, but avoid duplicating its business logic in this module.

