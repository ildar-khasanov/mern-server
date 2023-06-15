import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (token) {
        try {
            // расшифровка токена. В функцию verify (1-ый параметр = сам токен, 2-ой парам. ключ)
            const decoded = jwt.verify(token, "secret123");
            req.userId = decoded._id;
            next();
        } catch (error) {
            return res.status(403).json({
                message: "Нет доступа catch",
            });
        }
    } else {
        return res.status(403).json({
            message: "Нет доступа",
        });
    }
};
