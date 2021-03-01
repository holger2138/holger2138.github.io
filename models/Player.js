module.exports = (db, model, dataTypes) => {
    class Player extends model {}
    Player.init(
        {
            name: { type: dataTypes.STRING },
            age: { type: dataTypes.INTEGER }
        },
        {
            sequelize: db,
            modelName: 'Player'
        }
    );

    return Player;
};
