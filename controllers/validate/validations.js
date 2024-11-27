const validateQuery = (query) => {
  let errors = [];
  if (!query || typeof query !== "string") {
    errors.push("Query is required and should be string");
  }
  return errors;
};

const validatedCuratedlist = (curatedDetails) => {
  let errors = [];
  if (!curatedDetails.name || typeof curatedDetails.name !== "string")
    errors.push("Name is required and should be string");
  if (
    !curatedDetails.description ||
    typeof curatedDetails.description !== "string"
  ) {
    errors.push("Descripiton is required and should be string");
  }
  if (!curatedDetails.slug || typeof curatedDetails.slug !== "string") {
    errors.push("slug is required and should be string");
  }
  return errors;
};

const validateDetailsToUpdate = (details) => {
  let errors = [];
  if (!details.name || typeof details.name !== "string")
    errors.push("Name is required and should be string");
  if (!details.description || typeof details.description !== "string") {
    errors.push("Descripiton is required and should be string");
  }
  if (!details.curatedListId || typeof details.curatedListId !== "string") {
    errors.push("curatedListId is required and should be string");
  }
  return errors;
};

const validateMovieId = (ids) => {
  let errors = [];
  if (!ids.movieId || typeof ids.movieId !== "number") {
    errors.push("Movie ID is required and should be number");
  }
  if (!ids.query || typeof ids.query !== "string") {
    errors.push("Query is required and should be string");
  }
  return errors;
};

const validateMovieIdCurated = (ids) => {
  let errors = [];
  if (!ids.movieId || typeof ids.movieId !== "number") {
    errors.push("Movie ID is required and should be number");
  }
  if (!ids.curatedListId || typeof ids.curatedListId !== "number") {
    errors.push("Curated List ID is required and should be number");
  }
  if (!ids.query || typeof ids.query !== "string") {
    errors.push("Query is required and should be string");
  }
  return errors;
};

const validateRatingAndreview = ({ rating, reviewText, movieId }) => {
  let errors = [];
  if (!rating || typeof rating !== "number") {
    errors.push("Rating is required and should be string");
  }
  if (!reviewText || typeof reviewText !== "string") {
    errors.push("review Text is required and should be string");
  }
  if (!movieId || typeof movieId !== "string") {
    errors.push("movieId is required and should be string");
  }
  return errors;
};

const validateLimit = ({ rating, reviewText }) => {
  let errors = [];
  if (rating > 10) {
    errors.push("Rating should be less then equal to 10");
  }

  if (reviewText.length > 500) {
    errors.push("review text should be less than 500 characters");
  }
  return errors;
};

const validateGenreAndActor = ({ genre, actor }) => {
  let errors = [];
  if (!genre || typeof genre !== "string") {
    errors.push("Genre is required and should be string");
  }

  if (!actor || typeof actor !== "string") {
    errors.push("actor is required and should be string");
  }
  return errors;
};

const validateSortingCredentials = ({ list, sortBy, order }) => {
  let errors = [];
  if (!list || typeof list !== "string") {
    errors.push("List is required and should be string");
  }
  if (!sortBy || typeof sortBy !== "string") {
    errors.push("List is required and should be string");
  }
  if (!order || typeof order !== "string") {
    errors.push("List is required and should be string");
  }
  return errors;
};

module.exports = {
  validateQuery,
  validatedCuratedlist,
  validateDetailsToUpdate,
  validateMovieId,
  validateMovieIdCurated,
  validateRatingAndreview,
  validateLimit,
  validateGenreAndActor,
  validateSortingCredentials,
};
