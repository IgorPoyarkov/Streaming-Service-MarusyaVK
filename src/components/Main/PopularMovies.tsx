import { useTopMovies } from "../../services/movies/movies.api";
import CardFilm from "../CardFilm/CardFilm";
import Loader from "../Loader/Loader";

interface PopularMoviesProps {}

const PopularMovies = ({}: PopularMoviesProps) => {
  const { data: films, isLoading } = useTopMovies();

  return (
    <div className="popular-movies">
      <h3 className="popular-movies__title">{`Топ 10\u00A0фильмов`}</h3>
      {isLoading && <Loader count={7} size={200} />}
      <ol className="popular-movies__list">
        {films?.map((film) => (
          <li key={film.id} className="popular-movies__item">
            <CardFilm movie={film} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PopularMovies;
