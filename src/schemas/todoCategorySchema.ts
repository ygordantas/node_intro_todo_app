import mongoose from "mongoose";

const todoCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model("TodoCategory", todoCategorySchema);
