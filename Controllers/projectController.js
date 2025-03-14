const Project = require('../Models/project');
const User = require('../Models/user');
const handleErrors = (err) => {
    let errors = { title: "", description: "", createdBy: "" };
    if (err.code === 11000){
      errors.title = "That project title is already registered on our database";
    }
    console.log(err.message, err.code);
  
  
    if (err.message.includes("Project validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        console.log(properties); // Log the properties of each error
        errors[properties.path] = properties.message; // Update the error message for each field
      });
    }
  
    return errors;
  };
const projectGet = (req,res) => {
    res.render('createProject', {title : "Create A Project"});
}
const projectGetDetails = (req, res) => {
    res.render('projectDetails', {
        title: res.locals.project.title,
        projectTitle: res.locals.project.title,
        description: res.locals.project.description,
        id: res.locals.project._id,
        doneCards: res.locals.doneCards,
        notDoneCards: res.locals.notDoneCards
    });
};

const projectPost = async (req, res) => {
    const { title, description, createdBy } = req.body;
    try {
        const project = await Project.create({
            title,
            description,
            createdBy
        });
        const user = await User.findByIdAndUpdate(
            createdBy,
            { $push: { projects: project._id } }, // Add project ID to projects array
            { new: true } // Return updated user document
        );
        res.status(201).json({ project, user });  // Return the created project
    } catch (err) {
        const errors = handleErrors(err);  // Handle any errors (like validation errors)
        res.status(400).json({ errors });  // Send back errors if any
    }
};

const projectUpdate = async (req, res) => {
    const {title, description} = req.body;
    try{
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { title: title, description: description },
            { new: true }
        )
        res.json(project);
    } catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });  // Send back errors if any
    }
}
const projectDelete = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the project exists
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Delete the project
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    projectGet, 
    projectPost,
    projectUpdate,
    projectDelete,
    projectGetDetails
}