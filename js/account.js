window.onload = function() {
    var accountDetailsButton = document.querySelector('.navigation ul li.active');
    var accountDetailsLink = accountDetailsButton.querySelector('a');
    accountDetailsLink.click(); // Simulate click on the "Account Details" link
};

function setActive(element) {
    var listItems = document.querySelectorAll('.navigation ul li');
    listItems.forEach(function (item) {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

function scrollToSection(sectionId) {
    if (sectionId === 'account-details') {
        location.reload();
    } else {
        var headerHeight = document.getElementById('header2').offsetHeight;

        if (sectionId === 'user-specifications') {
            var documentHeight = document.body.clientHeight;
            window.scrollTo({ top: documentHeight - (window.innerHeight - 80), behavior: 'smooth' });
        } else if (sectionId === 'meal-plans') {
            var windowHeight = window.innerHeight;
            var documentHeight = document.body.clientHeight;
            window.scrollTo({ top: documentHeight - windowHeight, behavior: 'smooth' });
        }
    }
}



function showSection(sectionId) {
    var sections = document.querySelectorAll('.content');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });

    var selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add('active');
}


// Prevent default behavior
function preventDefault(e) {
    e.preventDefault();
}