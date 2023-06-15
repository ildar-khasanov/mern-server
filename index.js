import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
    registrValidation,
    loginValidation,
    postCreateValidation,
} from "./validations.js";
import { checkAuth, handelValidationErrors } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";
import config from "./config/index.js";

mongoose.set("strictQuery", false);

mongoose
    .connect(config.mongoDB)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err));

const app = express();

// создание хранилища для картинок
const storage = multer.diskStorage({
    // по какому пути сохранять
    destination: (_, __, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

// в мультер передаем наше созданное хранилище
const upload = multer({ storage });

app.use(express.json());
app.use(cors());

// если придет любой запрос на '/uploads', то тогда из бибилиотеке static =>
// сверь ссылку и название файла
app.use("/uploads", express.static("uploads"));

app.post(
    "/auth/login",
    loginValidation,
    handelValidationErrors,
    UserController.login
);
// если будет запрос на '/auth/me', chechAuth решит, нужно ли выполнять
// остальные функции
app.post(
    "/auth/register",
    //registrValidation,
    //handelValidationErrors,
    UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

// если придет post запрос на upload
// третий параметр ожидает свойство image(изображение), если такой файл придет =>
// вернем клиенту по какому пути сохранили изображениел
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    handelValidationErrors,
    PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);
app.get("posts/tags", PostController.getLastTags);
app.get("/tags", PostController.getLastTags);

app.listen(8001, console.log("listen 8000"));
