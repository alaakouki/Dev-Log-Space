const sequelize = require("../config/connection");
const { User } = require ("../models");

const userData = require ("./userdata.json");

const userDatabase = async () => {
    await sequelize.sync({force: true});

    await User.bulkCreate(userData, {
        individualHooks: true,
    returning: true,
    });
    process.exit(0);
};

userDatabase();