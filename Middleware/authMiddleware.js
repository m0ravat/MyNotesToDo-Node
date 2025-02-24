const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const Project = require('../Models/project');
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
                let user = await User.findById(decodedToken.id);
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
const validateProject = async (req, res, next) => {
    const user = res.locals.user;

    if (!user) return res.redirect('/login');

    try {
        const project = await Project.findById(req.params.id);
        console.log(project);
        if (!project) return res.status(404).send('Project not found');

        // Correct field name
        if (!project.createdBy.equals(user._id)) return res.status(403).send('Unauthorized');

        res.locals.project = project;
        next();
    } catch (err) {
        console.log(err.message, "Valid auth");
        res.redirect('/');
    }
};

module.exports= {requireAuth, checkUser, validateProject}