// ===============================
// LOGIN SYSTEM
// ===============================

const loginForm = document.getElementById("loginForm");

const errorMessage = document.getElementById("errorMessage");


// ===============================
// LOGIN SUBMIT
// ===============================

loginForm.addEventListener("submit", async function(e){

    e.preventDefault();


    const username =
        document.getElementById("username").value;


    const password =
        document.getElementById("password").value;


    try{


        const response = await fetch("/login",{

            method:"POST",

            headers:{

                 "Content-Type":"application/x-www-form-urlencoded"
            },

            body:new URLSearchParams({

                username: username,
                password: password

            })


        });



        const result = await response.json();



        if(result.success){


            window.location.href="/";


        }

        else{


            errorMessage.innerHTML =
            result.message;


        }



    }

    catch(error){


        errorMessage.innerHTML =
        "Server connection failed";


        console.log(error);


    }


});




// ===============================
// SHOW / HIDE PASSWORD
// ===============================


const togglePassword =
document.getElementById("togglePassword");


togglePassword.addEventListener("click",()=>{


    const password =
    document.getElementById("password");



    if(password.type==="password"){


        password.type="text";


        togglePassword.classList.remove(
            "fa-eye"
        );


        togglePassword.classList.add(
            "fa-eye-slash"
        );


    }

    else{


        password.type="password";


        togglePassword.classList.remove(
            "fa-eye-slash"
        );


        togglePassword.classList.add(
            "fa-eye"
        );


    }


});