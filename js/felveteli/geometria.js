// F4 – Síkgeometria és testek (szögek, területek, térfogat, Pitagorasz-tétel)
import { egesz, valaszt } from '../lib/rng.js';
import { probal, f, tisztit } from '../temak/seged.js';
import { egyMezos } from './seged.js';
import { haromszogAbra, negyszogAbra, sokszogAbra, teglalapAbra, kockaAbra, pitagoraszAbra } from './abrak.js';

// ---- Tiszta számolók ----
export const harmadikSzog = (a, b) => 180 - a - b;
export const kulsoSzog = (a, b) => a + b;
export const szabalyosBelso = (n) => 180 - 360 / n;
export const szabalyosKulso = (n) => 360 / n;
export const atlokSzama = (n) => (n * (n - 3)) / 2;
/** Négyszög szögei: p k, q k, q k + d1, q k + d2 (összeg 360) → a legkisebb szög (q k). */
export const negyszogLegkisebb = (p, q, d1, d2) => (q * (360 - d1 - d2)) / (p + 3 * q);
/** Téglalap: egyik oldal a, mindkét oldal x-szel nő, a terület dT-vel nő → a másik oldal. */
export const teglalapMasikOldal = (a, x, dT) => dT / x - a - x;
export const kockaLyukTerfogat = (e, s) => e ** 3 - s * s * e;
export const kockaLyukFelszin = (e, s) => 6 * e * e - 2 * s * s + 4 * s * e;
export const atfogo = (a, b) => Math.sqrt(a * a + b * b);
export const masikBefogo = (c, a) => Math.sqrt(c * c - a * a);

// ---- G1: háromszög szögei ----
function G1(rng) {
  const valt = egesz(rng, 0, 2);
  return probal(() => {
    if (valt === 2) {
      const a = 2 * egesz(rng, 20, 60);
      return egyMezos({
        abra: haromszogAbra({ valt: 2, a }),
        szoveg: `Egy háromszög A csúcsánál lévő belső szög ${a}°. Hány fokos szöget zár be az A csúcsból induló szögfelező a háromszög AB oldalával?`,
        cimke: 'A szög', egyseg: '°', helyes: a / 2,
        hibak: [{ ertek: a, uzenet: 'Ez a teljes belső szög. A szögfelező ezt két egyenlő részre osztja.' }, { ertek: 180 - a, uzenet: 'A szögfelező az A csúcsnál lévő belső szöget felezi, a háromszög többi szögéhez nincs köze.' }],
        ellenproba: (w) => `Ellenpróba: a szögfelező két egyenlő részre osztja a ${f(a)} fokos szöget, ezért 2 · ${f(w)} = ${f(2 * w)} fokot kellene kapnod, de ${f(a)} fok a belső szög.`,
        tippek: [`Mit csinál a szögfelező a szöggel, amelyet felez?`, `A szögfelező két egyenlő részre osztja a ${f(a)} fokos szöget.`, `Oszd el a ${f(a)} fokot kettővel.`],
        megoldas: [`A szögfelező felezi az A csúcsnál lévő szöget.`, `${f(a)}° : 2 = <strong>${f(a / 2)}°</strong>.`],
        magyarazat: [
          `A szögfelező olyan félegyenes, amely a szöget két egyenlő nagyságú részre osztja.`,
          `Az AB oldallal bezárt szög ezért a belső szög fele. Ez ${f(a)} : 2 = ${f(a / 2)} fok.`,
          `Józan ésszel: a ${f(a / 2)} fok kétszerese ${f(a)} fok, vagyis éppen a belső szög. A szögfelező által bezárt szög mindig kisebb a teljes szögnél.`,
        ],
        jegyezze: 'A szögfelező a szöget két egyenlő részre osztja.',
      });
    }
    const a = egesz(rng, 30, 95), b = egesz(rng, 25, 85);
    if (a + b > 160 || a === b) return null;
    if (valt === 0) {
      const c = 180 - a - b;
      return egyMezos({
        abra: haromszogAbra({ valt: 0, a, b }),
        szoveg: `Egy háromszög két belső szöge ${a}° és ${b}°. Hány fokos a háromszög harmadik belső szöge?`,
        cimke: 'A harmadik szög', egyseg: '°', helyes: c,
        hibak: [{ ertek: a + b, uzenet: 'Ez a két szög összege. A harmadik szöget úgy kapod meg, hogy ezt kivonod 180 fokból.' }, { ertek: 360 - a - b, uzenet: 'A háromszög belső szögeinek összege 180 fok, nem 360.' }],
        ellenproba: (w) => `Ellenpróba: ${f(a)} + ${f(b)} + ${f(w)} = ${f(a + b + w)} fok jönne ki, de a háromszög szögeinek összege 180 fok.`,
        tippek: [`Mennyi a háromszög belső szögeinek összege?`, `A belső szögek összege 180 fok.`, `Vond ki a két ismert szöget a 180 fokból.`],
        megoldas: [`A háromszög belső szögeinek összege 180°.`, `180° − ${f(a)}° − ${f(b)}° = <strong>${f(c)}°</strong>.`],
        magyarazat: [
          `Minden háromszög belső szögeinek összege 180 fok, függetlenül attól, hogy milyen alakú. Ezt az összeget kell felhasználnunk.`,
          `Az ismert két szög összege ${f(a)} + ${f(b)} = ${f(a + b)} fok, ezért a harmadik szög 180 − ${f(a + b)} = ${f(c)} fok.`,
          `Józan ésszel: ${f(a)} + ${f(b)} + ${f(c)} = 180, és a harmadik szög nem lehet nagyobb 180 foknál.`,
        ],
        jegyezze: 'A háromszög belső szögeinek összege 180°.',
      });
    }
    return egyMezos({
      abra: haromszogAbra({ valt: 1, a, b }),
      szoveg: `Egy háromszög A csúcsánál lévő belső szög ${a}°, a B csúcsánál lévő ${b}°. Hány fokos a C csúcsnál lévő külső szög?`,
      cimke: 'A külső szög', egyseg: '°', helyes: a + b,
      hibak: [{ ertek: 180 - a - b, uzenet: 'Ez a C csúcsnál lévő belső szög. A külső szög ennek 180 fokra kiegészítő szöge.' }, { ertek: 360 - a - b, uzenet: 'A külső szög és a mellette lévő belső szög együtt 180 fok (egyenesszög).' }],
      ellenproba: (w) => `Ellenpróba: a belső szög ${f(180 - a - b)} fok, ezért a külső szögnek ${f(180 - (180 - a - b))} fok kell lennie (180 fokra egészíti ki), de nálad ${f(w)}.`,
      tippek: [`Mekkora a C csúcsnál lévő belső szög, és mennyivel egészíti ki a külső szög 180 fokra?`, `A belső szög 180 − ${f(a)} − ${f(b)} = ${f(180 - a - b)} fok.`, `A külső szög ezt 180 fokra egészíti ki.`],
      megoldas: [`C csúcsnál a belső szög: 180° − ${f(a)}° − ${f(b)}° = ${f(180 - a - b)}°.`, `A külső szög: 180° − ${f(180 - a - b)}° = <strong>${f(a + b)}°</strong> (a két nem mellette lévő belső szög összege).`],
      magyarazat: [
        `A külső szög és a mellette lévő belső szög együtt egyenesszöget, azaz 180 fokot alkotnak. Ezért előbb a belső szöget számoljuk ki.`,
        `A belső szög 180 − ${f(a)} − ${f(b)} = ${f(180 - a - b)} fok, ezért a külső szög 180 − ${f(180 - a - b)} = ${f(a + b)} fok. Rövidebben: a külső szög egyenlő a két nem mellette lévő belső szög összegével.`,
        `Józan ésszel: ${f(a)} + ${f(b)} = ${f(a + b)}, és ez nagyobb, mint a mellette lévő belső szög, mert a külső szög és a belső szög együtt 180 fok.`,
      ],
      jegyezze: 'A háromszög külső szöge a két nem mellette lévő belső szög összege (vagy 180° mínusz a mellette lévő belső szög).',
    });
  });
}

