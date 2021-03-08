/* eslint-disable no-unused-vars */
import { main } from "./server/index";
import { crawlMovies, getMovieSrc } from "./services";

import { dbConnect, env, dbClean } from "./configs";
import { Movie } from "./models";

async function testDB() {
    crawlMovies() 
    // const { dbClean } = await dbConnect("mongodb://localhost:27017/phe-phim");
    // await dbClean();   

    // const movies = await Movie.find({}).skip(1).limit(10);

    // await getMovieSrc(movies[1]);   

    // const movie = await Movie.findById(movies[1]._id);
    // console.log(movie);
}

testDB();

main();
