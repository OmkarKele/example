let score = 0;
let availablePoints = 1000;
let userId = localStorage.getItem("user_id"); // Retrieve user ID from localStorage or sessionStorage

// Fetch user data from the database
function fetchUserData() {
    fetch("game.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=get_data&user_id=${userId}`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error) {
            score = data.score;
            availablePoints = data.available_points;
            document.getElementById('score').innerText = score;
            document.getElementById('available-points').innerText = availablePoints;
        } else {
            console.error("Error fetching user data:", data.error);
        }
    })
    .catch(error => console.error("Error fetching user data:", error));
}

// Place bet function
function placeBet(color) {
    let betAmount = parseInt(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > availablePoints) {
        alert('Invalid bet amount');
        return;
    }

    availablePoints -= betAmount;
    let winningColor = ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)];

    if (color === winningColor) {
        let winnings = betAmount * 2;
        score += winnings;
        availablePoints += winnings;
        document.getElementById('result-message').innerText = `🎉 You won! The color was ${winningColor}`;
    } else {
        document.getElementById('result-message').innerText = `❌ You lost! The color was ${winningColor}`;
    }

    document.getElementById('score').innerText = score;
    document.getElementById('available-points').innerText = availablePoints;

    // Update the database with new values
    fetch("game.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=update_score&user_id=${userId}&score=${score}&available_points=${availablePoints}`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error("Error updating user data:", data.error);
        }
    })
    .catch(error => console.error("Error updating user data:", error));
}

// Logout function
function logout() {
    alert('Logging out...');
    window.location.href = 'login.html';
}

// Load user data when page loads
window.onload = fetchUserData;