// ---- G2: négyszög szögei, arányok ----
function G2(rng) {
  const PQ = [[4, 3], [5, 3], [3, 2], [5, 2], [5, 4], [7, 4], [7, 5]];
  return probal(() => {
    const [p, q] = valaszt(rng, PQ);
    const k = egesz(rng, 10, 30);
    const R = 360 - (p + 3 * q) * k;
    if (R < 24 || R > 140) return null;
    const d1 = egesz(rng, 10, R - 10), d2 = R - d1;
    if (d1 === d2 || d1 > d2) return null;
    const legkisebb = q * k;
    if (legkisebb + d2 >= 180 || p * k >= 180) return null;
    return egyMezos({
      abra: negyszogAbra({ p, q, d1, d2 }),
      szoveg: `Egy négyszög két belső szögének aránya ${p} : ${q}. A másik két belső szöge ${d1}°-kal, illetve ${d2}°-kal nagyobb a négyszög legkisebb szögénél. Hány fokos a négyszög legkisebb szöge?`,
      cimke: 'A legkisebb szög', egyseg: '°', helyes: legkisebb,
      hibak: [
        { ertek: p * k, uzenet: 'Ez a nagyobbik arányos szög. A legkisebb szög az arány kisebbik száma szerinti szög.' },
        { ertek: tisztit(360 / (p + q)) * q, uzenet: 'A négyszög szögeinek összege 360 fok, de a másik két szög is benne van az összegben, ezért nem csak a két arányos szögből áll.' },
      ],
      ellenproba: (w) => `Ellenpróba: ha a legkisebb szög ${f(w)}°, akkor a szögek ${f(w)}, ${f(w + d1)}, ${f(w + d2)} és az arányos párja ${f((p * w) / q, 2)}, összegük ${f(w + w + d1 + w + d2 + (p * w) / q, 2)}, de 360° kellene.`,
      tippek: [
        'Mennyi a négyszög belső szögeinek összege, és hogyan fejezhető ki mind a négy szög egyetlen betűvel?',
        `Legyen az arányos szögek egy-egy része k fok: ${p}k és ${q}k. A másik két szög ${q}k + ${d1} és ${q}k + ${d2}.`,
        `Az összeg: ${p}k + ${q}k + (${q}k + ${d1}) + (${q}k + ${d2}) = 360.`,
      ],
      megoldas: [
        `A szögek: ${p}k, ${q}k, ${q}k + ${d1}, ${q}k + ${d2} (a legkisebb a ${q}k).`,
        `Összegük 360°: ${p + 3 * q}k + ${d1 + d2} = 360, tehát ${p + 3 * q}k = ${f(360 - d1 - d2)}.`,
        `k = ${f(k)}, a legkisebb szög ${q} · ${f(k)} = <strong>${f(legkisebb)}°</strong>.`,
      ],
      magyarazat: [
        `A négyszög belső szögeinek összege 360 fok. Az arányból tudjuk, hogy két szög ${p}k és ${q}k alakú. Mivel a másik két szög a legkisebb szögnél nagyobb, a legkisebb szög a ${q}k.`,
        `A másik két szög ${q}k + ${d1} és ${q}k + ${d2}. Összeadva: ${p}k + ${q}k + ${q}k + ${q}k + ${d1 + d2} = ${p + 3 * q}k + ${d1 + d2} = 360.`,
        `Ebből ${p + 3 * q}k = ${f(360 - d1 - d2)}, így k = ${f(k)} és a legkisebb szög ${f(legkisebb)} fok. Józan ésszel: a szögek ${f(p * k)}, ${f(q * k)}, ${f(q * k + d1)} és ${f(q * k + d2)} fok, ezek összege ${f(360)}.`,
      ],
      jegyezze: 'Négyszög belső szögeinek összege 360°. Arányos szögeket p·k és q·k alakban írj fel, és írd fel az összeget.',
    });
  });
}

