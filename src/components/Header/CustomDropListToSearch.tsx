import { Link } from "react-router-dom";
import { useAllMovies } from "../../services/movies/movies.api";
import ProfileFilm from "../Main/ProfileFilm";
import type { OpenDropList } from "./CustomSearch";
import Loader from "../Loader/Loader";

export interface CustomListToSearchProps {
  openDropList: OpenDropList;
  closeSearchList: () => void;
}

const CustomDropListToSearch = ({
  openDropList,
  closeSearchList,
}: CustomListToSearchProps) => {
  const { data: movie, isLoading } = useAllMovies({
    count: 5,
    title: openDropList.searchFilm,
  });

  const isNotFound =
    openDropList.searchFilm && openDropList.open && movie && movie.length === 0;

  const containerClassName = `drop-list ${
    openDropList.searchFilm && openDropList.open ? "drop-list--open" : ""
  } ${isNotFound ? "drop-list--not-found" : ""}`;

  return (
    <div className={containerClassName}>
      {isLoading && <Loader count={12} size={50} />}
      <span className="drop-list__not-found">
        По вашему запросу фильм не найден
      </span>

      <ul className="drop-list__list">
        {movie?.map((film) => {
          return (
            <li className="drop-list__item" key={film.id}>
              <Link
                className="drop-list__link"
                to={`/movie/${film.id}`}
                onClick={closeSearchList}
              >
                <ProfileFilm movie={film} modifier="drop" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CustomDropListToSearch;
