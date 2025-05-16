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
const cardUpdate = async (req, res) => {
    const {title, description, priority, done} = req.body;
    try{
        const card = await Card.findByIdAndUpdate(
            req.params.id,
            { title: title, description: description, priority: priority, done: done },
            { new: true }
        )
        const io = req.app.get('io');
        io.to(card.parentProject.toString()).emit('cardUpdated', {
            card: {  // Wrap in `card` object
                _id: req.params.id,
                title,
                description,
                priority,
                done,
                parentProject: card.parentProject // Include if frontend needs it
            }
        });

        res.json(card);
    } catch (err){
        res.status(400).json(err);  // Send back errors if any
    }
}
const cardDelete = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the project exists
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Delete the project
        await Card.findByIdAndDelete(id);
        const io = req.app.get('io');
        io.to(card.parentProject.toString()).emit('cardDeleted', {
            title: card.title
        });
        res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { 
    cardPost,
    cardUpdate,
    cardDelete,
}