// ---- G3: szabályos sokszög ----
function G3(rng) {
  const valt = egesz(rng, 0, 2);
  const N360 = [5, 6, 8, 9, 10, 12, 15, 18, 20, 24];
  if (valt === 2) {
    const n = egesz(rng, 5, 12);
    return egyMezos({
      abra: sokszogAbra({ n, mod: 'atlo' }),
      abraMegoldas: sokszogAbra({ n, mod: 'atlo-megoldas' }),
      szoveg: `Hány átlója van egy konvex ${n} oldalú sokszögnek?`,
      helyes: atlokSzama(n), tizedes: 0, cimke: 'Az átlók száma',
      hibak: [{ ertek: n * (n - 3), uzenet: 'Így minden átlót kétszer számoltál (mindkét végpontjától egyszer). Oszd el kettővel.' }, { ertek: n * (n - 1) / 2, uzenet: 'Ez az összes szakasz a csúcsok között, az oldalakat is beleszámolva. Az oldalak nem átlók.' }],
      ellenproba: (w) => `Ellenpróba: ha ${f(w)} átló lenne, a csúcsonkénti ${f(n - 3)} átlóval számolva ${f(n)} · ${f(n - 3)} : 2 = ${f(atlokSzama(n))} jönne ki, nem ${f(w)}.`,
      tippek: [`Hány másik csúccsal köthető össze egy csúcs úgy, hogy az ne oldal legyen?`, `Egy csúcsból ${n - 3} átló indul (önmagával és két szomszédjával nem kötjük össze).`, `${n} csúcs · ${n - 3} átló, de minden átlót kétszer számoltunk.`],
      megoldas: [`Egy csúcsból ${n} − 3 = ${n - 3} átló indul.`, `${n} · ${n - 3} = ${n * (n - 3)}, ezt kettővel osztjuk (mindegyik átlót kétszer számoltuk): <strong>${f(atlokSzama(n))}</strong>.`],
      magyarazat: [
        `Egy csúcsot a sokszög minden más csúcsával összeköthetünk, kivéve önmagát és a két szomszédját, mert azok oldalak.`,
        `Így egy csúcsból ${n} − 3 = ${n - 3} átló indul. Mind a ${n} csúcsból ennyi, vagyis ${f(n * (n - 3))}, de minden átlónak két végpontja van, ezért ennyiszer számoltuk.`,
        `Az átlók száma ${f(n * (n - 3))} : 2 = ${f(atlokSzama(n))}. Józan ésszel: egy négyszögnek 4 · 1 : 2 = 2 átlója van, ez stimmel.`,
      ],
      jegyezze: 'Az n oldalú sokszög átlóinak száma n · (n − 3) : 2.',
    });
  }
  const n = valaszt(rng, N360);
  const kulso = valt === 1;
  return egyMezos({
    abra: sokszogAbra({ n, mod: kulso ? 'kulso' : 'belso' }),
    szoveg: `Mekkora egy szabályos ${n} oldalú sokszög egy ${kulso ? 'külső' : 'belső'} szöge (fokban)?`,
    helyes: kulso ? 360 / n : 180 - 360 / n, tizedes: 0, cimke: kulso ? 'A külső szög' : 'A belső szög', egyseg: '°',
    hibak: kulso
      ? [{ ertek: 180 - 360 / n, uzenet: 'Ez a belső szög. A külső szög ennek a 180 fokra kiegészítője.' }, { ertek: 180 / n, uzenet: 'A külső szögek összege 360 fok (nem 180).' }]
      : [{ ertek: 360 / n, uzenet: 'Ez a külső szög. A belső szög ezt 180 fokra egészíti ki.' }, { ertek: 180 * (n - 2), uzenet: 'Ez az összes belső szög összege. Egy szög nagyságához el kell osztani a csúcsok számával.' }],
    ellenproba: (w) => kulso
      ? `Ellenpróba: ${f(n)} külső szög összege ${f(n)} · ${f(w)} = ${f(n * w)} fok, de a külső szögek összege 360 fok.`
      : `Ellenpróba: ha a belső szög ${f(w)} fok lenne, a külső szög ${f(180 - w)} fok, és ${f(n)} ilyen külső szög összege ${f(n * (180 - w))} fok lenne, de a külső szögek összege 360 fok.`,
    tippek: kulso
      ? [`Mennyi az összes külső szög összege, és hány egyforma külső szög van?`, `A külső szögek összege mindig 360 fok.`, `Oszd el a 360 fokot a csúcsok számával (${n}).`]
      : [`Hogyan kapható meg a külső szögből a belső szög, és mennyi a külső szögek összege?`, `A külső szögek összege 360 fok, egy külső szög 360 : ${n} = ${f(360 / n)} fok.`, `A belső szög 180 fokra kiegészíti a külső szöget.`],
    megoldas: kulso
      ? [`A külső szögek összege 360°, mind egyforma.`, `360° : ${n} = <strong>${f(360 / n)}°</strong>.`]
      : [`Egy külső szög: 360° : ${n} = ${f(360 / n)}°.`, `A belső szög: 180° − ${f(360 / n)}° = <strong>${f(180 - 360 / n)}°</strong>.`],
    magyarazat: kulso ? [
      `Ha egy sokszög körül végigmegyünk, és minden csúcsnál elfordulunk a külső szögnek megfelelően, összesen egy teljes fordulatot, 360 fokot fordulunk.`,
      `Szabályos sokszögnél mind a ${n} elfordulás egyforma, ezért egy külső szög 360 : ${n} = ${f(360 / n)} fok.`,
      `Józan ésszel: minél több oldala van a sokszögnek, annál kisebb a külső szög. ${f(n)} · ${f(360 / n)} = 360.`,
    ] : [
      `A belső és a külső szög egy csúcsnál együtt egyenesszöget, 180 fokot alkot. Először a külső szöget számoljuk ki.`,
      `A külső szögek összege 360 fok, egy külső szög ${f(360 / n)} fok. A belső szög így 180 − ${f(360 / n)} = ${f(180 - 360 / n)} fok.`,
      `Józan ésszel: a szabályos sokszög belső szöge 180 foknál kisebb, és minél több az oldal, annál közelebb van a 180-hoz. Ellenőrzés: ${f(n)} · ${f(180 - 360 / n)} = ${f(n * (180 - 360 / n))} = (${f(n)} − 2) · 180.`,
    ],
    jegyezze: 'Szabályos n-szög: külső szög = 360° : n, belső szög = 180° − külső szög.',
  });
}

