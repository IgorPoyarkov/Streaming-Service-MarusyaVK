import { useEffect, useState } from "react";
import { useMovieUtils } from "../../hooks/useMovieUtils";

interface GenreSliderProps {
  genres: string[] | undefined;
  isStatic?: boolean;
}

const GenreSlider = ({ genres, isStatic = false }: GenreSliderProps) => {
  const [currentIndex, setCurrentIdex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const { isMobile } = useMovieUtils();

  useEffect(() => {
    if (!genres || genres.length <= 1 || isStatic) return;

    const interval = setInterval(() => {
      setAnimate(true);

      setTimeout(() => {
        setCurrentIdex((prev) => (prev + 1) % genres.length);
        setAnimate(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [genres, isStatic]);

  if (!genres || genres.length === 0)
    return <span className="genre-slider__value">{"Отсутствует жанр"}</span>;

  if (isStatic) {
    if (isMobile) {
      return (
        <span className="genre-slider__value genre-slider__value--transfer">
          {genres?.slice(0, 2).join(", ")}
        </span>
      );
    }
    return <span className="genre-slider__value">{genres[0]}</span>;
  }

  return (
    <div className="genre-slider">
      <span
        className={`genre-slider__value ${animate ? "genre-slider__value--fade" : ""}`}
      >
        {genres[currentIndex]}
      </span>
    </div>
  );
};

export default GenreSlider;
