export function flagUrl(code: string) {
  return `https://www.eurovision.com/static/images/flags/flag_${code.toLowerCase()}.svg`;
}

export function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function getYouTubeThumbnail(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

/** ISO 2-letter country code → Polish country name */
const COUNTRY_NAMES_PL: Record<string, string> = {
  AL: "Albania",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbejdżan",
  BE: "Belgia",
  BG: "Bułgaria",
  HR: "Chorwacja",
  CY: "Cypr",
  CZ: "Czechy",
  DK: "Dania",
  EE: "Estonia",
  FI: "Finlandia",
  FR: "Francja",
  GE: "Gruzja",
  DE: "Niemcy",
  GR: "Grecja",
  HU: "Węgry",
  IS: "Islandia",
  IE: "Irlandia",
  IL: "Izrael",
  IT: "Włochy",
  LV: "Łotwa",
  LT: "Litwa",
  LU: "Luksemburg",
  MT: "Malta",
  MD: "Mołdawia",
  ME: "Czarnogóra",
  NL: "Holandia",
  MK: "Macedonia Płn.",
  NO: "Norwegia",
  PL: "Polska",
  PT: "Portugalia",
  RO: "Rumunia",
  RU: "Rosja",
  SM: "San Marino",
  RS: "Serbia",
  SK: "Słowacja",
  SI: "Słowenia",
  ES: "Hiszpania",
  SE: "Szwecja",
  CH: "Szwajcaria",
  UA: "Ukraina",
  GB: "Wlk. Brytania",
};

/**
 * Convert a 2-letter ISO country code to a Polish country name.
 * Falls back to the code itself if not found.
 */
export function countryName(code: string): string {
  return COUNTRY_NAMES_PL[code.toUpperCase()] ?? code;
}
