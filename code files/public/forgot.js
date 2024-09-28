document.addEventListener('DOMContentLoaded', function() {
    const secQnElement = document.getElementById('sec-qn');
    const verifyButton = document.getElementById('verify-button');
    const outputElement = document.getElementById('output');
    const usernameInput = document.getElementById('username');
    const submitUsernameButton = document.getElementById('submit-username');
    const securityQuestionSection = document.getElementById('security-question-section');

    let user;

    // Event listener for the submit username button
    submitUsernameButton.addEventListener('click', function() {
        // Clear previous output message
        outputElement.textContent = '';
        
        // Fetch the login.json file
        fetch('./login.json') // Replace with the actual path to your login.json file
            .then(response => response.json())
            .then(usersData => {
                // Get the entered username from the input field
                const enteredUsername = usernameInput.value.trim();

                // Find the user by their username in the data
                user = usersData.find(user => user.username === enteredUsername);

                if (user) {
                    // Display the security question
                    secQnElement.textContent = user.secret_question;
                    securityQuestionSection.style.display = 'block';
                    usernameInput.setCustomValidity('');
                } else {
                    // User not found
                    outputElement.innerHTML = 'User not found. <br>Please check your username.';
                    securityQuestionSection.style.display = 'none';
                    usernameInput.setCustomValidity('User not found.');
                    usernameInput.reportValidity();
                }
            })
            .catch(error => {
                console.error('Error fetching login.json:', error);
                outputElement.textContent = 'An error occurred. Please try again later.';
            });
    });

    // Event listener for the verify button
    verifyButton.addEventListener('click', function() {
        // Get the entered answer from the input field
        const enteredAnswer = document.getElementById('security-answer').value;

        // Check if the entered answer matches the user's secret answer
        if (enteredAnswer.trim() === user.secret_answer) {
            // Correct answer: Display the user's password
            outputElement.textContent = `Your password is: ${user.password}`;
        } else {
            // Incorrect answer: Display an error message
            outputElement.textContent = 'Incorrect answer. Please try again.';
        }
    });

    // Event listener for the username input field to reset validity state
    usernameInput.addEventListener('input', function() {
        // Reset custom validity when user types in the username input field
        usernameInput.setCustomValidity('');
        usernameInput.reportValidity();
    });
});
