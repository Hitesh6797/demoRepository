$(document).ready( function() {
    $('#addUserForm').on('submit',(function(e) {
        e.preventDefault();
        
        var formData = new FormData();
        var files = $('#file')[0].files[0];
        
        formData.append('file',files);
        formData.append('fname',$("input[name='fname']").val())
        formData.append('lname',$("input[name='lname']").val())
        formData.append('gender',$("input[name='gender']:checked").val())
        formData.append('email',$("input[name='email']").val())
        formData.append('birthdate',$("input[name='dob']").val())
        
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

                    if(locals.birthdate) {
                        let birthdate = locals.birthdate.msg;
                        document.getElementById("birthdateError").innerHTML = `<strong style="color:red;">${birthdate}</strong> `;  
                    } else {
                        document.getElementById("birthdateError").innerHTML = ``; 
                    }
                    
                    if(locals.profile) {
                        let profile = locals.profile.msg;
                        document.getElementById("profileError").innerHTML = `<strong style="color:red;">${profile}</strong> `;  
                    } else {
                        document.getElementById("profileError").innerHTML = ``;  
                    }
                }
            }
        });
    }))
});
