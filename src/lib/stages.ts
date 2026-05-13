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
    name: "Półfinał 1",
    round: "Noc otwarcia",
    date: "13 maja",
    tagline: "Mocne kolory, chwytliwe refreny i pierwsze eliminacje.",
    description:
      "Arena otwiera się nieoczywistymi hitami, dramatycznymi balladami i krajami walczącymi o pierwszy wielki nagłówek.",
    entries: [
      {
        id: "sf1-sweden",
        country: "Szwecja",
        artist: "Lina Storm",
        song: "Electric Halo",
        note: "Laserowy pop z refrenem skrojonym pod finałową minutę.",
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
        note: "Powoli narastający dramatyzm i finałowa zmiana tonacji stworzona pod kamery.",
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
        country: "AU",
        artist: "Solar Echo",
        song: "Chrome Hearts",
        note: "https://www.youtube.com/watch?v=kYI9458O2G8",
        accentFrom: "#ffd166",
        accentTo: "#df8eff",
      },
    ],
  },
  {
    id: "semi-final-2",
    name: "Półfinał 2",
    round: "Noc presji",
    date: "15 maja",
    tagline: "Czystsza realizacja, większe ryzyko i mniejszy margines błędu.",
    description:
      "Ten konkurs opiera się na kontraście: jedna piosenka wywołuje łzy, a następna wchodzi w pełnym trybie stroboskopów.",
    entries: [
      {
        id: "sf2-norway",
        country: "Norwegia",
        artist: "Aurora Line",
        song: "Midnight Voltage",
        note: "Lodowata kontrola wokalu na tle pulsującej elektroniki.",
        accentFrom: "#8ef7ff",
        accentTo: "#00a8ff",
      },
      {
        id: "sf2-greece",
        country: "Grecja",
        artist: "Iris Vale",
        song: "Golden Sparks",
        note: "Śródziemnomorskie ciepło z refrenem, który trafia od razu.",
        accentFrom: "#ffd166",
        accentTo: "#ff9f1c",
      },
      {
        id: "sf2-poland",
        country: "Polska",
        artist: "Vanta",
        song: "Heart on Firewire",
        note: "Pełne dramatyzmu wokale opakowane w metaliczną klubową produkcję.",
        accentFrom: "#ff6b98",
        accentTo: "#df8eff",
      },
      {
        id: "sf2-estonia",
        country: "Estonia",
        artist: "Pixel Sky",
        song: "Gravity Bloom",
        note: "Minimalistyczne zwrotki, wybuchowy drop i perfekcyjne światła.",
        accentFrom: "#00eefc",
        accentTo: "#d878ff",
      },
      {
        id: "sf2-armenia",
        country: "Armenia",
        artist: "Arin",
        song: "Glass Anthem",
        note: "Teatralne napięcie, które kończy się wspólnym śpiewem całej sali.",
        accentFrom: "#df8eff",
        accentTo: "#ffd166",
      },
    ],
  },
  {
    id: "grand-final",
    name: "Wielki finał",
    round: "Główne wydarzenie",
    date: "17 maja",
    tagline: "Wszystko jest jaśniejsze, głośniejsze, ciaśniej spięte i pod lupą.",
    description:
      "Finał to moment, w którym widowisko musi przetrwać każde powtórzenie. Każdy punkt wydaje się publiczny i ostateczny.",
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
        country: "Włochy",
        artist: "Rosso Vega",
        song: "Circuito",
        note: "Gładka charyzma i żywy aranż z zespołem, który naprawdę ma pazur.",
        accentFrom: "#ffd166",
        accentTo: "#ff6b98",
      },
      {
        id: "gf-finland",
        country: "Finlandia",
        artist: "Polar Jam",
        song: "Voltage Parade",
        note: "Kontrolowany chaos zaprojektowany tak, by porwać salę w trzydzieści sekund.",
        accentFrom: "#00eefc",
        accentTo: "#8ef7ff",
      },
      {
        id: "gf-spain",
        country: "Hiszpania",
        artist: "Luz Marina",
        song: "Noches de Neon",
        note: "Perkusyjny dramatyzm, choreografia fanów i sprint w finałowym refrenie.",
        accentFrom: "#ff9f1c",
        accentTo: "#ffd166",
      },
      {
        id: "gf-netherlands",
        country: "Holandia",
        artist: "Low Tide",
        song: "Signal Bloom",
        note: "Intymne zwrotki rozwijające się w szeroko rozlany elektroniczny finał.",
        accentFrom: "#8ef7ff",
        accentTo: "#d878ff",
      },
      {
        id: "gf-switzerland",
        country: "Szwajcaria",
        artist: "Sora",
        song: "Crystal Current",
        note: "Krystalicznie czysty detal występu z precyzją skrojoną pod oceny.",
        accentFrom: "#df8eff",
        accentTo: "#00eefc",
      },
    ],
  },
];

export function getStageById(stageId: string) {
  return STAGES.find((stage) => stage.id === stageId) ?? null;
}
