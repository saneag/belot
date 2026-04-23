import en from "./en.json";
import { errors } from "./errors";
import ro from "./ro.json";
import ru from "./ru.json";

export const Localizations = {
  en: {
    ...en,
    ...errors.en,
  },
  ro: {
    ...ro,
    ...errors.ro,
  },
  ru: {
    ...ru,
    ...errors.ru,
  },
};
export type LocalizationKey = keyof typeof Localizations.en;
