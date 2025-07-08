import User from '../models/user.js';
import Problem from '../models/problem.js';

const difficultyPoints = {
  Easy: 10,
  Medium: 20,
  Hard: 30,
};

export const updateLeaderboard = async (req, res) => {
  try {
    const { userId, problemId } = req.body;

    if (!userId || !problemId) {
      return res.status(400).json({ error: "Missing userId or problemId" });
    }

    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);

    if (!user || !problem) {
      return res.status(404).json({ error: 'User or Problem not found' });
    }

    user.solvedProblems = user.solvedProblems || [];
    user.score = typeof user.score === 'number' ? user.score : 0;
    user.submissionCount = typeof user.submissionCount === 'number' ? user.submissionCount : 0;

    // Always increment submission count
    user.submissionCount += 1;

    const alreadySolved = user.solvedProblems.some(
      (entry) => entry.problem.toString() === problemId
    );

    if (!alreadySolved) {
      user.solvedProblems.push({ problem: problem._id });

      const points = difficultyPoints[problem.difficulty] || 10;
      user.score += points;
    }

    await user.save();

    res.json({ message: 'Leaderboard updated successfully' });
  } catch (err) {
    console.error("Error updating leaderboard:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name score solvedProblems submissionCount')
      .sort({ score: -1, name: 1 })
      .limit(50);

    const leaderboardData = users.map(user => ({
      name: user.name,
      solvedCount: user.solvedProblems?.length || 0,
      submissionCount: user.submissionCount || 0,
      score: user.score || 0
    }));

    res.json(leaderboardData);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
