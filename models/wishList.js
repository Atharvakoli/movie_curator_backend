module.exports = (sequelize, DataTypes) => {
  let wishList = sequelize.define(
    "wishList",
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

  wishList.associate = (models) => {
    wishList.belongsTo(models.movie, { foreignKey: "movieId" });
  };

  return wishList;
};
