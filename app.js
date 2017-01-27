var express = require('express'); //templth@gmail.com deadline : vacances
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var userSchema = require('./schema');
var Contact = userSchema.Contact;

var app = express();

app.use(cors());

app.get('/contact/:id', function (req, res, next) { // Retrieve a single contact
        Contact.findById(req.params.id, function (err, contact) { // convention : 1st parameter is error. If no error, null is passed. 2nd argument is what's returned by findById : a json contact object
            if (err) return res.send(err);
            else res.json(contact);
        });
    })
    .get('/contacts', function (req, res) { // Retrieve the contact list
        Contact.find(function (err, contact) {
            if (err) console.error(err);
            else res.json(contact);
        });
    })
    .post('/contact/:username/:password', function (req, res) { // Create a contact if the username is still available
        Contact.where({ username: req.params.username }).findOne(function (err, contact) {
            if (err) return console.error(err);
            if (contact == null) {
                new Contact({ username: req.params.username, password: req.params.password }).save(function (err, contact) {
                    if (err) return console.error(err);
                    else res.send(contact.username + " has been successfully added to the dB");
                });
            } else res.send("Username " + contact.username +" is not Available");
        });
    })
    .put('/update/username/:id/:username', function (req, res) { //Update Username
        Contact.findByIdAndUpdate(req.params.id, { username: req.params.username }, function (err, contact) {
            if (err) return console.error(err);
            else res.send("Username of contact " + req.params.id + " now is " + req.params.username);
        });
    })
    .put('/update/password/:id/:password', function (req, res) { // Update Password
        Contact.findByIdAndUpdate(req.params.id, { password: req.params.password }, function (err, contact) {
            if (err) return console.error(err);
            else res.send("Password of contact " + req.params.id + " now is " + req.params.password);
        });
    })
    .delete('/contact/:id', function (req, res) { // Delete
        Contact.findByIdAndRemove(req.params.id, function(err, contact) {
            if (err) return console.error(err);
            else res.send("contact " + contact.username + " has been removed from the dB");
        });
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080);

module.exports = app;
