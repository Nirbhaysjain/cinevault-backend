const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'MySQLnirbhay001',
    database:'cinevault'
});

db.connect((err) => {
    if(err){
        console.log('Database connection failed:',err);
    } else{
        console.log('Connected to MySQL database');
    }
});

// AUTH ROUTES

// SIGNUP
app.post('/signup',(req,res)=>{
    const {name,email,password} = req.body;
    const sql = 'INSERT INTO users(name,email,password) VALUES(?,?,?)';
    db.query(sql,[name,email,password],(err,result)=>
    {
        if (err){
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(400).json({error:'Email already exists'});
            }
            return res.status(500).json({error:'Signup failed'});
        }
        res.json({message:'Signup successful',userid:result.insertId});
    });
});

// LOGIN
app.post ('/login',(req,res) => {
    const {email,password} = req.body;
    const sql = 'SELECT*FROM users WHERE email =? AND password =?';
    db.query(sql,[email,password],(err,results)=>{
        if(err) return res.status(500).json({error:'Login failed'});
        if (results.length ===0) return res.status(401).json ({error:'Invalid email or password'});
        const user = results[0];
        res.json({message:'Login successful',user:{id:user.id,name:user.name,email:user.email}});
    });
});

// WATCHLIST ROUTES

// ADD TO WATCHLIST
app.post('/watchlist',(req,res)=>{
    const {user_id,tmdb_film_id,film_title,poster_url} = req.body;
    const sql = 'INSERT INTO watchlist(user_id,tmdb_film_id,film_title,poster_url) VALUES (?,?,?,?)';
    db.query(sql,[user_id,tmdb_film_id,film_title,poster_url],(err,result) => {
        if (err) return res.status(500).json({error:'Could not add to watchlist'});
        res.json({message:'Added to watchlist'});
    });
});

// GET WATCHLIST FOR A USER 
app.get('/watchlist/:userId',(req,res) => {
    const sql = 'SELECT*FROM watchlist WHERE user_id =? ORDER BY added_at DESC';
    db.query(sql,[req.params.userId],(err,results) => {
        if(err) return res.status(500).json({error:'Could not get watchlist'});
        res.json(results);
    });
});

// REMOVE FROM WATCHLIST
app.delete('/watchlist/:id',(req,res) =>{
    const sql = 'DELETE FROM watchlist WHERE id=?';
    db.query(sql,[req.params.id],(err) => {
        if (err) return res.status(500).json({error:'Could not remove from watchlist'});
        res.json({messages:'Removed from watchlist'});
    });
});

// LOGS ROUTES

// LOG A FILM
app.post('/log',(req,res) => {
    const{user_id,tmdb_film_id,film_title,poster_url,rating,mood}= req.body;
    const sql = 'INSERT INTO logs (user_id,tmdb_film_id,film_title,poster_url,rating,mood) VALUES (?,?,?,?,?,?)';
    db.query(sql,[user_id,tmdb_film_id,film_title,poster_url,rating,mood],(err,result)=>{
        if(err) return res.status(500).json({error:'Could not log film'});
        res.json({message:'Film logged successfully'});
    });
});

// GET LOGS FOR A USER
app.get('/logs/:userId',(req,res) => {
    const sql = 'SELECT*FROM logs WHERE user_id = ? ORDER BY logged_at DESC';
    db.query(sql,[req.params.userId],(err,results) => {
        if(err) return res.status(500).json({error:'Could not get logs'});
        res.json(results);
    });
});

// MEMBERS|SOCIAL ROUTES

// GET ALL USERS (for members page)
app.get('/members',(req,res)=>{
    const sql = 'SELECT id,name,email FROM users';
    db.query(sql,(err,results) => {
        if (err) return res.status(500).json({error:'Could not get members'});
        res.json(results);
    });
});

// GET A SINGLE USERS'S INFO 
app.get('/user/:userId',(req,res)=> {
    const sql = 'SELECT id,name,email FROM users WHERE id=?';
    db.query(sql,[req.params.userId],(err,results)=>{
        if (err) return res.status(500).json({error:'Could not get user'});
        if (results.length ===0) return res.status(404).json({error:'User not found'});
        res.json(results[0]);
    });
});

// FOLLOW A USER
app.post('/follow',(req,res)=> {
    const {follower_id,following_id}= req.body;
    const sql = 'INSERT INTO follows (follower_id,following_id) VALUES (?,?)';
    db.query(sql,[follower_id,following_id],(err)=> {
        if(err) return res.status(500).json({error:'Could not follow user'});
        res.json({message:'Followed successfully'});
    });
});

// UNFOLLOW A USER
app.delete('/follow',(req,res)=> {
    const {follower_id,following_id} = req.body;
    const sql = 'DELETE FROM follows WHERE follower_id = ? AND following_id = ?';
    db.query(sql,[follower_id,following_id],(err)=> {
        if(err) return res.status(500).json({error:'Could not unfollow'});
        res.json({message:'Unfollowed successfully'});
    });
});

// GET WHO A USER IS FOLLOWING
app.get('/following/:userId',(req,res)=>{
    const sql = 'SELECT following_id FROM follows WHERE follower_id=?';
    db.query(sql,[req.params.userId],(err,results) => {
        if(err) return res.status(500).json({error:'Could not get following list'});
        res.json(results);
    });
});

// server
app.listen(5000,()=> {
    console.log('Server running on port 5000');
});