//##############################IMPORT IMPORTANT MODULES######################################
const express = require('express');//Module for Web framework
const app = express();
const mysql = require('mysql');//Module for MySQL DB
const session = require('express-session');//Module for sessions
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');//Module for sending emails
const md5 = require('md5');//Module for hashing password
const router = express.Router
const multer  =   require('multer');//Module for image upload
const fs = require('fs');//Module for file system
const cryptoRandomString = require('crypto-random-string');//Module for generating random number
//const sharp = require('sharp');//Module resize big images
//##############################//IMPORT IMPORTANT MODULES######################################

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(express.static(__dirname+'/public/'));
var sess; // global session, NOT recommended
//##############################//IMPORT IMPORTANT MODULES####################################
//##############################SET DIRECTORY OF THE VIEWS(html pages)########################
var path = __dirname + '/views/';
 //###########################//SET DIRECTORY OF THE VIEWS##################################
//############################CREATE CONNECTION TO THE MYSQL DATABASE#########################

var mysqlConnection = mysql.createConnection({
    host: 'bjq3f4jq8c2mg8w01ylo-mysql.services.clever-cloud.com',
    user: 'uwxrerrssa5wwwzj',
    password: 'YafmlgjTqPhWQoDcB15f',
    database: 'bjq3f4jq8c2mg8w01ylo',
    multipleStatements: "true", 
});
//##########################//CREATE CONNECTION TO THE MYSQL DATABASE#########################
//##########################CHECK WHETHER CONNECTION SUCCESSED OR NOT########################
mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});
//##########################//CHECK WHETHER CONNECTION SUCCESSED OR NOT#######################



 //##############################LINKING PAGE##########################################
app.get("/login",function(req,res){
  res.sendFile(path + "login.html");
  
});

app.get("/home",function(req,res){
	sess = req.session;
            if(sess.username) {
              res.sendFile(path + "index.html");
			}
			else
			{
				res.redirect('/');
			}
});
 //##############################//LINKING PAGE##########################################
 //##############################LINKING DEFAULT PAGE#########################################

app.get("/",function(req,res){
  res.sendFile(path + "login.html");
});
//##############################//LINKING DEFAULT PAGE######################################
//##########################API CODE TO INSERT DATA INTO DATABASE USING POST METHOD###########
app.post("/api/customers/save", function(req,res){
   var id='';
   let customer = req.body;
   var sql = "INSERT INTO `employee`(`id`, `FIRST_NAME`, `LAST_NAME`, `AGE`, `SEX`, `INCOME`) VALUES (?,?,?,?,?,?)";
    mysqlConnection.query(sql, [id,customer.firstname,customer.lastname,customer.age,customer.sex,customer.income], (err, rows, fields) => {
        if (!err)
           res.send("Records inserted!");
        else
            console.log(err);
    })
});
//##########################//API CODE TO INSERT DATA INTO DATABASE USING POST METHOD#########
//##########################API CODE TO LOGIN DATA INTO DATABASE USING POST METHOD###########
app.post("/api/user/login", function(req,res){
   var sql = "SELECT * FROM users WHERE username=? AND password=?";
    mysqlConnection.query(sql, [req.query.username,md5(req.query.password)], (err,rows,fields) => {
        if (!err)
        {
			if(rows.length>0)
			{
		       
            sess = req.session;
             Object.keys(rows).forEach(function(key) {
             var row = rows[key];
             sess.username = row.account_id;
            });
           res.send("SUCCESS");
		   
			}
      else
      {
         res.send("FAIL");
      }
      
    }
        else {
            console.log(err);
          }
    })
});
//##########################//API CODE TO INSERT DATA INTO DATABASE USING POST METHOD#########
//##########################API CODE TO GET ALL DATA FROM DATABASE USING GET METHOD###########

			
app.get("/api/user/session", function(req,res){
  sess = req.session;
     if(sess.username) {
      var sql = "SELECT first_name,last_name FROM users WHERE account_id=? ";
    mysqlConnection.query(sql, [sess.username], (err,rows,fields) => {
        if (!err)
        {
             if(rows.length)
              {
           
              Object.keys(rows).forEach(function(key) {
               var row = rows[key];
               res.send(row.first_name+"&nbsp;&nbsp;"+ row.last_name);

               });
       
      }
      
    }
        else {
            console.log(err);
          }
    })
			}
			else
			{
				res.end('NULL');
			}
});





