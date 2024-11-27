const axiosInstance = require("../lib/axios.lib");
const { movie: movieModel } = require("../models");

const generateSlug = (name) => {
  let slug = name.replace(" ", "-");
  return slug.toLowerCase();
};

const movieExistsInDB = async (tmdbId) => {
  const movieWithtmdbId = await movieModel.findOne({ where: { tmdbId } });
  return movieWithtmdbId;
};

const moviesDetails = async (query) => {
  const moviesResponse = await axiosInstance.get(
    `/search/movie?query=${query}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
  );

  const movies = moviesResponse.data.results;

  const detailedMovies = await fetchMovieAndCastDetails(movies);

  return detailedMovies;
};

const fetchMovieAndCastDetails = async (movies) => {
  const detailedMovies = await Promise.all(
    movies.map(async (movie) => {
      const movieDetailsResponse = await axiosInstance.get(
        `/movie/${movie.id}?append_to_response=credits`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );
      const movieDetails = movieDetailsResponse.data;

      const genreNames = movieDetails.genres.map((genre) => genre.name);
      console.log(movieDetails);

      return {
        title: movieDetails.title,
        tmdbId: movieDetails.id,
        genre: genreNames,
        actors: movieDetails.credits.cast
          .slice(0, 5)
          .map(
            (person) => person.known_for_department === "Acting" && person.name
          ),
        releaseYear: movieDetails.release_date?.split("-")[0] || "N/A",
        rating: movieDetails.vote_average,
        description: movieDetails.overview,
      };
    })
  );

  return detailedMovies;
};

const findMovieByMovieId = async (query, movieId) => {
  let movies = await moviesDetails(query);

  return movies.find((movie) => movie.tmdbId === movieId);
};

module.exports = {
  generateSlug,
  movieExistsInDB,
  fetchMovieAndCastDetails,
  moviesDetails,
  findMovieByMovieId,
};
