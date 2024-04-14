<?php
// Start the session
session_start();

// Include config file and establish database connection
require_once "config.php";

// Check if the user is not logged in, redirect to the login page
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: login.php");
    exit;
}

// Initialize error variables
$firstName_err = $lastName_err = $dob_err = $password_err = $height_err = $weight_err = $gender_err = $calorie_err = $protein_err = $mealMethodBio_err = "";

// Define variables to hold user details
$firstName = $lastName = $dob = $password = $height = $weight = $gender = $calorie = $protein = $mealMethodBio = "";

// Retrieve user details from the database
$sql = "SELECT * FROM userprofile WHERE username = ?";
if ($stmt = $mysqli->prepare($sql)) {
    $stmt->bind_param("s", $_SESSION['username']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        if ($row) {
            $firstName = $row['first_name'];
            $lastName = $row['last_name'];
            $dob = $row['dob'];
            $height = $row['height'];
            $weight = $row['weight'];
            $gender = $row['gender'];
            $calorie = $row['calorie'];
            $protein = $row['protein'];
            $mealMethodBio = $row['mealMethodBio'];
        } else {
            // Initialize form fields with empty values if no details found
            $firstName = $lastName = $dob = $height = $weight = $gender = $calorie = $protein = $mealMethodBio = "";
        }
    }
    $stmt->close();
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Process form data when form is submitted
    $firstName = trim($_POST["firstName"]);
    $lastName = trim($_POST["lastName"]);
    $dob = trim($_POST["dob"]);
    $password = trim($_POST["password"]);
    $height = trim($_POST["height"]);
    $weight = trim($_POST["weight"]);
    $gender = $_POST["gender"]; // Removed trim() from here because it crrated error
    $calorie = trim($_POST["calorie"]);
    $protein = trim($_POST["protein"]);
    $mealMethodBio = trim($_POST["mealMethodBio"]);

    // Check input errors before updating the database
    if (empty($firstName_err) && empty($lastName_err) && empty($dob_err) && empty($password_err) && empty($height_err) && empty($weight_err) && empty($gender_err) && empty($calorie_err) && empty($protein_err) && empty($mealMethodBio_err)) {
        // Prepare an insert statement if no details found in the database
        $sql = $row ? "UPDATE userprofile SET first_name=?, last_name=?, dob=?, password=?, height=?, weight=?, gender=?, calorie=?, protein=?, mealMethodBio=? WHERE username=?" : "INSERT INTO userprofile (first_name, last_name, dob, password, height, weight, gender, calorie, protein, mealMethodBio, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        if ($stmt = $mysqli->prepare($sql)) {
            if ($row) {
                // If details exist, bind parameters for update
                $stmt->bind_param("ssssssddsss", $firstName, $lastName, $dob, $password, $height, $weight, $gender, $calorie, $protein, $mealMethodBio, $_SESSION['username']);
            } else {
                // If no details exist, bind parameters for insert
                $stmt->bind_param("ssssssddsss", $firstName, $lastName, $dob, $password, $height, $weight, $gender, $calorie, $protein, $mealMethodBio, $_SESSION['username']);
            }

            if ($stmt->execute()) {
                // Redirect to account page after successful update or insertion
                header("location: account.php");
                exit;
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            $stmt->close();
        }
    }
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>User Profile</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="icon" type="image/x-icon" href="img/favicon.ico">
    <script>
        // JavaScript function to logout the user
        function logout() {
            window.location.href = "logout.php";
        }
    </script>
</head>

<body>
    <!-- Header -->
    <header id="header2">
        <a href="index.html" class="logo"><img src="img/logo.png" alt="Logo"></a>
    </header>

    <!-- Navigation -->
    <div class="navigation">
        <ul>
            <!-- List items for navigation -->
            <li class="active" onclick="setActive(this); showSection('user-profile');"><a href="#user-profile">User Profile</a></li>
            <li><a href="index.html">Home</a></li>
            <li><a href="recipe.html">Recipes</a></li>
            <li><a href="mealplanner.html">Meal Planner</a></li>
            <li><a href="fitbuilder.html">Fit Builder</a></li>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="">More Features Coming Soon!</a></li>

              <!-- Logout button -->
            <li><a href="#" class="logout-button" onclick="logout()">Logout</a></li>

        </ul>
    </div>

    <!-- User Profile Content -->
    <div class="content" id="user-profile">
        <h2>User Profile</h2>

        <!-- User Profile Form -->
        <form id="userProfileForm" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <div>
                <!-- Welcome message -->
                <h4 id="welcome-message">Welcome, <?php echo htmlspecialchars($_SESSION["username"]); ?></h4>

                <!-- Profile Picture -->
                <label for="profilePicture" class="profile-picture">
                    <div class="profile-picture-placeholder">
                        <i class="fas fa-camera"></i>
                    </div>
                    <input type="file" id="profilePicture" name="profilePicture" style="display: none;">
                </label>

                <!-- First Name and Last Name inputs -->
                <div class="name-inputs">
                    <div class="input-wrapper">
                        <label for="firstName">First Name:</label><br>
                        <input type="text" id="firstName" name="firstName" value="<?php echo htmlspecialchars($firstName); ?>">
                        <span class="error"><?php echo $firstName_err; ?></span>
                    </div>
                    <div class="input-wrapper">
                        <label for="lastName">Last Name:</label><br>
                        <input type="text" id="lastName" name="lastName" value="<?php echo htmlspecialchars($lastName); ?>">
                        <span class="error"><?php echo $lastName_err; ?></span>
                    </div>
                </div>

                <!-- Date of Birth -->
                <label for="dob">Date of Birth:</label><br>
                <input type="date" id="dob" name="dob" value="<?php echo htmlspecialchars($dob); ?>">
                <span class="error"><?php echo $dob_err; ?></span>

                <!-- Password -->
                <label for="password">Password:</label><br>
                <input type="password" id="password" name="password" value="">
                <span class="error"><?php echo $password_err; ?></span>

                <!-- Height and Weight inputs -->
                <div class="input-group">
                    <div class="input-wrapper">
                        <label for="height">Height (cm):</label>
                        <input type="number" id="height" name="height" value="<?php echo htmlspecialchars($height); ?>">
                        <span class="error"><?php echo $height_err; ?></span>
                    </div>
                    <div class="input-wrapper">
                        <label for="weight">Weight (kg):</label>
                        <input type="number" id="weight" name="weight" value="<?php echo htmlspecialchars($weight); ?>">
                        <span class="error"><?php echo $weight_err; ?></span>
                    </div>
                </div>

                <!-- Gender -->
                <div class="input-wrapper">
                    <label for="gender">Gender: 1 = Male / 2 = Female / any digit = other</label><br>
                    <textarea id="gender" name="gender"><?php echo htmlspecialchars($gender); ?></textarea>
                    <span class="error"><?php echo $gender_err; ?></span>
                </div>

                <!-- Calorie and Protein intake inputs -->
                <div class="input-group">
                    <div class="input-wrapper">
                        <label for="calorie">Calorie Intake:</label>
                        <input type="number" id="calorie" name="calorie" value="<?php echo htmlspecialchars($calorie); ?>">
                        <span class="error"><?php echo $calorie_err; ?></span>
                    </div>
                    <div class="input-wrapper">
                        <label for="protein">Protein Intake:</label>
                        <input type="number" id="protein" name="protein" value="<?php echo htmlspecialchars($protein); ?>">
                        <span class="error"><?php echo $protein_err; ?></span>
                    </div>
                </div>

                <!-- Meal Method Bio -->
                <label for="mealMethodBio">Meal Method Bio:</label>
                <textarea id="mealMethodBio" name="mealMethodBio"><?php echo htmlspecialchars($mealMethodBio); ?></textarea>
                <span class="error"><?php echo $mealMethodBio_err; ?></span>
            </div>

            <!-- Submit Button -->
            <input type="submit" value="Save Profile">
        </form>
    </div>
</body>

</html>
