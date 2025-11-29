import { ZodiacSign } from "./types";

export const ZODIAC_ORDER = [
  ZodiacSign.Aries,
  ZodiacSign.Taurus,
  ZodiacSign.Gemini,
  ZodiacSign.Cancer,
  ZodiacSign.Leo,
  ZodiacSign.Virgo,
  ZodiacSign.Libra,
  ZodiacSign.Scorpio,
  ZodiacSign.Sagittarius,
  ZodiacSign.Capricorn,
  ZodiacSign.Aquarius,
  ZodiacSign.Pisces,
];

export const ZODIAC_COLORS: Record<ZodiacSign, string> = {
  [ZodiacSign.Aries]: "#ef4444", // Red-500
  [ZodiacSign.Taurus]: "#22c55e", // Green-500
  [ZodiacSign.Gemini]: "#eab308", // Yellow-500
  [ZodiacSign.Cancer]: "#94a3b8", // Slate-400 (Silver/White)
  [ZodiacSign.Leo]: "#f59e0b", // Amber-500 (Gold)
  [ZodiacSign.Virgo]: "#15803d", // Green-700
  [ZodiacSign.Libra]: "#f472b6", // Pink-400
  [ZodiacSign.Scorpio]: "#7f1d1d", // Red-900
  [ZodiacSign.Sagittarius]: "#6366f1", // Indigo-500
  [ZodiacSign.Capricorn]: "#3f3f46", // Zinc-700
  [ZodiacSign.Aquarius]: "#06b6d4", // Cyan-500
  [ZodiacSign.Pisces]: "#a855f7", // Purple-500
};

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  [ZodiacSign.Aries]: "♈",
  [ZodiacSign.Taurus]: "♉",
  [ZodiacSign.Gemini]: "♊",
  [ZodiacSign.Cancer]: "♋",
  [ZodiacSign.Leo]: "♌",
  [ZodiacSign.Virgo]: "♍",
  [ZodiacSign.Libra]: "♎",
  [ZodiacSign.Scorpio]: "♏",
  [ZodiacSign.Sagittarius]: "♐",
  [ZodiacSign.Capricorn]: "♑",
  [ZodiacSign.Aquarius]: "♒",
  [ZodiacSign.Pisces]: "♓",
};

export const ZODIAC_CN: Record<string, string> = {
  [ZodiacSign.Aries]: "白羊座",
  [ZodiacSign.Taurus]: "金牛座",
  [ZodiacSign.Gemini]: "双子座",
  [ZodiacSign.Cancer]: "巨蟹座",
  [ZodiacSign.Leo]: "狮子座",
  [ZodiacSign.Virgo]: "处女座",
  [ZodiacSign.Libra]: "天秤座",
  [ZodiacSign.Scorpio]: "天蝎座",
  [ZodiacSign.Sagittarius]: "射手座",
  [ZodiacSign.Capricorn]: "摩羯座",
  [ZodiacSign.Aquarius]: "水瓶座",
  [ZodiacSign.Pisces]: "双鱼座",
};

export const ELEMENT_CN: Record<string, string> = {
  fire: "火",
  earth: "土",
  air: "风",
  water: "水"
};