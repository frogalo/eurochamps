export interface StageEntry {
  id: string;
  country: string;
  artist: string;
  song: string;
  note: string;
  accentFrom: string;
  accentTo: string;
}

export interface StageDefinition {
  id: string;
  name: string;
  round: string;
  date: string;
  tagline: string;
  description: string;
  entries: StageEntry[];
}

export const STAGES: StageDefinition[] = [
  {
    id: "semi-final-1",
    name: "Polfinal 1",
    round: "Noc otwarcia",
    date: "13 maja",
    tagline: "Mocne kolory, chwytliwe refreny i pierwsze eliminacje.",
    description:
      "Arena otwiera sie nieoczywistymi hitami, dramatycznymi balladami i krajami walczacymi o pierwszy wielki naglowek.",
    entries: [
      {
        id: "sf1-sweden",
        country: "Szwecja",
        artist: "Lina Storm",
        song: "Electric Halo",
        note: "Laserowy pop z refrenem skrojonym pod finalowa minute.",
        accentFrom: "#df8eff",
        accentTo: "#00eefc",
      },
      {
        id: "sf1-ukraine",
        country: "Ukraina",
        artist: "Nova Karta",
        song: "Afterglow Signal",
        note: "Perkusyjne folkowe motywy przecinajace futurystyczny beat.",
        accentFrom: "#ff6b98",
        accentTo: "#ffd166",
      },
      {
        id: "sf1-portugal",
        country: "Portugalia",
        artist: "Mar Azul",
        song: "Velvet Static",
        note: "Powoli narastajacy dramatyzm i finalowa zmiana tonacji stworzona pod kamery.",
        accentFrom: "#00eefc",
        accentTo: "#8ef7ff",
      },
      {
        id: "sf1-czechia",
        country: "Czechy",
        artist: "Night Transit",
        song: "Run the Neon",
        note: "Mroczny syntezatorowy nacisk i bezlitosne uniesienie po refrenie.",
        accentFrom: "#d878ff",
        accentTo: "#ff6b98",
      },
      {
        id: "sf1-australia",
        country: "Australia",
        artist: "Solar Echo",
        song: "Chrome Hearts",
        note: "Arena rock przepisany na precyzyjny dance-pop.",
        accentFrom: "#ffd166",
        accentTo: "#df8eff",
      },
    ],
  },
  {
    id: "semi-final-2",
    name: "Polfinal 2",
    round: "Noc presji",
    date: "15 maja",
    tagline: "Czystsza realizacja, wieksze ryzyko i mniejszy margines bledu.",
    description:
      "Ten etap opiera sie na kontrascie: jedna piosenka wywoluje lzy, a nastepna wchodzi w pelnym trybie stroboskopow.",
    entries: [
      {
        id: "sf2-norway",
        country: "Norwegia",
        artist: "Aurora Line",
        song: "Midnight Voltage",
        note: "Lodowata kontrola wokalu na tle pulsujacej elektroniki.",
        accentFrom: "#8ef7ff",
        accentTo: "#00a8ff",
      },
      {
        id: "sf2-greece",
        country: "Grecja",
        artist: "Iris Vale",
        song: "Golden Sparks",
        note: "Srodziemnomorskie cieplo z refrenem, ktory trafia od razu.",
        accentFrom: "#ffd166",
        accentTo: "#ff9f1c",
      },
      {
        id: "sf2-poland",
        country: "Polska",
        artist: "Vanta",
        song: "Heart on Firewire",
        note: "Pelne dramatyzmu wokale opakowane w metaliczna klubowa produkcje.",
        accentFrom: "#ff6b98",
        accentTo: "#df8eff",
      },
      {
        id: "sf2-estonia",
        country: "Estonia",
        artist: "Pixel Sky",
        song: "Gravity Bloom",
        note: "Minimalistyczne zwrotki, wybuchowy drop i perfekcyjne swiatla.",
        accentFrom: "#00eefc",
        accentTo: "#d878ff",
      },
      {
        id: "sf2-armenia",
        country: "Armenia",
        artist: "Arin",
        song: "Glass Anthem",
        note: "Teatralne napiecie, ktore konczy sie wspolnym spiewem calej sali.",
        accentFrom: "#df8eff",
        accentTo: "#ffd166",
      },
    ],
  },
  {
    id: "grand-final",
    name: "Wielki final",
    round: "Glowne wydarzenie",
    date: "17 maja",
    tagline: "Wszystko jest jasniejsze, glosniejsze, ciasniej spiete i pod lupa.",
    description:
      "Final to moment, w ktorym widowisko musi przetrwac kazde powtorzenie. Kazdy punkt wydaje sie publiczny i ostateczny.",
    entries: [
      {
        id: "gf-france",
        country: "Francja",
        artist: "Celeste Noir",
        song: "Avenue Lumiere",
        note: "Filmowy popis wokalny, ktory zyskuje dzieki ciszy przed uderzeniem.",
        accentFrom: "#df8eff",
        accentTo: "#ff6b98",
      },
      {
        id: "gf-italy",
        country: "Wlochy",
        artist: "Rosso Vega",
        song: "Circuito",
        note: "Gladka charyzma i zywy aranz z zespolem, ktory naprawde ma pazur.",
        accentFrom: "#ffd166",
        accentTo: "#ff6b98",
      },
      {
        id: "gf-finland",
        country: "Finlandia",
        artist: "Polar Jam",
        song: "Voltage Parade",
        note: "Kontrolowany chaos zaprojektowany tak, by porwac sale w trzydziesci sekund.",
        accentFrom: "#00eefc",
        accentTo: "#8ef7ff",
      },
      {
        id: "gf-spain",
        country: "Hiszpania",
        artist: "Luz Marina",
        song: "Noches de Neon",
        note: "Perkusyjny dramatyzm, choreografia fanow i sprint w finalowym refrenie.",
        accentFrom: "#ff9f1c",
        accentTo: "#ffd166",
      },
      {
        id: "gf-netherlands",
        country: "Holandia",
        artist: "Low Tide",
        song: "Signal Bloom",
        note: "Intymne zwrotki rozwijajace sie w szeroko rozlany elektroniczny final.",
        accentFrom: "#8ef7ff",
        accentTo: "#d878ff",
      },
      {
        id: "gf-switzerland",
        country: "Szwajcaria",
        artist: "Sora",
        song: "Crystal Current",
        note: "Krystalicznie czysty detal wystepu z precyzja skrojona pod jury.",
        accentFrom: "#df8eff",
        accentTo: "#00eefc",
      },
    ],
  },
];

export function getStageById(stageId: string) {
  return STAGES.find((stage) => stage.id === stageId) ?? null;
}
