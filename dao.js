const { Sequelize, DataTypes } = require("sequelize");

//Conection DB - MySQL
const sequelize = new Sequelize(
  'store',
  'root',
  'user',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

//Check coneection with server
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

//Tables

const Order = sequelize.define("orderuser", {
  orderID: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    defaultValue: Sequelize.INTEGER,
    allowNull: false
  },
  orderNum: {
    type: DataTypes.INTEGER,
    defaultValue: Sequelize.INTEGER,
    allowNull: false
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.DATE,
    allowNull: false
  },
  numProducts: {
    type: DataTypes.INTEGER,
    defaultValue: Sequelize.INTEGER,
    allowNull: false
  },
  finalPrice: {
    type: DataTypes.FLOAT,
    defaultValue: Sequelize.FLOAT,
    allowNull: false
  },
  orderStatus: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  freezeTableName: true
})

//Tabla Productos 
const Product = sequelize.define("product", {
  productID: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    defaultValue: Sequelize.INTEGER,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.STRING,
    allowNull: false
  },
  productDesc: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: Sequelize.FLOAT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  freezeTableName: true
})

//Tabla relacion orders - product
const productOrder = sequelize.define("productorder",{
  orderProductID : {
      primaryKey : true,
      type : DataTypes.INTEGER,
      defaultValue : Sequelize.INTEGER,
      allowNull : false
  },
  orderID : {
      type : DataTypes.INTEGER,
      allowNull : false
  },
  productID : {
      type : DataTypes.INTEGER,
      allowNull : false
  }
},{
  timestamps : false,
  freezeTableName : true
})

productOrder.belongsTo(Product, {
  foreignKey : "productID"
})
Product.hasMany(productOrder, {
  foreignKey : "productID"
})

productOrder.belongsTo(Order, {
  foreignKey : "orderID"
})
Order.hasMany(productOrder, {
  foreignKey : "orderID"
})

module.exports = {
  Order, productOrder, Product
}