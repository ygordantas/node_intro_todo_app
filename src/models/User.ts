import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  todos: [{ type: mongoose.Types.ObjectId, required: true, ref: "Todo" }]
});

const User = mongoose.model("User", userSchema);

export default User;
