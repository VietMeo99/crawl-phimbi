/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
import { getListMovies, updateMovieDetail, getMovieSrc } from "./movie";
import Redis from "ioredis";
import kue from "kue";

import { dbConnect, env } from "../configs";
// import { MovieBi } from "../models/MovieBi";
// import { Movie } from "../models";
import { MovieGi } from "../models/MovieGi";

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
    // for(let i=1758; i <= 4848 ; i ++){ // 1760  bilu
    //     console.log('i : ', i);
    //     let data = (await Movie.paginate({}, {page: i,limit: 2})).docs;
    //     const request = data.map((item) => {
    //         return getMovieSrc(item).catch(e => console.log('e : ', e));
    //     })

    //     await Promise.all(request).catch(e => console.log('e : ', e))
    // }
    
    for(let i=1; i <= 518 ; i ++){ // phim gi
        console.log('i : ', i);
        let data = (await MovieGi.paginate({}, {page: i,limit: 20})).docs;
        const request = data.map((item) => {
            if(item.src == "")
                return getMovieSrc(item).catch(e => console.log('e : ', e));
        })

        await Promise.all(request).catch(e => console.log('e : ', e))
    }
    // for (let i = 1; i < 57; i++) { // 57
    //     const job = queue
    //         .create("crawl-list-movie", { page: i })
    //         .save(function (err) {
    //             if (err) console.log(err); 
    //             // console.log(job.id);
    //         });  
    // } 

    // queue.process("crawl-list-movie", 5, async function (job, done) {
    //     const list = await getListMovies(job.data.page); // return list [ {} ]
    //     let list_updated = await Promise.all(
    //         list.map(async (movie) => { 
    //             const movieAvaiable = await MovieBi.findOne({link: movie.link}); 
    //             if(!movieAvaiable) {
    //                 console.log("movie : ", movie.title);
    //                 return await updateMovieDetail(movie);  
    //             }
    //             else{
    //                 console.log('link : ', movieAvaiable.link);
    //                 return null;
    //             } 
    //         }),  
    //     );
    //     list_updated = await list_updated.filter((e) => !!e);
    //     await MovieBi.create(list_updated);  
    //     done(); 
    // });
}
 
export { getMovieSrc }; 