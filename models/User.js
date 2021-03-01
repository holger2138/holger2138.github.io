module.exports = (db, model, dataTypes) => {
    class User extends model {}
    User.init(
        {
            firstName: { type: dataTypes.STRING },
            lastName: {
                type: dataTypes.STRING,
                allowNull: false,
                defaultValue: 'default'
            }
        },
        {
            sequelize: db,
            modelName: 'User'
        }
    );
    return User;
};
