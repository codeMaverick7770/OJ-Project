import Problem from '../models/problem.js';

// Admin: Create problem
export const createProblem = async (req, res) => {
  const { title, description, difficulty, tags = [], testCases, solutionCode = {} } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({ error: 'At least one test case is required' });
  }

  try {
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      testCases,
      solutionCode,
      createdBy: req.user.id,
    });

    console.log('✅ Created:', problem.title);
    res.status(201).json({ message: 'Problem created successfully', problem });
  } catch (err) {
    console.error('❌ Problem creation error:', err.message);
    res.status(500).json({ error: 'Failed to create problem' });
  }
};

// Admin: Bulk create problems
export const bulkCreateProblems = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  const problems = req.body;

  if (!Array.isArray(problems)) {
    return res.status(400).json({ error: 'Expected an array of problems' });
  }

  try {
    const enrichedProblems = problems.map(p => ({
      ...p,
      createdBy: req.user.id,
    }));

    const result = await Problem.insertMany(enrichedProblems);
    res.status(201).json({ message: `${result.length} problems added.` });
  } catch (err) {
    console.error('❌ Bulk create failed:', err.message);
    res.status(500).json({ error: 'Failed to create problems in bulk' });
  }
};


// Public: Fetch all problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (err) {
    console.error('❌ Fetching all problems failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

// Public: Fetch single problem
export const getSingleProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.status(200).json(problem);
  } catch (err) {
    console.error('❌ Fetch single problem failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
};

// Admin: Delete problem
export const deleteProblem = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (err) {
    console.error('❌ Deleting problem failed:', err.message);
    res.status(500).json({ error: 'Failed to delete problem' });
  }
};
