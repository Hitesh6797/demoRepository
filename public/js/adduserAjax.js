$(document).ready( function() {
    $('#addUserForm').submit(function(e) {
        e.preventDefault();
        
        // var formData = new FormData();    
        var formData = new FormData(this);
        // formData.append('birthdate',$("input[name='dob']").val())
        // var files = $('#file')[0].files[0];

        var data = {
            "fname": $("input[name='fname']").val(),
            "lname": $("input[name='lname']").val(),
            "gender": $("input[name='gender']:checked").val(),
            "email": $("input[name='email']").val(),
            "dob": $("input[name='dob']").val(),
            // "profile":files
        }
        
        $.ajax({
            url: '/api/users',
            type:'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response){
                console.log(response);
                window.location =  '/users';
            },
            error: function(err) {
                let locals = err.responseJSON.errorMessage;

                console.log(err);
                if(err.responseJSON){
            
                    if(locals.fname) {
                        let FirstName = locals.fname.msg
                        document.getElementById("fnameError").innerHTML = `<strong style="color:red;">${FirstName}</strong> `;  
                    } else {
                        document.getElementById("fnameError").innerHTML = ``;
                    }
                
                    if(locals.lname) {
                        let LastName = locals.lname.msg
                        document.getElementById("lnameError").innerHTML = `<strong style="color:red;">${LastName}</strong> `;  
                    } else {
                        document.getElementById("lnameError").innerHTML = ``;
                    }

                    if(locals.email) {
                        let email = locals.email.msg
                        document.getElementById("emailError").innerHTML = `<strong style="color:red;">${email}</strong> `;                 
                    } else {
                        document.getElementById("emailError").innerHTML = ``;                 
                    }

                    if(locals.dob) {
                        let birthdate = locals.dob.msg;
                        document.getElementById("birthdateError").innerHTML = `<strong style="color:red;">${birthdate}</strong> `;  
                    } else {
                        document.getElementById("birthdateError").innerHTML = ``; 
                    }
                    
                    if(locals.profile_photo) {
                        let profile = locals.profile_photo.msg;
                        document.getElementById("profileError").innerHTML = `<strong style="color:red;">${profile}</strong> `;  
                    } else {
                        document.getElementById("profileError").innerHTML = ``;  
                    }
                }
            }
        });
        return false;
    });
});