// ---- G4: téglalap oldalainak növelése ----
function G4(rng) {
  return probal(() => {
    const a = egesz(rng, 3, 9), b = egesz(rng, 4, 14), x = egesz(rng, 1, 4);
    if (a === b) return null;
    const dT = x * (a + b + x);
    return egyMezos({
      abra: teglalapAbra({ a, x }),
      szoveg: `Egy téglalap egyik oldala ${a} cm hosszú. A téglalap mindkét oldalát megnöveltük ${x} cm-rel. Az így kapott téglalap területe ${f(dT)} cm²-rel nagyobb az eredeti téglalap területénél. Milyen hosszú a téglalap másik oldala (cm-ben)?`,
      cimke: 'A másik oldal', egyseg: 'cm', helyes: b,
      hibak: [
        { ertek: b + x, uzenet: 'Ez az új téglalap másik oldala. Az eredeti oldalt kell megadni, vagyis ki kell vonni belőle a növekedést.' },
        { ertek: tisztit(dT / x), uzenet: 'Ez a két oldal és a növekedés összege (a + b + x). A másik oldalhoz ebből ki kell vonni az ismert oldalt és a növekedést is.' },
      ],
      ellenproba: (w) => `Ellenpróba: ha a másik oldal ${f(w)} cm, az eredeti terület ${f(a)} · ${f(w)} = ${f(a * w)} cm², az új (${f(a + x)}) · (${f(w + x)}) = ${f((a + x) * (w + x))} cm², a különbség ${f((a + x) * (w + x) - a * w)} cm², de ${f(dT)} cm² kellene.`,
      tippek: [
        'Hogyan lehet kiszámolni az új és az eredeti terület különbségét az oldalakból?',
        `Legyen a másik oldal b. Az új terület (${a} + ${x}) · (b + ${x}), az eredeti ${a} · b.`,
        `A különbség ${f(dT)}: (${a + x}) · (b + ${x}) − ${a}b = ${f(dT)}. Bontsd fel a zárójelet.`,
      ],
      megoldas: [
        `Az eredeti terület ${a}b, az új (${a + x})(b + ${x}) = ${a}b + ${a + x}·${x} + ${x}b.`,
        `A különbség: ${a + x}·${x} + ${x}b = ${f((a + x) * x)} + ${x}b = ${f(dT)}, tehát ${x}b = ${f(dT - (a + x) * x)}.`,
        `b = <strong>${f(b)}</strong> cm.`,
      ],
      magyarazat: [
        `Az új téglalap oldalai ${a + x} cm és b + ${x} cm, az eredetié ${a} cm és b cm. A kettő területének különbsége a feladat szerint ${f(dT)} cm².`,
        `Az új terület kibontva ${a}b + ${f((a + x) * x)} + ${x}b, ebből az eredeti ${a}b-t levonva ${f((a + x) * x)} + ${x}b marad. Ez egyenlő ${f(dT)}-mal, így ${x}b = ${f(dT - (a + x) * x)}.`,
        `Józan ésszel: b = ${f(b)} cm esetén az eredeti terület ${f(a * b)} cm², az új ${f((a + x) * (b + x))} cm², a különbség ${f((a + x) * (b + x) - a * b)} cm².`,
      ],
      jegyezze: 'Oldalak növelésénél írd fel az új és a régi területet is, vond ki egymásból, és oldd meg az egyenletet.',
    });
  });
}

