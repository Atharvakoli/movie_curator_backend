module.exports = (sequelize, DataTypes) => {
  let curatedList = sequelize.define(
    "curatedList",
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { timeStamps: true }
  );

  curatedList.associate = (models) => {
    curatedList.hasMany(models.curatedListItem, {
      foreignKey: "curatedListId",
    });
  };
  return curatedList;
};
