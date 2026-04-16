const express = require('express');
const router = express.Router();
const {createClient} = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY);

//GET all Events
router.get('/', async (req,res)=>{
    const{data, error} = await supabase
        .from('events')
        .select('*')
        .order('created_at', {ascending : false});
    if(error) return res.status(500).json({error: error.message});
    res.json(data);
});

//GET featured Events
router.get('/featured', async (req, res) => {
    const {data, error} = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('created_art', {ascending : false})
        .limit(1)
        .single()
    if(error) return res.status(500).json({error: error.message});
    res.json(data);
});

//POST create event (admin only)
router.post('/:id', async (req, res)=>{
    const {data, error} = await supabase
        .from('events')
        .update(req.body)
        .eq('id', req.params.id);
    if(error) return res.status(500).json({erro: error.message});
    res.json(data);
});

//DELETE event
router.delete('/:id', async (req, res)=>{
    const {error} = await supabase
        .from('events')
        .delete()
        .eq('id', req.params.id);
    if(error) return res.status(500).json({erro: error.message});
    res.json("Deleted successfully");
}); 

module.exports = router;
