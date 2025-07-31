import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, enum: ["local", "google"], default: "local" }, // ⬅️ Add this
  role: { type: String, default: "user" },
  googleId: { type: String, unique: true },

  // Leaderboard fields
  solvedProblems: [
    {
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
      solvedAt: { type: Date, default: Date.now },
    },
  ],
  score: { type: Number, default: 0 },
  submissionCount: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
export default User;
