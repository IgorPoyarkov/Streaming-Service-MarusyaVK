import { Link } from "react-router-dom";
import { useMovieUtils } from "../../hooks/useMovieUtils";
import Loader from "../Loader/Loader";

interface GenresFilmProps {}

const GenresFilm = ({}: GenresFilmProps) => {
  const { avatarsGenresFilmsData, isLoading } = useMovieUtils();
  const avatarsGenres = avatarsGenresFilmsData();
  if (isLoading) return <Loader count={7} size={200}/>;

  return (
    <div className="genres-film">
      <h2 className="genres-film__title">Жанры фильмов</h2>
      <ul className="genres-film__list">
        {avatarsGenres.map(({ genre, posterUrl }) => {
          return (
            <li key={genre} className="genres-film__item">
              <Link className="genres-film__link" to={`/genres/${genre}`}>
                <div className="genres-film__picture">
                  <img
                    className="genres-film__img"
                    src={posterUrl || undefined}
                    alt={`Аватар жанра ${genre}`}
                  />
                </div>
                <span className="genres-film__name">
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GenresFilm;
