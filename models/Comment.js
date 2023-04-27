const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id"
        }
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "post",
          key: "id"
        }
      },
      comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1]
        }
      }
  },
  {
    sequelize,
    freezeTableName: true, // Using the freezeTableName: true option to stop the auto-pluralization performed by Sequelize. This way, Sequelize will infer the table name to be equal to the model name, without any modifications.
    underscored: true,
    modelName: "comment"
  }
);

module.exports = Comment;