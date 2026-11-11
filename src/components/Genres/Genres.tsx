import { Link, useParams } from "react-router-dom";
import { useInfiniteMovies } from "../../services/movies/movies.api";
import CardFilm from "../CardFilm/CardFilm";
import Loader from "../Loader/Loader";
import { asset } from "../../utils/asset";

interface GenresProps {}

const Genres = ({}: GenresProps) => {
  const { genre } = useParams<{ genre: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMovies({ genre });

  if (isLoading) return <Loader count={7} size={200} />;
  if (isError)
    return <div className="genres__error">Ошибка: {error.message}</div>;

  const allFilms = data?.pages.flat() || [];

  const isButtonDisabled = isFetchingNextPage || !hasNextPage;

  const buttonClassName = `genre-btn btn ${
    !hasNextPage ? "genre-btn--disabled" : ""
  }`;

  const getButtonText = () => {
    if (isFetchingNextPage) return "Загрузка...";
    if (!hasNextPage) return "Вы посмотрели все фильмы";
    return "Показать ещё";
  };

  return (
    <div className="genre">
      <Link className="genre-link" to={"/movie/genres"}>
        <svg className="genre-icon">
          <use href={asset("/sprite.svg#genre__icon")} />
        </svg>

        <h2 className="genre-title">
          {genre
            ? genre.charAt(0).toUpperCase() + genre.slice(1)
            : "Жанр не выбран"}
        </h2>
      </Link>

      <ul className="genre-list">
        {allFilms.map((film) => (
          <li key={film.id} className="genre-item">
            <CardFilm movie={film} />
          </li>
        ))}
      </ul>
      <button
        className={buttonClassName}
        type="button"
        onClick={() => fetchNextPage()}
        disabled={isButtonDisabled}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default Genres;
