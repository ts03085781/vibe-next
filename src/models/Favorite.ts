import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  favorites: mongoose.Types.ObjectId[];
}

const FavoriteSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  favorites: [{ type: mongoose.Types.ObjectId, required: true }],
});

export default models.Favorite || model<IFavorite>("Favorite", FavoriteSchema);
