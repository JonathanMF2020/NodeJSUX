var express = require('express') 
const mysql = require('mysql');
var app = express()               

var port = process.env.PORT || 8080 

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13298jona',
  database: 'pventa',
  port: 3306
});

con.connect(function(err) { if (err) { console.error('Error connecting: ' + err.stack); return; } console.log('Connected as id ' + con.threadId); });

app.use('/static', express.static(__dirname + '/resources'));

app.get('/', function(req, res) {
  res.sendFile(__dirname +'/index.html');
})

app.get('/productos', function(req, res) {
  
  con.query('SELECT * FROM inventario',function(err,rows,fields){
  	if(err) throw err;

  	res.json(rows);
  });
})

app.listen(port)
console.log('API escuchando en el puerto ' + port)