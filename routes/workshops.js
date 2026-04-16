const express = require('express');
const router = express.Router();
const {createClient} = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const supabase = createClient(process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY);

//GET category = VIRTUAL
router.get('/',authMiddleware, async (req, res) =>{
    const {category} = req.query;
    let query = supabase
        .from('workshops')
        .select('*')
        .order('created_at', {ascending: false});
    if(category){
        query = query.eq('category', category);
    }
    const {data, error} = await query;
    if(error) return res.status(500).json({error: error.message});
    res.json(data);
});

//POST all 
router.post('/',authMiddleware, async (req, res)=>{
    const {data, error} = await supabase
        .from('workshops')
        .insert(req.body)
        
    if(error) return res.status(500).json({error: error.message});
    res.status(200).json(data);
});

//PUT event
router.put('/:id',authMiddleware, async (req, res)=>{
    const{data, error} = await supabase
        .from('workshops')
        .update(req.body)
        .eq('id', req.params.id);
    if (error) return res.status(500).json({error: error.message});
    res.json(data);
});

//DELETE event
router.delete('/:id',authMiddleware, async (req, res)=>{
    const {error} = await supabase
        .from('workshops')
        .delete()
        .eq('id', req.params.id);
    if(error) return res.status(500).json({error: error.message});
    res.json("Deleted successfully");
}); 

module.exports = router;
