import app from './app.js';
import {PORT} from './common/config/env.config.js';
import { authenticateDB } from './common/database/connection.js';


authenticateDB();

app.listen(PORT, () => {
  console.log("server is listening...");
});