// ---- G5: átfúrt kocka (térfogat, felszín) ----
function G5(rng) {
  const felszin = egesz(rng, 0, 1) === 1;
  return probal(() => {
    const e = egesz(rng, 6, 12), s = egesz(rng, 2, 3);
    const V = kockaLyukTerfogat(e, s), A = kockaLyukFelszin(e, s);
    return egyMezos({
      abra: kockaAbra({ e, s }),
      szoveg: `Egy ${e} cm élű tömör kockán az egyik lapra merőlegesen átfúrtunk egy ${s} cm × ${s} cm keresztmetszetű négyzetes lyukat (a lyuk az egyik lapról a szemközti lapig tart). Mekkora a megmaradt test ${felszin ? 'felszíne (cm²-ben)' : 'térfogata (cm³-ben)'}?`,
      cimke: felszin ? 'A felszín' : 'A térfogat', egyseg: felszin ? 'cm²' : 'cm³', helyes: felszin ? A : V,
      hibak: felszin
        ? [{ ertek: 6 * e * e, uzenet: 'Ez a tömör kocka felszíne. A lyuk miatt két négyzet kiesik a lapokból, és négy belső fal jön hozzá.' }, { ertek: 6 * e * e - 2 * s * s, uzenet: 'A lyuk belső falait (4 darab, ' + s + ' × ' + e + ' cm-es téglalap) is hozzá kell adni a felszínhez.' }]
        : [{ ertek: e ** 3, uzenet: 'Ez a tömör kocka térfogata. A lyuk térfogatát ki kell vonni.' }, { ertek: e ** 3 - s * s, uzenet: 'A lyuk hossza az egész kocka élével egyenlő, ezért a lyuk térfogata s² · e.' }],
      ellenproba: felszin
        ? (w) => `Ellenpróba: a tömör kocka felszíne ${f(6 * e * e)} cm², ebből a lyuk miatt ${f(2 * s * s)} cm² kiesik, és ${f(4 * s * e)} cm² belső fal jön hozzá, így ${f(A)} cm² jön ki, nem ${f(w)}.`
        : (w) => `Ellenpróba: a kivágott rész térfogata ${f(e ** 3)} − ${f(w)} = ${f(e ** 3 - w)} cm³ lenne, de a lyuk ${s} · ${s} · ${e} = ${f(s * s * e)} cm³.`,
      tippek: felszin
        ? [`Mely lapok csökkennek a lyuk miatt, és milyen új felületek keletkeznek a lyuk belsejében?`, `A két szemközti lapról kiesik egy-egy ${s} cm × ${s} cm-es négyzet, a lyukban 4 belső fal keletkezik.`, `A belső falak mindegyike ${s} cm × ${e} cm-es téglalap.`]
        : [`Mekkora a lyuk térfogata, ha a lyuk egy ${s} × ${s} keresztmetszetű, ${e} cm hosszú négyzetes hasáb?`, `A tömör kocka térfogata ${e}³ = ${f(e ** 3)} cm³.`, `A lyuk térfogata ${s} · ${s} · ${e} = ${f(s * s * e)} cm³; ezt vond ki.`],
      megoldas: felszin
        ? [`A tömör kocka felszíne: 6 · ${e}² = ${f(6 * e * e)} cm².`, `Kiesik 2 · ${s}² = ${f(2 * s * s)} cm²; hozzájön 4 · ${s} · ${e} = ${f(4 * s * e)} cm².`, `${f(6 * e * e)} − ${f(2 * s * s)} + ${f(4 * s * e)} = <strong>${f(A)}</strong> cm².`]
        : [`A kocka térfogata: ${e}³ = ${f(e ** 3)} cm³.`, `A lyuk térfogata: ${s} · ${s} · ${e} = ${f(s * s * e)} cm³.`, `${f(e ** 3)} − ${f(s * s * e)} = <strong>${f(V)}</strong> cm³.`],
      magyarazat: felszin ? [
        `A lyuk két lapot „lyukasztott ki”: mindkét lapról elvész egy ${s} cm × ${s} cm-es négyzet, együtt ${f(2 * s * s)} cm².`,
        `Ugyanakkor a lyuk belsejében négy új fal keletkezik, mindegyik ${s} cm × ${e} cm-es téglalap, összesen ${f(4 * s * e)} cm². Ez a rész is a test felszínéhez tartozik.`,
        `A felszín tehát ${f(6 * e * e)} − ${f(2 * s * s)} + ${f(4 * s * e)} = ${f(A)} cm². Józan ésszel: a lyukas test felszíne nagyobb a tömör kocka felszínénél (${f(6 * e * e)} cm²), mert a belső falak többet adnak, mint amennyi kiesik.`,
      ] : [
        `A megmaradt test térfogata a tömör kocka térfogata mínusz a kifúrt rész térfogata.`,
        `A kocka térfogata ${e}³ = ${f(e ** 3)} cm³. A lyuk egy ${s} cm × ${s} cm alapú, ${e} cm magas hasáb, térfogata ${s} · ${s} · ${e} = ${f(s * s * e)} cm³.`,
        `A különbség ${f(e ** 3)} − ${f(s * s * e)} = ${f(V)} cm³. Józan ésszel: a lyuk miatt kevesebb lett a térfogat, ${f(V)} < ${f(e ** 3)}.`,
      ],
      jegyezze: 'Lyukas testnél: térfogatnál kivonjuk a lyuk térfogatát; felszínnél a kiesett lapokat levonjuk, a belső falakat hozzáadjuk.',
    });
  });
}

