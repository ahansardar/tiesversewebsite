const express = require('express');
const router = express.Router();
const {createClient} = require('@supabase/supabase-js');
const authMiddleware = requirw('../middleware/auth');
const supabase = createClient(process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY);

//GET all settings
router.get('/',authMiddleware, async (req,res)=>{
    const{data, error} = await supabase
        .from('site_settings')
        .select('*')
    if(error) return res.status(500).json({error: error.message});
    res.json(data);
});

//PUT event
router.put('/:key',authMiddleware, async (req, res)=>{
    const{data, error} = await supabase
        .from('site_settings')
        .update(req.body)
        .eq('key', req.params.key);
    if (error) return res.status(500).json({error: error.message});
    res.json(data);
});
module.exports = router;
//
