CREATE TABLE userprofile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATE,
    username VARCHAR(50),
    password VARCHAR(255),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    gender VARCHAR(50),
    calorie INT,
    protein INT,
    mealMethodBio TEXT
);
