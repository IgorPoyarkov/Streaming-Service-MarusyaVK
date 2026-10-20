import {
  MovieDetailsSchema,
  type Movie,
  type MovieDetails,
} from "../../services/movies/movies.schema";

interface DetailsFilmProps {
  film: Movie;
}

const languageTranslations: Record<string, string> = {
  ru: "Русский",
  en: "Английский",
  fr: "Французский",
  es: "Испанский",
  de: "Немецкий",
  ja: "Японский",
  it: "Итальянский",
  te: "Телугу (Индия)",
  ml: "Мали",
  tl: "Восточный Тимор",
  cn: "Китайский",
  zh: "Тайваньский",
};

const nameFields: Record<keyof MovieDetails, string> = {
  language: "Язык оригинала",
  budget: "Бюджет",
  awardsSummary: "Награды",
  director: "Режиссёр",
  production: "Продакшен",
  revenue: "Выручка",
};

const DetailsFilm = ({ film }: DetailsFilmProps) => {
  if (!film) return null;

  const allFields = Object.keys(MovieDetailsSchema.shape) as Array<
    keyof MovieDetails
  >;

  const activeFields = allFields.filter((field) => {
    const value = film[field];
    return value !== null && value !== undefined && value !== "";
  });

  if (activeFields.length === 0) return null;

  return (
    <div className="details-film">
      <p className="details-film__title">{`О\u00A0фильме`}</p>

      <ul className="details-film__list">
        {activeFields.map((field) => {
          let displayValue = film[field]!.toString();

          if (field === "language") {
            displayValue =
              languageTranslations[displayValue] || displayValue.toUpperCase();
          }

          return (
            <li key={field} className="details-film__item">
              <div className="details-film__section">
                <span className="details-film__section-item details-film__section-name">
                  {nameFields[field]}
                </span>
                <span className="details-film__section-item details-film__section-value">
                  {field === "budget" || field === "revenue"
                    ? `${Number(displayValue).toLocaleString("ru-RU")} руб.`
                    : `${displayValue}`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DetailsFilm;
