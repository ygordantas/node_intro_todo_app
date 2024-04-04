import mongoose from "mongoose";

const todoCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const TodoCategory = mongoose.model("TodoCategory", todoCategorySchema);

export default TodoCategory;
