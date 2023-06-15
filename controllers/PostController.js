import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try {
        // limit(5) - получение последних 5 статей 2:34
        const posts = await PostModel.find().limit(5).exec();

        // flat - вытаскиваем все статьи
        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить тэги",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        // получение всех статей
        // populate('user').exec() связь и запрос 1:37
        const post = await PostModel.find().populate("user").exec();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить все статьи",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        // получение ID
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                // viesCount++
                $inc: { viewsCount: 1 },
            },
            {
                // Обновить результат и ее же вернуть
                returnDocument: "after",
            },
            // функция после обновления и получения результата
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не удалось найти статью",
                    });
                }
                // проверка на существование документа
                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена",
                    });
                }
                res.json(doc);
            }
        ).populate("user");
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить все статьи",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не удалось удалить статью",
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена",
                    });
                }
                res.json({
                    success: true,
                });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить все статьи",
        });
    }
};

export const update = async (req, res) => {
    console.log(req.body.tags);
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(","),
                // Получение ID после авторизации пользователя
            }
        );
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось обновить статью",
        });
    }
};

export const create = async (req, res) => {
    try {
        // Создание документа 1:28\
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            // Получение ID после авторизации пользователя
            user: req.userId,
        });

        const post = await doc.save();
        console.log("post", post);
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось создать статью",
        });
    }
};
