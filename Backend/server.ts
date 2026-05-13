import {app} from './dist/src/app.js';
import { connectDB } from './dist/src/config/database.js';

// Connect to MongoDB
connectDB();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});