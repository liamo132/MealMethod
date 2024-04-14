<?php
//to access database you will have to create a databse and change the details below
//the databse script is in the files and will include two tables
//one called users and another called userprofile
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'MealMethod99$');
define('DB_NAME', 'userdb');

$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($mysqli->connect_error) {
    die("ERROR: Could not connect. " . $mysqli->connect_error);
}
?>
