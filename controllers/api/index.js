const router = require("express").Router();
const commentRoutes = require("./commentRoutes");
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
