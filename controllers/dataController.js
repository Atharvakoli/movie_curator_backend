const { Op } = require("sequelize");
const {
  curatedList: curatedListModel,
  movie: movieModel,
  wishList: wishListModel,
  watchList: watchListModel,
  curatedListItem: curatedListItemModel,
  review: reviewModel,
} = require("../models");

const {
  generateSlug,
  movieExistsInDB,
  findMovieByMovieId,
} = require("../services/index.service");
const {
  validatedCuratedlist,
  validateDetailsToUpdate,
  validateMovieId,
  validateMovieIdCurated,
  validateRatingAndreview,
  validateLimit,
  validateGenreAndActor,
} = require("./validate/validations");

const createCuratedList = async (req, res) => {
  try {
    let { name, description, slug } = req.body;

    let isValid = validatedCuratedlist({ name, description, slug });

    if (isValid.length > 0) {
      return res.status(404).json({ errors: isValid });
    }

    let newCuratedList = await curatedListModel.create({
      name,
      description,
      slug,
    });

    if (!newCuratedList) {
      return res
        .status(400)
        .json({ message: "Something went wrong while creating curatedList" });
    }
    res.status(201).json({ message: "Curated list created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Can't Create Curated List, since ${error.message}` });
  }
};

const updateCuratedList = async (req, res) => {
  try {
    let curatedListId = req.params.curatedListId;
    let { name, description } = req.body;

    let isValidDetails = validateDetailsToUpdate({
      name,
      description,
      curatedListId,
    });

    if (isValidDetails.length > 0) {
      return res.status(404).json({ erros: isValidDetails });
    }

    let findCuratedDetailsByCuratedListId = await curatedListModel.findOne({
      where: { id: curatedListId },
    });

    if (!findCuratedDetailsByCuratedListId) {
      return res.status(404).json({ message: "Curated details NOT FOUND" });
    }

    if (name) {
      findCuratedDetailsByCuratedListId.name = name;
    }

    if (description) {
      findCuratedDetailsByCuratedListId.description = description;
    }

    let slug = generateSlug(name);

    findCuratedDetailsByCuratedListId.slug = slug;

    await findCuratedDetailsByCuratedListId.save();

    res.status(200).json({
      message: "Curated List updated success",
      updatedCuratedList: findCuratedDetailsByCuratedListId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Can't Update Curated List, since ${error.message}` });
  }
};

const savingMoviesToWatchList = async (req, res) => {
  try {
    let { movieId } = req.body;
    let query = req.query.query;

    let isValidMovieId = validateMovieId({ movieId, query });

    if (isValidMovieId.length > 0) {
      return res.status(404).json({ errors: isValidMovieId });
    }

    let isMovieAvailable = await movieExistsInDB(movieId);

    if (isMovieAvailable) {
      let findIfMovieIsAlreadyExistInWatchList = await watchListModel.findOne({
        where: { movieId: isMovieAvailable.id },
      });
      if (!findIfMovieIsAlreadyExistInWatchList) {
        await watchListModel.create({
          movieId: isMovieAvailable.id,
          addedAt: new Date(),
        });
      } else {
        return res
          .status(200)
          .json({ message: "Movie Already exists in your wishList " });
      }
    } else {
      let detailedMovie = await findMovieByMovieId(query, movieId);

      if (!detailedMovie) {
        return res.status(400).json({ message: "Movies details, NOT FOUND" });
      }
      let { title, tmdbId, genere, actors, releaseYear, rating, description } =
        detailedMovie;

      let createMovie = await movieModel.create({
        title,
        tmdbId,
        genere: genere.toString(),
        actors: actors.toString(),
        releaseYear,
        rating,
        description,
      });

      if (!createMovie) {
        return res
          .status(400)
          .json({ message: "Something went wrong while creating movie." });
      }

      await watchListModel.create({
        movieId: createMovie.id,
        addedAt: new Date(),
      });
    }

    res.status(201).json({
      message: "Movie added to watchlist successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: `Can't Save movies to Watchlist, since ${error.message}`,
    });
  }
};

const savingMoviesToWishlist = async (req, res) => {
  try {
    let { movieId } = req.body;
    let query = req.query.query;

    let isValidMovieId = validateMovieId({ movieId, query });

    if (isValidMovieId.length > 0) {
      return res.status(404).json({ errors: isValidMovieId });
    }

    let isMovieAvailable = await movieExistsInDB(movieId);

    if (isMovieAvailable) {
      let findWishListIfAlreadyExistInWishList = await wishListModel.findOne({
        where: { movieId: isMovieAvailable.id },
      });

      if (!findWishListIfAlreadyExistInWishList) {
        await wishListModel.create({
          movieId: isMovieAvailable.id,
          addedAt: new Date(),
        });
      } else {
        return res
          .status(200)
          .json({ message: "Movie Already exists in your wishList " });
      }
    } else {
      let detailedMovie = await findMovieByMovieId(query, movieId);

      if (!detailedMovie) {
        return res.status(400).json({ message: "Movies deatails NOT FOUND" });
      }

      let { title, tmdbId, genere, actors, releaseYear, rating, description } =
        detailedMovie;

      let movie = await movieModel.create({
        title,
        tmdbId,
        genere: genere.toString(),
        actors: actors.toString(),
        releaseYear,
        rating,
        description,
      });

      if (!movie) {
        return res
          .status(400)
          .json({ message: "Something went wrong while creating movie." });
      }

      await wishListModel.create({
        movieId: movie.id,
        addedAt: new Date(),
      });
    }

    res.status(201).json({
      message: "Movie added to wishList successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: `Can't Save movies to Wishlist, since ${error.message}`,
    });
  }
};

const savingMoviesToCuratedLists = async (req, res) => {
  try {
    let { movieId, curatedListId } = req.body;
    let query = req.query.query;

    let isValidMovieId = validateMovieIdCurated({
      movieId,
      curatedListId,
      query,
    });

    if (isValidMovieId.length > 0) {
      return res.status(404).json({ errors: isValidMovieId });
    }

    let isMovieAvailable = await movieExistsInDB(movieId);

    if (isMovieAvailable) {
      let findIfMovieIsAlreadyExistInCuratedList =
        await curatedListItemModel.findOne({
          where: { movieId: isMovieAvailable.id },
        });
      if (!findIfMovieIsAlreadyExistInCuratedList) {
        await curatedListItemModel.create({
          curatedListId,
          movieId: isMovieAvailable.id,
          addedAt: new Date(),
        });
      } else {
        return res
          .status(200)
          .json({ message: "Movie Already exists in curated list" });
      }
    } else {
      let detailedMovie = await findMovieByMovieId(query, movieId);

      if (!detailedMovie) {
        return res.status(400).json({ message: "Movies deatails NOT FOUND" });
      }

      let { title, tmdbId, genere, actors, releaseYear, rating, description } =
        detailedMovie;

      let createMovie = await movieModel.create({
        title,
        tmdbId,
        genere: genere.toString(),
        actors: actors.toString(),
        releaseYear,
        rating,
        description,
      });

      if (!createMovie) {
        return res
          .status(400)
          .json({ message: "Something went wrong while creating movie." });
      }

      await curatedListItemModel.create({
        curatedListId,
        movieId: createMovie.id,
        addedAt: new Date(),
      });
    }

    res.status(201).json({
      message: "Movie added to curatedListItem successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: `Can't Save movies to CuratedLists, since ${error.message}`,
    });
  }
};

const addingReviewsAndRatingsToMovies = async (req, res) => {
  try {
    let { rating, reviewText } = req.body;
    let movieId = req.params.movieId;

    let isValidRatingAndReview = validateRatingAndreview({
      rating,
      reviewText,
      movieId,
    });

    if (isValidRatingAndReview.length > 0) {
      return res.status(404).json({ errors: isValidRatingAndReview });
    }

    let validateLimits = validateLimit({ rating, reviewText });

    if (validateLimits.length > 0) {
      return res.status(404).json({ errors: validateLimits });
    }

    let review = await reviewModel.create({
      movieId,
      rating,
      reviewText,
      addedAt: new Date(),
    });

    if (!review) {
      return res
        .status(400)
        .json({ message: "Something went wrong while creating review." });
    }

    res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    res.status(500).json({
      error: `Can't create reviews and rating, since ${error.message}`,
    });
  }
};

const searchingListsByGenereAndActor = async (req, res) => {
  try {
    let { genre, actor } = req.query;

    let isValidGenreAndActor = validateGenreAndActor({ genre, actor });

    if (isValidGenreAndActor.length > 0) {
      return res.status(404).json({ errors: isValidGenreAndActor });
    }

    let findMovieByGenreAndActor = await movieModel.findAll({
      where: {
        genre: { [Op.like]: `%${genre}%` },
        actors: { [Op.like]: `%${actor}%` },
      },
    });
    console.log(findMovieByGenreAndActor);

    if (findMovieByGenreAndActor.length === 0) {
      return res.status(404).json({ message: "Movie NOT FOUND" });
    }

    res.status(200).json({ movies: findMovieByGenreAndActor });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Can't search list by genere, since ${error.message}` });
  }
};

const sortingByRatingsOrYearOfRelease = async (req, res) => {
  try {
    let { list, sortBy, order } = req.query;

    let isValid = validateSortingCredentials({ list, sortBy, order });

    if (isValid.length > 0) {
      return res.status(404).json({ errors: isValid });
    }

    let sortlistsByRating;

    if (list.toLowerCase() === "watchlist") {
      sortlistsByRating = await watchListModel.findAll({
        where: { order: [[rating, sortBy.toUpperCase()]] },
      });
    } else if (list.toLowerCase() === "wishlist") {
      sortlistsByRating = await wishListModel.findAll({
        where: { order: [rating, sortBy.toUpperCase()] },
      });
    } else if (list.toLowerCase() === "curatedlist") {
      sortlistsByRating = await curatedListModel.findAll({
        where: { order: [rating, sortBy.toUpperCase()] },
      });
    }

    return res.status(200).json({ movies: sortlistsByRating });
  } catch (error) {
    res.status(500).json({
      message: `Can't sort list by ratings or year of release, since ${error.message}`,
    });
  }
};

const GetTopFiveMoviesByRatingPlusDetailedReview = async (req, res) => {
  try {
    const movies = await movieModel.findAll({
      attributes: ["title", "rating"],
      include: [
        {
          model: reviewModel,
          attributes: ["reviewText"],
        },
      ],
      limit: 5,
    });

    const extractReview = movies.map(({ reviewText }) => ({ reviewText }));

    const response = {
      movies: movies.map((movie) => ({
        title: movie.title,
        rating: movie.rating,
        review: movie.reviews.map((review) =>
          review.movieId === movie.id
            ? {
                text: review.reviewText,
                wordCount: review.reviewText.split(/\s+/).filter(Boolean)
                  .length,
              }
            : {}
        ),
      })),
    };
    // console.log(result);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: `Can't GET top five movies by rating plus detailed reviews since ${error.message}`,
    });
  }
};

module.exports = {
  createCuratedList,
  updateCuratedList,
  savingMoviesToWishlist,
  savingMoviesToWatchList,
  savingMoviesToCuratedLists,
  addingReviewsAndRatingsToMovies,
  searchingListsByGenereAndActor,
  sortingByRatingsOrYearOfRelease,
  GetTopFiveMoviesByRatingPlusDetailedReview,
};
