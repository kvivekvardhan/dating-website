// JavaScript for handling signup form submission
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(signupForm); // Get form data

    // Convert form data to JSON
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    // Send POST request to check if username exists
    try {
        const response = await fetch('/checkUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: jsonData.username })
        });

        // Check if the response indicates success
        if (response.ok) {
            // Continue with signup if username is available
            // Proceed with existing signup logic
            // Send POST request to signup endpoint
            try {
                const signupResponse = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });

                // Handle signup response
                if (signupResponse.ok) {
                    // Signup successful, redirect to dating.html
                    window.location.href = 'dating.html';
                } else {
                    const responseData = await signupResponse.json();
                    console.error('Error signing up:', responseData.error);
                    // Handle signup error
                }
            } catch (signupError) {
                console.error('Error signing up:', signupError);
                // Handle signup error
            }
        } else {
            // Display error message if username already exists
            const responseData = await response.json();
            document.getElementById('username-output').textContent = responseData.error;
        }
    } catch (error) {
        console.error('Error checking username:', error);
        // Handle network errors
    }
});


// login form handling in javascript
// I felt like there is no specific need to use node js here
document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the username and password from the form
    const enteredUsername = document.getElementById('loginUsername').value;
    const enteredPassword = document.getElementById('loginPassword').value;

    // Fetch the login.json file
    fetch('./login.json') // Replace with the actual path to your login.json file
        .then(response => response.json())
        .then(usersData => {
            // Initialize variables
            let isAuthenticated = false;
            let usernameExists = false; 
            // Loop through the users data

            for (const user of usersData) {
                // Check if the entered username matches the user's username in the data
                if (user.username === enteredUsername) {
                    usernameExists = true;
                    // If the username matches, check the password
                    if (user.password === enteredPassword) {
                        isAuthenticated = true;
                        break; // Stop the loop as we found a match
                    }
                }
            }

            // Provide feedback to the user based on the authentication result
            const outputElement = document.getElementById('output');
            if (isAuthenticated) {
                // User is authenticated
                // Redirect to dating.html
                window.location.href = 'dating.html';
            } else {
                // User is not authenticated
                if (usernameExists) {
                    // The username exists, but the password is incorrect
                    outputElement.textContent = 'Password is incorrect. Please try again.';
                } else {
                    // The username does not exist
                    outputElement.textContent = 'Username does not exist. Please check your username.';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching login.json:', error);
            const outputElement = document.getElementById('output');
            outputElement.textContent = 'An error occurred. Please try again later.';
        });
});
// creating the necessary signup button required files
// Add event listener for the "Sign up" link
document.querySelector('#loginContainer .register-link a').addEventListener('click', function(event) {
    event.preventDefault();
    // Hide login container, show signup container
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'block';
    clearSignupForm();
});

// Add event listener for the "Login" link
document.querySelector('#signupContainer .register-link a').addEventListener('click', function(event) {
    event.preventDefault();
    // Hide signup container, show login container
    document.getElementById('signupContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    clearLoginForm();
});
// Function to clear signup form inputs
function clearSignupForm() {
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupPassword').value = '';
    //document.getElementById('secqn').value = '';
    document.getElementById('secans').value = '';
    document.getElementById('username-output').textContent = '';
}

// Function to clear login form inputs
function clearLoginForm() {
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('output').textContent = '';
}
