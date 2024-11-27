const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { searchMovie } = require("./controllers/TMDB.controller");
const {
  createCuratedList,
  updateCuratedList,
  savingMoviesToWatchList,
  savingMoviesToWishlist,
  savingMoviesToCuratedLists,
  addingReviewsAndRatingsToMovies,
  searchingListsByGenereAndActor,
  sortingByRatingsOrYearOfRelease,
  GetTopFiveMoviesByRatingPlusDetailedReview,
} = require("./controllers/dataController");
const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Movie Curator app");
});

app.get("/api/movies/search", searchMovie);

app.post("/api/curated-lists", createCuratedList);
app.put("/api/curated-lists/:curatedListId", updateCuratedList);
app.post("/api/movies/watchlist", savingMoviesToWatchList);
app.post("/api/movies/wishlist", savingMoviesToWishlist);
app.post("/api/movies/curated-list", savingMoviesToCuratedLists);
app.post("/api/movies/:movieId/reviews", addingReviewsAndRatingsToMovies);
app.get("/api/movies/searchByGenreAndActor", searchingListsByGenereAndActor);
app.get("/api/movies/sort", sortingByRatingsOrYearOfRelease);
app.get("/api/movies/top5", GetTopFiveMoviesByRatingPlusDetailedReview);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully :) "))
  .catch((error) => console.log("Database connection problem :) "));

let PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`);
});
