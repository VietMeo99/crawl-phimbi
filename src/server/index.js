import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import { env, dbConnect } from "../configs";
import { Movie } from "../models";
import { HttpError } from "./constant";
import { getMovieSrc } from "../services";

export async function main() {
    // eslint-disable-next-line no-unused-vars
    const { dbClean } = await dbConnect(env.uri);
    const app = express();

    app.use(express.json());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(cors());

    // eslint-disable-next-line no-unused-vars
    app.get("/", (req, res, next) => {
        return res.status(200).json({
            msg: "OK",
        });
    });
    app.get("/api/v1/service-movie/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const movie = await Movie.find(id);
            if (!movie) {
                throw new HttpError(`Could not find movie with id ${id}`, 404);
            }
            await getMovieSrc(movie);
            return res.status(200).json({
                msg: "ok",
            });
        } catch (error) {
            next(error);
        }
    });

    app.use((req, res, next) => {
        const error = new HttpError(`Not Found`, 404);
        next(error);
    });

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        const status = err.status ? err.status : 500;
        return res.status(status).json({
            msg: err.message,
        });
    });

    app.listen(env.port, () =>
        console.log(`Server is running on port: ${env.port}`),
    );
}
