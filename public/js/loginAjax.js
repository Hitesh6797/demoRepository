$(document).ready(function () {
  
    $('#adminLogin').on('submit', function(e) {
        e.preventDefault();
  
        var data = {
            "email": $('#adminLoginEmail').val(),
            "password": $('#adminLoginPassword').val(),
          }
        var result = JSON.stringify(data)
        $.ajax({
            url: 'admin/login',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',     
            data: result,
            success: function(data) {
              console.log(data);
              window.location =  '/dashboard';
            },
            error: function(err){
              console.log(err);
              let locals = err.responseJSON.errorMessage;

              if(err.responseJSON){
                
                if(locals.email) {
                  let email = err.responseJSON.errorMessage.email.msg
                  document.getElementById("emailError").innerHTML = `<strong style="color:red;">${email}</strong> `;  
                } else {
                  document.getElementById("emailError").innerHTML = ``;
                }

                if(locals.password) {
                  let password = err.responseJSON.errorMessage.password.msg
                  document.getElementById("passwordError").innerHTML = `<strong style="color:red;">${password}</strong> `;                 
                } else {
                  document.getElementById("passwordError").innerHTML = ``;                 
                  } 
              }  
            }
        })
    })
    });
