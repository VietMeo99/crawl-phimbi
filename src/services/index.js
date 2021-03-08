/* eslint-disable no-unused-vars */
import { getListMovies, updateMovieDetail, getMovieSrc } from "./movie";
import Redis from "ioredis";
import kue from "kue";

import { dbConnect, env } from "../configs";
import { Movie } from "../models";

const queue = kue.createQueue({
    redis: {
        createClientFactory: function () {
            return new Redis();
        },
    },
});

export async function crawlMovies() {       
    console.log(env.uri);
    await dbConnect(env.uri);
    // cao src phim
    // for(let i=1 ; i <= 1 ; i ++){ // 95
    for(let i=1 ; i <= 260 ; i ++){
        console.log('i : ', i);
        let data = (await Movie.paginate({}, {page: i,limit: 2})).docs;
        // Movie.paginate({}, {page: i,limit: 45})
            // .then(result => {
            //     data: result.docs, // { {}, {}, ...}
            //     console.log('rs  : ', result.docs);
            // })
            // .catch( _e => {
            //     console.log('e : ', _e);
            // })
        // console.log('data : ', data);
        const request = data.map((item) => {
            return getMovieSrc(item).catch(e => console.log('e : ', e));
        })

        await Promise.all(request).catch(e => console.log('e : ', e))
    }

    //  cao thong tin
    // for (let i = 1; i <= 217; i++) { // i = 11
    //     const job = queue
    //         .create("crawl-list-movie", { page: i })
    //         .save(function (err) {
    //             if (err) console.log("err queue : ",err); 
    //             // console.log(job.id);
    //         });
    // }

    // queue.process("crawl-list-movie", 10, async function (job, done) {
    //     const list = await getListMovies(job.data.page); // return list [ {} ]
    //     let list_updated = await Promise.all(
    //         list.map(async (movie) => {
    //             const movieAvaiable = await Movie.findOne({link: movie.link});
    //             if(!movieAvaiable) 
    //                 return await updateMovieDetail(movie);
    //         }),
    //     );
    //     list_updated = list_updated.filter((e) => !!e);
    //     await Movie.create(list_updated);
    //     done();  
    // });
}
 
export { getMovieSrc }; 