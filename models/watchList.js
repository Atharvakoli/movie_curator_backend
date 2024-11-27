module.exports = (sequelize, DataTypes) => {
  let watchList = sequelize.define(
    "watchList",
    {
      movieId: {
        type: DataTypes.INTEGER,
        references: { model: "movies", key: "id" },
      },
      addedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { timestamps: true }
  );

  watchList.associate = (models) => {
    watchList.belongsTo(models.movie, { foreignKey: "movieId" });
  };

  return watchList;
};
