<?php
session_start();

require_once "config.php";

$username = $password = "";
$username_err = $password_err = $login_err = "";

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
    } else{
        $password = trim($_POST["password"]);
    }

    // Check for errors before querying the database
    if(empty($username_err) && empty($password_err)){

        // Prepare a select statement
        $sql = "SELECT id, username, password FROM users WHERE username = ?";

        if($stmt = $mysqli->prepare($sql)){
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("s", $param_username);
            // Set parameters
            $param_username = $username;

            // Attempt to execute the prepared statement
            if($stmt->execute()){
                // Store result
                $stmt->store_result();

                // Check if username exists, then verify password
                if($stmt->num_rows == 1){
                    // Bind result variables
                    $stmt->bind_result($id, $username, $hashed_password);
                    if($stmt->fetch()){
                        if(password_verify($password, $hashed_password)){
                            // if the password is correct, start a new session
                            session_start();

                            // Store data in session variables
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["username"] = $username;

                            // Redirect user to account page
                            header("location: account.php");
                        } else{
                            // if the password is not valid, display  error message
                            $login_err = "Invalid username or password.";
                        }
                    }
                } else{
                    // Username doesn't exist, display error message
                    $login_err = "Invalid username or password.";
                }
            } else{
                // Display an error message if execution failed
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Closes statement
            $stmt->close();
        }
    }

    // Closes connection
    $mysqli->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>User Login</title>
<link rel="icon" type="image/x-icon" href="img/favicon.ico" >
<style>
body {
    font-family: 'Rubik', 'Montserrat', sans-serif;
    background-image: url('https://source.unsplash.com/1920x1080/?food');
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
    outline: none;
    border-color: #1f824d;
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
    margin: 0 15px;
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

header ul li a:hover {
    background-color: #F0F8FF;
    border-color: #31C48D;
}

header ul li a.active {
    color: #fff;
    background-color: #31C48D;
    border-color: #31C48D;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

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
<!-- Header -->
  <header>
      <a href="#" class="logo"><img src="img/logo.png" alt="Logo"></a>
      <ul>
          <!-- Navigation links -->
          <li><a href="index.html">Home</a></li>
          <li><a href="recipe.html">Recipes</a></li>
          <li><a href="mealplanner.html">Meal Planner</a></li>
          <li><a href="fitbuilder.html">Fit Builder</a></li>
      </ul>

  </header>

  <!-- Login Form -->
  <div class="container">
    <h2>User Login</h2>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <!-- Username and Password inputs -->
        <!-- Display error message if username is invalid -->
        <input type="text" name="username" id="username" placeholder="Username" class="form-control <?php echo (!empty($username_err)) ? 'is-invalid' : ''; ?>" value="<?php echo $username; ?>">
        <span class="invalid-feedback"><?php echo $username_err; ?></span>
        <!-- Display error message if password is invalid -->
        <input type="password" name="password" id="password" placeholder="Password" class="form-control <?php echo (!empty($password_err)) ? 'is-invalid' : ''; ?>">
        <span class="invalid-feedback"><?php echo $password_err; ?></span>
        <!-- Submit button -->
        <button type="submit">Login</button>
    </form>
    <!-- Error message -->
    <p><?php echo $login_err; ?></p>
    <!-- Registration link -->
    <a href="register.php"><button type="button" id="registerButton">New here? Register</button></a>
</div>

</body>
</html>
