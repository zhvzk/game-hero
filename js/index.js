$.ajax({
    url:"../media/maps.json",
    dataType: "text",
    method: "get",
    success: function (response) {
        //Получение карт из JSON
        $('#map-container').append('<span>Выберите карту</span><br>');
        let result = JSON.parse(response);
        for (let key in result) {
            //Радиобаттоны для выбора карты
            $('#map-container')
                .append('<input type="radio" id="map'+key+'" name="map" value="'+result[key]+'" class="onchange" onchange="chooseMap(map'+key+')">')
                .append('<label for="map'+key+'"><img src="../media/'+result[key]+'" height="100"></label>')
        };

    },

})
//Если поле заполнено, показывается следующее
function display(item, length = "", target = "") {
    if ((length !== "")&&(target !== "")) {
        if ($(target).val().trim().length >= length) {
            $(item).removeClass('hidden');
        }
    } else {
        $(item).removeClass('hidden');
    }
}
//начало игры
function play() {
    $('#form').fadeOut('slow',  window.location.href = "../pages/playfield.html");
}
//Выбор карты. Запись выбора в локальное хранилище
function chooseMap(target) {
    localStorage.setItem($(target).attr('name'), $(target).val().trim());
}


