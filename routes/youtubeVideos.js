const express = require('express');
const router = express.Router();
const {createClient} = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const supabase = createClient(process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY);

//GET all youtube_videos
router.get('/', async (req,res)=>{
    const{data, error} = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', {ascending : false});
    if(error) return res.status(500).json({error: error.message});
    res.json(data);
});

//POST all 
router.post('/',authMiddleware, async (req, res)=>{
    const {data, error} = await supabase
        .from('youtube_videos')
        .insert(req.body)
        
    if(error) return res.status(500).json({error: error.message});
    res.status(200).json(data);
});

//PUT event
router.put('/:id',authMiddleware, async (req, res)=>{
    const{data, error} = await supabase
        .from('youtube_videos')
        .update(req.body)
        .eq('id', req.params.id);
    if (error) return res.status(500).json({error: error.message});
    res.json(data);
});

//DELETE event
router.delete('/:id',authMiddleware, async (req, res)=>{
    const {error} = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', req.params.id);
    if(error) return res.status(500).json({error: error.message});
    res.json({message: "Deleted successfully"});

}); 

module.exports = router;
