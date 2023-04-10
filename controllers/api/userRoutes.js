const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {

    User.findAll({
        attributes: { exclude: ["password"] }
    })
      .then(userDatabase => res.json(userDatabase))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.get("/:id", (req, res) => {
    User.findOne({
        attributes: { exclude: ["password"]},
        where: {
          id: req.params.id
        },
        include: [
            {
              model: Post,
              attributes: ["id", "title", "post_content", "created_at"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                  model: Post,
                  attributes: ["title"]
                }
            }
          ]

    })
      .then(userDatabase => {
        if (!userDatabase) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(userDatabase);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.post("/", (req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    .then(userDatabase => {
      req.session.save(() => {
        req.session.user_id = userDatabase.id;
        req.session.username = userDatabase.username;
        req.session.loggedIn = true;
    
        res.json(userDatabase);
      });
    });
  });

  router.post("/login", (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(userDatabase => {
      if (!userDatabase) {
        res.status(400).json({ message: "No user with that email address!" });
        return;
      }
  
      const validPassword = userDatabase.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: "Incorrect password!" });
        return;
      }
  
      req.session.save(() => {
        // declare session variables
        req.session.user_id = userDatabase.id;
        req.session.username = userDatabase.username;
        req.session.loggedIn = true;
  
        res.json({ user: userDatabase, message: "You are now logged in!" });
      });
    });
  });

  router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
  });

router.put("/:id", withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
      }
    })
      .then(userDatabase => {
        if (!userDatabase[0]) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(userDatabase);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.delete("/:id", withAuth, (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(userDatabase => {
        if (!userDatabase) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(userDatabase);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;