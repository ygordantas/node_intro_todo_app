import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priorityId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "TodoPriority",
  },
  categoryId: { type: mongoose.Types.ObjectId, ref: "TodoCategory" },
  createdBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, required: true },
  lastUpdatedAt: { type: Date, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
