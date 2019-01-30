var express = require('express') 
var fs = require("fs")
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require("path");
var mysql = require('mysql');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var sess;

var app = express()

app.set('views', __dirname + '/html');
app.engine('html', require('ejs').renderFile);

var connect = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "user",
    port: '3306'
});
app.listen(3000)


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, '')));

app.get('/', function (req, res) {
    
    sess=req.session;
	if(sess.name)
	{
		res.redirect('/authorizedUser/:authorUser');
	}
	else{
        res.render('index.html');
        //res.end("huinia")
	}
});

app.delete('/delete:id', function(req,res){
    connect.query("DELETE FROM users WHERE id=" + req.params.id, 
       function(err, result){
        if(err) throw err;
        console.log("1 record delete");
        res.send(req.params.id);
    });
})

app.post('/database', function(req, res){
    var body ='';
    req.on('data', function (data) 
    {
        body += data; 
    })
    req.on('end', function () 
    {
        var article = JSON.parse(body)
        connect.query("INSERT INTO users (title, content, author, published) VALUE ('"+article.articleTitle+"', "
           + " '"+article.articleContent+"', '"+article.articleAuthor+"', '"+article.articleDate+"')", 
           function(err, result){
                if(err) throw err;
                console.log(result);
            });
        res.end(body);
    });  
});

app.get('/database', function (req, res) {
    connect.query("SELECT * FROM users", function (err, result, fields) {
            if (err) throw err;
            //console.log(result[0]);
            res.send(result);
        });
});
app.get('/users', function (req, res) {
    connect.query("SELECT * FROM authorizedUser", function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
});
app.post('/users', function(req, res){
    var body ='';
    req.on('data', function (data) 
    {
        body += data; 
    })
    req.on('end', function () 
    {
        var newUser = JSON.parse(body)
        connect.query("INSERT INTO authorizedUser (firstName, lastName, userName, email, password, passwordRep) VALUE ('"+newUser.firstN+"', "
       +" '"+newUser.lastN+"', '"+newUser.userN+"', '"+newUser.email+"', '"+newUser.pass+"', '"+newUser.repPass+"')", 
           function(err, result){
                if(err) throw err;
                console.log(result);
            });
        res.end(body);
    });   
});

app.post('/authorizedUser', jsonParser, function(req, res) {
    sess = req.session;	

    var post = req.body;
    var name = post.nikName;
    var pass = post.pass;
    //console.log(name, pass);

    connect.query('SELECT * FROM authorizedUser', 
    function(err, result) {
        var resultArray = Object.values(JSON.parse(JSON.stringify(result)))
           //console.log(resultArray[i].userName);
           for (var i in resultArray){
               if (resultArray[i].userName == name && resultArray[i].password == pass) {
                   sess.name = name;
                   sess.pass = pass;
               } 			
           }
           if (sess.name){
               res.json("done");
           } else {
            res.json('Incorrect Username and/or Password!');
        }
    });
});

app.get('/authorizedUser', function(req,res){
    sess = req.session;
    if(sess.name){
        res.send(sess.name)
    }
})

app.get('/authorizedUser/:authorUser',function(req,res){
    //console.log(req.params.p);
	sess = req.session;
	if(sess.name)	
	{
        res.render('index.html');
        //res.write('<a href='+'/logout'+'>Logout</a>');
        //res.write('<h1>Hello '+sess.name+'</h1><br>');
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href='+'/'+'>Login</a>');
	}

});

app.get('/logout',function(req,res){
	
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

});