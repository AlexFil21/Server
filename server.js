const express = require('express'), 
      fs = require("fs"),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      path = require("path"),
      mysql = require('mysql'),
      urlencodedParser = bodyParser.urlencoded({ extended: false }),
      jsonParser = bodyParser.json()

const app = express()

app.set('views', __dirname + '/html');
app.engine('html', require('ejs').renderFile);

const connect = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "user",
    port: '3306'
});
app.listen(8080)


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, '')));

app.get('/',  (req, res) => {  
    sess = req.session;
	if(sess.name)
	{
		res.redirect('/authorizedUser/:authorUser');
	}
	else{
        res.render('index.html');
	}
});

app.delete('/delete:id', (req,res) => {
    connect.query(`DELETE FROM users WHERE id=${req.params.id}`, (err, result) => {
        if(err) throw err;
        console.log("1 record delete");
        res.send(req.params.id);
    });
})

app.post('/database', (req, res) => {
    body = '';
    req.on('data', (data) => {
        body += data; 
    })
    req.on('end', () => {
        article = JSON.parse(body)
        connect.query(`INSERT INTO users (title, content, author, published) VALUE ('${article.articleTitle}',
           '${article.articleContent}', '${article.articleAuthor}', '${article.articleDate}')`, (err, result) => {
                if(err) throw err;
                console.log(result);
            });
        res.end(body);
    });  
});

app.get('/database',  (req, res) => {
    connect.query("SELECT * FROM users", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
});
app.get('/users', (req, res) => {
    connect.query("SELECT * FROM authorizedUser", (err, result) =>{
            if (err) throw err;
            res.send(result);
        });
});
app.post('/users', (req, res) => {
    
    body ='';
    req.on('data', (data) => {
        body += data; 
    })
    req.on('end', () => {
        
        newUser = JSON.parse(body)
        connect.query(`INSERT INTO authorizedUser (firstName, lastName, userName, email, password, passwordRep) VALUE ('${newUser.firstN}',
       '${newUser.lastN}', '${newUser.userN}', '${newUser.email}', '${newUser.pass}', '${newUser.repPass}')`, 
            (err, result) => {
                if(err) throw err;
                console.log(result);
            });
        res.end(body);
    });   
});

app.post('/authorizedUser', jsonParser, (req, res) => {
   
    sess = req.session;	
    const post = req.body;
    const name = post.nikName;
    const pass = post.pass;

    connect.query('SELECT * FROM authorizedUser', (err, result) => {
        resultArray = Object.values(JSON.parse(JSON.stringify(result)))
           
           for (let i in resultArray){
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

app.get('/authorizedUser', (req,res) => {
    sess = req.session;
    if(sess.name){
        res.end(sess.name)
    }
})

app.get('/authorizedUser/:authorUser', (req,res) => {
	sess = req.session;
	if(sess.name)	
	{
        res.render('index.html');
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href="/">Login</a>');
	}

});

app.get('/logout', (req,res) => {
	
	req.session.destroy((err) => {
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

});