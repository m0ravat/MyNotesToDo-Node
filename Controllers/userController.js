const User = require('../Models/user');


const user_details = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      res.render('userDetails', { user: result, title: 'User Details' });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'User not found' });
    });
}

const user_create_get = (req, res) => {
  res.render('signup', { title: 'Create a new user' });
}

const user_create_post = (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
}

const user_delete = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/' });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  user_details, 
  user_create_get, 
  user_create_post, 
  user_delete
}
