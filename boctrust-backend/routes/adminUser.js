const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/AdminUser');
const express = require('express');
const router = express.Router();
// const adminUserVerification = require('../middleware/AuthMiddleware');

// Set up Multer storage to define where to save the uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a unique name
  },
});

const upload = multer({
  storage: storage,
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();

        // Map users to include image URLs
        const usersWithImages = users.map(user => {
            const baseUrl = process.env.BASE_URL || 'http://localhost:3030';
            return {
                ...user.toJSON(),
                imageUrl: `${baseUrl}/uploads/${user.photo}`
            };
        });

        // Return success response with users and image URLs
        return res.status(200).json({ users: usersWithImages });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}); // get all users logic ends here

// register new user endpoint
const type = upload.single('photo');

router.post('/register', type, async (req, res, next) => {
    try {
        // Get user input
        const { fullName, email, phone, username, password, jobRole, userType, adminRoles } = req.body;
        
         // Get the image file name from req.file
      const photo = req.file.filename;
      
   
    
        // Validate user input
        if (!(email && password && fullName && phone && username && jobRole && userType && photo)) {
        return res.status(400).json({ error: 'All input is required' });
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
        return res.status(409).json({ error: 'User Already Exist. Please Login' });
        }
    
        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
        fullName,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        phone,
        username,
        password: encryptedPassword,
        jobRole,
        userType,
        adminRoles,
        photo,
        });
    
        // Create token
        const token = jwt.sign(
          { user_id: user._id, username },
          process.env.TOKEN_KEY,
          {
            expiresIn: '2h',
          }
        );
        // save user token
        user.token = token;
        user.save();
        
        // return token
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: false,
        });
      
        // return new user
      return res.status(201).json({ success: 'User created successfully' });
      next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}); // registration logic ends here
    
// verify admin middleware route
router.post('/verify', (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
});

// Login user using username and password
router.post('/login', async (req, res, next) => {
    try {
        // get user input
        const { username, password } = req.body;
      
        // validate user input
        if (!(username && password)) {
            return res.status(400).json({ error: 'All input is required' });
        }

        // find user by username
        const user = await User.findOne({ username });

        // validate if user exist in our database and create token
      if (user && (await bcrypt.compare(password, user.password))) {
          
            // Create token
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '2h',
                }
        );

            // save user token
        user.token = token;
        
                
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: false,
        });

            // user
        return res.status(200).json({ success: 'Login successful', user });
      }
      
      return res.status(400).json({ error: 'Invalid Credentials' });
      next()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}); // login logic ends here

// forget password logic
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.token = resetToken;
    await user.save();

    // Send an email with the password reset link
    const transporter = nodemailer.createTransport({
      // Configure your email service here
      service: 'Bluehost SMTP',
      auth: {
        user: 'ebusiness@boctrustmfb.com', 
        pass: ' eBiz-9945@', 
      },
    });

    const mailOptions = {
      from: 'ebusiness@boctrustmfb.com', 
      to: user.email,
      subject: 'Boctrust MFB Password Reset',
      text: `Click the following link to reset your password: http://your-app-url/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send reset email' });
      }

      res.status(200).json({ message: 'Reset email sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {

    try {
        // get user id from request params
        const { id } = req.params;

        // find user by id and delete
        const deleted = await User.findByIdAndDelete(id);
        
        if (deleted) {
            return res.status(200).json({ success: 'User deleted successfully' });
        }
        throw new Error('User not found');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
); // delete user logic ends here

// Update a user
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, username, jobRole, userType, adminRoles } = req.body;

        if (!(email && fullName && phone && username && jobRole && userType)) {
            return res.status(400).json({ error: 'All input is required' });
        }

        // find user by id
        const userAccount = await User.findById(id);
        const password = userAccount.password;
        
        // update user details
        const updated = await User.findByIdAndUpdate(id, {
            fullName,
            email: email.toLowerCase(),
            phone,
            username,
            password: password,
            jobRole,
            userType,
            adminRoles,
        });

        if (updated) {
            return res.status(200).json({ success: 'User updated successfully' });
        }
        throw new Error('User not found');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
); // update user logic ends here

module.exports = router; // export router