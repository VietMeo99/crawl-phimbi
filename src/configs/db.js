import mongoose from "mongoose";

export async function dbConnect(uri) {
    await mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    async function dbClean() {
        await mongoose.connection.db.dropDatabase();
        console.log("Done");
    }
    return { dbClean };
}
