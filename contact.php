<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Email address where you want to receive the messages
    $to = "methodmeal@gmail.com";

    // Email subject
    $email_subject = "New Contact Form Submission: $subject";

    // Email content
    $email_body = "You have received a new message from your website contact form.\n\n" .
        "Name: $name\n" .
        "Email: $email\n" .
        "Subject: $subject\n" .
        "Message:\n$message";

    // Headers
    $headers = "From: $name <$email>\r\nReply-To: $email\r\n";

    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "Thank you! Your message has been sent.";
    } else {
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    echo "Oops! It seems you've accessed this page incorrectly.";
}
?>