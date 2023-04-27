const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {}

Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      post_content: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      }
    },
    {
      sequelize,
      freezeTableName: true, // Using the freezeTableName: true option to stop the auto-pluralization performed by Sequelize. This way, Sequelize will infer the table name to be equal to the model name, without any modifications.
      underscored: true,
      modelName: "post"
    }
  );

  module.exports = Post;