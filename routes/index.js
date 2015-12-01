var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var passport = require('passport');
var jwt = require('express-jwt');

var Post = require('../models/Posts.js');
var Comment = require('../models/Comments.js');
var User = require('../models/users.js');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//register routes
router.post('/register',function(req,res,next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){return next (err); }

    return res.json({token: user.generateJWT()});
  });
});

//login routes
router.post('/login', function(req,res,next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if (err){ return next(err); }

    if (user) {
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req,res,next);
});


//grabs all posts in posts
router.get('/posts', function(req,res,next){
  Post.find(function(err,posts){ //we exported Post from models/Posts.js
    if(err){return next(err);}

    res.json(posts);
  });
});
//creates a new post
router.post('/posts', auth, function(req,res,next){
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err,post){
    if(err){ return next(err);}
    res.json(post);
  });
});
//returns to post by ID
router.param('post', function(req,res,next,id){
  var query = Post.findById(id);

  query.exec(function (err,post){
    if (err) {return next(err);}
    if (!post) {return next(new Error('can\'t find post'));}

    req.post = post;
    return next();
  });
});
//find comments for the post ID
router.param('comment', function(req,res,next,id){

  var query = Comment.findById(id);

  query.exec(function (err,comment){
    if (err) {return next(err);}
    if (!comment) {return next(new Error('can\'t find comment'));}

    req.comment = comment;
    return next();
  });
});
//requests a particular post by ID
router.get('/posts/:post', function(req,res){
  req.post.populate('comments', function(err,post){
    res.json(post);
  });
});
//Post Votes section
router.put('/posts/:post/upvote', auth, function(req,res,next){
  req.post.upvote(function(err,post){
    if(err){return next(err);}
    res.json(post);
  });
});

router.put('/posts/:post/downvote', auth, function(req,res,next){
  req.post.downvote(function(err,post){
    if(err){return next(err);}
    res.json(post);
  });
});
//adds comments and saves it to specific post
router.post('/posts/:post/comments', auth, function(req,res,next){
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err,comment){
    if(err){return next(err);}
      req.post.comments.push(comment);


    req.post.save(function(err,post){
      if(err){return next(err);}
      console.log(comment);

      res.json(comment);
    });
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req,res,next){
  req.comment.upvote(function(err,comment){
    if(err){return next(err);}

    res.json(comment);
  });
});

router.put('/posts/:post/comments/:comment/downvote', auth, function(req,res,next){
  req.comment.downvote(function(err,comment){
    if(err){return next(err);}

    res.json(comment);
  });
});









module.exports = router;
