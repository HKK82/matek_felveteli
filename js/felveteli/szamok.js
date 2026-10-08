// F1 – Számok, törtek, oszthatóság
import { egesz, valaszt } from '../lib/rng.js';
import { probal, f, az, tisztit } from '../temak/seged.js';
import { egyMezos, TORT_UTASITAS, lnko, lkkt, tortSzoveg } from './seged.js';

export { lnko, lkkt };
export const osztokSzama = (n) => { let d = 0; for (let i = 1; i <= n; i++) if (n % i === 0) d++; return d; };
/** a/b ± c/d értéke. */
export const tortMuvelet = (a, b, c, d, jel = 1) => tisztit(a / b + jel * (c / d));

const NEVEZOK = [2, 3, 4, 5, 6, 8, 9, 10, 12];

// ---- S1: törtek összeadása, kivonása ----
function S1(rng) {
  const valt = egesz(rng, 0, 2); // 0: összeg, 1: különbség, 2: egész − tört
  return probal(() => {
    const b = valaszt(rng, NEVEZOK), d = valaszt(rng, NEVEZOK);
    if (b === d) return null;
    const a = egesz(rng, 1, b - 1), c = egesz(rng, 1, d - 1);
    if (lnko(a, b) !== 1 || lnko(c, d) !== 1) return null;
    const m = lkkt(b, d);
    let kif, szamlalo, bal, balSzamlalo;
    if (valt === 0) { kif = `${a}/${b} + ${c}/${d}`; balSzamlalo = a * (m / b); szamlalo = balSzamlalo + c * (m / d); }
    else if (valt === 1) {
      if (a / b <= c / d) return null;
      kif = `${a}/${b} − ${c}/${d}`; balSzamlalo = a * (m / b); szamlalo = balSzamlalo - c * (m / d);
    } else {
      const N = egesz(rng, 1, 3);
      kif = `${N} − ${c}/${d}`; balSzamlalo = N * m; szamlalo = balSzamlalo - c * (m / d);
      bal = N;
    }
    const jobbSzamlalo = c * (m / d);
    const jel = valt === 0 ? '+' : '−';
    const helyes = tisztit(szamlalo / m);
    const eredmeny = tortSzoveg(szamlalo, m);
    const balAlak = valt === 2 ? `${bal} = ${bal * m}/${m}` : `${a}/${b} = ${balSzamlalo}/${m}`;
    const nevezoSzoveg = valt === 2 ? `${d}` : `${b} és ${d}`;
    const hibas = valt === 0 ? [
      { ertek: (a + c) / (b + d), uzenet: 'A törteket nem úgy adjuk össze, hogy a számlálót a számlálóhoz, a nevezőt a nevezőhöz adjuk. Előbb közös nevezőre kell hozni őket.' },
      { ertek: (a + c) / m, uzenet: 'A közös nevező a számlálókat is átírja: ha a nevezőt szorzod, a számlálót is szorozni kell ugyanazzal.' },
    ] : valt === 1 ? [
      { ertek: (a - c) / (b - d), uzenet: 'A törtek kivonásánál sem a számlálókat és a nevezőket vonjuk ki egymásból. Közös nevező kell.' },
      { ertek: (a - c) / m, uzenet: 'A közös nevezőre hozásnál a számlálókat is át kell írni (a számlálót annyival szorozd, amennyivel a nevezőt).' },
    ] : [
      { ertek: (bal - c) / d, uzenet: 'Az egész számot is át kell írni törtté ugyanazzal a nevezővel, pl. 2 = 6/3, és csak ezután vonhatod ki a törtet.' },
    ];
    const jobb = jobbSzamlalo / m, balT = balSzamlalo / m;
    return egyMezos({
      szoveg: `Számítsd ki az alábbi művelet értékét: ${kif}`,
      utasitas: TORT_UTASITAS,
      helyes, tizedes: 3, hibak: hibas,
      ellenproba: (w) => `Ellenpróba: ha az eredmény ${f(w, 3)} lenne, akkor visszaszámolva ${f(valt === 0 ? w - jobb : w + jobb, 3)} jönne ki az első tagra, de az első tag ${f(balT, 3)}.`,
      tippek: [
        `Mi a baj azzal, hogy a törtek nevezője különbözik (${nevezoSzoveg})? Milyen számot lehet közös nevezőnek választani?`,
        `Közös nevezőnek jó a ${m}, mert a ${valt === 2 ? d : b + ' és a ' + d} is osztója.`,
        `Írd át: ${balAlak}, és ${c}/${d} = ${jobbSzamlalo}/${m}.`,
      ],
      megoldas: [
        `Közös nevező: ${m} (a nevezők legkisebb közös többszöröse).`,
        `${balAlak}; ${c}/${d} = ${jobbSzamlalo}/${m}.`,
        `${balSzamlalo}/${m} ${jel} ${jobbSzamlalo}/${m} = ${szamlalo}/${m} = <strong>${eredmeny}</strong> (tizedes alakban ≈ ${f(helyes, 3)}).`,
      ],
      magyarazat: [
        `A törteket csak akkor tudjuk ${valt === 0 ? 'összeadni' : 'kivonni'}, ha ugyanannyi részre vannak osztva, vagyis egyforma a nevezőjük. Itt nem egyforma, ezért közös nevezőt keresünk.`,
        `A legkisebb szám, amely mindkét nevezővel osztható: ${m}. Úgy kapjuk meg az új törteket, hogy a számlálót és a nevezőt ugyanazzal a számmal szorozzuk (ettől a tört értéke nem változik): ${balAlak}, illetve ${c}/${d} = ${jobbSzamlalo}/${m}.`,
        `Most már ${m} részre osztott egységekből ${valt === 0 ? 'rakunk össze' : 'veszünk el'}: ${balSzamlalo} ${jel} ${jobbSzamlalo} = ${szamlalo}, tehát ${szamlalo}/${m}, egyszerűsítve ${eredmeny}.`,
        `Józan ésszel: tizedes alakban ${f(balSzamlalo / m, 3)} ${jel} ${f(jobbSzamlalo / m, 3)} = ${f(helyes, 3)}, és ez egyezik az ${eredmeny} értékével.`,
      ],
      jegyezze: 'Különböző nevezőjű törteket csak közös nevezőre hozás után lehet összeadni és kivonni; a számlálót és a nevezőt ugyanazzal a számmal szorozd.',
    });
  });
}

