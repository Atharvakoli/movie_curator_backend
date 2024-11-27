const axiosInstance = require("../lib/axios.lib");
const {
  fetchMovieAndCastDetails,
  moviesDetails,
} = require("../services/index.service");
const { validateQuery } = require("./validate/validations");

const searchMovie = async (req, res) => {
  try {
    let query = req.query.query;

    let isValidQuery = validateQuery(query);

    if (isValidQuery.length > 0) {
      return res.status(404).json({ errors: isValidQuery });
    }

    let detailedMovies = await moviesDetails(query);

    res.json({ movies: detailedMovies });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to GET movies, since ${error.message}` });
  }
};

module.exports = { searchMovie };
