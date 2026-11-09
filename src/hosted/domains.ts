import {
  PRIMARY_ORIGIN,
  LEGACY_ORIGIN,
  validOrigin,
} from "../../shared/origins";
export const mainOrigin = validOrigin(
  (import.meta as any).env.VITE_APP_ORIGIN,
  PRIMARY_ORIGIN,
);
export const legacyOrigin = validOrigin(
  (import.meta as any).env.VITE_LEGACY_ORIGIN,
  LEGACY_ORIGIN,
);
export const legacyHost = location.origin === legacyOrigin;
