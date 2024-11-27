module.exports = (sequelize, DataTypes) => {
  let curatedListItem = sequelize.define("curatedListItem", {
    curatedListId: {
      type: DataTypes.INTEGER,
      references: { model: "curatedLists", key: "id" },
    },
    movieId: {
      type: DataTypes.INTEGER,
      references: { model: "movies", key: "id" },
    },
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  curatedListItem.associate = (models) => {
    curatedListItem.belongsTo(models.curatedList, {
      foreignKey: "curatedListId",
    });
    curatedListItem.belongsTo(models.movie, { foreignKey: "movieId" });
  };

  return curatedListItem;
};
