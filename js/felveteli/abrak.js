// Vázlatok a geometria feladatokhoz (SVG, külső könyvtár nélkül). A feladatlapokon is ez áll:
// „Az ábra csak tájékoztató jellegű vázlat, nem pontos méretű.” – de az arányokat igyekszünk tartani.
import { formaz } from '../lib/szam.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const W = 360, H = 250, PAD = 34;
const rad = (fok) => (fok * Math.PI) / 180;
const f = (x) => formaz(x, 2);

/** Pontok illesztése a rajzterületre (egységes nagyítás, középre). A függvény a pont-transzformációt adja. */
function illeszt(pontok, w = W, h = H, pad = PAD) {
  const xs = pontok.map((p) => p[0]), ys = pontok.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((w - 2 * pad) / (x1 - x0 || 1), (h - 2 * pad) / (y1 - y0 || 1));
  const ox = (w - k * (x1 - x0)) / 2, oy = (h - k * (y1 - y0)) / 2;
  // a matematikai y tengely felfelé mutat, az SVG-é lefelé
  return (p) => [ox + k * (p[0] - x0), h - (oy + k * (p[1] - y0))];
}

const keret = (leiras, tartalom, w = W, h = H) =>
  `<svg class="abra" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(leiras)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(leiras)}</title>${tartalom}</svg>`;
const szoveg = (p, s, osztaly = 'abra-cimke', horgony = 'middle') =>
  `<text class="${osztaly}" x="${p[0].toFixed(1)}" y="${(p[1] + 5).toFixed(1)}" text-anchor="${horgony}">${esc(s)}</text>`;
const vonal = (a, b, osztaly = 'abra-vonal v1') => `<line class="${osztaly}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`;
const sokszog = (pontok, osztaly = 'abra-vonal v1') =>
  `<polygon class="${osztaly}" points="${pontok.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}" stroke-linejoin="round"/>`;
const pont = (p) => `<circle class="abra-pont" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5"/>`;
const egys = (a, b) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };

/** Szögív a V csúcsnál a VP és VQ félegyenesek között (a kisebbik szög), felirattal. A pontok SVG-koordináták. */
function ive(V, P, Q, r, cimke) {
  const u = egys(V, P), v = egys(V, Q);
  const a1 = [V[0] + r * u[0], V[1] + r * u[1]], a2 = [V[0] + r * v[0], V[1] + r * v[1]];
  const kereszt = u[0] * v[1] - u[1] * v[0];
  const nagy = 0, irany = kereszt > 0 ? 1 : 0;
  let m = [u[0] + v[0], u[1] + v[1]];
  const ml = Math.hypot(m[0], m[1]);
  m = ml < 1e-6 ? [-u[1], u[0]] : [m[0] / ml, m[1] / ml];
  const c = [V[0] + (r + 15) * m[0], V[1] + (r + 15) * m[1]];
  return `<path class="abra-vonal v2" stroke-width="2" d="M${a1[0].toFixed(1)},${a1[1].toFixed(1)} A${r},${r} 0 ${nagy} ${irany} ${a2[0].toFixed(1)},${a2[1].toFixed(1)}"/>${cimke ? szoveg(c, cimke, 'abra-cimke v2') : ''}`;
}
/** Csúcs betűjele a súlyponttól kifelé. */
function betu(V, kozep, s) {
  const u = egys(kozep, V);
  return szoveg([V[0] + 15 * u[0], V[1] + 15 * u[1]], s, 'abra-felirat');
}
const sulypont = (ps) => [ps.reduce((a, p) => a + p[0], 0) / ps.length, ps.reduce((a, p) => a + p[1], 0) / ps.length];

