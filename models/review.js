module.exports = (sequelize, DataTypes) => {
  let review = sequelize.define(
    "review",
    {
      movieId: {
        type: DataTypes.INTEGER,
        references: { model: "movies", key: "id" },
      },
      rating: DataTypes.FLOAT,
      reviewText: DataTypes.STRING,
      addedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { timestamps: true }
  );

  review.associate = (models) => {
    review.belongsTo(models.movie, { foreignKey: "movieId" });
  };

  return review;
};
