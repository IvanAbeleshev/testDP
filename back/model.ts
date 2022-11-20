import { sequelize } from './db'
import { DataType } from 'sequelize-typescript'
import { userRole } from './interfaces'

const category = sequelize.define('category', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataType.STRING,
        allowNull: false
    },
    description:{
        type: DataType.TEXT,
        allowNull: true
    }
})

const blogs = sequelize.define('blogs',{
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataType.STRING,
        allowNull: false
    },
    text:{
        type: DataType.TEXT,
        allowNull: false
    },
    cover:{
        type: DataType.STRING,
        allowNull: true    
    }
})

const users = sequelize.define('users', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    login:{
        type: DataType.STRING,
        allowNull: false,
    },
    password:{
        type: DataType.STRING,
        allowNull: false,
    },
    role:{
        type: DataType.STRING,
        allowNull: false,
        defaultValue: userRole.guest
    }
})


category.hasMany(blogs)
blogs.belongsTo(category)

users.hasMany(blogs)
blogs.belongsTo(users)

export {category, blogs, users}