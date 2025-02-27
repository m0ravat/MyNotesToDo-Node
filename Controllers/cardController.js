const Card = require('../Models/card');
const Project = require ('../Models/project');

  const cardPost = async (req, res) => {
    const { title, description, priority, done, parentProject } = req.body;

    try {
        const card = await Card.create({
            title,
            description,
            priority,
            done,
            parentProject
        });

        const project = await Project.findByIdAndUpdate(
            parentProject,
            { $push: { cards: card._id } },
            { new: true }
        );

        res.status(201).json({ card, project });  // Return the created card and updated project
    } catch (err) {
        res.status(400).json({ err});  // Send back errors if any
    }
};
const cardUpdate = (req, res) => {

}
const cardDelete = (req, res) => {

}

module.exports = { 
    cardPost,
    cardUpdate,
    cardDelete,
}