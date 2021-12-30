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
    $(".banner").css("background-color","rgb(248, 215, 218)")
    $(".banner").css("border-right", "10px solid rgb(245, 198, 203)")
    $(".banner").css("color", "#721c24")
    $(".banner-text").html(msg)
    $(".banner").toggleClass("shown");
    setTimeout(() => {
        $(".banner").toggleClass("shown")
    },5000)
}

function displaySuccess(msg) {
    $(".banner").css("background-color","#d4edda")
    $(".banner").css("border-right", "10px solid #c3e6cb")
    $(".banner").css("color", "#155724")
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