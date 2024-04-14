<?php
session_start();

// Include the configuration file
require_once "config.php";

// Initialize variables
$username = $password = $confirm_password = "";
$username_err = $password_err = $confirm_password_err = "";

// Process form submission
if($_SERVER["REQUEST_METHOD"] == "POST"){

    // Validate username
    if(empty(trim($_POST["username"]))){
        $username_err = "Please enter username.";
    } else{
        $username = trim($_POST["username"]);
    }

    // Validate password
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter your password.";
    } elseif(strlen(trim($_POST["password"])) < 6){
        $password_err = "Password must have at least 6 characters.";
    } else{
        $password = trim($_POST["password"]);
    }

    // Validate confirm password
    if(empty(trim($_POST["confirmPassword"]))){
        $confirm_password_err = "Please confirm password.";
    } else{
        $confirm_password = trim($_POST["confirmPassword"]);
        if(empty($password_err) && ($password != $confirm_password)){
            $confirm_password_err = "Password did not match.";
        }
    }

    // Check input errors before inserting into database
    if(empty($username_err) && empty($password_err) && empty($confirm_password_err)){

        // Prepare a select statement to check if username already exists
        $sql = "SELECT id FROM users WHERE username = ?";

        // Prepare statement
        if($stmt = $mysqli->prepare($sql)){
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("s", $param_username);

            // Set parameters
            $param_username = $username;

            // Attempt to execute the prepared statement
            if($stmt->execute()){
                // Store result
                $stmt->store_result();

                if($stmt->num_rows == 1){
                    $username_err = "This username is already taken.";
                } else{
                    // Prepare an insert statement
                    $sql = "INSERT INTO users (username, password) VALUES (?, ?)";

                    if($stmt = $mysqli->prepare($sql)){
                        // Bind variables to the prepared statement as parameters
                        $stmt->bind_param("ss", $param_username, $param_password);

                        // Set parameters
                        $param_username = $username;
                        $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash

                        // Attempt to execute the prepared statement
                        if($stmt->execute()){
                            // Redirect to login page
                            header("location: login.php");
                        } else{
                            echo "Oops! Something went wrong. Please try again later.";
                        }

                        // Close statement
                        $stmt->close();
                    }
                }
            } else{
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            $stmt->close();
        }
    }

    // Close connection
    $mysqli->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Register</title>
<link rel="icon"  type="image/x-icon" href="img/favicon.ico" >
<style>
body {
font-family: 'Rubik', 'Montserrat', sans-serif;
background-image: url('https://source.unsplash.com/1920x1080/?food'); /* Free background image */
background-size: cover;
background-position: center;
background-repeat: no-repeat;
color: #fff;
margin: 0;
padding: 0;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.container {
background-color: #31C48D;
padding: 20px;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
max-width: 400px;
width: 100%;
text-align: center;
}

input[type="text"],
input[type="password"],
button {
padding: 10px;
margin-bottom: 10px;
width: 90%;
border: none;
border-radius: 5px;
font-size: 16px;
background-color: #ececec;
color: #31C48D;
}

input[type="text"]:focus,
input[type="password"]:focus {
outline: none; /* Removes focus outline */
border-color: #1f824d; /
}

button {
cursor: pointer;
}

button:hover {
background-color: #1f824d; 
color: #fff;
}

header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 1s;
    padding: 18px 100px;
    z-index: 100000;
    background: #ececec;
    box-shadow: none;
    /* Initially no shadow */
}


.logo img {
    max-height: 50px;
    transition: opacity 0.6s;
    display: block;
    left: auto;
}

header ul {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

header ul li {
    position: relative;
    list-style: none;
}

header ul li a {
    position: relative;
    margin: 15px;
    text-decoration: none;
    color: #31C48D;
    letter-spacing: 2px;
    font-weight: 500;
    padding: 10px 15px;
    border: 2px solid transparent;
    border-radius: 5px;
    transition: 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Hover effect */
header ul li a:hover {
    background-color: #F0F8FF;
    border-color: #31C48D;

}

/* Active link */
header ul li a.active {
    color: #fff;
    background-color: #31C48D;
    border-color: #31C48D;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Centering all navigation links */
header ul {
    flex: 1;
    display: flex;
    justify-content: center;
}

header.sticky {
    padding: 12px 100px;
    background: #ececec;
    box-shadow: 0 4px 8px rgba(49, 196, 141, 0.5);
}

header.sticky ul li a {
    color: #31C48D;
}

header.sticky ul li a.active {
    color: #fff;
}

header.sticky .logo {
    color: #31C48D;
}

header.sticky .logo img {
    display: block;
    opacity: 1;
}

</style>
</head>
<body>
<header>
    <a href="#" class="logo"><img src="img/logo.png" alt="Logo"></a>
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="recipe.html">Recipes</a></li>
        <li><a href="mealplanner.html">Meal Planner</a></li>
        <li><a href="fitbuilder.html">Fit Builder</a></li>
    </ul>

</header>

<div class="container">
    <h2>Register</h2>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <!-- Username input -->
        <input type="text" id="username" name="username" placeholder="Username" required>
        <!-- Display error message if username is invalid -->
        <span class="invalid-feedback"><?php echo $username_err; ?></span>
        <!-- Password input -->
        <input type="password" id="password" name="password" placeholder="Password" required>
        <!-- Display error message if password is invalid -->
        <span class="invalid-feedback"><?php echo $password_err; ?></span>
        <!-- Confirm Password input -->
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>
        <!-- Display error message if confirm password does not match -->
        <span class="invalid-feedback"><?php echo $confirm_password_err; ?></span>
        <!-- Submit button -->
        <button type="submit" id="registerButton">Register</button>
        <!-- Login link -->
        <a href="login.php"><button type="button">Login</button></a>
    </form>
</div>

</body>
</html>
