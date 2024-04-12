
// ------------------- adding a scroll function that makes my header(height & logo) smaller when user scrolls ------------
window.addEventListener("scroll", function () {
    var header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);

    var logoImg = document.querySelector(".logo img");

    // Calculate the scale factor based on the scroll position
    var scaleFactor = 1 - window.scrollY / 1000;

    scaleFactor = Math.max(0.9, scaleFactor);

    // Apply the scale transformation to the logo image
    logoImg.style.transform = "scale(" + scaleFactor + ")";



    // ------------------- method tghat shows about us content nicely animaated when user scrolls ------------
    var aboutUsSection = document.querySelector('.about-us');
    var aboutUsPosition = aboutUsSection.getBoundingClientRect().top;
    var screenPosition = window.innerHeight / 1.2; // Adjust this value as needed

    if (aboutUsPosition < screenPosition) {
        aboutUsSection.classList.add('show');
    }

    var footer = document.getElementById('footer');
    var footerContent = document.querySelectorAll('.footer-content');

    if (isInViewport(footer)) {
        footerContent.forEach(function (content) {
            content.classList.add('show');
        });
        // Remove event listener after the footer has been revealed
        window.removeEventListener('scroll', handleScroll);
    }
});

// Function to check if an element is in the viewport
function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


// ---------------------------- TOGGLE VIDEO PAUSE INDEX ----------------------------
function toggleVideo() {
    var video = document.querySelector('.banner-video');
    var banner = document.querySelector('.banner');
    var bannerContent = document.querySelector('.banner-content');

    if (video.paused) {
        video.play();
        banner.classList.remove('paused');
    } else {
        video.pause();
        banner.classList.add('paused');
    }
}


// ---------------------------- MAKE ABOUT US IMAGES ANIMATE NICELY ----------------------------
var carouselSlides = document.querySelectorAll('.carousel-slide');

// Function to show each carousel slide one after the other
function showCarouselSlides() {
    carouselSlides.forEach(function (slide, index) {
        setTimeout(function () {
            slide.style.opacity = '1';
            slide.style.transform = 'translateY(0)';
        }, 200 * index); // Adjust the delay between each slide as needed
    });
}

function handleScroll() {
    if (isInViewport(document.querySelector('.about-us'))) {
        showCarouselSlides();
        // Remove scroll event listener after showing carousel slides to improve performance
        window.removeEventListener('scroll', handleScroll);
    }
}

window.addEventListener('scroll', handleScroll);

// Show footer content with delay
document.addEventListener('DOMContentLoaded', function () {
    var footerContents = document.querySelectorAll('.footer-content');
    footerContents.forEach(function (content, index) {
        setTimeout(function () {
            content.classList.add('show');
        }, index * 500);
    });
});


// ---------------------------- NOTIFY USER WHEN EMAIL IS COPIED----------------------------
document.addEventListener('DOMContentLoaded', function () {
    var email = document.getElementById('email');
    email.addEventListener('click', function () {
        // Create a textarea element to hold the email
        var textarea = document.createElement('textarea');
        textarea.value = email.innerText;

        // Append the textarea to the body
        document.body.appendChild(textarea);

        // Select the email text
        textarea.select();

        // Copy the text to the clipboard
        document.execCommand('copy');

        // Remove the textarea
        document.body.removeChild(textarea);

        // Show a popup
        alert('Copied to clipboard');
    });
});

/*
// ---------------------------- PROFILE SIDE BAR ----------------------------
document.getElementById('profileBtn').addEventListener('click', function () {
var profileSidebar = document.getElementById('profileSidebar');
if (profileSidebar.style.right === '0px') {
profileSidebar.style.right = '-300px'; // Hide the sidebar
} else {
profileSidebar.style.right = '0px'; // Show the sidebar
}
});

document.getElementById('closeBtn').addEventListener('click', function () {
document.getElementById('profileSidebar').style.right = '-300px';
});
*/