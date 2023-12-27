const Goal = require('./../models/goal');




const getGoals = async (req, res) => {
    console.log('TRYING TO FETCH GOALS');
    try {
      const goals = await Goal.find();
      res.status(200).json({
        goals: goals.map((goal) => ({
          id: goal.id,
          text: goal.text,
        })),
      });
      console.log('FETCHED GOALS');
    } catch (err) {
      console.error('ERROR FETCHING GOALS');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to load goals.' });
    }
}

const addGoal = async (req, res) => {
    console.log('TRYING TO STORE GOAL');
    const goalText = req.body.text;
  
    if (!goalText || goalText.trim().length === 0) {
      console.log('INVALID INPUT - NO TEXT');
      return res.status(422).json({ message: 'Invalid goal text.' });
    }
  
    const goal = new Goal({
      text: goalText,
    });
  
    try {
      await goal.save();
      res
        .status(201)
        .json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
      console.log('STORED NEW GOAL');
    } catch (err) {
      console.error('ERROR FETCHING GOALS');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to save goal.' });
    }
}

const deleteGoal= async (req, res) => {
    console.log('TRYING TO DELETE GOAL');
    try {
      await Goal.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Deleted goal!' });
      console.log('DELETED GOAL');
    } catch (err) {
      console.error('ERROR FETCHING GOALS');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to delete goal.' });
    }
  }


module.exports = {
    getGoals,
    addGoal,
    deleteGoal
}