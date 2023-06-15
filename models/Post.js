import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String, // тип данных String
            required: true, // Обязательный ключ
        },
        text: {
            type: String,
            required: true,
            // unique: true, // уникальный, не может повторяться два раза
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },

        imageUrl: String,
        user: {
            // есть mogoose, у него есть Schema, в ней есть Types
            // и есть спец. тип ObjextId
            type: mongoose.Schema.Types.ObjectId,
            // Ссылается на отдельную модель User
            ref: "User",
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

export default mongoose.model("Posts", PostSchema);