// ---- S2: tört része, tört négyzete ----
function S2(rng) {
  const valt = egesz(rng, 0, 1); // 0: egy szám p/q része, 1: tört négyzete
  return probal(() => {
    if (valt === 0) {
      const q = valaszt(rng, [3, 4, 5, 6, 8]);
      const p = egesz(rng, 1, q - 1);
      if (lnko(p, q) !== 1) return null;
      const k = egesz(rng, 2, 12);
      const N = q * k;
      const helyes = k * p;
      return egyMezos({
        szoveg: `Mennyi ${az(N)} szám ${p}/${q} része?`,
        helyes, tizedes: 0,
        hibak: [
          { ertek: N / q, uzenet: `Ez csak egyetlen rész (az egészet ${q} egyenlő részre osztva). A keresett rész ennek ${p}-szorosa.` },
          { ertek: (N * q) / p, uzenet: 'Fordítva számoltál: a tört részét úgy kapjuk, hogy osztunk a nevezővel és szorzunk a számlálóval.' },
        ],
        ellenproba: (w) => `Ellenpróba: ha ${f(w)} lenne a válasz, akkor ${f(w)} : ${p} · ${q} = ${f((w / p) * q)} adódna az egészre, de az egész ${f(N)}.`,
        tippek: [
          `Hány egyenlő részre kell osztani a számot (${f(N)}), és ebből hányat kell venni?`,
          `Számold ki: ${f(N)} : ${q}. Ez az egyetlen rész.`,
          `Az egy rész ${f(N / q)}, ebből ${p} részt kell venni.`,
        ],
        megoldas: [
          `A ${f(N)} ${q} egyenlő része: ${f(N)} : ${q} = ${f(N / q)}.`,
          `${p} ilyen rész: ${p} · ${f(N / q)} = <strong>${f(helyes)}</strong>.`,
        ],
        magyarazat: [
          `A ${p}/${q} azt jelenti: az egészet ${q} egyenlő részre osztjuk, és ebből ${p} darabot veszünk.`,
          `Először osztunk: ${f(N)} : ${q} = ${f(N / q)} az egyetlen rész nagysága. Aztán szorzunk: ${p} · ${f(N / q)} = ${f(helyes)}.`,
          `Józan ésszel: az egésznek (${f(N)}) a ${p}/${q} része kisebb, mint az egész, és tényleg ${f(helyes)} < ${f(N)}. Visszaszámolva: ${f(helyes)} : ${p} · ${q} = ${f(N)}.`,
        ],
        jegyezze: 'A tört része: előbb osztás a nevezővel, aztán szorzás a számlálóval.',
      });
    }
    const q = valaszt(rng, [3, 4, 5, 6, 7, 8, 9]);
    const p = egesz(rng, 1, q - 1);
    if (lnko(p, q) !== 1) return null;
    const helyes = (p * p) / (q * q);
    const eredmeny = tortSzoveg(p * p, q * q);
    return egyMezos({
      szoveg: `Mennyi (${p}/${q})² értéke?`,
      utasitas: TORT_UTASITAS,
      helyes, tizedes: 3,
      hibak: [
        { ertek: (2 * p) / q, uzenet: 'A négyzet nem a kétszeres: a törtet önmagával kell megszorozni.' },
        { ertek: (p * p) / q, uzenet: 'A nevezőt is négyzetre kell emelni: a számlálót és a nevezőt is önmagával szorozzuk.' },
      ],
      ellenproba: (w) => `Ellenpróba: ${f(w, 3)} gyöke ≈ ${f(Math.sqrt(Math.abs(w)), 3)}, de ${p}/${q} ≈ ${f(p / q, 3)} – ezeknek egyezniük kellene.`,
      tippek: [
        `Mit jelent a négyzetre emelés: mennyiszer és mivel kell szorozni a törtet?`,
        `(${p}/${q})² = ${p}/${q} · ${p}/${q}. Törtet törttel úgy szorzunk, hogy a számlálót a számlálóval, a nevezőt a nevezővel.`,
        `A számláló ${p} · ${p} = ${p * p}, a nevező ${q} · ${q} = ${q * q}.`,
      ],
      megoldas: [`(${p}/${q})² = ${p}/${q} · ${p}/${q} = ${p * p}/${q * q} = <strong>${eredmeny}</strong>.`],
      magyarazat: [
        `A négyzetre emelés azt jelenti, hogy a számot önmagával szorozzuk. A tört esetén a számláló és a nevező is önmagával szorzódik.`,
        `A számláló: ${p} · ${p} = ${p * p}. A nevező: ${q} · ${q} = ${q * q}. Így ${p * p}/${q * q}, ami ${eredmeny}.`,
        `Józan ésszel: egy egynél kisebb szám négyzete még kisebb. A ${f(p / q, 3)} négyzete ${f(helyes, 3)}, tényleg kisebb.`,
      ],
      jegyezze: 'Tört négyzete: a számlálót és a nevezőt is négyzetre emeljük. Egynél kisebb szám négyzete kisebb a számnál.',
    });
  });
}

