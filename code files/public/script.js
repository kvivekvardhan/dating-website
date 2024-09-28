document.addEventListener('DOMContentLoaded', function () {
    // Get the form and output elements
    const form = document.getElementById('detailsForm');
    const outputElement = document.getElementById('output');

    // Event listener for form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Gather user inputs from the form
        const formData = new FormData(form);
        const rollNumber = formData.get('rollNumber');
        const name = formData.get('name');
        const yearOfStudy = parseInt(formData.get('yearOfStudy'));
        const age = parseInt(formData.get('age'));
        const gender = formData.get('gender');
        const interests = [...formData.getAll('interests')];
        const hobbies = [...formData.getAll('hobbies')];
        const email = formData.get('email');
        const photo = formData.get('photo');
        // Fetch the students.json file
        fetch('./students.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching data.');
                }
                return response.json();
            })
            .then(data => {
                // Get the roll number of the logged-in user (from the form)
                const loggedInRollNumber =  rollNumber;
                const potentialMatches = filterPotentialMatches(data, gender,loggedInRollNumber);
                calculateCommonInterestsAndHobbies(potentialMatches, interests, hobbies);
// Sort potential matches based on the sum of common interests and hobbies
// Then consider age relative to the logged-in user's age
potentialMatches.sort((a, b) => {
    const totalA = a.commonInterestsCount + a.commonHobbiesCount;
    const totalB = b.commonInterestsCount + b.commonHobbiesCount;

    // Compare the sum of common interests and hobbies
    if (totalA !== totalB) {
        return totalB - totalA;
    } else {
        // Define age priority based on logged-in user's gender
        let priorityA, priorityB;

        if (gender === 'Male') {
            // Male user dating: prioritize same age females, then younger females, then older females
            priorityA = agePriority(a.Age, age, 'female');
            priorityB = agePriority(b.Age, age, 'female');
        } else if (gender === 'Female') {
            // Female user dating: prioritize same age males, then older males, then younger males
            priorityA = agePriority(a.Age, age, 'male');
            priorityB = agePriority(b.Age, age, 'male');
        }
        else if(gender === 'Other'){
            // Other gender user dating: prioritize same age others, then other ages, and then males/females
            priorityA = agePriority(a.Age, age, a.Gender);
            priorityB = agePriority(b.Age, age, b.Gender);
        }

        // Compare age priorities
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        } else {
            // Prioritize hobbies over interests in case of a tie
            if (b.commonHobbiesCount !== a.commonHobbiesCount) {
                return b.commonHobbiesCount - a.commonHobbiesCount;
            } else {
                return b.commonInterestsCount - a.commonInterestsCount;
            }
        }
    }
});


                // Display the best match
                displayBestMatch(potentialMatches[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                outputElement.textContent = 'An error occurred. Please try again later.';
            });
    });

    // Function to filter potential matches based on user gender preference
    // Function to filter potential matches based on user gender preference
function filterPotentialMatches(data, userGender, loggedInRollNumber) {
    let potentialMatches;
    if (userGender === 'Male') {
        potentialMatches = data.filter(person => person.Gender === 'Female');
    } else if (userGender === 'Female') {
        potentialMatches = data.filter(person => person.Gender === 'Male');
    } else {
        // For non-binary gender, include all gender matches
        potentialMatches = data;
    }

    // Exclude the logged-in user from potential matches based on roll number
    potentialMatches = potentialMatches.filter(person => person['IITB Roll Number'] !== loggedInRollNumber);

    return potentialMatches;
}


    // Function to calculate the count of common interests and hobbies
    function calculateCommonInterestsAndHobbies(matches, userInterests, userHobbies) {
        matches.forEach(person => {
            // Calculate the count of common interests
            const commonInterestsCount = userInterests.filter(interest => person.Interests.includes(interest)).length;
            person.commonInterestsCount = commonInterestsCount;

            // Calculate the count of common hobbies
            const commonHobbiesCount = userHobbies.filter(hobby => person.Hobbies.includes(hobby)).length;
            person.commonHobbiesCount = commonHobbiesCount;
        });
    }

    // Function to display the best match
    function displayBestMatch(bestMatch) {
        if (bestMatch) {
            // Check if there are any common interests or hobbies
            if (bestMatch.commonInterestsCount > 0 || bestMatch.commonHobbiesCount > 0) {
                // Save the best match's details to localStorage
                localStorage.setItem('bestMatch', JSON.stringify({
                    Name: bestMatch.Name,
                    rollNumber: bestMatch['IITB Roll Number'],
                    yearOfStudy: bestMatch['Year of Study'],
                    age: bestMatch.Age,
                    email: bestMatch.Email,
                    Photo: bestMatch['Photo'],
                    interests: bestMatch.Interests.join(', '),
                    hobbies: bestMatch.Hobbies.join(', ')
                }));
    
                // Redirect the user to match.html
                window.open('match.html', '_blank');
            } else {
                outputElement.textContent = 'No good match found.';
            }
        } else {
            outputElement.textContent = 'No suitable match found.';
        }
    }
  // Function to calculate age priority
  function agePriority(potentialAge, currentAge, targetGender) {
    if (potentialAge === currentAge) {
        return 1; // Same age gets the highest priority
    } else if ((targetGender === 'female' && potentialAge > currentAge) ||
               (targetGender === 'male' && potentialAge < currentAge)) {
        return 2; // Older (for female) or younger (for male) gets medium priority
    } else {
        return 3; // Younger (for female) or older (for male) gets lowest priority
    }
}
});
