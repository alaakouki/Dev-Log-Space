const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
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
            // serialize data before passing to template
            const posts = postDatabase.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get( "/edit/:id", withAuth, (req, res) => {
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
    .then ( postDatabase => {
        if (!postDatabase) {
            res.status(404).json({ message: "No post found with this id!"});
            return;
        }

        // serialize the data
        const post = postDatabase.get ({ plain: true });
        res.render("editPost", {
            post, loggedIn: true
        });
    })
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get("/create/", withAuth, (req, res) => {
    Post.findAll({
        where: {
            // using the id from session
            user_id: req.session.user_id
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
    .then (postDatabase => {
        const posts = postDatabase.map(post => post.get({plain: true}));
        res.render("createPost", {posts, loggedIn: true});
    })
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
