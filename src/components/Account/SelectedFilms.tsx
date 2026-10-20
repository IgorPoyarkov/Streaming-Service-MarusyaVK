import { useEffect, useRef } from "react";
import { useInfiniteFavoriteMovies } from "../../services/movies/movies.api";
import CardFilm from "../CardFilm/CardFilm";
import Loader from "../Loader/Loader";

interface SelectedFilmsProps {}

const SelectedFilms = ({}: SelectedFilmsProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteFavoriteMovies();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const favoriteFilms = data?.pages.flat() || [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [data, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <Loader count={7} size={300} />;

  return (
    <div className="selected-films">
      <ul className="selected-films__list">
        {favoriteFilms.map((film) => (
          <li key={film.id} className="selected-films__item">
            <CardFilm movie={film} modifier={"selected"} />
          </li>
        ))}
      </ul>

      <div className="selected-films__loader"
        ref={bottomRef}
      >
        {isFetchingNextPage && (
          <Loader modif="scroll" />
        )}
      </div>
    </div>
  );
};

export default SelectedFilms;
