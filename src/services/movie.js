/* eslint-disable no-extra-boolean-cast */
import request from "request-promise";
import cheerio from "cheerio";
import { slug } from "../utils";
import puppeteer from "puppeteer";
const proxyChain = require('proxy-chain');

const oldProxyUrl = 'http://194.37.98.123:3128';
var t = Math.ceil((Math.random()*100));

export async function updateMovieDetail(movie) {
    // const oldProxyUrl = 'http://194.37.98.123:3128';
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

    const response = await request({
            'uri':movie.link,
            'method': "GET",
            'proxy': newProxyUrl
        });

    // const response = await request.get(movie.link);
    const $ = await cheerio.load(response);
    movie.trailer = ""; 
    // movie.trailer = $("iframe").attr("src") || "";
    movie.description = $("#film-content").text() ? $("#film-content").text().trim() : "";
    movie.categories = $(".movie-dl dt").eq(4).text() ? $(".movie-dl dt").eq(4).text().split(":")[1].trim() : "";
    movie.slug_cats = (movie.categories && slug(movie.categories)) || "";
    movie.times = $(".movie-dl dt").eq(-1).text() ? $(".movie-dl dt").eq(-1).text().split(":")[1].trim() : "";
    movie.views = 1000 + t;
    movie.year = 2021;
    // movie.year = $(".movie-dl dt").eq(3).text() ? $(".movie-dl dt").eq(3).text().split(":")[1].trim() : 2021;
    movie.country = $(".movie-dl dt").eq(5).text() ? $(".movie-dl dt").eq(5).text().split(":")[1].trim() : "Chưa xác định";
    movie.actors = $(".movie-dl dt").eq(3).text() ? $(".movie-dl dt").eq(3).text().split(":")[1].trim() : "Chưa xác định";
    movie.director = $(".movie-dl dt").eq(2).text() ? $(".movie-dl dt").eq(2).text().split(":")[1].trim() : "Chưa xác định";
    movie.rating = 100 + t;
    // movie.poster = $("p img").attr("src") || "";
    movie.rating_count = t + 50;
    movie.linkMovie = ("http://biphimz.tv" + $("a#btn-film-watch").attr("href")) || "";
    return movie;
}

export async function getListMovies(page) {
    // console.log("page : ", page);
    const baseURL = `http://biphimz.tv/kieu-phim-phim-le-19.a20i${page}.html`; 
    // https://phimgi.tv/phim-le/page/216/
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
    
    const response = await request({
        'uri':baseURL,
        'method': "GET",
        'proxy': newProxyUrl
    });
    // const response = await request.get(baseURL); 

    const $ = await cheerio.load(response);
    const list = []; 
    // eslint-disable-next-line no-unused-vars   
    $("li.movie-item").each(function (i, e) { 
        const title = $(this).find("span.movie-title-1").text();
        const views = +$(this).find("span.ribbon").text().split(":")[1].trim() || 1000;
        const subtitle = $(this).find("span.movie-title-2").text() || "";
        const img = $(this).find("div.movie-thumbnail").attr("style").match(/http(.*)\)/)[0].slice(0, -1);
        const link = "http://biphimz.tv" + $(this).find("a.block-wrapper").attr("href");
        const times = $(this).find("span.movie-title-chap").text();
        // http://biphimz.tv/phim-giai-cuu-than-chet/1276.html
        list.push({ title, subtitle, img, link , views , times });  
    });
    return list;
}

export async function getMovieSrc(movie) {
    console.log('movie : ', movie.title);
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
    // return document.querySelector("iframe.embed-responsive-item") ? document.querySelector("iframe.embed-responsive-item").getAttribute("src") : "";
    return document.querySelector("iframe.lazyloaded") ? document.querySelector("iframe.lazyloaded").getAttribute("src") : "";
    });
    console.log('src : ', movie.src);
    await movie.save();
    await browser.close();
    // console.log('end');
}