$(function (){
    let f_width = 700; //ширина игрового поля
    let f_height = 700; //высота игрового поля

    let lives = 5; //жизни
    let isPaused = false; //пауза
    let trapsCount = 0; //количесво ловушек, в которые попали
    let monstersCount = 0; //количество монстров, с котороыми встретились

    //таймер
    let minutes = 0;
    let seconds = 0;

    $('#sec').text("0" + seconds);
    $('#min').text("0" + minutes);

    //стили игрового поля
    $('#container').css({width:f_width, height:f_height});
    $('#container').css("background-image", "url( ../media/"+localStorage.map+")");
    $('#container').fadeIn('slow');
    $('#container').removeClass('hidden');

    //стили игрока
    $('#player').css({width: 100, height: 100})
    $('#player').css("background-image", "url( ../media/player.gif)")
    $('#player').css("background-position", "center center")
    $('#player').css("background-size", "100px");
    $('#player').css("border", "1px solid red")
    $('#player').offset({left:10, top: 300});

    // вывод на экран
    $('#lives').text("Жизней осталось: " + lives); //количество жизней
    $('#text').text("Времени в игре: "); //таймер
    $('#login').text("Ваше имя: " + localStorage.login); //имя игрока

    //время текущее
    function timer() {
        if (!isPaused) { //если не пауза
            let currentTime = new Date(); //текущее время
            currentTime = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
            $('#time').text("Текущее время: " + currentTime); //вывод на экран
            moveMonsters(); //перемещение монстра
        }
        setTimeout(timer, 1000) //частота обновления 1 с
    }
    //внутриигровой таймер
    function inGameTimer() {
        if (!isPaused) { //если не пауза
            if (seconds < 60) { //если меньше 60 секунд
                seconds++; //секунды +1
            } else { //если больше 60 секунд
                seconds = 0; //секунды обнуляются
                minutes++; //минуты +1

                if (minutes <= 9) { //если меньше или = 9 минут
                    $('#min').text("0" + minutes); //форматирование и вывод на экран
                } else { //если больше 9
                    $('#min').text(minutes);  //форматирование и вывод на экран
                }
            }
            if (seconds <= 9) { //если меньше или = 9 секунд
                $('#sec').text("0" + seconds); //форматирование и вывод на экран
            } else { //если больше 9
                $('#sec').text(seconds);  //форматирование и вывод на экран
            }
        }
        setTimeout(inGameTimer, 1000) //частота обновления 1 с
    }

    timer(); //время текущее
    inGameTimer(); //время в игре

    $('body').on('keydown', function (event) { //по нажатию кнопки
        let top = $('#player').offset().top;
        let left = $('#player').offset().left;
        //движение героя вправо
        if (event.code === "ArrowRight") {
            if (isCharacterOnTheField(top, left, 600, 618, 1, 1)) { //если герой на карте
                left = left+50;
                $('#player').offset({left: left, top: top}); //смещениие
            }
            //когда герой доходит до правого края карты
            if ((left >= 600) && (lives > 0)) {
                gameOver("Вы победили!"); //игра заканчивается
            }
        }
        //движение героя влево
        if (event.code === "ArrowLeft") {
            if (isCharacterOnTheField(top, left, 600, 618, 20, 1)) { //если герой на карте
                left = left-50;
                $('#player').offset({left: left, top: top});//смещениие
            }
        }
        //движение героя вверх
        if (event.code === "ArrowUp") {
            if (isCharacterOnTheField(top, left, 600, 618, 1, 68)) { //если герой на карте
                top = top - 50;
                $('#player').offset({left: left, top: top});//смещениие
            }
        }
        //движение героя вниз
        if (event.code === "ArrowDown") {
            if (isCharacterOnTheField(top, left, 600, 568, 1, 1)) { //если герой на карте
                top = top + 50;
                $('#player').offset({left: left, top: top});//смещениие
            }

        }
        //esc - пауза
        if (event.key === "Escape") {
            pauseHandler();
        }
        //каждое нажатие кнопки проверяются координаты игрока на совпадение
        isCharacterInDanger($('#player').position().top, $('#player').position().left)
    })
    //добавление монстров на поле каждые 3 секунды
    function generateMonsters() {
        if (!isPaused) {
            $('.monster').removeClass('new-monster'); //у старых монстров удаляется класс для анимации
            $('.trap').removeClass('new-monster'); //у старых ловушек удаляется класс для анимации
            for (let i = 0; i < 10; i++) { //добавляется 10 монстров со случайными координатами
                $('#container').append("<img src='../media/monster.gif' border='1px solid red' class='monster new-monster danger' height='100px'  width='100px' style='position:absolute;top: "+randomInteger(0,650)+"px; left: "+randomInteger(0,650)+"px;'>");

            }
            for (let j = 0; j < 2; j++) { //добавляется 2 ловушки со случайными координатами
                $('#container').append("<img src='../media/naval-mine.png' border='1px solid red' class='trap new-monster danger' height='100px' width='100px' style='position:absolute;top: "+randomInteger(50,650)+"px; left: "+randomInteger(50,650)+"px;'>")
            }
            $('.new-monster').hide().fadeIn(); //анимация появления новых монстров
        }
        setTimeout(generateMonsters, 3000) //вызов каждые 3 секунды
    }
    setTimeout(generateMonsters, 100); //первый вызов добавления монстров

    // случайное число от min до (max+1)
    function randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    //Перемещение монстров по полю
    function moveMonsters() {
        if (!isPaused) {
            //коллекция монстров
            $('.monster').each(function () {
                $(this).addClass('animate-monster'); //добавляется класс для анимации
                //координаты одного монстра (исходные)
                let top = $(this).offset().top;
                let left = $(this).offset().left;
                //координаты одного монстра (новые)
                let newTop = top + randomInteger(-50, 50);
                let newLeft = left + randomInteger(-50, 50);
                //находится ли монстр до сих пор на поле
                if (isCharacterOnTheField(newTop, newLeft, 600, 600, 30, 30)) {
                    $(this).animate({left:newLeft, top :newTop}); //да, перемещается на новые координаты
                } else {
                    $(this).fadeOut("slow", function () { $(this).remove();}); //нет, удаляется из дом

                }
                $(this).removeClass('animate-monster'); //удалется класс для анимации

            })
            //при каждом перемещении проверяются координаты игрока и монстров на совпадение
            isCharacterInDanger($('#player').offset().top, $('#player').offset().left);
        }
    }
    //если персонаж на поле - true
    function isCharacterOnTheField(top, left, f_width, f_height, min_width, min_height) {
        return ((top <= f_height) && (left <= f_width)) && ((top >= min_height) && (left >= min_width));
    }
    //Проверка координат игрока и монстров/ловушек
    function isCharacterInDanger(top, left, key = "", playerSize = 100, dangerSize = 100) {
        //Коллекция монстров и ловушек
        $('.danger').each(function () {
            //координаты препятствия
            let dangerLeft = $(this).position().left;
            let dangerTop = $(this).position().top;
            //проверка совпадают ли координаты по Х
            if (((left >= dangerLeft) && (left <= (dangerLeft + dangerSize)))||(((left + playerSize) >= dangerLeft) && ((left+playerSize) <= (dangerLeft + dangerSize)))) {
                // проверка совпадают ли координаты по У
                if (((top + playerSize) >= dangerTop) && ((top+playerSize) <= (dangerTop + dangerSize))) {
                    return characterIsInDanger($(this));
                }
                // проверка совпадают ли координаты по У
                else if ((top <= (dangerTop + dangerSize))&&(top >= dangerTop)){
                    return characterIsInDanger($(this));
                }
            }
        })
    }
    //Если герой встретил монстра/попал в ловушку
    function characterIsInDanger(target) {
        oneDeath(); //одна смерть
        if($(target).hasClass('monster')) { //если встретил монстра
            monstersCount++;
        } else if ($(target).hasClass('trap')) {//если попал в ловушку
            trapsCount++;
        }
        $(target).fadeOut("fast", function () { $(target).remove();}); //препятствие удаляется
        return true;
    }
    //Смерть
    function oneDeath() {
        if (lives > 0) {
            lives--;
            $('#lives').text("Жизней осталось: " + lives);
        } else {
            gameOver();
        }
    }
    //Конец игры
    function gameOver(message = "Вы умерли") {
        // Запись данных в локальное хранилище
        localStorage.setItem("message", message);
        localStorage.setItem("monstersCount", monstersCount);
        localStorage.setItem("trapsCount", trapsCount);
        localStorage.setItem("inGameTimer", minutes+":"+seconds);
        localStorage.setItem("lives", lives);
        //переадресация
        $.fadeOut('slow',  window.location.href = "../pages/end.html");

    }
    //Пауза
    function pauseHandler() {
        $('#player', '.monster').css("background-image", "none");
        isPaused = !isPaused;

        let extension;
        //Если пауза, картинки заменяются на статические, и обратно
        if (isPaused) {
            extension = "png";
        } else {
            extension = "gif";
        }
        $('#player').css("background-image", "url( ../media/player."+extension+")");
        $('.monster').attr("src", " ../media/monster."+extension);
        return isPaused;
    }

})