app.post("/api/customers/get", function(req,res){

  var offset = (parseInt(req.query.offset) != 0 ) ? req.query.offset : 0;
  var limit = (parseInt(req.query.limit) != 0 ) ? req.query.limit : 5;

  mysqlConnection.query('SELECT * FROM employee WHERE 1 ORDER BY id DESC LIMIT '+ limit + ' OFFSET '+ offset, (err, rows, fields) => {
        if (!err)
            res.send(rows);

        else
            console.log(err);
    })
});
//##########################//API CODE TO GET ALL DATA FROM DATABASE USING GET METHOD######################################

//##########################API CODE TO SEND EMAIL USING NODEMAILER#########################################################
app.post("/api/send/email", function(req,res){
 


// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  

  // create reusable transporter object using the default SMTP transport
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
       user: 'info@schoolmodify.com',
       pass: 'P9DyoviS'
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nyakuri 👻" <info@schoolmodify.com>', // sender address
    to:req.body.emailto , // list of receivers
    subject:req.body.emailsubject , // Subject line
    html:req.body.emailcontents, // plain text body
  });
  res.send("Sent");
  
}

main().catch(console.error);
});
//##########################//API CODE TO SEND EMAIL USING NODEMAILER#########################################################

//##########################API CODE TO UPDATE DATA USING PUT METHOD###########
app.put("/api/customers/update", function(req,res){
   let customer = req.body;
   var sql = "UPDATE `employee` SET `FIRST_NAME`=?, `LAST_NAME`=?, `AGE`=?, `SEX`=?, `INCOME`=? WHERE `id`=?";
    mysqlConnection.query(sql, [customer.firstname,customer.lastname,customer.age,customer.sex,customer.income,customer.id], (err, rows, fields) => {
        if (!err)
           res.write("Records successfully updated!");
        else
            console.log(err);
    })
});
//##########################//API CODE TO UPDATE DATA USING PUT METHOD###########
//########################API CODE TO GET USER BY ID FROM DATABASE USING GET METHOD###########

app.get("/api/customers/get/:id", function(req,res){
		var id=req.params.id;
  mysqlConnection.query('SELECT * FROM employee WHERE id= ?',[id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.get("/:username", function(req,res){
    var username=req.params.username;
      var sql = "SELECT * FROM users WHERE username=? OR account_id=? ";
    mysqlConnection.query(sql, [username,username], (err,rows,fields) => {
        if (!err)
        {
             if(rows.length)
              {
           
              Object.keys(rows).forEach(function(key) {
               var row = rows[key];
               res.send(rows);

               });
              
       
      }
      else
      {
        res.send("User not found");
      }
      
    }
        else {
            console.log(err);
          }
    })
      
});
//#################//API CODE TO GET USER BY ID FROM DATABASE USING GET METHOD#########
//##########################API CODE TO SEARCH DATA FROM DATABASE USING GET METHOD###########
 app.post('/api/customers/search', (req, res) => {
	 let customer = req.body;
	 var firstname=customer.firstname +'%';
    mysqlConnection.query("SELECT * FROM employee WHERE FIRST_NAME LIKE ?", [firstname], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});
//##########################//API CODE TO SEARCH DATA FROM DATABASE USING GET METHOD##########
//##############API CODE TO DELETE SPECIFIED DATA FROM DATABASE USING DELETE METHOD###########
app.delete('/api/customers/delete/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM employee WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});
//##############//API CODE TO DELETE SPECIFIED DATA FROM DATABASE USING DELETE METHOD########

app.get('/api/user/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});
//##################//API CODE TO UPLOAD IMAGE TO THE FOLDER#######################################
var new_image_name=cryptoRandomString({length: 20, type: 'numeric'});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './upload_images');
  },
  filename: function (req, file, callback) {
    callback(null,new_image_name +'.jpg');
  }
});

var upload = multer({ storage : storage}).single('userPhoto');

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
       /* let inputFile  = "./upload_images"+ new_image_name + ".jpg";
        let outputFile = "output.jpg";
        sharp(inputFile).resize({ width: 600 }).toFile(outputFile).then(function(newFileInfo) {
        // newFileInfo holds the output file properties
        }).catch(function(err) {
        res.end("Error occured");
    });*/
              res.end("File is uploaded");
  
    });
});
//##################//API CODE TO UPLOAD IMAGE TO THE FOLDER#######################################


app.use("/",router);
//##############RETURNING 404 ERROR PAGE WHEN YOU REQUEST UNAVAILABLE PAGE####################
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});
//##############//RETURNING 404 ERROR PAGE WHEN YOU REQUEST UNAVAILABLE PAGE##################
//##############CREATING PORT THAT SERVER WILL RUN ON#########################################
app.listen(8081, function () {
  console.log('System listening on port 8081!')
})
//##############//CREATING PORT THAT SERVER WILL RUN ON#######################################
