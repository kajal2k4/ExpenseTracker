// Function to handle user signup
function handleSignUp() {
    // localStorage.clear();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const question = document.getElementById('securityQuestion').value;
    const answer = document.getElementById('securityAnswer').value;

    // Check if all fields are filled out
    if (!username || !password || !question || !answer) {
        alert('Please fill out all fields.');
        return;
    }

    // Retrieve existing users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists.');
        return;
    }   

    // Add new user to the list and save to local storage
    users.push({ username, password, question, answer });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Redirect to tracker page
    window.location.href = "tracker.html";  
}

// Function to handle user login
function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Check if username and password are provided
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    // Retrieve existing users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching username and password
    const user = users.find(user => user.username === username && user.password === password);

    // If user is found, redirect to tracker page
    if (user) {
        window.location.href = "tracker.html";
    } 
    else {
        alert('Invalid username or password.');
    }
}

// Function to handle forgotten password
function handleForgotPassword() {
    const username = prompt("Please enter your username to recover your password:");

    // Check if username is provided
    if (!username) {
        alert('Username is required.');
        return;
    }

    // Retrieve existing users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching username
    const user = users.find(user => user.username === username);

    // If user is found, prompt for security question answer
    if (user) {
        const answer = prompt(`Security Question: ${user.question}\nPlease enter your answer:`);

        // If answer is correct, prompt for new password
        if (answer === user.answer) {
            const newPassword = prompt("Answer correct! Please enter a new password:");

            // Update user password and save to local storage
            if (newPassword) {
                user.password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                alert("Password successfully reset.");
            } 
            else {
                alert("Password cannot be empty.");
            }
        } 
        else {
            alert("Incorrect answer to the security question.");
        }
    }
    else {
        alert("Username not found.");
    }
}
