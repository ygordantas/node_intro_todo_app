import mongoose from "mongoose";

const todoPrioritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sortKey: { type: Number, required: true },
  iconOptionName: { type: String, required: true},
});

const TodoPriority = mongoose.model("TodoPriority", todoPrioritySchema);

export default TodoPriority;