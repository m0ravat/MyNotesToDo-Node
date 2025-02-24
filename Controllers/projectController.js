const Project = require('../Models/project');
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
        res.status(201).json({ project });  // Return the created project
    } catch (err) {
        const errors = handleErrors(err);  // Handle any errors (like validation errors)
        res.status(400).json({ errors });  // Send back errors if any
    }
};

const projectUpdate = async (req, res) => {

}
const projectDelete = async (req, res) => {

}

module.exports = {
    projectGet, 
    projectPost,
    projectUpdate,
    projectDelete,
    projectGetDetails
}