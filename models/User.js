import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String, // тип данных String
            required: false, // Обязательный ключ
        },
        email: {
            type: String,
            //required: true,
            // unique: false, // уникальный, не может повторяться два раза
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
    },
    {
        timestamps: false,
    }
);

export default mongoose.model("User", userSchema);
