const logForm = $(".login-form")
const regForm = $(".register-form")

function showLogin() {
    regForm.fadeOut();
    logForm.css("display", "flex").hide().fadeIn();
}
function showRegister() {
    logForm.fadeOut();
    regForm.css("display", "flex").hide().fadeIn();
}

function displayBanner(msg) {
    $(".banner-text").html(msg)
    $(".banner").toggleClass("shown");
    setTimeout(() => {
        $(".banner").toggleClass("shown")
    },5000)
}

const queryString = window.location.search
if(queryString == '?register') {
    showRegister()
}