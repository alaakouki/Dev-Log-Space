const sequelize = require("../config/connection");
const { User, Post, Comment } = require ("../models");

const userData = require ("./userdata.json");
const postData = require ("./postdata.json");
const commentData = require ("./commentdata.json");

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
  
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });
  
    const posts = await Post.bulkCreate(postData, {
      individualHooks: true,
      returning: true,
    });
  
    const comments = await Comment.bulkCreate(commentData, {
      individualHooks: true,
      returning: true,
    });
  
    process.exit(0);
  };
  
  seedDatabase();