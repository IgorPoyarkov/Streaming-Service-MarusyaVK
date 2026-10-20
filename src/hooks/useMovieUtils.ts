import { useQuery } from "@tanstack/react-query"; 
import { useAllMovies, useGenresMovies } from "../services/movies/movies.api";
import type { Movie } from "../services/movies/movies.schema";
import { useEffect, useState } from "react";

export function useMovieUtils() {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth <= 375 : false,
  );
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 375);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const {
    data: films,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
  } = useAllMovies();
  const {
    data: genresData,
    isLoading: isGenresLoading,
    isError: isGenresError,
  } = useGenresMovies();

  const maxCountLoader = (count: number, size: number, gap: number): number => {
    const totalRequiredWidth = count * size + gap * (count - 1);

    if (totalRequiredWidth < windowWidth) {
      return count;
    }

    const calculatedCount = Math.floor((windowWidth + gap) / (size + gap));

    return calculatedCount > 0 ? calculatedCount : 1;
  };

  const formatTime = (time: number | null | undefined): string => {
    if (!time) return "—";
    const hour = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hour} ч  ${minutes} мин`;
  };

  const formatRating = (rating: number | null | undefined): string => {
    let formatRatingRezult = "";
    const nameClass = "profile-film__intelligence-detail--";

    if (!rating) return nameClass + "thunderbird";

    switch (true) {
      case rating <= 5:
        formatRatingRezult = nameClass + "thunderbird";
        break;
      case rating <= 6 && rating > 5:
        formatRatingRezult = nameClass + "boulder";
        break;
      case rating <= 7 && rating > 6:
        formatRatingRezult = nameClass + "forestGreen";
        break;
      default:
        formatRatingRezult = "pirateGold";
        formatRatingRezult = "";
        break;
    }

    return formatRatingRezult;
  };

  const getRandomIndex = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  type MovieGenre = Movie & { genre: string };

  const generateAvatarsData = (): MovieGenre[] => {
    if (!films || !genresData) return [];

    const avatarsGenresFilms: MovieGenre[] = [];
    const usedInDddIds = new Set<number>();

    genresData.forEach((genre) => {
      let suitableFilms = films.filter((film) => {
        return (
          film.genres.includes(genre) &&
          !!film.posterUrl &&
          !usedInDddIds.has(film.id)
        );
      });

      if (suitableFilms.length === 0) {
        suitableFilms = films.filter(
          (film) => film.genres.includes(genre) && !!film.posterUrl,
        );
      }

      if (suitableFilms.length > 0) {
        const randomIndex = getRandomIndex(suitableFilms.length);
        const randomMovie = suitableFilms[randomIndex];

        avatarsGenresFilms.push({
          ...randomMovie,
          genre: genre,
        });
        usedInDddIds.add(randomMovie.id);
      }
    });

    return avatarsGenresFilms;
  };

  const { data: cachedAvatars, isLoading: isAvatarsLoading } = useQuery({
    queryKey: ["avatarsGenresFilms"],
    queryFn: generateAvatarsData,
    enabled: !!films && !!genresData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    isMobile,
    formatTime,
    maxCountLoader,
    formatRating,
    avatarsGenresFilmsData: () => cachedAvatars || [],
    isLoading: isMoviesLoading || isGenresLoading || isAvatarsLoading,
    isError: isMoviesError || isGenresError,
  };
}
