const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname,'public')));

// Parse JSON request bodies
app.use(bodyParser.json());

// Serve the login.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Handle signup form submission
app.post('/signup', (req, res) => {
    const { username, password, securityQuestion, securityAnswer } = req.body;
    console.log('Received form data: ', { username, password, securityQuestion, securityAnswer });
  
    // Read the existing users data from login.json
    fs.readFile(path.join(__dirname, 'public', 'login.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading login.json:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      let usersData = [];
      if (data) {
        try {
          usersData = JSON.parse(data);
        } catch (parseErr) {
          console.error('Error parsing login.json:', parseErr);
          return res.status(500).json({ error: 'Internal server error' });
        }
      }
  
      // Check if the username already exists
      const existingUser = usersData.find(user => user.username === username);
      if (existingUser) {
        // Username already exists, return an error message
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Create a new user object
      const newUser = {
        username,
        password,
        secret_question: securityQuestion,
        secret_answer: securityAnswer,
      };
  
      // Append the new user to the existing users data
      usersData.push(newUser);
  
      // Save the updated users data to login.json
      fs.writeFile(path.join(__dirname, 'public', 'login.json'), JSON.stringify(usersData, null, 2), (err) => {
        if (err) {
          console.error('Error writing login.json:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        // Redirect to dating.html after successful signup
        //res.redirect('/dating.html');
        res.status(200).json({ message: 'Signup successful' });
      });
    });
  });
// Handle checking if username exists
app.post('/checkUsername', (req, res) => {
    const { username } = req.body;

    // Read the existing users data from login.json
    fs.readFile(path.join(__dirname, 'public', 'login.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading login.json:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        let usersData = [];
        if (data) {
            try {
                usersData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing login.json:', parseErr);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        // Check if the username already exists
        const existingUser = usersData.find(user => user.username === username);
        if (existingUser) {
            // Username already exists, return an error message
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Username does not exist, proceed with signup
        return res.status(200).json({ message: 'Username available' });
    });
});

  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});