$(document).ready(function(e){
    $('.search-bar .search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        console.log(param);
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
    $('#search-bar-btn').click(function(){
        var select_option =$('#search_param').val().toLowerCase();
        var gender = ['female', 'male', 'unisex'];
        var personality = ['manly', 'feminine', 'sporty', 'classy'];
        var occasion = ['christmas', 'valentines', 'birthday'];
        var category = ['music', 'crafts', 'otaku', 'cooking'];
        var search = $("#search-box-value").val() === undefined || $("#search-box-value").val() === "" ? "" : $("#search-box-value").val();
        var query = '';
        if (select_option == 'all'){
            query = 'key=' + search;
        }else if ($.inArray(select_option, gender) !== -1){
            query = 'key=' + search + '&g=' + select_option + '&o=&p=&c=';
        }else if ($.inArray(select_option, occasion) !== -1){
            query = 'key=' + search + '&g=&o=' + select_option + '&p=&c=';
        }else if ($.inArray(select_option, personality) !== -1){
            query = 'key=' + search + '&g=&o=&p=' + select_option + '&c=';
        }else if ($.inArray(select_option, category) !== -1){
            query = 'key=' + search + '&g=&o=&p=&c=' + select_option;
        }

        location.href='products.html?' + query;
        return;
    });
});
