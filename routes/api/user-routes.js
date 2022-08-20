const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// Get /api/users/1
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    // User.findAll() is the JavaScript equivalent of the following SQL query: SELECT * FROM users;
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // We want to find a user where its id value equals whatever req.params.id is, 
    // much like the following SQL query: SELECT * FROM users WHERE id = 1;
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        // replace the existing `include` with this
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
        // if the .then() method returns nothing from the query, 
        // we send a 404 status back to the client to indicate everything's 
        // okay and they just asked for the wrong piece of data.
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // To insert data, we use Sequelize's .create() method. 
    // Pass in key/value pairs where the keys are what we defined in the User model
    // and the values are what we get from req.body. 
    // In SQL, this command would look like the following code: 
    // INSERT INTO users
    //  (username, email, password)
    // VALUES
    //  ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users/login
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No users found with that email address!' });
                return;
            }
            // Verify user
            const validPassword = dbUserData.checkPassword(req.body.password);

            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });

});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This .update() method combines the parameters for creating data and looking up data. 
    // We pass in req.body to provide the new data we want to use in the update and 
    // req.params.id to indicate where exactly we want that new data to be used.
    // The associated SQL syntax would look like the following code:
    // UPDATE users
    // SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
    // WHERE id = 1;
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // To delete data, use the .destroy() method and provide some 
    // type of identifier to indicate where exactly we would 
    // like to delete data from the user database table.
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
