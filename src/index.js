import app from './app.js';
import {PORT} from './common/config/env.config.js';


app.listen(PORT, () => {
  console.log("server is listening...");
});
