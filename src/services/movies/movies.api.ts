import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { MovieSchema, type Movie } from "./movies.schema";
import { z } from "zod";
import {
  DeleteFavoriteResponseSchema,
  UserSchema,
  type ApiUser,
  type DeleteFavoriteResponse,
} from "../users/users.schema";
import { useMovieUtils } from "../../hooks/useMovieUtils";

const BASE_URL = "https://cinemaguide.skillbox.cc";

export interface MovieQueryParams {
  count?: number;
  page?: number;
  title?: string;
  genre?: string;
}

const fetchFavoriteMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить избранные фильмы");
  }

  const data = await response.json();
  return z.array(MovieSchema).parse(data);
};

export const useFavoriteMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ["favoriteMovies"],
    queryFn: fetchFavoriteMovies,
  });
};

export const useInfiniteFavoriteMovies = () => {
  return useInfiniteQuery<Movie[], Error>({
    queryKey: ["infiniteFavorites"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`${BASE_URL}/favorites`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Не удалось загрузить избранное");
      const allFavorites = z.array(MovieSchema).parse(await response.json());

      const count = 10;
      const start = ((pageParam as number) - 1) * count;
      const end = start + count;

      return allFavorites.slice(start, end);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
  });
};

const addFavoriteMovies = async (credentials: {
  id: string;
}): Promise<ApiUser> => {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Не удалось добавить фильм в избранное");
  }

  const data = await response.json();

  return UserSchema.parse(data);
};

export const useAddFavoriteMovies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavoriteMovies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteMovies"] });
    },
  });
};

const deleteFavoriteMovies = async (
  id: number,
): Promise<DeleteFavoriteResponse> => {
  const response = await fetch(`${BASE_URL}/favorites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось удалить фильм из избранного");
  }

  const data = await response.json();

  return DeleteFavoriteResponseSchema.parse(data);
};

export const useDeleteFavoriteMovies = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteFavoriteResponse, Error, number>({
    mutationFn: deleteFavoriteMovies,
    onSuccess: (serverUpdatedUser) => {
      queryClient.setQueryData(["profileUser"], (oldProfile: any) => ({
        ...oldProfile,
        favorites: serverUpdatedUser.favorites,
      }));

      queryClient.invalidateQueries({ queryKey: ["favoriteMovies"] });
      queryClient.invalidateQueries({ queryKey: ["infiniteFavorites"] });
    },
  });
};

const fetchAllMovies = async (params?: MovieQueryParams): Promise<Movie[]> => {
  const searchParams = new URLSearchParams();

  searchParams.append("count", String(params?.count ?? 50));
  searchParams.append("page", String(params?.page ?? 1));

  if (params?.title) {
    searchParams.append("title", params.title);
  }

  if (params?.genre) {
    searchParams.append("genre", params.genre);
  }

  const response = await fetch(`${BASE_URL}/movie?${searchParams.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить список фильмов");
  }

  const data = await response.json();
  return z.array(MovieSchema).parse(data);
};

export const useAllMovies = (params?: MovieQueryParams) => {
  return useQuery<Movie[], Error>({
    queryKey: ["allMovies", params],
    queryFn: () => fetchAllMovies(params),
  });
};

export const useInfiniteMovies = (
  params?: Omit<MovieQueryParams, "page" | "count">,
) => {
  const { isMobile } = useMovieUtils();

  return useInfiniteQuery<Movie[], Error>({
    queryKey: ["infiniteMovies", params, isMobile],

    queryFn: ({ pageParam = 1 }) => {
      const currentCount = isMobile ? 5 : 10;

      return fetchAllMovies({
        ...params,
        page: pageParam as number,
        count: currentCount,
      });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;

      const expectedLength = isMobile ? 5 : 10;

      if (lastPage.length < expectedLength) return undefined;

      return currentPage + 1;
    },
  });
};

const fetchTopMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/top10`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить топ 10 фильмов");
  }

  const data = await response.json();
  return z.array(MovieSchema).parse(data);
};

export const useTopMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ["topMovies"],
    queryFn: fetchTopMovies,
  });
};

const fetchGenresMovies = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/movie/genres`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить жанры фильмов");
  }

  const data = await response.json();
  return z.array(z.string()).parse(data);
};

export const useGenresMovies = () => {
  return useQuery<string[], Error>({
    queryKey: ["genresMovies"],
    queryFn: fetchGenresMovies,
  });
};

const fetchRandomMovie = async (): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}/movie/random`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Не удалось загрузить случайный фильм");
  const data = await response.json();
  return MovieSchema.parse(data);
};

export const useRandomMovie = (
  options?: Partial<UseQueryOptions<Movie, Error>>,
) => {
  return useQuery<Movie, Error>({
    queryKey: ["randomMovie"],
    queryFn: fetchRandomMovie,
    ...options,
  });
};

const fetchMovieById = async (id: number): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}/movie/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить информацию о фильме");
  }

  const data = await response.json();
  return MovieSchema.parse(data);
};

export const useMovieById = (id: number) => {
  return useQuery<Movie, Error>({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieById(id),
    enabled: !!id,
  });
};
