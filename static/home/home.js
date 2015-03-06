//load the page Hmml template and eventual Json data and initialize page
var masterHtml, homeHtml;  // Main template HTML

// Bind a callback that executes when document.location.hash changes.
// Initialization page
var initHomePage = function () {

    $.get("/home/home.html", function (d) {
        homeHtml = d;
    }).then(function () {

        $(".home_main_containter").html(homeHtml);
        //v_aligner();
        randomString();
        HomeOnClickHandler();
        onHomeLogginSubmit();
        updateWorkSpaceRightContainerOnClick("#home_info", "/home/activities/activities");
        updateWorkSpaceRightContainerOnClick("#home_service_area", "/processes/verifications/verificationServices");
        updateWorkSpaceRightContainerOnClick(".idPhotoServices", "/processes/photoservice/photoServices");
        updateWorkSpaceRightContainerOnClick(".creditratings", "/processes/creditratings/creditratingservices");

    });
}();
// end of load the page html template and eventual Json data   and initialize page

//submit loging information
function onHomeLogginSubmit() {

    $("#homeLoginSubmit").click(function (e) {

        //gUserType = "admin";
        //gUserType = "corporate";
        //gUserType = "personal";
        //$.bbq.pushState('#/workspace/welcome');
       // $.getScript("/workspace/welcome/master.js");

        $(this).addClass('btnPressed');




       $.post("/home/login", {
            "username": $("#username").val(),
            "password": $("#password").val(),
            "user_captcha": $("#user_captcha").val(),
            "antiBotValue": $("#antiBotValue").val()
        }, function (paramReturndata) {

                if (paramReturndata.status) {
                    //alert(paramReturndata.status);
                   // gUserType = paramReturndata.type;
                   // $.bbq.pushState('#/workspace/welcome');
                }
                else {
                    alert("Invalid user name or password !!");
                }

        }, "json");



        e.preventDefault();

    });//end of click event

}
//end of onHomeLoginSubmit function
//load registration or forgot password contain on click

function HomeOnClickHandler() {
    //home page registration link
    updateWorkSpaceRightContainerOnClick(".clickToRegister", "/home/userRegistration");
    //home page password reset link
    updateWorkSpaceRightContainerOnClick(".clickToResetPw", "/home/forgetpw/forgotPw");
}
//end of load registration or forgot password  contain on click
