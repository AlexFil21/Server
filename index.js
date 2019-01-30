var template = '';
var $article = $('.newsContent');
var json, regData, logData, active;

$('#showReg').click(function(){
    $('#regForm').addClass('active');
    $('#background').addClass('active');
    
    $('#regForm').submit(function(e){
        e.preventDefault()
        var $data = {};

        $('#regForm').find ('input').each(function() {
          $data[this.name] = $(this).val();
        });

        regData = JSON.stringify($data)
        console.log(regData);
        postUsers(regData)
    
         $('#regForm').removeClass('active');
         $('#background').removeClass('active');
    })

})

$(".attention").hide()
$('.addArticle').click(function(){
    if (active) {
        $('.newArticle').addClass('active');
        $('.backgroundForArticle').addClass('active');
        
        $('#myForm').submit(function(e){
            e.preventDefault()
            var $data = {};

            $('#myForm').find ('input, textarea').each(function() {
            $data[this.name] = $(this).val();
            });

            json = JSON.stringify($data)
            //console.log(json);
            postArticle(json)
        
            $('.newArticle').removeClass('active');
            $('.backgroundForArticle').removeClass('active');
        })
    }
    else {
        $(".attention").show()
    }
})

$('#showLog').click(function(){
    $('#logForm').addClass('active');
    
    $('#logForm').submit(function(e){
        e.preventDefault()
        var $data = {};

        $('#logForm').find ('input').each(function() {
          $data[this.name] = $(this).val();
        });

        logData = JSON.stringify($data)
        //console.log($data.nikName);
        logUser(logData)
        $('#logForm').removeClass('active');
    })
})

$('#signOut').click(function(){
    $('.regLog').removeClass('hidden');
    $('.nikSignOut').removeClass('show');
})


function postArticle(newData){
    $.ajax({
        url: '/database',
        method: 'POST',
        data: newData,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data){
        console.log(data);
        location.reload()
    }).fail(function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
    })
}

getArticle()
function getArticle(){
    $.ajax({
        url: '/database',
        method: 'GET',
    }).done(function(data){
        
        for(var i in data ){
            template = '<div class="article">'
            + '<div class="title">'+ data[i].title + '</div>'
            + '<div class="content">'+ data[i].content + '</div>'
            + '<div class="author">'+ data[i].author + '</div>'
            + '<p class="published">'+ data[i].published + '</p>'
            + '<span id="btn" class="btn" data-attr='+data[i].id+'>Delete</span>'
            + '</div>'
            $article.append(template);
        }
            $('.btn').click(function(event){
                event.preventDefault();
                var id = $(this).attr('data-attr') 
                deleteArticle(id);  
            })
    })
    .fail(function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
    })    
}

function deleteArticle(id) {
    $.ajax({
        url: '/delete'+id,
        method: 'DELETE',
    }).done(function(data){
        location.reload()
        console.log("sucessful delete id:"+id);
    })
    .fail(function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
    })
}

function getUsers(){
    $.ajax({
        url: '/users',
        method: 'GET'
    })
    .done(function(data){
        console.log(data);
    })
    .fail(function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
    })
}

function postUsers(usersData){
    $.ajax({
        url: '/users',
        method: 'POST',
        data: usersData,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data){
        console.log(data);
    }).fail(function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
    })
}

function logUser(lU){
    $.ajax({
        url: '/authorizedUser',
        method: 'POST',
        data: lU,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    })
    .done(function(data){
       
        if(data === 'done')			
			{
                var s = Object.values(JSON.parse(lU))
                window.location.href="/authorizedUser/"+s[0];
            }
         else {
             console.log(data);
         }   
        
    })
    .fail(function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
    })
   
}

checkAuthorizedUser()
function checkAuthorizedUser(){
    $.ajax({
        url: '/authorizedUser',
        method: 'GET'
    })
    .done(function(data){
            $('.regLog').addClass('hidden');
            $('.nikSignOut').addClass('show');
            $('.nikSignOut').append('<span id="userNikName">'+data+'</span>')
            $('.nikSignOut').append('<a id="signOut" href='+'/logout'+'>Sign out</a>')
            active = true
    })
    .fail(function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log(msg);
    })  
}