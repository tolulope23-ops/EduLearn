import { Sequelize } from 'sequelize';
import config from './config/config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

//Authenticate with DB
export const authenticateDB = async() => {
  try {
    await sequelize.authenticate(); 
    console.log('Connected to Database');
  } catch (error) {
    console.log('Connection to Database failed:', error.message);
    process.exit(1);
  };
};

export default sequelize;
