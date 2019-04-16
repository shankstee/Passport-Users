module.exports = function (sequelize, DATATYPE) {
    const userTable = sequelize.define('userTable', {
        // attributes
        userName: {
          type: DATATYPE.STRING(20),
          allowNull: false
        },
        email: {
          type: DATATYPE.STRING(100),
          allowNull: false,
        },
        password: {
            type: DATATYPE.STRING(60).BINARY,
            allowNull: false
        }
      },
      {
        freezeTableName: true
      });
    
      return userTable;
    }