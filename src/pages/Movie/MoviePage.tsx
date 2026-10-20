import { useParams } from "react-router-dom";
import { useMovieById } from "../../services/movies/movies.api";
import ProfileFilm from "../../components/Main/ProfileFilm";
import DetailsFilm from "../../components/Main/DetailsFilm";
import Loader from "../../components/Loader/Loader";

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading } = useMovieById(Number(id));

  if (isLoading) return <Loader count={7} size={200} />;
  if (!movie) return <Loader count={1} size={700} />;

  return (
    <>
      <ProfileFilm movie={movie} modifier="card" />
      <DetailsFilm film={movie} />
    </>
  );
};
export default MoviePage;
