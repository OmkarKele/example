<?php
session_start(); // Start the session

$servername = "localhost";
$username = "root";  // Update if needed
$password = "";  // Update if needed
$dbname = "color_game_db1";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for a successful connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the user is logged in (replace this with your own login check mechanism)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id']; // Get user ID from session

// Handle different requests
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST["action"];

    // Action: get user data
    if ($action === "get_data") {
        // Prepared statement to fetch user data based on session user_id
        $stmt = $conn->prepare("SELECT score, available_points FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id); // Bind the user_id as integer
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Send user data as JSON response
            echo json_encode($result->fetch_assoc());
        } else {
            // Handle user not found case
            echo json_encode(["error" => "User not found"]);
        }

        $stmt->close(); // Close the statement
    }

    // Action: update user score and points
    elseif ($action === "update_score") {
        // Ensure input is sanitized and valid
        $newScore = intval($_POST["score"]);
        $newPoints = intval($_POST["available_points"]);

        // Prepared statement to update user score and points
        $stmt = $conn->prepare("UPDATE users SET score = ?, available_points = ? WHERE id = ?");
        $stmt->bind_param("iii", $newScore, $newPoints, $user_id); // Bind the parameters

        if ($stmt->execute()) {
            // Success message
            echo json_encode(["success" => true]);
        } else {
            // Error in updating
            echo json_encode(["error" => "Update failed"]);
        }

        $stmt->close(); // Close the statement
    }
}

$conn->close(); // Close the database connection
?>
