import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        // зашифровка hash
        const password = req.body.password; // достаем пароль из тела
        const salt = await bcrypt.genSalt(10); // алгоритм шифрования пароля
        const hash = await bcrypt.hash(password, salt);

        // создание документа
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        // с помощью деструктизации вытавскиваем passwordHash, но ее не используем
        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось зарегестироваться",
        });
    }
};

export const login = async (req, res) => {
    try {
        // проверка на существование пользователя по email
        const user = await UserModel.findOne({ email: req.body.email });

        // req.status(404) - возращаем ответ 404
        if (!user) {
            return res.status(404).json({
                message: "Пользователь с такими данными отсутствует",
            });
        }
        // сравнение пароля с телом запроса (то, что пришло от пользователя) с паролем в БД
        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        // с помощью деструктизации вытавскиваем passwordHash, но ее не используем
        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (error) {
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};
