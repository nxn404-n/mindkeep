import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

//Todo: Add allowedorigins after making frontend
/*const allowedorigins = [];
  app.use(cors({
    origin: allowedorigins,
    credentials: true
  }));
*/

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Server is running at http://localhost:${PORT}`);
      }
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });
