/**
 * Created by Volodymyr on 18.07.2015.
 */

var slideWidth=600;
var currentSlide=0;
var slides=5;
var clickFinish=false;
$(function(){
    // При завантаженні сторінки
    //
    // Position
    //
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
        // Search was starting
    } else {
        alert("Ваш браузер не підтримує геолокацію, оновіть його або змініть на інший.");
    }

    //
    //  AJAX
    //

    // Slider
    $('.slidewrapper').css('width',String(5*slideWidth));
    $('#rnav').click(function(){
        nextSlide();
    });
    $('#lnav').click(function(){
       prevSlide();
    });
    // Feedback
    $('#side2').hover(function(){
        $('#feedback').css('left',380);
        $('#wrapForm').css('left',0);
    }, function(){
        $('#feedback').css('left',0);
        $('#wrapForm').css('left',-385);
    });
    // Add Atributes
    $('#add_atr').hover(function(){
        $('.add_char').css('right',-300);
        $('#add_atr').css('opacity',0);
    }, function(){
        $('.add_char').css('right',-600);
        $('#add_atr').css('opacity',0.7);
    });

    /*if(!($('#feedback').is(':animated'))) {
        if (!clickFinish) {
            $('#side2').click(function () {
                if (!clickFinish) {
                    $('#feedback').animate({left: 380}, {duration: 1250, left: "easeOutBounce"});
                    $('#wrapForm').animate({left: 0}, {duration: 1250, left: "easeOutBounce"});
                    setTimeout(function () {
                        clickFinish = true;
                    }, 300);
                } else {
                    $('#feedback').animate({left: 0}, {duration: 1250, left: "easeOutBounce"});
                    $('#wrapForm').animate({left: -385}, {duration: 1250, left: "easeOutBounce"});
                    setTimeout(function () {
                        clickFinish = false;
                    }, 300);
                }
            });
        }
    }*/
});

//Creating slides and fill in it
function fillSlider(data){
    var offset = (new Date()).getTimezoneOffset()*60*1000;
    var country = data.city.country;
    var city = data.city.name;
    console.log(data.list.length);
    var cuTime;
    cuTime=new Date().getHours()+new Date().getMinutes()+new Date().getSeconds();
    // Вставка під історію старіших посиланb
    var dayPos = getDayPosition();
    /*switch(dayPos){
        case
    }*/
    for(var i = 0; i < 8-getDayPosition(); i+=1) {
        var localTime = new Date(data.list[i].dt*1000 + offset);
        console.log(localTime);
    }
    var countReq;
    var countOld = 8 - getDayPosition();
    switch(countOld) {
        case 1:case 2: countReq = 1;break;
        case 3:case 4: countReq = 2;break;
        case 5:case 6: countReq = 3;break;
        case 7: countReq = 4;break;
    }
    fillingFirstSlide(countReq);
    for(var i = getDayPosition(); i < data.list.length+getDayPosition()-8; i+=8) {
        var localTime = new Date(data.list[i].dt*1000 + offset);
        console.log(localTime);
        cuTime='';
        var markup = '<li class="slide">' +
                        '<table class="dayTable">' +
                            '<tr class="frow">'+
                                '<th width="300">'+
                                    '<img src="images/icons/'+ data.list[i+5].weather[0].icon +'.png" />'+
                                '</th>'+
                                '<th width="300">'+
                                    '<table class="inf">'+
                                        '<tr>'+
                                            '<th height="125" width="85" class="cityName">'+city+'</th>'+
                                            '<th height="125" width="200" class="time">'+cuTime+'</th>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td id="countr">'+country+'</td>'+
                                            '<td id="datatod">'+localTime.getDate()+'-'+((localTime.getMonth()<10)?('0'+localTime.getMonth()):(localTime.getMonth()))+'-'+localTime.getFullYear()+'</td>'+
                                        '</tr>'+
                                    '</table>'+
                                '</th>'+
                            '</tr>'+
                            '<tr class="srow">'+
                                '<td>'+
                                    '<table class="smtable">'+
                                        '<tr>'+
                                            '<th align="center">'+'Година'+'</th>'+
                                            '<th align="center">Температура</th>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td align="center">00:00</td>'+
                                            '<td align="center">'+Math.round(convertTemperature(data.list[i].main.temp))+'</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td align="center">06:00</td>'+
                                            '<td align="center">'+Math.round(convertTemperature(data.list[i+2].main.temp))+'</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td align="center">12:00</td>'+
                                            '<td align="center">'+Math.round(convertTemperature(data.list[i+4].main.temp))+'</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td align="center">18:00</td>'+
                                            '<td align="center">'+Math.round(convertTemperature(data.list[i+6].main.temp))+'</td>'+
                                        '</tr>'+
                                    '</table>'+
                                '</td>'+
                            '</tr>'+
                        '</table>'+
                    '</li>';
        $('.slidewrapper').append(markup);
    }
}

