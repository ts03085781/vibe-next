import mongoose, { Schema, model, models } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  favorites: mongoose.Types.ObjectId[];
  // createdDate: Date;
}

const FavoriteSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  favorites: [{ type: mongoose.Types.ObjectId, required: true, unique: true }],
  // createdDate: { type: Date, required: true },
});

export default models.Favorite || model<IFavorite>("Favorite", FavoriteSchema);