// ---- G1: háromszög ----
/** valt 0: harmadik szög; 1: külső szög a C csúcsnál; 2: szögfelező az A csúcsnál. */
export function haromszogAbra({ valt, a, b }) {
  const bb = valt === 2 ? (180 - a) / 2 : b;
  const L = 10;
  const A = [0, 0], B = [L, 0];
  const t = (L * Math.sin(rad(bb))) / Math.sin(rad(a + bb));
  const C = [t * Math.cos(rad(a)), t * Math.sin(rad(a))];
  const pontok = [A, B, C];
  let D = null;
  if (valt === 1) { const u = egys(B, C); D = [C[0] + 2.5 * u[0], C[1] + 2.5 * u[1]]; pontok.push(D); }
  let P = null;
  if (valt === 2) {
    // a szögfelező és a BC oldal metszéspontja
    const d = [Math.cos(rad(a / 2)), Math.sin(rad(a / 2))], e = [C[0] - B[0], C[1] - B[1]];
    const det = d[0] * -e[1] - d[1] * -e[0];
    const s = ((B[0] - A[0]) * -e[1] - (B[1] - A[1]) * -e[0]) / det;
    P = [s * d[0], s * d[1]];
  }
  const T = illeszt(pontok);
  const [tA, tB, tC] = [T(A), T(B), T(C)];
  const k = sulypont([tA, tB, tC]);
  let r = vonal(tA, tB) + vonal(tB, tC) + vonal(tC, tA);
  let leiras;
  if (valt === 0) {
    r += ive(tA, tB, tC, 30, `${a}°`) + ive(tB, tA, tC, 30, `${b}°`) + ive(tC, tA, tB, 24, '?');
    leiras = `Háromszög: az A csúcsnál ${a} fok, a B csúcsnál ${b} fok, a C csúcsnál a keresett szög.`;
  } else if (valt === 1) {
    const tD = T(D);
    r += vonal(tC, tD, 'abra-seged') + ive(tA, tB, tC, 30, `${a}°`) + ive(tB, tA, tC, 30, `${b}°`) + ive(tC, tD, tA, 26, '?');
    leiras = `Háromszög: az A csúcsnál ${a} fok, a B csúcsnál ${b} fok; a BC oldal meghosszabbítása a C csúcsnál a keresett külső szöget adja.`;
  } else {
    const tP = T(P);
    r += vonal(tA, tP, 'abra-vonal v2') + pont(tP) + ive(tA, tB, tC, 44, `${a}°`) + ive(tA, tB, tP, 26, '?') + betu(tP, k, 'P');
    leiras = `Háromszög: az A csúcsnál ${a} fok, a belőle induló szögfelező a BC oldalt a P pontban metszi; a keresett szög a szögfelező és az AB oldal szöge.`;
  }
  r += betu(tA, k, 'A') + betu(tB, k, 'B') + betu(tC, k, 'C');
  return keret(leiras, r);
}

// ---- G2: négyszög ----
export function negyszogAbra({ p, q, d1, d2 }) {
  const ps = [[0, 0], [10, 0.8], [8.4, 7.4], [0.8, 6]];
  const T = illeszt(ps);
  const tp = ps.map(T);
  const k = sulypont(tp);
  const cimkek = [`${p}x`, `${q}x`, `${q}x + ${d1}°`, `${q}x + ${d2}°`];
  let r = sokszog(tp);
  tp.forEach((V, i) => {
    const u = egys(V, k);
    r += szoveg([V[0] + 48 * u[0], V[1] + 38 * u[1]], cimkek[i], 'abra-cimke v2');
    r += betu(V, k, 'ABCD'[i]);
  });
  return keret(`Négyszög: két szöge ${p}x és ${q}x, a másik kettő ${q}x + ${d1} fok és ${q}x + ${d2} fok.`, r);
}

// ---- G3: szabályos sokszög ----
/** mod: 'belso' | 'kulso' | 'atlo' | 'atlo-megoldas' */
export function sokszogAbra({ n, mod }) {
  const ps = Array.from({ length: n }, (_, i) => [Math.cos(rad(90 + (360 / n) * i)), Math.sin(rad(90 + (360 / n) * i))]);
  const T = illeszt(ps, W, H, 40);
  const tp = ps.map(T);
  const k = sulypont(tp);
  let r = sokszog(tp);
  const V = tp[0], elo = tp[n - 1], kov = tp[1];
  if (mod === 'belso') r += ive(V, elo, kov, 26, '?');
  if (mod === 'kulso') {
    const u = egys(elo, V);
    const ki = [V[0] + 55 * u[0], V[1] + 55 * u[1]];
    r += vonal(V, ki, 'abra-seged') + ive(V, ki, kov, 24, '?');
  }
  if (mod === 'atlo-megoldas') for (let i = 2; i < n - 1; i++) r += vonal(V, tp[i], 'abra-seged');
  tp.forEach((P) => { r += pont(P); });
  const leiras = `Szabályos ${n} oldalú sokszög${mod === 'belso' ? ', a belső szög jelölve' : mod === 'kulso' ? ', a külső szög jelölve' : mod === 'atlo-megoldas' ? ', az egyik csúcsból induló átlók berajzolva' : ''}.`;
  void k;
  return keret(leiras, r);
}

// ---- G4: téglalap oldalainak növelése ----
export function teglalapAbra({ a, x }) {
  const hb = 80;
  const k = Math.min(230 / (a + x), 110 / x);
  const wa = a * k, wx = x * k, x0 = 50, yAlja = 215;
  const ya = yAlja - hb;
  let r = `<rect class="abra-sav" x="${x0}" y="${ya - wx}" width="${wa + wx}" height="${hb + wx}"/>`;
  r += `<rect class="abra-seged" fill="none" x="${x0}" y="${ya - wx}" width="${wa + wx}" height="${hb + wx}"/>`;
  r += `<rect class="abra-vonal v1" x="${x0}" y="${ya}" width="${wa}" height="${hb}"/>`;
  r += vonal([x0 + wa, ya], [x0 + wa, ya - wx], 'abra-seged') + vonal([x0 + wa, ya], [x0 + wa + wx, ya], 'abra-seged');
  r += szoveg([x0 + wa / 2, yAlja + 22], `${a} cm`, 'abra-felirat');
  r += szoveg([x0 - 10, ya + hb / 2], '?', 'abra-felirat', 'end');
  r += szoveg([x0 + wa + wx / 2, ya + hb / 2 - 5], `+${x}`, 'abra-cimke v2');
  r += szoveg([x0 + (wa + wx) / 2, ya - wx / 2 - 5], `+${x}`, 'abra-cimke v2');
  r += szoveg([x0 + wa + wx / 2, yAlja + 22], `${x} cm`, 'abra-cimke v2');
  return keret(`Téglalap: az egyik oldala ${a} cm, a másik ismeretlen; mindkét oldalát ${x} cm-rel megnöveljük (szaggatott vonal).`, r, 360, 250);
}

