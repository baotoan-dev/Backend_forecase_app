import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
// import firebaseAdmin from "firebase-admin";
import helmet from "helmet";
import http from "http";

import route from "./routes/route";
import configSocket from "./configs/socket";
import logging from "./utils/logging";
import configJsonFirebase from "./keys/gig-app-82de6-firebase-adminsdk-vnayw-9fd65a122d.json";
import "./configs/redis";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: number;
            };
        }
        interface Response {
            io: any;
        }
    }
}

// Config environment variables
dotenv.config();

// Init app
const app = express();

// Create server
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

// DDOS protection
// app.use(
//     rateLimit({
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 100, // limit each IP to 100 requests per windowMs (here, per 15 minutes)
//         handler: (req, res) => {
//             return res.status(429).send("Too many requests");
//         },
//     })
// );

// Cors middlewares
app.use(cors(
    {
        origin: "*",
    }
));
app.use(helmet());

// Middlewares to get POST request body
app.use(express.json({ limit: "10mb" }));
app.use(
    express.urlencoded({
        extended: false,
        limit: "10mb",
    })
);

// Socket
const io = configSocket(server);

global.__io = io;

// Init firebase app
// firebaseAdmin.initializeApp({
//     credential: firebaseAdmin.credential.cert(configJsonFirebase as any),
//     projectId: "gig-app-82de6",
// });

// Routers
route(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logging.success(`Server is listening on port ${PORT}`);
});

type ModuleId = string | number;

interface WebpackHotModule {
    hot?: {
        data: any;
        accept(
            dependencies: string[],
            callback?: (updatedDependencies: ModuleId[]) => void
        ): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
}
