import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovieById } from "../../services/movies/movies.api";
import ReactPlayer from "react-player";

interface WatchingVideoProps {}

const WatchingVideo = ({}: WatchingVideoProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const movieIdParam = searchParams.get("video");
  const movieId = movieIdParam ? Number(movieIdParam) : null;
  const { data: film } = useMovieById(movieId ?? 0);

  const youtubeUrl = film?.trailerYouTubeId ? `https:${film.trailerUrl}` : null;

  if (!youtubeUrl) return null;

  const handleCloseVideo = () => {
    setIsPlaying(false);
    setIsReady(false);
    setSearchParams({});
  };

  const togglePlay = () => {
    if (!isReady) return;
    setIsPlaying((prev) => !prev);
  };

  const isPause = !isPlaying && !isLoading;

  return (
    <div
      className={`watching-video ${isLoading ? "watching-video--loading" : isPause ? "watching-video--pause" : ""}`}
      onClick={handleCloseVideo}
    >
      <div
        className="watching-video__wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="watching-video__closs btn"
          type="button"
          onClick={handleCloseVideo}
        />

        <div className="watching-video__video" onClick={togglePlay}>
          <ReactPlayer
            url={youtubeUrl}
            playing={isReady && isPlaying}
            width="100%"
            height="100%"
            controls={false}
            onReady={() => {
              setIsLoading(false);
              setIsReady(true);
            }}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        </div>

        <button
          className="watching-video__play"
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg className="watching-video__icon">
            {isLoading ? (
              <use href="/sprite.svg#loader-video__icon" />
            ) : isPause ? (
              isHovered ? (
                <use href="/sprite.svg#play__icon" />
              ) : (
                <use href="/sprite.svg#pause__icon" />
              )
            ) : null}
          </svg>
        </button>

        <p className="watching-video__title">
          {film?.title ? `${film.title}` : "Название отсутствует"}
        </p>
      </div>
    </div>
  );
};

export default WatchingVideo;
