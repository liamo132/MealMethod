-- Create a database
CREATE DATABASE MealMethodDB;

-- Use the database
USE MealMethodDB;

-- Create a table to store user account details
CREATE TABLE AccountDetails (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    DOB DATE,
    Email VARCHAR(255),
    Password VARCHAR(255)
);

-- Create a table to store user specifications
CREATE TABLE UserSpecifications (
    UserID INT,
    Height FLOAT,
    Weight FLOAT,
    Sex ENUM('male', 'female'),
    CalorieIntake INT,
    ProteinIntake INT,
    MealMethodBio TEXT,
    FOREIGN KEY (UserID) REFERENCES AccountDetails(UserID)
);

-- Create a table to store meal plans
CREATE TABLE MealPlans (
    PlanID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    PlanName VARCHAR(255),
    ScreenshotFileName VARCHAR(255), -- File name of the screenshot
    FOREIGN KEY (UserID) REFERENCES AccountDetails(UserID)
);
