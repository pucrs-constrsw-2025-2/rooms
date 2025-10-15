// NOTE: resources are served by another microservice. Do not implement here.
import { RoomStatus } from '@prisma/client';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const ROOM_STATUS_VALUES: RoomStatus[] = [
  RoomStatus.ACTIVE,
  RoomStatus.INACTIVE,
  RoomStatus.MAINTENANCE,
];

export const JWT_VALIDATION_ENDPOINT_PLACEHOLDER =
  'https://placeholder.oauth.service/validate-token';

