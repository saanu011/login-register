var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');
var path = require('path');
var passport = require('passport');

var config = require('./config/config');
var route = require('./routes/user');

var app = express();

mongoose.connect(config.db, { useNewUrlParser : true });

mongoose.connection.on('connected', ()=> {
    console.log('Connection established with the database');
});

mongoose.connection.on('error', (err)=> {
    if (err) console.log(err);
});

//middlewares
app.use(bodyparser.json({ useNewUrlParser : true}));
app.use(cors());
app.use(morgan('dev'));


//getting routes
app.use('/api', route);

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res)=> {
    res.send('Invalid request');
});

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
})
//listening to port
app.listen(config.port, (err)=> {
    if (err) console.log(err); 
    else console.log('Server running on port: ' + config.port);
});