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
        const data = res.json(card);
        console.log("Card data");
        console.log(data);
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
        res.status(200).json({ message: "card deleted successfully" });
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