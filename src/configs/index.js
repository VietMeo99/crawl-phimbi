import "dotenv/config";

import { dbConnect } from "./db";

const env = {
    port: process.env.PORT || 3005,
    uri: process.env.DB_URI,
};

export { dbConnect, env };
