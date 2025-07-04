import mongoose from 'mongoose';
const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  tags: [String],

  starterCode: {
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' }
  },

  solutionCode: {
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' }
  },

  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true }
    }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);

