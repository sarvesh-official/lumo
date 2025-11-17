import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICard {
  question: string;
  answer: string;
}

export interface IFlashcard extends Document {
  userId: string;
  chatId: mongoose.Types.ObjectId | string;
  cards: ICard[];
  createdAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const FlashcardSchema = new Schema<IFlashcard>({
  userId: { type: String, required: true, index: true },
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  cards: { type: [CardSchema], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard || mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;
