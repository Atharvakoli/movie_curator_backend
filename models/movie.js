module.exports = (sequelize, DataTypes) => {
  const movie = sequelize.define(
    "movie",
    {
      title: DataTypes.STRING,
      tmdbId: DataTypes.INTEGER,
      genre: DataTypes.TEXT,
      actors: DataTypes.TEXT,
      releaseYear: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      description: DataTypes.TEXT,
    },
    { timestamps: true }
  );

  movie.associate = (models) => {
    movie.hasMany(models.watchList, { foreignKey: "movieId" });
    movie.hasMany(models.wishList, { foreignKey: "movieId" });
    movie.hasMany(models.review, { foreignKey: "movieId" });
    movie.hasMany(models.curatedListItem, { foreignKey: "movieId" });
  };

  return movie;
};
