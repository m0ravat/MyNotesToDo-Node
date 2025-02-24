const Project = require('../Models/project');
const handleErrors = (err) => {
    let errors = { title: "", description: "" };
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
const projectPost = async (req, res) => {
    const {title, description} = req.body;

    try{
        const project = await Project.create({title, description});
        res.render('/project/' + project._id, {title : project.title});
      }
      catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const projectUpdate = async (req, res) => {

}
const projectDelete = async (req, res) => {

}

module.exports = {
    projectGet, 
    projectPost,
    projectUpdate,
    projectDelete
}