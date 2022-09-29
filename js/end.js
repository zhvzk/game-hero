$(function (){
    //вывод статистики
    $('#message').text(localStorage.getItem('message'));
    $('#monsters').text("Количество монстров, с которыми вы столкнулись: " + localStorage.getItem('monstersCount'));
    $('#traps').text("Количество ловушек, в которые вы попали: " + localStorage.getItem('trapsCount'));
    $('#lives').text("Оставшиеся жизни: " + localStorage.getItem('lives'));
    $('#inGameTimer').text("Время в игре: " + localStorage.getItem('inGameTimer'));

})
//новая игра
function startOver() {
    $.fadeOut('slow',  window.location.href = "../pages/playfield.html");
}