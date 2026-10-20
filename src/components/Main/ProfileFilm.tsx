import {
  useAddFavoriteMovies,
  useDeleteFavoriteMovies,
  useFavoriteMovies,
  useRandomMovie,
} from "../../services/movies/movies.api";
import type { Movie } from "../../services/movies/movies.schema";
import { Link, useNavigate } from "react-router-dom";
import { useMovieUtils } from "../../hooks/useMovieUtils";
import GenreSlider from "./GenreSlider";
import Loader from "../Loader/Loader";

interface ProfileFilmProps {
  movie?: Movie;
  modifier?: string;
}

const ProfileFilm = ({ movie, modifier = "" }: ProfileFilmProps) => {
  const randomMovieQuery = useRandomMovie({
    enabled: modifier !== "drop",
  });

  const navigate = useNavigate();

  const addFavorite = useAddFavoriteMovies();
  const deleteFavoriteMutation = useDeleteFavoriteMovies();
  const { data: favorites } = useFavoriteMovies();
  const { formatTime, formatRating } = useMovieUtils();

  const film = movie || randomMovieQuery.data;
  const currentFilmId = film?.id || movie?.id;
  const isAlreadyFavorite = favorites?.some(
    (film) => film.id === currentFilmId,
  );

  const isFirstLoading =
    !movie && randomMovieQuery.isLoading && !randomMovieQuery.data;

  if (isFirstLoading) {
    return <Loader count={7} size={200} />;
  }

  function hendlerAddFilm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!currentFilmId) return;

    if (isAlreadyFavorite) {
      deleteFavoriteMutation.mutate(currentFilmId, {
        onSuccess: () => {},
        onError: () => {
          navigate("/?auth=login");
        },
      });
    } else {
      addFavorite.mutate(
        { id: currentFilmId.toString() },
        {
          onSuccess: () => {},
          onError: () => {
            navigate("/?auth=login");
          },
        },
      );
    }
  }

  function hendlerRandomFilm() {
    randomMovieQuery.refetch();
  }

  let valueModifer: string = "";
  const visuallyHidden = "visually-hidden";

  switch (modifier) {
    case "drop":
      valueModifer = "profile-film--drop";
      break;

    case "card":
      valueModifer = "profile-film--card";
      break;

    case "selected":
      valueModifer = "profile-film--card";
      break;
    default:
      valueModifer = "";
      break;
  }
  const containerClassName = `profile-film ${modifier ? valueModifer : ""}`;
  return (
    <div className={containerClassName}>
      <div className="profile-film__intelligence">
        <ul className="profile-film__intelligence-list">
          <li className="profile-film__intelligence-item">
            <div className="profile-film__intelligence-wrapper">
              <svg className="profile-film__intelligence-icon">
                <use href={"/sprite.svg#star__icon"} />
              </svg>
              <span
                className={`profile-film__intelligence-detail profile-film__intelligence-detail--rating ${formatRating(film?.tmdbRating)} ${Number(film?.tmdbRating) === 10 ? "profile-film__intelligence-detail--rating-big" : ""}`}
              >
                {Number(film?.tmdbRating).toFixed(1).replace(".", ",")}
              </span>
            </div>
          </li>
          <li className="profile-film__intelligence-item">
            <div className="profile-film__intelligence-wrapper">
              <span className="profile-film__intelligence-detail profile-film__intelligence-detail--year">
                {film?.releaseYear}
              </span>
            </div>
          </li>
          <li className="profile-film__intelligence-item">
            <div className="profile-film__intelligence-wrapper">
              <GenreSlider
                genres={film?.genres}
                isStatic={modifier === "drop"}
              />
            </div>
          </li>
          <li className="profile-film__intelligence-item">
            <div className="profile-film__intelligence-wrapper">
              <span className="profile-film__intelligence-detail profile-film__intelligence-detail--duration">
                {formatTime(film?.runtime)}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <h2 className="profile-film__title">{film?.title}</h2>
      <p className="profile-film__text">
        {film?.plot || "Описание не представлено"}
      </p>
      {modifier !== "drop" && (
        <div className="profile-film__actions">
          <ul className="profile-film__actions-list">
            <li className="profile-film__actions-item">
              <div className="profile-film__actions-wrapper">
                <Link
                  className="profile-film__actions-btn profile-film__actions-btn--trailer btn"
                  to={`/?video=${film?.id}`}
                >
                  Трейлер
                </Link>
              </div>
            </li>
            <li
              className={`profile-film__actions-item ${valueModifer !== "" && visuallyHidden}`}
            >
              <div className={`profile-film__actions-wrapper `}>
                <Link
                  className="profile-film__actions-btn profile-film__actions-btn--plot btn"
                  to={`/movie/${film?.id}`}
                >
                  {`О\u00A0фильме`}
                </Link>
              </div>
            </li>
            <li className="profile-film__actions-item">
              <div className="profile-film__actions-wrapper">
                <button
                  className={`profile-film__actions-btn profile-film__actions-btn--favorites btn ${isAlreadyFavorite ? "profile-film__actions-btn--select" : ""}`}
                  type="button"
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                  ) => hendlerAddFilm(e)}
                  disabled={addFavorite.isPending}
                >
                  <svg className="profile-film__actions-icon">
                    <use href={"/sprite.svg#little-heart__icon"} />
                  </svg>
                </button>
              </div>
            </li>
            <li
              className={`profile-film__actions-item ${valueModifer !== "" && visuallyHidden}`}
            >
              <div className="profile-film__actions-wrapper">
                <button
                  className={`profile-film__actions-btn profile-film__actions-btn--reverse btn `}
                  type="button"
                  onClick={hendlerRandomFilm}
                  disabled={
                    addFavorite.isPending || randomMovieQuery.isFetching
                  }
                >
                  <svg
                    className={`profile-film__actions-icon ${
                      randomMovieQuery.isFetching
                        ? "profile-film__actions-icon--circular"
                        : ""
                    }`}
                  >
                    <use href={"/sprite.svg#reverse__icon"} />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}

      <div className="profile-film__picture">
        <img
          className="profile-film__picture-img"
          src={film?.backdropUrl || ""}
          alt={
            modifier !== "drop"
              ? `Аватар фильма: '${film?.title}' временно не доступен`
              : "Аватар отсутствует"
          }
          aria-label="Основная картинка фильма"
        />
      </div>
    </div>
  );
};

export default ProfileFilm;
