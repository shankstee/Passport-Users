module.exports = function (sequelize, DATATYPE) {
const Sessions = sequelize.define('Sessions', {
    sid: {
      type: DATATYPE.STRING,
      primaryKey: true
    },
    userId: DATATYPE.STRING,
    expires: DATATYPE.DATE,
    data: DATATYPE.STRING(5000)
  },
  {
    freezeTableName: true
  }
  
  
  );

  return Sessions;

};