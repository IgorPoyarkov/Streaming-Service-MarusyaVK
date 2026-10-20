import { Link } from "react-router-dom";
import type { Movie } from "../../services/movies/movies.schema";
import { useDeleteFavoriteMovies } from "../../services/movies/movies.api";

interface CardFilmProps {
  movie?: Movie;
  modifier?: string;
}

const CardFilm = ({ movie, modifier = "" }: CardFilmProps) => {
  const deleteFavoriteMutation = useDeleteFavoriteMovies();
  let valueModifer: string = "";
  const visuallyHidden = "visually-hidden";

  switch (modifier) {
    case "selected":
      valueModifer = "card-film--selected";
      break;
    default:
      valueModifer = "";
      break;
  }
  const containerClassName = `card-film ${modifier ? valueModifer : ""}`;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    if (movie?.id) {
      deleteFavoriteMutation.mutate(movie.id);
    }
  };

  return (
    <div className={containerClassName}>
      <Link className="card-film__link" to={`/movie/${movie?.id}`}>
        <div className="card-film__picture">
          <img
            className="card-film__img"
            src={movie?.posterUrl || ""}
            alt={movie?.title}
          />
        </div>
      </Link>
      <button
        className={`card-film__delete btn ${valueModifer === "" ? visuallyHidden : ""}`}
        type="button"
        onClick={(e) => handleDelete(e)}
        disabled={deleteFavoriteMutation.isPending}
      ></button>
    </div>
  );
};

export default CardFilm;
