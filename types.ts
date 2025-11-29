export interface BirthDetails {
  date: string;
  time: string;
  location: string;
  name: string;
}

export enum ZodiacSign {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces"
}

export interface PlanetPosition {
  name: string; // Sun, Moon, Mercury, etc.
  sign: ZodiacSign;
  degree: number; // 0-29.99
  house: number; // 1-12
  isRetrograde: boolean;
}

export interface ChartAnalysis {
  planets: PlanetPosition[];
  bigThree: {
    sun: { sign: string; summary: string };
    moon: { sign: string; summary: string };
    rising: { sign: string; summary: string };
  };
  overview: string;
  elementalBalance: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