// ---- S3: pozitív osztók száma ----
function S3(rng) {
  return probal(() => {
    const N = valaszt(rng, [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 60, 72, 84, 90, 96, 100]);
    const d = osztokSzama(N);
    const lista = [];
    for (let i = 1; i <= N; i++) if (N % i === 0) lista.push(i);
    return egyMezos({
      szoveg: `Hány pozitív osztója van ${az(N)} számnak?`,
      helyes: d, tizedes: 0,
      hibak: [
        { ertek: d - 2, uzenet: 'Az 1 és maga a szám is osztó. Ezeket is meg kell számolni.' },
        { ertek: d - 1, uzenet: 'Az 1 és maga a szám is osztó. Mindkettőt számold bele.' },
      ],
      ellenproba: (w) => `Ellenpróba: ha ${f(w)} osztó lenne, akkor a ${f(N)} osztóit felsorolva ${f(w)} számot kellene találnod. A felsorolás: ${lista.join(', ')}, ennyi nem jön ki.`,
      tippek: [
        `Melyik számokkal osztható maradék nélkül a ${f(N)}, ha sorban próbálgatod őket?`,
        `Az osztók párban járnak: ha az 1 osztó, akkor a ${f(N)} is az; ha a 2 osztó, akkor a ${f(N / 2)} is (ha egész).`,
        `Írd le a párokat egymás után, és számold meg az összes különböző számot.`,
      ],
      megoldas: [
        `A ${f(N)} osztói: ${lista.join(', ')}.`,
        `Ez összesen <strong>${d}</strong> osztó.`,
      ],
      magyarazat: [
        `Egy szám osztója az a szám, amellyel maradék nélkül elosztható. Mindig osztó az 1 és maga a szám.`,
        `A ${f(N)} osztóit rendszerben keressük: 1-től indulva megnézzük, melyik számmal osztható. Az osztók párban járnak, mert ha a · b = ${f(N)}, akkor a és b is osztó.`,
        `Az osztók: ${lista.join(', ')}. Ezek száma ${d}.`,
        `Józan ésszel: nagyobb szám, mint ${f(N)}, nem lehet osztó, és minden osztó párjának is osztónak kell lennie. A felsorolt ${d} szám között ez teljesül.`,
      ],
      jegyezze: 'Az osztókat párokban keresd (1 és a szám, aztán 2 és a fele, …). Az 1 és maga a szám is osztó.',
    });
  });
}