// ---- G6: Pitagorasz-tétel ----
const HARMASOK = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
function G6(rng) {
  const valt = egesz(rng, 0, 2);
  return probal(() => {
    const [a0, b0, c0] = valaszt(rng, HARMASOK);
    const k = egesz(rng, 1, 4);
    const a = a0 * k, b = b0 * k, c = c0 * k;
    if (c > 90) return null;
    if (valt === 1) {
      return egyMezos({
        abra: pitagoraszAbra({ mod: 'befogo', a, b, c }),
        szoveg: `Egy derékszögű háromszög átfogója ${c} cm, az egyik befogója ${a} cm hosszú. Milyen hosszú a másik befogó (cm-ben)?`,
        cimke: 'A másik befogó', egyseg: 'cm', helyes: b,
        hibak: [{ ertek: c - a, uzenet: 'A befogó nem a két oldal különbsége. Pitagorasz-tétellel kell számolni: a² + b² = c².' }, { ertek: tisztit(Math.sqrt(c * c + a * a)), uzenet: 'Az átfogó a leghosszabb oldal, ezért a másik befogót az átfogó négyzetéből kell kivonni (nem hozzáadni).' }],
        ellenproba: (w) => `Ellenpróba: ${f(a)}² + ${f(w)}² = ${f(a * a + w * w)}, a négyzetgyöke ${f(Math.sqrt(a * a + w * w), 2)}, de az átfogó ${f(c)}.`,
        tippek: [`Melyik a derékszögű háromszög leghosszabb oldala, és milyen összefüggés van a három oldal között?`, `Pitagorasz: a² + b² = c², ahol c az átfogó (${c}).`, `b² = ${c}² − ${a}² = ${f(c * c - a * a)}.`],
        megoldas: [`Pitagorasz-tétel: a² + b² = c².`, `b² = ${c}² − ${a}² = ${f(c * c)} − ${f(a * a)} = ${f(b * b)}.`, `b = √${f(b * b)} = <strong>${f(b)}</strong> cm.`],
        magyarazat: [
          `A derékszögű háromszögben a két befogó négyzetének összege egyenlő az átfogó négyzetével (Pitagorasz-tétel).`,
          `Itt az átfogó ${c} cm, az egyik befogó ${a} cm. A másik befogó négyzete ${f(c * c)} − ${f(a * a)} = ${f(b * b)}. Ennek a négyzetgyöke ${f(b)}.`,
          `Józan ésszel: a befogó mindig rövidebb az átfogónál (${f(b)} < ${f(c)}), és ${f(a)}² + ${f(b)}² = ${f(a * a + b * b)} = ${f(c)}².`,
        ],
        jegyezze: 'Pitagorasz-tétel: a² + b² = c² (c az átfogó). Hiányzó befogónál kivonunk.',
      });
    }
    const atlo = valt === 2;
    return egyMezos({
      abra: pitagoraszAbra({ mod: atlo ? 'atlo' : 'atfogo', a, b, c }),
      szoveg: atlo
        ? `Egy téglalap oldalai ${a} cm és ${b} cm hosszúak. Milyen hosszú a téglalap átlója (cm-ben)?`
        : `Egy derékszögű háromszög befogói ${a} cm és ${b} cm hosszúak. Milyen hosszú az átfogó (cm-ben)?`,
      cimke: atlo ? 'Az átló' : 'Az átfogó', egyseg: 'cm', helyes: c,
      hibak: [{ ertek: a + b, uzenet: 'A két oldal összege hosszabb az átfogónál. Pitagorasz-tétellel kell számolni: a² + b² = c².' }, { ertek: a * a + b * b, uzenet: 'Ez az átfogó négyzete. A hosszhoz a négyzetgyökét kell venni.' }],
      ellenproba: (w) => `Ellenpróba: ${f(w)}² = ${f(w * w)}, de ${f(a)}² + ${f(b)}² = ${f(a * a + b * b)}.`,
      tippek: [atlo ? 'Milyen alakzat keletkezik, ha behúzod a téglalap egyik átlóját, és mit tudsz az oldalairól?' : 'Melyik oldal az átfogó, és milyen összefüggés van a három oldal között?', 'Pitagorasz: a² + b² = c².', `c² = ${a}² + ${b}² = ${f(a * a + b * b)}.`],
      megoldas: [`Pitagorasz-tétel: c² = a² + b² = ${f(a * a)} + ${f(b * b)} = ${f(a * a + b * b)}.`, `c = √${f(a * a + b * b)} = <strong>${f(c)}</strong> cm.`],
      magyarazat: [
        atlo ? `A téglalap átlója két derékszögű háromszögre vágja a téglalapot, amelynek a befogói a téglalap oldalai, az átfogója pedig az átló.` : `A derékszögű háromszögben a két befogó négyzetének összege egyenlő az átfogó négyzetével (Pitagorasz-tétel).`,
        `Itt c² = ${f(a)}² + ${f(b)}² = ${f(a * a)} + ${f(b * b)} = ${f(a * a + b * b)}. Ebből a négyzetgyök: c = ${f(c)} cm.`,
        `Józan ésszel: az ${atlo ? 'átló' : 'átfogó'} hosszabb, mint bármelyik oldal (${f(c)} > ${f(Math.max(a, b))}), de rövidebb, mint a két oldal összege (${f(a + b)}).`,
      ],
      jegyezze: 'Pitagorasz-tétel: a² + b² = c². Az átfogó a leghosszabb oldal, mindig rövidebb a két befogó összegénél.',
    });
  });
}