//Success geolocation
function geolocationSuccess(position) {
    var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
    var lang = 'ua';
    var currentDate = new Date();
    if (cache && cache.timestamp && cache.timestamp > currentDate.getTime() - 30 * 60 * 1000) {
        fillSlider(cache.data);
    } else {
        $.getJSON('http://api.openweathermap.org/data/2.5/forecast?lat=' + position.coords.latitude + '&lon=' +
            position.coords.longitude/* + '&units=metric' + '&lang=' + lang + '&callback=?'*//*'http://api.openweathermap.org/data/2.5/forecast?lat=' + position.coords.latitude + '&lon' + position.coords.longitude*/, function (response) {
            localStorage.weatherCache = JSON.stringify({
                timestamp: (new Date()).getTime(),
                data: response
            });
            geolocationSuccess(position);
        });
    }
}

//Failure geolocation
function geolocationFailure(positionError) {
    switch (positionError) {
        case 1: alert('Ви вирішили не надавати дані про своє місце знаходження.'); break;
        case 2: alert("Проблеми із з'єднанням або неможливо зв'язатись із службою визначення місцезнаходження з якихось інших причин. Повторіть запит через декілька хвилин."); break;
        case 3: alert("Не вдалось виконати запит протягом встаногвленого часу. Повторіть запит пізніше."); break;
        default: alert("Невідома помилка."); break;
    }
}

// Next Slide
function nextSlide(){
    currentSlide++;
    if(currentSlide > slides-2) {
        $('#rnav').css('display','none');
    } else{
        $('#lnav').css('display','block');
    }
    $('.slidewrapper').animate({left: -currentSlide*slideWidth},600);
    fillingAddAtr (currentSlide);
}

// Previous Slide
function prevSlide(){
    currentSlide--;
    if(currentSlide<=0) {
        $('#lnav').css('display','none');
    } else{
        $('#rnav').css('display','block');
    }
    $('.slidewrapper').animate({left: -currentSlide*slideWidth},600);
    fillingAddAtr (currentSlide);
}

// Next Day Position
function getDayPosition() {
    var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
    var date = new Date();
    var offset = date.getTimezoneOffset() * 60 * 1000;
    var localTime = new Date(cache.data.list[0].dt * 1000 + offset).getHours();
    var massOfHours = new Array(0, 3, 6, 9, 12, 15, 18, 21);
    var positionDay = massOfHours.length - massOfHours.indexOf(localTime);
    return positionDay;
}

// Filling First Slide
function fillingFirstSlide(counterOfRequest) {
    var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
    $('.frow th:first').html('<img src="images/icons/'+ cache.data.list[0].weather[0].icon +'.png" />');
    $('.frow th:eq(1) table tr:first').find('th:eq(0)').html(cache.data.city.name);
    setInterval (function(){
        var cuTime=new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
        $('.frow th:eq(1) table tr:first').find('th:eq(1)').html(cuTime);
    }, 1000);
    $('#countr').text(cache.data.city.country);
    var offset = (new Date()).getTimezoneOffset()*60*1000;
    var localTime = new Date(cache.data.list[0].dt*1000 + offset);
    var today = localTime.getDate()+'-'+((localTime.getMonth()<10)?('0'+localTime.getMonth()):(localTime.getMonth()))+'-'+localTime.getFullYear();
    $('#datatod').text(today);
    var Tds = $('.srow td>table tr').find('td:eq(1)');
    var k = 3*counterOfRequest;
    var i;
    for( i = 0; i < counterOfRequest; i++) {
        $(Tds[i]).html(convertTemperature(cache.data.list[0].main.temp)-k+'&degC');
        k-=3;
    }
    var p = 1;
    if(getDayPosition()%2===0) {p = 0;}
    for (var j = i; j < 4; j++, p+=2) {
        $(Tds[j]).html(convertTemperature(cache.data.list[p].main.temp)+'&degC');
    }
    fillingAddAtr(0);
}

// Filling add atributes table
function fillingAddAtr (currentSlide){
    var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
    var secondTd = $('.add_char tr').find('td:eq(1)');
    var elem = cache.data.list[(currentSlide+1)*8-getDayPosition()];
    $(secondTd[0]).html(convertTemperature(elem.main.temp_min)+'&degC');
    $(secondTd[1]).html(convertTemperature(elem.main.temp_max)+'&degC');
    $(secondTd[2]).html(elem.main.pressure+'Pa');
    $(secondTd[3]).html(elem.main.humidity+'%');
    $(secondTd[4]).html(elem.clouds.all+'%');
    $(secondTd[5]).html(elem.wind.speed+' m/s');
    $(secondTd[6]).html(windDirection(elem.wind.deg));
}

// Temperature Convert
function convertTemperature(kelvin){
    // Convert the temperature to either Celsius or Fahrenheit:
    return Math.round(kelvin - 273.15);
}

// Wind Direction
function windDirection(degree){
    var val=parseInt(degree/22.5 +0.5);
    var dirArray=["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirArray[(val%16)];
}