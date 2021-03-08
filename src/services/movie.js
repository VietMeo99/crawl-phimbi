/* eslint-disable no-extra-boolean-cast */
import request from "request-promise";
import cheerio from "cheerio";
import { slug } from "../utils";
import puppeteer from "puppeteer";
const proxyChain = require('proxy-chain');

export async function updateMovieDetail(movie) {
    // const oldProxyUrl = 'http://194.37.98.123:3128';
    // const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

    // const response = await request({
    //         'uri':movie.link,
    //         'method': "GET",
    //         'proxy': newProxyUrl
    //     });

    const response = await request.get(movie.link);
    const $ = await cheerio.load(response);
    movie.trailer = ""; 
    // movie.trailer = $("iframe").attr("src") || "";
    movie.description = $("article.item-content").text().trim() || "";
    movie.categories = $(".movie-detail p").eq(4).text().split(":")[1] || "";
    movie.slug_cats = (movie.categories && slug(movie.categories)) || "";
    movie.times = $(".movie-detail p").eq(-1).text().split(":")[1] || "";
    movie.views = 1000;
        // +$(".movie-detail p")
        //     .eq(-2)
        //     .text()
        //     .split(":")[1] ? 
        //     +$(".movie-detail p")
        //     .eq(-2)
        //     .text()
        //     .split(":")[1].trim()
        //     .replace(",", "")
        //     .replace("'", "")
        //     .replace('"', "") : 1000;
    movie.year = $(".movie-detail p").eq(3).text().split(":")[1] || 2021;
    movie.country = $(".movie-detail p").eq(5).text().split(":")[1] || "";
    movie.actors = $(".movie-detail p").eq(5).text().split(":")[1] || "";
    movie.director = $(".movie-detail p").eq(-3).text().split(":")[1] || "";
    // movie.rating = +$("#average").text().trim() || 100;
    movie.rating = +$("span.score").text() ? +$("span.score").text().trim() : 100;
    // movie.poster = $("p img").attr("src") || "";
    movie.rating_count = +$("#rate_count").text() ? +$("#rate_count").text().trim() : 50;
    movie.linkMovie = $("a.watch-movie").attr("href") || "";
    return movie;
}

export async function getListMovies(page) {
    const baseURL = `https://phimgi.tv/phim-le/page/${page}/`;
    // https://phimgi.tv/phim-le/page/216/
    const response = await request.get(baseURL); 
    // const oldProxyUrl = 'http://194.37.98.123:3128';
    // const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

    // const response = await request({
    //     'uri':baseURL,
    //     'method': "GET",
    //     'proxy': newProxyUrl
    // });

    const $ = await cheerio.load(response);
    const list = []; 
    // eslint-disable-next-line no-unused-vars   
    $("div.halim-item").each(function (i, e) {
        const title = $(this).find("h2.entry-title").text();
        const subtitle = $(this).find("p.original_title").text();
        const img = $(this).find("img").attr("src");
        const link = $(this).find("a.halim-thumb").attr("href");

        list.push({ title, subtitle, img, link });
    });
    return list; 
}

export async function getMovieSrc(movie) {
    console.log('movie : ', movie.title);
    const oldProxyUrl = 'http://194.37.98.123:3128';
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
    const browser = await puppeteer.launch({
        args: [ `--proxy-server=${newProxyUrl}`]
    });
    //http://194.37.98.123:3128/ 
    const page = await browser.newPage();
    
    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(0);
    // console.log("Start");
    await page.goto(movie.linkMovie, {
        waitUntil: "networkidle2",
    });
    movie.src = await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    return document.querySelector("iframe.embed-responsive-item") ? document.querySelector("iframe.embed-responsive-item").getAttribute("src") : "";
    });
    console.log('src : ', movie.src);
    await movie.save();
    await browser.close();
    // console.log('end');
}
