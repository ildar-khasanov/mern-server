import { body } from "express-validator";

export const loginValidation = [
    body("email", "Неверная почта").isEmail(),
    body("password").isLength({ min: 5 }),
];

export const registrValidation = [
    // body("email", "Неверная почта").isEmail(),
    body("password").isLength({ min: 5 }),
    //body("fullName").isLength({ min: 3 }),
    // body("avatarUrl").optional().isURL(),
];

// optional - не обязательно для получения
export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
    body("text", "Введите текст статьи").isLength({ min: 3 }).isString(),
    body("tags", "Неверный формат тэгов (укажите массив)")
        .optional()
        .isString(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
