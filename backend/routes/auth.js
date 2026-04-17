const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {createClient} = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');
const supabase = createClient(process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY);

//POST /login
router.post('/login', async (req,res)=>{
    const{email, password} = req.body;

    const{data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if(error) return res.status(401).json({error: 'Invalid email or password'});
    const token = jwt.sign(
        {id : data.user.id , email : data.user.email},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );
    res.json({token, user: data.user});
});

//POST logout
router.post('/logout',authMiddleware, async(req, res)=>{
    await supabase.auth.signOut();
    res.json({message: 'Logged out Successfully'});
});

//GET /session
router.get('/session',authMiddleware, async(req, res)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: 'No token provided'});
    } 
    const token = authHeader.split(' ')[1];
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({valid : true , user: decoded});
    }catch(err){
        res.status(401).json({error: 'Invalid or expired token'});
    }
});

module.exports = router;