// ---- S4: legnagyobb közös osztó, legkisebb közös többszörös ----
function S4(rng) {
  const lkktE = egesz(rng, 0, 1) === 1;
  return probal(() => {
    const g = egesz(rng, 2, 12);
    const m1 = egesz(rng, 2, 9), m2 = egesz(rng, 2, 9);
    if (m1 === m2 || lnko(m1, m2) !== 1) return null;
    const a = g * m1, b = g * m2;
    const l = lkkt(a, b);
    const helyes = lkktE ? l : g;
    return egyMezos({
      szoveg: lkktE
        ? `Mennyi ${az(a)} és ${az(b)} legkisebb közös többszöröse?`
        : `Mennyi ${az(a)} és ${az(b)} legnagyobb közös osztója?`,
      helyes, tizedes: 0,
      hibak: lkktE
        ? [{ ertek: a * b, uzenet: 'Ez közös többszörös, de nem a legkisebb. A szorzat csak akkor a legkisebb, ha a két számnak nincs közös osztója.' }, { ertek: g, uzenet: 'Ez a legnagyobb közös osztó, de többszöröst kérdeznek: a számoknál nem kisebb szám kell.' }]
        : [{ ertek: l, uzenet: 'Ez a legkisebb közös többszörös. Osztót kérdeznek: a két számnál nem nagyobb szám kell.' }, { ertek: Math.min(a, b), uzenet: 'A kisebbik szám nem biztos, hogy a másiknak is osztója.' }],
      ellenproba: lkktE
        ? (w) => `Ellenpróba: ${f(w)} : ${f(a)} = ${f(w / a, 2)} és ${f(w)} : ${f(b)} = ${f(w / b, 2)}. Mindkettőnek egész számnak kellene lennie.`
        : (w) => `Ellenpróba: ${f(a)} : ${f(w)} = ${f(a / w, 2)} és ${f(b)} : ${f(w)} = ${f(b / w, 2)}. Mindkettőnek egész számnak kellene lennie.`,
      tippek: [
        lkktE ? `Melyik szám többszöröse egyszerre ${az(a)} és ${az(b)} számnak is?` : `Mely számokkal osztható ${az(a)} és ${az(b)} is?`,
        lkktE ? `Sorold fel a nagyobbik szám többszöröseit, és nézd meg, melyik osztható a kisebbikkel is.` : `Írd fel mindkét szám osztóit, és keresd meg a közöseket.`,
        lkktE ? `A nagyobbik szám többszörösei: ${f(Math.max(a, b))}, ${f(2 * Math.max(a, b))}, ${f(3 * Math.max(a, b))}, …` : `Bontsd mindkét számot törzstényezőkre, a közös tényezők szorzata a keresett szám.`,
      ],
      megoldas: lkktE
        ? [`${f(a)} = ${g} · ${m1}, ${f(b)} = ${g} · ${m2}.`, `A közös tényezőt (${g}) csak egyszer vesszük: ${g} · ${m1} · ${m2} = <strong>${f(l)}</strong>.`]
        : [`${f(a)} = ${g} · ${m1}, ${f(b)} = ${g} · ${m2}; ${m1} és ${m2} már nem osztható közös számmal.`, `A legnagyobb közös osztó <strong>${g}</strong>.`],
      magyarazat: lkktE ? [
        `A közös többszörös olyan szám, amely mindkét számnak többszöröse. A legkisebb ilyen számot keressük.`,
        `A ${f(a)} és a ${f(b)} is felírható úgy, hogy közös tényezőjük a ${g}: ${f(a)} = ${g} · ${m1}, ${f(b)} = ${g} · ${m2}. A közös tényezőt (${g}) elég egyszer venni.`,
        `A szorzat: ${g} · ${m1} · ${m2} = ${f(l)}. Józan ésszel: ${f(l)} : ${f(a)} = ${f(l / a)} és ${f(l)} : ${f(b)} = ${f(l / b)}, mindkettő egész szám.`,
      ] : [
        `A közös osztó olyan szám, amellyel mindkét szám osztható. A legnagyobb ilyet keressük.`,
        `A ${f(a)} = ${g} · ${m1} és a ${f(b)} = ${g} · ${m2}. A ${m1} és a ${m2} között már nincs közös osztó (az 1-et kivéve), ezért a ${g} a legnagyobb közös osztó.`,
        `Józan ésszel: ${f(a)} : ${g} = ${f(m1)} és ${f(b)} : ${g} = ${f(m2)}, mindkettő egész szám, és ennél nagyobb szám már nem osztja mindkettőt.`,
      ],
      jegyezze: 'LNKO: a közös osztók közül a legnagyobb. LKKT: a közös többszörösök közül a legkisebb. Közös tényező esetén az LKKT = a szorzat osztva az LNKO-val.',
    });
  });
}

