$(document).ready(function(){
    $("#unisex").prop("checked", true);
    $('.panel-heading span.clickable').on("click", function (e) {
        if ($(this).hasClass('panel-collapsed')) {
            // expand the panel
            $(this).parents('.panel').find('.panel-body').slideDown();
            $(this).removeClass('panel-collapsed');
            $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
        else {
            // collapse the panel
            $(this).parents('.panel').find('.panel-body').slideUp();
            $(this).addClass('panel-collapsed');
            $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
    });
    var QueryString = function () {
      // This function is anonymous, is executed immediately and
      // the return value is assigned to QueryString!
        var query_string = {};
        console.log(query_string);
        var query = window.location.search.substring(1);
        console.log(query);
        var vars = query.split("&");
        console.log(JSON.stringify(vars));
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        console.log(query_string);
        return query_string;
    }();
    // set search key
    $("#filter-box").val(QueryString.key);
    // get gender selected options
    var gender_arr = QueryString.g;
    if (gender_arr === ""){ gender_arr="unisex";}
    $("input[name=gender][value=" + gender_arr + "]").attr('checked', 'checked');
    // var female = false;
    // var male = false;
    // var unisex = false;
    // if (gender_arr == 'female'){
    //     female = true;
    // }else if (gender_arr == 'male'){
    //     male = true;
    // }else if (gender_arr== 'unisex'){
    //     unisex = true;
    // }
    // just_for_her_checkbox(female);
    // just_for_him_checkbox(male);
    // unisex_checkbox(unisex);
    // get occasions selected options
    var occasions_arr = QueryString.o.split(',');
    var christmas = false;
    var valentines = false;
    var birthday = false;
    for(var i = 0, len = occasions_arr.length, text = ""; i < len; i++){
        if (occasions_arr[i] == 'christmas'){
            christmas = true;
        }else if (occasions_arr[i] == 'valentines'){
            valentines = true;
        }else if (occasions_arr[i] == 'birthday'){
            birthday = true;
        }
        christmas_checkbox(christmas);
        valentines_checkbox(valentines);
        birthday_checkbox(birthday);
    }
    // get personality selected options
    var personality_arr = QueryString.p.split(',');
    var manly = false;
    var feminine = false;
    var sporty = false;
    var classy = false;
    for(var i = 0, len = personality_arr.length, text = ""; i < len; i++){
        if (personality_arr[i] == 'manly'){
            manly = true;
        }else if (personality_arr[i] == 'feminine'){
            feminine = true;
        }else if (personality_arr[i] == 'sporty'){
            sporty = true;
        }else if (personality_arr[i] == 'classy'){
            classy = true;
        }
        manly_checkbox(manly);
        feminine_checkbox(feminine);
        sporty_checkbox(sporty);
        classy_checkbox(classy);
    }
    // get category selected options
    var category_arr = QueryString.c.split(',');
    var music = false;
    var crafts = false;
    var otaku = false;
    var cooking = false;
    for(var i = 0, len = category_arr.length, text = ""; i < len; i++){
        if (category_arr[i] == 'music'){
            music = true;
        }else if (category_arr[i] == 'crafts'){
            crafts = true;
        }else if (category_arr[i] == 'otaku'){
            otaku = true;
        }else if (category_arr[i] == 'cooking'){
            cooking = true;
        }
        music_checkbox(music);
        crafts_checkbox(crafts);
        otaku_checkbox(otaku);
        cooking_checkbox(cooking);
    }
    $("#filter-product-btn").click(function(){
        // var value_json = { key: '', g: '', o:'', p: '', c: ''};
        // value_json.key = $("#filter-box").val();
        // value_json.g = $('input[name=gender]:checked').val();
        // value_json.o = $('input[type="checkbox"][name="occasions\\[\\]"]:checked').map(function() { return this.value; }).get();
        // value_json.p = $('input[type="checkbox"][name="personality\\[\\]"]:checked').map(function() { return this.value; }).get();
        // value_json.c = $('input[type="checkbox"][name="category\\[\\]"]:checked').map(function() { return this.value; }).get();
        // console.log(JSON.stringify(value_json));
        var queryStr = '';
        queryStr += 'key=' + $("#filter-box").val();
        queryStr += '&';
        queryStr += 'g=' + $('input[name=gender]:checked').val();
        queryStr += '&';
        queryStr += 'o=' + $('input[type="checkbox"][name="occasions\\[\\]"]:checked').map(function() { return this.value; }).get();
        queryStr += '&';
        queryStr += 'p=' + $('input[type="checkbox"][name="personality\\[\\]"]:checked').map(function() { return this.value; }).get();
        queryStr += '&';
        queryStr += 'c=' + $('input[type="checkbox"][name="category\\[\\]"]:checked').map(function() { return this.value; }).get();
        location.href='products.html?' + queryStr.replace(/\[.*\]/g,'');
    });

});

function just_for_her_checkbox(isFemale){
    if (isFemale){
        $("#female").attr('checked', 'checked');
    }else{
        $("#female").prop("checked", false);
    }
}
function just_for_him_checkbox(isMale){
    if (isMale){
        $("#male").attr('checked', 'checked');
    }else{
        $("#male").prop("checked", false);
    }
}
function unisex_checkbox(unisex){
    if (unisex){
        $("#unisex").attr('checked', 'checked');
    }else{
        $("#unisex").prop("checked", false);
    }
}
function christmas_checkbox(value){
    if (value){
        $("#christmas").prop("checked", true);
    }else{
        $("#christmas").prop("checked", false);
    }
}
function valentines_checkbox(value){
    if (value){
        $("#valentines").prop("checked", true);
    }else{
        $("#valentines").prop("checked", false);
    }
}
function birthday_checkbox(value){
    if (value){
        $("#birthday").prop("checked", true);
    }else{
        $("#birthday").prop("checked", false);
    }
}
function manly_checkbox(value){
    if (value){
        $("#manly").prop("checked", true);
    }else{
        $("#manly").prop("checked", false);
    }
}
function feminine_checkbox(value){
    if (value){
        $("#feminine").prop("checked", true);
    }else{
        $("#feminine").prop("checked", false);
    }
}
function sporty_checkbox(value){
    if (value){
        $("#sporty").prop("checked", true);
    }else{
        $("#sporty").prop("checked", false);
    }
}
function classy_checkbox(value){
    if (value){
        $("#classy").prop("checked", true);
    }else{
        $("#classy").prop("checked", false);
    }
}
function music_checkbox(value){
    if (value){
        $("#music").prop("checked", true);
    }else{
        $("#music").prop("checked", false);
    }
}
function crafts_checkbox(value){
    if (value){
        $("#crafts").prop("checked", true);
    }else{
        $("#crafts").prop("checked", false);
    }
}
function otaku_checkbox(value){
    if (value){
        $("#otaku").prop("checked", true);
    }else{
        $("#otaku").prop("checked", false);
    }
}
function cooking_checkbox(value){
    if (value){
        $("#cooking").prop("checked", true);
    }else{
        $("#cooking").prop("checked", false);
    }
}
