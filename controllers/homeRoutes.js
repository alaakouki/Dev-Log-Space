const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

router.get("/", (req, res) => {

    console.log(req.session);

    Post.findAll({
        attributes: [
            "id", "title", "created_at", "post_content"
        ],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
        .then(postDatabase => {
            const posts = postDatabase.map(post => post.get({ plain: true }));
            res.render("homepage", {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("signup");
});

router.get("/post/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            "id", "title", "created_at", "post_content"
        ],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
        .then(postDatabase => {
            if (!postDatabase) {
                res.status(404).json({ message: "No post found with this id!" });
                return;
            }

            // serialize the data
            const post = postDatabase.get({ plain: true });

            res.render("singlePost", {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch (err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
