import Problem from '../models/problem.js';
import redisClient from '../utils/redisClient.js'; // adjust path if needed

// Admin: Create problem
export const createProblem = async (req, res) => {
  let { title, description, difficulty, tags = [], testCases, solutionCode = {} } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({ error: 'At least one test case is required' });
  }

  // Convert all literal '\n' in description to real newlines and clean up formatting
  if (typeof description === 'string') {
    // Replace literal \n with real newlines
    description = description.replace(/\\n/g, '\n');
    // Clean up any double newlines that might cause rendering issues
    description = description.replace(/\n{3,}/g, '\n\n');
    // Ensure proper spacing around LaTeX blocks
    description = description.replace(/(\n\$\$)/g, '\n\n$$');
    description = description.replace(/(\$\$\n)/g, '$$\n\n');
    
    // Convert common LaTeX symbols to HTML entities for better rendering
    description = description
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\approx/g, '≈')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\pm/g, '±')
      .replace(/\\infty/g, '∞')
      .replace(/\\sum/g, '∑')
      .replace(/\\prod/g, '∏')
      .replace(/\\int/g, '∫')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\pi/g, 'π')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\omega/g, 'ω');
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

    await redisClient.del('all_problems'); // Invalidate cache

    console.log('✅ Created problem:', problem.title);
    console.log('📝 Description length:', problem.description.length);
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

  let problems = req.body;

  if (!Array.isArray(problems)) {
    return res.status(400).json({ error: 'Expected an array of problems' });
  }

  // Convert all literal '\n' in description to real newlines for each problem
  problems = problems.map(p => {
    let cleanDescription = p.description;
    if (typeof cleanDescription === 'string') {
      // Replace literal \n with real newlines
      cleanDescription = cleanDescription.replace(/\\n/g, '\n');
      // Clean up any double newlines that might cause rendering issues
      cleanDescription = cleanDescription.replace(/\n{3,}/g, '\n\n');
      // Ensure proper spacing around LaTeX blocks
      cleanDescription = cleanDescription.replace(/(\n\$\$)/g, '\n\n$$');
      cleanDescription = cleanDescription.replace(/(\$\$\n)/g, '$$\n\n');
      
      // Convert common LaTeX symbols to HTML entities for better rendering
      cleanDescription = cleanDescription
        .replace(/\\leq/g, '≤')
        .replace(/\\geq/g, '≥')
        .replace(/\\neq/g, '≠')
        .replace(/\\approx/g, '≈')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\pm/g, '±')
        .replace(/\\infty/g, '∞')
        .replace(/\\sum/g, '∑')
        .replace(/\\prod/g, '∏')
        .replace(/\\int/g, '∫')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\gamma/g, 'γ')
        .replace(/\\delta/g, 'δ')
        .replace(/\\theta/g, 'θ')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\mu/g, 'μ')
        .replace(/\\pi/g, 'π')
        .replace(/\\sigma/g, 'σ')
        .replace(/\\phi/g, 'φ')
        .replace(/\\omega/g, 'ω');
    }
    
    return {
      ...p,
      description: cleanDescription,
      createdBy: req.user.id,
    };
  });

  try {
    const result = await Problem.insertMany(problems);
    await redisClient.del('all_problems'); // Invalidate cache
    
    console.log(`✅ Bulk created ${result.length} problems`);
    console.log('📝 Sample description length:', result[0]?.description?.length || 'N/A');
    
    res.status(201).json({ message: `${result.length} problems added.` });
  } catch (err) {
    console.error('❌ Bulk create failed:', err.message);
    res.status(500).json({ error: 'Failed to create problems in bulk' });
  }
};

// Public: Fetch all problems (with Redis cache)
export const getAllProblems = async (req, res) => {
  try {
    const cached = await redisClient.get('all_problems');
    if (cached) {
      console.log('📦 Served from Redis: all_problems');
      return res.status(200).json({ problems: JSON.parse(cached) });
    }

    const problems = await Problem.find().sort({ createdAt: -1 });
    await redisClient.set('all_problems', JSON.stringify(problems), { EX: 300 }); // Cache for 5 mins

    res.status(200).json({ problems });
  } catch (err) {
    console.error('❌ Fetching all problems failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

// Public: Fetch single problem (with Redis cache)
export const getSingleProblem = async (req, res) => {
  const key = `problem:${req.params.id}`;
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      console.log(`📦 Served from Redis: ${key}`);
      return res.status(200).json(JSON.parse(cached));
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    await redisClient.set(key, JSON.stringify(problem), { EX: 300 }); // Cache 5 mins
    res.status(200).json(problem);
  } catch (err) {
    console.error('❌ Fetch single problem failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
};

// Admin: Update problem
export const updateProblem = async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Invalidate cache
    await redisClient.del('all_problems');
    await redisClient.del(`problem:${req.params.id}`);

    res.status(200).json({ message: 'Problem updated successfully', problem: updatedProblem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update problem' });
  }
};

// Admin: Delete problem
export const deleteProblem = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (deleted) {
      await redisClient.del('all_problems'); // Invalidate cache
      await redisClient.del(`problem:${req.params.id}`);
    }

    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (err) {
    console.error('❌ Deleting problem failed:', err.message);
    res.status(500).json({ error: 'Failed to delete problem' });
  }
};
