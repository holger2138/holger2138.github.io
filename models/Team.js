module.exports = (db, model, dataTypes) => {
    class Team extends model {}
    Team.init(
        {
            teamName: { type: dataTypes.STRING },
            teamPlace: { type: dataTypes.STRING },
            teamCode: { type: dataTypes.INTEGER }
        },
        {
            sequelize: db,
            modelName: 'Team'
        }
    );

    return Team;
};
