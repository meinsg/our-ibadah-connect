// src/lib/qiblaMath.ts
export const KAABA = { lat: 21.4225, lon: 39.8262 };

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
export const normalize = (deg: number) => ((deg % 360) + 360) % 360;

/**
 * Returns the initial great-circle bearing from (lat, lon) to Kaaba (0..360)
 * 0° = true north, clockwise positive
 */
export function bearingToKaaba(lat: number, lon: number) {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA.lat);
  const dLon = toRad(KAABA.lon - lon);
  const y = Math.sin(dLon) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLon);
  return normalize(toDeg(Math.atan2(y, x)));
}