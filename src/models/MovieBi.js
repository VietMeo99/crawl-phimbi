import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
//Phim le

const movieBiSchema = new Schema(
    { 
        title: {
            type: String,
            require: true,
        },
        subtitle: {
            type: String,
            require: true,
        },
        slug: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        director: {
            type: String,
            require: true,
        },
        trailer: {
            type: String,
            require: true,
        },
        poster: {
            type: String,
            require: true,
        },
        img: {
            type: String,
            require: true,
        },
        src: {
            type: String,
            // require: true,
            default: "",
        },
        //link to scrap data
        link: {
            type: String,
            required: true,
        },
        linkMovie: {
            type: String,
            // required: true,
        },
        rating: {
            type: Number,
            require: true,
            default: 0,
        },
        rating_count: {
            type: Number,
            require: true,
            default: 0,
        },
        comments: {
            type: [],
        },
        categories: {
            type: String,
        },
        slug_cats: {
            type: String,
        },
        actors: {
            type: String,
        },
        views: {
            type: Number,
        },
        year: {
            type: String,
        },
        times: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

movieBiSchema.plugin(mongoosePaginate);
export const MovieBi = model("MovieBi", movieBiSchema);