// ---- G5: átfúrt kocka ----
export function kockaAbra({ e, s }) {
  const m = 130, x0 = 20, y0 = 40, ks = (s / e) * m, os = (m - ks) / 2;
  let r = szoveg([x0 + m / 2, 24], 'felülnézet', 'abra-skala');
  r += `<rect class="abra-vonal v1" x="${x0}" y="${y0}" width="${m}" height="${m}"/>`;
  r += `<rect class="abra-vonal v2" x="${x0 + os}" y="${y0 + os}" width="${ks}" height="${ks}"/>`;
  r += szoveg([x0 + m / 2, y0 + m + 22], `${e} cm`, 'abra-felirat');
  r += szoveg([x0 + m / 2, y0 + m / 2], `${s}×${s}`, 'abra-cimke v2');
  const x1 = 210;
  r += szoveg([x1 + m / 2, 24], 'elölnézet (a lyuk szaggatva)', 'abra-skala');
  r += `<rect class="abra-vonal v1" x="${x1}" y="${y0}" width="${m}" height="${m}"/>`;
  r += vonal([x1 + os, y0], [x1 + os, y0 + m], 'abra-seged') + vonal([x1 + os + ks, y0], [x1 + os + ks, y0 + m], 'abra-seged');
  r += szoveg([x1 + m / 2, y0 + m + 22], `${e} cm`, 'abra-felirat');
  r += szoveg([x1 + m + 8, y0 + m / 2], `${e} cm`, 'abra-felirat', 'start');
  return keret(`Kocka, élhossza ${e} cm, rajta négyzetes lyuk ${s} cm × ${s} cm keresztmetszettel; felülnézet és elölnézet.`, r, 410, 215);
}

// ---- G6: derékszögű háromszög, téglalap átlója ----
/** mod: 'atfogo' (befogók adottak) | 'befogo' (átfogó és egy befogó adott) | 'atlo' (téglalap) */
export function pitagoraszAbra({ mod, a, b, c }) {
  const arany = Math.min(Math.max(a / b, 0.3), 3);
  const bw = 200, bh = Math.min(Math.max(bw / arany, 70), 190);
  const x0 = 70, y0 = 215;
  const A = [x0, y0], B = [x0 + bw, y0], C = [x0, y0 - bh];
  let r;
  let leiras;
  if (mod === 'atlo') {
    r = `<rect class="abra-vonal v1" x="${x0}" y="${y0 - bh}" width="${bw}" height="${bh}"/>` + vonal(A, [x0 + bw, y0 - bh], 'abra-vonal v2');
    r += szoveg([x0 + bw / 2, y0 + 22], `${a} cm`, 'abra-felirat') + szoveg([x0 - 10, y0 - bh / 2], `${b} cm`, 'abra-felirat', 'end');
    r += szoveg([x0 + bw / 2 - 14, y0 - bh / 2 - 6], '?', 'abra-cimke v2');
    leiras = `Téglalap, oldalai ${a} cm és ${b} cm, az átló hossza ismeretlen.`;
  } else {
    r = sokszog([A, B, C]) + `<path class="abra-seged" fill="none" d="M${x0 + 14},${y0} v-14 h-14"/>`;
    const alsoCimke = mod === 'atfogo' ? `${a} cm` : `${a} cm`;
    r += szoveg([x0 + bw / 2, y0 + 22], alsoCimke, 'abra-felirat');
    r += szoveg([x0 - 10, y0 - bh / 2], mod === 'atfogo' ? `${b} cm` : '?', 'abra-felirat', 'end');
    r += szoveg([x0 + bw / 2 + 20, y0 - bh / 2 - 10], mod === 'atfogo' ? '?' : `${c} cm`, 'abra-cimke v2');
    leiras = mod === 'atfogo'
      ? `Derékszögű háromszög, befogói ${a} cm és ${b} cm, az átfogó ismeretlen.`
      : `Derékszögű háromszög, átfogója ${c} cm, az egyik befogója ${a} cm, a másik befogó ismeretlen.`;
  }
  void B; void C; void f;
  return keret(leiras, r, 360, 250);
}
