const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const Project = require('../Models/project');
const Card = require('../Models/card');
const checkProject = async (req,res,next) =>{
    try {
        // Extract project ID from the URL parameter
        const projectId = req.params.id;

        // Check if the project exists
        const project = await Project.findById(projectId).populate('cards');

        // Fetch and split cards associated with the project by `done` status
        const doneCards = project.cards.filter(card => card.done === true);
        const notDoneCards = project.cards.filter(card => card.done === false);

        // Attach the results to the response object, so you can access them later
        res.locals.doneCards = doneCards;
        res.locals.notDoneCards = notDoneCards;

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}
const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err){
                res.redirect('/login');
                console.log(err.message);
            } else{
                console.log(decodedToken)
                req.user = decodedToken;
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}

const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.locals.user= null;
                next();
            } else{
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id).populate("projects");
                res.locals.user= user;
                next();
            }
        })
    }
    else{
        res.locals.user= null;
        next();

    }
}
const laog  = (req, res, next) => {
    console.log("Logging in");
    next();
}
const validateProject = async (req, res, next) => {
    const user = res.locals.user;

    if (!user) return res.redirect('/login');

    try {
        const project = await Project.findById(req.params.id);
        console.log(project);
        if (!project) return res.status(404).send('Project not found');

        // Correct field name
        const isCreator = project.createdBy.equals(user._id);
        const isParticipant = project.participants.some(participantId =>
        participantId.equals(user._id)
        );
        if (!isCreator && !isParticipant) {
            return res.status(403).send('Unauthorized updated');
        }


        res.locals.project = project;
        res.locals.isCreator = project.createdBy.equals(user._id);
        next();
    } catch (err) {
        console.log(err.message, "Valid auth");
        res.redirect('/');
    }
};

module.exports= {requireAuth, checkUser, validateProject, laog, checkProject}