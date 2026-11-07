export const paths = [
  "Helix",
  "Double Helix",
  "Orbital Ring",
  "Spiral Vortex",
  "Sine Ribbon",
  "Figure Eight",
  "Lissajous Flow",
  "Möbius Loop",
  "Torus Knot",
  "Spherical Orbit",
  "Cylindrical Tunnel",
  "Conical Spiral",
  "Expanding Wave",
  "Grid Fold",
  "Fractal Branch",
  "Particle Constellation",
];
export function point(
  path: number,
  t: number,
  time: number,
): [number, number, number] {
  const a = t * Math.PI * 2,
    u = a + time;
  switch (path) {
    case 0:
      return [Math.cos(u) * 160, (t - 0.5) * 400, Math.sin(u) * 160];
    case 1:
      return [
        Math.cos(u + (Math.floor(t * 24) % 2) * Math.PI) * 150,
        (t - 0.5) * 400,
        Math.sin(u + (Math.floor(t * 24) % 2) * Math.PI) * 150,
      ];
    case 2:
      return [Math.cos(u) * 230, Math.sin(u) * 100, Math.sin(u) * 140];
    case 3:
      return [
        Math.cos(u * 2) * t * 240,
        Math.sin(u * 2) * t * 180,
        (t - 0.5) * 250,
      ];
    case 4:
      return [(t - 0.5) * 600, Math.sin(u * 2) * 110, Math.cos(u) * 100];
    case 5:
      return [Math.sin(u) * 220, Math.sin(u * 2) * 100, Math.cos(u) * 90];
    case 6:
      return [
        Math.sin(u * 3) * 210,
        Math.sin(u * 2 + 0.8) * 130,
        Math.cos(u * 5) * 110,
      ];
    case 7: {
      const r = 160 + 50 * Math.cos(u / 2);
      return [r * Math.cos(u), r * Math.sin(u) * 0.7, 70 * Math.sin(u / 2)];
    }
    case 8:
      return [
        (145 + 65 * Math.cos(u * 3)) * Math.cos(u * 2),
        (145 + 65 * Math.cos(u * 3)) * Math.sin(u * 2) * 0.65,
        65 * Math.sin(u * 3),
      ];
    case 9: {
      const v = Math.acos(2 * t - 1);
      return [
        200 * Math.sin(v) * Math.cos(u * 4),
        180 * Math.cos(v),
        200 * Math.sin(v) * Math.sin(u * 4),
      ];
    }
    case 10:
      return [
        Math.cos(a * 4 + time) * 160,
        Math.sin(a * 4 + time) * 160,
        (t - 0.5) * 500,
      ];
    case 11:
      return [
        Math.cos(u * 3) * t * 240,
        (t - 0.5) * 360,
        Math.sin(u * 3) * t * 240,
      ];
    case 12:
      return [
        (t - 0.5) * 560,
        Math.sin(a * 3 + time) * t * 140,
        Math.cos(a * 3 + time) * t * 180,
      ];
    case 13: {
      const n = Math.floor(t * 144),
        x = n % 12,
        y = Math.floor(n / 12);
      return [
        (x - 5.5) * 40,
        (y - 5.5) * 24,
        Math.sin(x * 0.5 + time) * Math.cos(y * 0.4) * 150,
      ];
    }
    case 14: {
      const n = Math.floor(t * 63) + 1,
        level = Math.floor(Math.log2(n)),
        branch = n - 2 ** level;
      return [
        (branch / 2 ** level - 0.5) * level * 95,
        (level - 3) * 55,
        Math.sin(n * 2.4 + time) * 80,
      ];
    }
    default: {
      const n = Math.floor(t * 144);
      return [
        Math.sin(n * 127.1) * 260,
        Math.sin(n * 311.7) * 150,
        Math.sin(n * 74.7 + time * 0.2) * 170,
      ];
    }
  }
}
