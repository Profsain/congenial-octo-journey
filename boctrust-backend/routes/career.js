const express = require('express');
const router = express.Router();
const Career = require('../models/Career'); // import Career model

// career API Endpoints
// get all career posts endpoint
router.get('/careers', async (req, res) => {
  try {
    const careers = await Career.find();
    // return success response
    return res.status(200).json({ careers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// create new career post endpoint
router.post('/careers', (req, res) => {

    try {
        // Get post data from request body
        const { jobtitle, description, deadline, dateposted, image } = req.body;

        // Validate required fields
        if (!jobtitle || !description || !deadline || !dateposted || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new career
    const career = new Career({ jobtitle, description, deadline, dateposted, image  });

    // Save career
    career.save();

    // Return success response
    return res.status(201).json({ success: 'career created successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single career endpoint
router.put('/careers/:id', async (req, res) => {
  try {
    // get career id from request params
    const { id } = req.params;
    // get career data from request body
    const { jobtitle, description, deadline, dateposted, image } = req.body;

        // Validate required fields
        if (!jobtitle || !description || !deadline || !dateposted || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // find career by id and update
    const career = await Career.findByIdAndUpdate(id, { jobtitle, description, deadline, dateposted, image });
    
    // save updated career
    career.save();
    // return success response
    return res.status(200).json({ success: 'career updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete single career endpoint
router.delete('/careers/:id', async (req, res) => {
  try {
    // get career id from request params
    const { id } = req.params;
    // find career by id and delete
    await Career.findByIdAndDelete(id);
    // return success response
    return res.status(200).json({ success: 'career deleted successfully' });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// export router
module.exports = router;