export default {
  id: 'fv-geometria',
  sor: 'felveteli',
  cim: 'Geometria: szögek, területek, testek',
  rovid: 'Háromszög és négyszög szögei, szabályos sokszög, téglalap, átfúrt kocka, Pitagorasz-tétel.',
  kulcskeplet: '<span class="keplet-nagy">a² + b² = c²</span>',
  kulcsMagyarazat: ['Háromszög belső szögeinek összege 180°, négyszögé 360°; a derékszögű háromszög oldalai között a Pitagorasz-tétel érvényes.'],
  elmelet: [
    '<strong>Szögösszegek:</strong> a háromszög belső szögeinek összege mindig 180°, a négyszögé 360°. Ha két szöget ismersz a háromszögben, a harmadikat kivonással kapod: például 180° − 50° − 65° = 65°.',
    '<strong>Külső szög és szögfelező:</strong> a külső szög és a mellette lévő belső szög együtt egyenesszöget, azaz 180°-ot alkot. A háromszög külső szöge egyenlő a két nem mellette lévő belső szög összegével. A szögfelező a szöget két egyenlő részre osztja.',
    '<strong>Szabályos sokszög:</strong> a külső szögek összege mindig 360°, és szabályos sokszögben mind egyforma. Egy külső szög = 360° : n, egy belső szög = 180° − 360° : n. Példa a szabályos nyolcszögre: 360° : 8 = 45° és 180° − 45° = 135°. Az átlók száma: egy csúcsból n − 3 átló indul, összesen n · (n − 3) : 2. Nyolcszögre 8 · 5 : 2 = 20.',
    '<strong>Arányos szögek:</strong> ha két szög aránya 4 : 3, akkor 4x és 3x alakban írd fel őket, és az összeget (háromszögnél 180°, négyszögnél 360°) állítsd egyenlővé a szögek összegével. Ha egy szög egy másiknál 35°-kal nagyobb, az x + 35°.',
    '<strong>Terület és kerület:</strong> téglalap területe T = a · b, kerülete K = 2 · (a + b). Ha minden oldalt megnövelsz x-szel, az új terület (a + x) · (b + x). Írd fel az új és a régi területet, vond ki egymásból, és oldd meg az egyenletet.',
    '<strong>Kocka, téglatest:</strong> a kocka térfogata e³, felszíne 6 · e². Téglatest térfogata a · b · c, felszíne 2 · (ab + bc + ca). Ha lyukat fúrnak a testbe, a térfogatból kivonod a lyuk térfogatát. A felszínnél a lyuk két lapot kiüt, de a lyuk belsejében új falak keletkeznek, ezeket hozzá kell adni.',
    '<strong>Pitagorasz-tétel:</strong> derékszögű háromszögben a befogók négyzetének összege egyenlő az átfogó négyzetével: a² + b² = c². Az átfogó a derékszöggel szemközti, leghosszabb oldal. Ismert egész számú hármasok: 3-4-5, 5-12-13, 8-15-17, 7-24-25 és ezek többszörösei (6-8-10, 9-12-15). A téglalap átlója is átfogó.',
    '<strong>Mindig rajzolj ábrát:</strong> jelöld rajta, amit tudsz, és a „?”-lel, amit keresel. Az ábrák az oldalon is vázlatok, nem pontos méretűek.',
  ],
  peldak: [
    { cim: 'Háromszög harmadik szöge', feladat: 'Egy háromszög két belső szöge 50° és 65°. Mekkora a harmadik szöge?',
      abra: () => haromszogAbra({ valt: 0, a: 50, b: 65 }),
      lepesek: ['A háromszög belső szögeinek összege 180°.', 'A két ismert szög összege: 50° + 65° = 115°.', 'A harmadik szög: 180° − 115° = <strong>65°</strong>.', 'Ellenőrzés: 50° + 65° + 65° = 180° ✓.'] },
    { cim: 'Külső szög', feladat: 'Egy háromszög A csúcsánál lévő belső szög 64°, a B csúcsánál lévő 62°. Mekkora a C csúcsnál lévő külső szög?',
      abra: () => haromszogAbra({ valt: 1, a: 64, b: 62 }),
      lepesek: ['Első út: a C csúcsnál lévő belső szög 180° − 64° − 62° = 54°.', 'A külső szög ezt 180°-ra egészíti ki: 180° − 54° = <strong>126°</strong>.', 'Második út (rövidebb): a külső szög a két nem mellette lévő belső szög összege: 64° + 62° = 126° ✓.'] },
    { cim: 'Szabályos nyolcszög', feladat: 'Mekkora egy szabályos nyolcszög egy belső szöge, és hány átlója van?',
      abra: () => sokszogAbra({ n: 8, mod: 'belso' }),
      lepesek: ['A külső szögek összege 360°, nyolc egyforma külső szög van: 360° : 8 = 45°.', 'A belső szög a külső szöget 180°-ra egészíti ki: 180° − 45° = <strong>135°</strong>.', 'Ellenőrzés: 8 · 135° = 1080° = (8 − 2) · 180° ✓.', 'Egy csúcsból 8 − 3 = 5 átló indul. Mind a 8 csúcsból 8 · 5 = 40, de minden átlót kétszer számoltunk: 40 : 2 = <strong>20</strong> átló.'] },
    { cim: 'Négyszög szögei arányokkal', feladat: 'Egy négyszög két belső szögének aránya 4 : 3. A másik két belső szöge 35°-kal, illetve 52°-kal nagyobb a négyszög legkisebb szögénél. Mekkora a legkisebb szög?',
      abra: () => negyszogAbra({ p: 4, q: 3, d1: 35, d2: 52 }),
      lepesek: ['A szögek: 4x, 3x, 3x + 35°, 3x + 52°. A legkisebb a 3x, mert a másik kettő annál nagyobb.', 'Az összegük 360°: 4x + 3x + 3x + 3x + 87° = 360°, azaz 13x = 273°.', 'x = 21°, a legkisebb szög 3 · 21° = <strong>63°</strong>.', 'Ellenőrzés: a szögek 84°, 63°, 98°, 115°, összegük 360° ✓.'] },
    { cim: 'Téglalap oldalának növelése', feladat: 'Egy téglalap egyik oldala 5 cm. Mindkét oldalát 2 cm-rel megnöveljük, így a terület 36 cm²-rel nő. Milyen hosszú a másik oldal?',
      abra: () => teglalapAbra({ a: 5, x: 2 }),
      lepesek: ['Legyen a másik oldal b. A régi terület 5b, az új (5 + 2) · (b + 2) = 7b + 14.', 'A különbség 36: 7b + 14 − 5b = 36, azaz 2b + 14 = 36.', '2b = 22, így b = <strong>11</strong> cm.', 'Ellenőrzés: régi terület 5 · 11 = 55, új terület 7 · 13 = 91, a különbség 36 ✓.'] },
    { cim: 'Átfúrt kocka', feladat: 'Egy 10 cm élű tömör kockán átfúrtunk egy 2 cm × 2 cm keresztmetszetű lyukat az egyik lapra merőlegesen. Mekkora a megmaradt test térfogata és felszíne?',
      abra: () => kockaAbra({ e: 10, s: 2 }),
      lepesek: ['Térfogat: a kocka 10³ = 1000 cm³, a lyuk 2 · 2 · 10 = 40 cm³. A test térfogata 1000 − 40 = <strong>960 cm³</strong>.', 'Felszín: a tömör kocka 6 · 10² = 600 cm².', 'A lyuk két lapból egy-egy 2 × 2 = 4 cm²-es négyzetet kivág: 600 − 2 · 4 = 592 cm².', 'A lyuk belsejében 4 fal keletkezik, mindegyik 2 · 10 = 20 cm²: 4 · 20 = 80 cm². Összesen 592 + 80 = <strong>672 cm²</strong>.'] },
    { cim: 'Pitagorasz-tétel', feladat: 'a) Egy derékszögű háromszög befogói 9 cm és 12 cm. Milyen hosszú az átfogó? b) Az átfogó 25 cm, az egyik befogó 7 cm. Milyen hosszú a másik befogó?',
      abra: () => pitagoraszAbra({ mod: 'atfogo', a: 9, b: 12, c: 15 }),
      lepesek: ['a) c² = 9² + 12² = 81 + 144 = 225, c = √225 = <strong>15</strong> cm.', 'b) Az átfogó a leghosszabb oldal, ezért a másik befogót kivonással kapod: b² = 25² − 7² = 625 − 49 = 576.', 'b = √576 = <strong>24</strong> cm. Ellenőrzés: 7² + 24² = 49 + 576 = 625 = 25² ✓.'] },
  ],
  tipusok: [
    { id: 'G1', nev: 'Háromszög szögei (belső, külső, szögfelező)', general: G1 },
    { id: 'G2', nev: 'Négyszög szögei aránnyal', general: G2 },
    { id: 'G3', nev: 'Szabályos sokszög (szögek, átlók)', general: G3 },
    { id: 'G4', nev: 'Téglalap oldalainak növelése', general: G4 },
    { id: 'G5', nev: 'Átfúrt kocka (térfogat, felszín)', general: G5 },
    { id: 'G6', nev: 'Pitagorasz-tétel', general: G6 },
  ],
  peldaEllenorzes() {
    return [
      { nev: '1. példa: harmadik szög', kapott: harmadikSzog(50, 65), vart: 65 },
      { nev: '1. példa: ellenőrzés', kapott: 50 + 65 + 65, vart: 180 },
      { nev: '2. példa: belső szög C-nél', kapott: 180 - 64 - 62, vart: 54 },
      { nev: '2. példa: külső szög', kapott: kulsoSzog(64, 62), vart: 126 },
      { nev: '3. példa: külső szög (nyolcszög)', kapott: szabalyosKulso(8), vart: 45 },
      { nev: '3. példa: belső szög (nyolcszög)', kapott: szabalyosBelso(8), vart: 135 },
      { nev: '3. példa: szögösszeg', kapott: 8 * 135, vart: 1080 },
      { nev: '3. példa: átlók', kapott: atlokSzama(8), vart: 20 },
      { nev: '4. példa: legkisebb szög', kapott: negyszogLegkisebb(4, 3, 35, 52), vart: 63 },
      { nev: '4. példa: szögösszeg', kapott: 84 + 63 + 98 + 115, vart: 360 },
      { nev: '5. példa: másik oldal', kapott: teglalapMasikOldal(5, 2, 36), vart: 11 },
      { nev: '5. példa: új terület', kapott: 7 * 13, vart: 91 },
      { nev: '6. példa: térfogat', kapott: kockaLyukTerfogat(10, 2), vart: 960 },
      { nev: '6. példa: felszín', kapott: kockaLyukFelszin(10, 2), vart: 672 },
      { nev: '7. példa: átfogó', kapott: atfogo(9, 12), vart: 15 },
      { nev: '7. példa: másik befogó', kapott: masikBefogo(25, 7), vart: 24 },
    ];
  },
};
