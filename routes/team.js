const express = require('express');
const router = express.Router();
const {createClient} = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');
const supabase = createClient(process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY);

//GET all team_members
router.get('/',authMiddleware, async (req,res)=>{
    const{data, error} = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', {ascending : false});
    if(error) return res.status(500).json({error: error.message});
    res.json(data);
});

//POST all 
router.post('/',authMiddleware, async (req, res)=>{
    const {data, error} = await supabase
        .from('team_members')
        .insert(req.body)
        
    if(error) return res.status(500).json({error: error.message});
    res.status(200).json(data);
});

//PUT event
router.put('/:id',authMiddleware, async (req, res)=>{
    const{data, error} = await supabase
        .from('team_members')
        .update(req.body)
        .eq('id', req.params.id);
    if (error) return res.status(500).json({error: error.message});
    res.json(data);
});

//DELETE event
router.delete('/:id',authMiddleware, async (req, res)=>{
    const {error} = await supabase
        .from('team_members')
        .delete()
        .eq('id', req.params.id);
    if(error) return res.status(500).json({error: error.message});
    res.json("Deleted successfully");
}); 

module.exports = router;