export default {
  id: 'fv-szamok',
  sor: 'felveteli',
  cim: 'Számok, törtek, oszthatóság',
  rovid: 'Törtek összeadása és kivonása, tört része, osztók, legnagyobb közös osztó és legkisebb közös többszörös.',
  kulcskeplet: '<span class="keplet-nagy">a/b ± c/d = (a·k ± c·l) / m</span>',
  kulcsMagyarazat: [
    'Először közös nevezőt keresünk (a nevezők legkisebb közös többszörösét), aztán a számlálókat átírjuk, és csak ezután adunk össze vagy vonunk ki.',
  ],
  elmelet: [
    '<strong>Mi a tört?</strong> Az egészet egyenlő részekre osztjuk. A <strong>nevező</strong> megmondja, hány egyenlő részre osztottuk, a <strong>számláló</strong> pedig azt, hogy ebből hányat vettünk. Például a 3/4 egy negyedekre vágott pizza, amelyből három szeletet veszel.',
    '<strong>Bővítés és egyszerűsítés:</strong> ha a számlálót és a nevezőt ugyanazzal a számmal szorzod (bővítesz) vagy osztod (egyszerűsítesz), a tört értéke nem változik. Például 1/2 = 2/4 = 3/6 = 5/10, és 6/8 = 3/4.',
    '<strong>Összeadás, kivonás:</strong> csak azonos nevezőjű törteket lehet összeadni vagy kivonni. Ezért előbb <strong>közös nevezőt</strong> keresel: olyan számot, amely mindkét nevezővel osztható (a legkisebb ilyen a nevezők legkisebb közös többszöröse). Bővítsd mindkét törtet erre a nevezőre, aztán csak a számlálókat add össze vagy vond ki, a nevező marad. Példa: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.',
    '<strong>Tipikus hiba:</strong> az 1/2 + 1/3 nem 2/5! A számlálót a számlálóhoz, a nevezőt a nevezőhöz adni hiba. Ellenőrizd józan ésszel: az 1/2-nél többet kell kapnod, a 2/5 viszont kevesebb, mint az 1/2.',
    '<strong>Egész szám és tört:</strong> az egész számot írd át törtté ugyanazzal a nevezővel, mint a másik tört. Például 2 = 6/3 (mert 2 · 3 = 6), így 2 − 2/3 = 6/3 − 2/3 = 4/3.',
    '<strong>Egy szám tört része:</strong> a szám p/q része = (szám : q) · p. Előbb elosztod a nevezővel (ez az egyetlen rész), aztán megszorzod a számlálóval. Például 12 háromnegyed része: 12 : 4 = 3, és 3 · 3 = 9. <strong>Tört négyzete:</strong> a számlálót és a nevezőt is négyzetre emeled: (2/3)² = 4/9.',
    '<strong>Osztók:</strong> egy szám osztója az a szám, amellyel maradék nélkül osztható. Az osztók párokban járnak: ha 4 · 9 = 36, akkor a 4 és a 9 is osztó. Az 1 és maga a szám mindig osztó. Oszthatósági szabályok: 2-vel osztható, ha az utolsó számjegye páros; 5-tel, ha 0 vagy 5; 10-zel, ha 0; 3-mal (9-cel), ha a számjegyek összege osztható 3-mal (9-cel); 4-gyel, ha az utolsó két számjegyből álló szám osztható 4-gyel.',
    '<strong>LNKO és LKKT:</strong> bontsd mindkét számot törzstényezőkre. A <strong>legnagyobb közös osztó</strong> (LNKO) a közös törzstényezők szorzata (mindegyiket a kisebbik hatványon), a <strong>legkisebb közös többszörös</strong> (LKKT) minden törzstényezőt tartalmaz a nagyobbik hatványon. Példa: 36 = 2² · 3², 48 = 2⁴ · 3. LNKO = 2² · 3 = 12, LKKT = 2⁴ · 3² = 144. Ellenőrzés: 12 · 144 = 1728 = 36 · 48.',
  ],
  peldak: [
    { cim: 'Törtek összege (különböző nevező)', feladat: 'Számítsd ki: 5/6 + 7/12.',
      lepesek: ['Nézd meg a nevezőket: 6 és 12. A 12 osztható 6-tal, ezért a közös nevező a 12.', 'Bővítsd az 5/6-ot kettővel (a számlálót és a nevezőt is): 5/6 = 10/12.', 'Most már azonos a nevező, add össze a számlálókat: 10/12 + 7/12 = 17/12.', 'Egyszerűsíteni nem lehet, mert a 17 prímszám. 17/12 = 1 egész 5/12, tizedes törtként ≈ 1,417.', 'Ellenőrzés: 5/6 ≈ 0,833 és 7/12 ≈ 0,583. Az összegük ≈ 1,417 ✓.'] },
    { cim: 'Törtek különbsége', feladat: 'Számítsd ki: 3/4 − 2/5.',
      lepesek: ['A nevezők 4 és 5. Nincs közös osztójuk, ezért a közös nevező a szorzatuk: 20.', 'Bővítsd mindkettőt: 3/4 = 15/20 (mert 20 : 4 = 5, és 3 · 5 = 15), 2/5 = 8/20 (mert 20 : 5 = 4, és 2 · 4 = 8).', 'Vond ki a számlálókat: 15/20 − 8/20 = 7/20.', 'Tizedes törtként: 0,75 − 0,4 = 0,35 = 7/20 ✓.'] },
    { cim: 'Egész szám és tört különbsége', feladat: 'Számítsd ki: 2 − 2/3.',
      lepesek: ['A 2-t írd át harmadokra: 2 = 6/3, mert 2 · 3 = 6.', 'Vond ki: 6/3 − 2/3 = 4/3.', '4/3 = 1 egész 1/3 ≈ 1,333. Ez kevesebb, mint 2, ahogy várható ✓.'] },
    { cim: 'Tört része, tört négyzete', feladat: 'a) Mennyi a 36 5/6 része? b) Mennyi (3/4)² értéke?',
      lepesek: ['a) Osszd a 36-ot 6 egyenlő részre: 36 : 6 = 6. Ebből 5 részt veszel: 5 · 6 = 30.', 'Ellenőrzés: 30 kevesebb, mint 36, és 30 : 36 = 5/6 ✓.', 'b) A számlálót és a nevezőt is négyzetre emeled: 3² = 9 és 4² = 16, így (3/4)² = 9/16.', 'Tizedes törtként 0,75 · 0,75 = 0,5625 = 9/16 ✓. Egynél kisebb szám négyzete kisebb a számnál (0,5625 < 0,75).'] },
    { cim: 'Osztók száma', feladat: 'Hány pozitív osztója van a 36-nak?',
      lepesek: ['Keresd a szorzatpárokat: 1 · 36, 2 · 18, 3 · 12, 4 · 9, 6 · 6.', 'Írd fel az osztókat: 1, 2, 3, 4, 6, 9, 12, 18, 36. A 6-ot csak egyszer számold (6 · 6 = 36).', 'Összesen <strong>9</strong> osztó van.', 'Ellenőrzés: ha a 12 osztó, akkor 36 : 12 = 3 is az, és mindkettő a listában van ✓.'] },
    { cim: 'Legnagyobb közös osztó, legkisebb közös többszörös', feladat: 'a) Mennyi a 36 és a 48 legnagyobb közös osztója és legkisebb közös többszöröse? b) Mennyi a 125 és a 20 legkisebb közös többszöröse?',
      lepesek: ['a) 36 = 2 · 2 · 3 · 3 és 48 = 2 · 2 · 2 · 2 · 3.', 'Közös törzstényezők: 2 · 2 · 3 = 12, ez az LNKO.', 'Az LKKT-hoz minden törzstényező kell a nagyobbik hatványon: 2⁴ · 3² = 16 · 9 = 144.', 'Ellenőrzés: 144 : 36 = 4 és 144 : 48 = 3, mindkettő egész ✓.', 'b) 125 = 5³ és 20 = 2² · 5. LKKT = 2² · 5³ = 4 · 125 = 500. Ellenőrzés: 500 : 125 = 4 és 500 : 20 = 25 ✓.'] },
  ],
  tipusok: [
    { id: 'S1', nev: 'Törtek összeadása, kivonása', general: S1 },
    { id: 'S2', nev: 'Tört része, tört négyzete', general: S2 },
    { id: 'S3', nev: 'Pozitív osztók száma', general: S3 },
    { id: 'S4', nev: 'Legnagyobb közös osztó, legkisebb közös többszörös', general: S4 },
  ],
  peldaEllenorzes() {
    return [
      { nev: '1. példa: 5/6 + 7/12', kapott: tortMuvelet(5, 6, 7, 12, 1), vart: 17 / 12 },
      { nev: '1. példa: közös nevező', kapott: lkkt(6, 12), vart: 12 },
      { nev: '1. példa: számláló', kapott: 5 * 2 + 7, vart: 17 },
      { nev: '2. példa: 3/4 − 2/5', kapott: tortMuvelet(3, 4, 2, 5, -1), vart: 0.35 },
      { nev: '2. példa: közös nevező', kapott: lkkt(4, 5), vart: 20 },
      { nev: '2. példa: számláló', kapott: 3 * 5 - 2 * 4, vart: 7 },
      { nev: '3. példa: 2 − 2/3', kapott: tisztit(2 - 2 / 3), vart: tisztit(4 / 3) },
      { nev: '3. példa: 4/3 tizedes alakja', kapott: Math.round((4 / 3) * 1000) / 1000, vart: 1.333 },
      { nev: '4. példa: 36 5/6 része', kapott: (36 / 6) * 5, vart: 30 },
      { nev: '4. példa: (3/4)²', kapott: (3 / 4) ** 2, vart: 0.5625 },
      { nev: '5. példa: osztók 36', kapott: osztokSzama(36), vart: 9 },
      { nev: '6. példa: LNKO(36, 48)', kapott: lnko(36, 48), vart: 12 },
      { nev: '6. példa: LKKT(36, 48)', kapott: lkkt(36, 48), vart: 144 },
      { nev: '6. példa: LNKO · LKKT', kapott: lnko(36, 48) * lkkt(36, 48), vart: 36 * 48 },
      { nev: '6. példa: LKKT(125, 20)', kapott: lkkt(125, 20), vart: 500 },
    ];
  },
};
