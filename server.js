// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require mongoose
var mongoose = require('mongoose');
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

var Schema = mongoose.Schema;
// Routes
// Root Request
app.get('/', function(req, res) {
    Post.find({}, function(err, results){
        if(err){
            console.log(err);
            // res.redirect("/");
        }else {
            res.render('index', {post:results});
        }

    })
});

// Render form page
// Add Quote Request

app.post('/message', function(req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var post = new Post({name: req.body.name, text: req.body.text});
    console.log(post, "this post has just been submitted to DB");
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    post.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a post!');
            res.redirect('/');
        }
    })
})

//
app.post("/comment/:id", function(req, res){
	var message_id = req.params.id;
	Message.findOne({_id: message_id}, function(err, message){
		var newComment = new Comment({name: req.body.name, text: req.body.comment});
		newComment._message = message._id;
		Message.update({_id: message._id}, {$push: {"_comments": newComment}}, function(err){

		});
		newComment.save(function(err){
			if(err){
				console.log(err);
				res.render('index.ejs', {errors: newComment.errors});
			} else {
				console.log("comment added");
				res.redirect("/");
			}
		});
	});
});


 // Setting our Server to Listen on Port: 8000
 app.listen(8000, function() {
     console.log("Message App Listening on port 8000");
 });
 mongoose.Promise = global.Promise;

 // This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
 //   our db in mongodb -- this should match the name of the db you are going to use for your project.
 mongoose.connect('mongodb://localhost/message'); // <== DON'T FORGET TO CHANGE THIS EVERYTIME!!!!!!!!!!!





var Schema = mongoose.Schema;
var PostSchema = new mongoose.Schema({
 text: {type: String, required: true },
 name: {type: String, required: true },
 comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]}, {timestamps: true });


var CommentSchema = new mongoose.Schema({
 _post: {type: Schema.Types.ObjectId, ref: 'Post'},
 name: {type: String, required: true },
 text: {type: String, required: true }}, {timestamp: true });

mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);


var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// app.get('/posts/:id', function (req, res){
//  Post.findOne({_id: req.params.id})
//  .populate('comments')
//  .exec(function(err, post) {
//       res.render('post', {post: post});
//         });
// });



//
// app.post('/posts/:id', function (req, res){
//   Post.findOne({_id: req.params.id}, function(err, post){
//          var comment = new Comment(req.body);
//          comment._post = post._id;
//          post.comments.push(comment);
//          comment.save(function(err){
//                  post.save(function(err){
//                        if(err) { console.log('Error'); }
//                        else { res.redirect('/'); }
//                  });
//          });
//    });
//  });
