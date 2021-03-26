ymaps.ready(init);
function init(){
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 14
    }, {
        balloonMaxWidth: 350,
        balloonMaxHeight: 500,
        searchControlProvider: 'yandex#search'
    });

    myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
            myMap.balloon.open(coords, {
                contentBody:
                    '<div class="balloon-content">' +
                    '<div class="reviews">' +
                    '  <div class="reviews__review review">' +
                    '    <div class="review__header">' +
                    '      <span class="review__name">Сергей</span>' +
                    '      <span class="review__place-date">Кафе 12.01.2020</span>' +
                    '    </div>' +
                    '    <div class="review__text">Очень хорошее место!</div>' +
                    '  </div>' +
                    '  <div class="reviews__review review">' +
                    '    <div class="review__header">' +
                    '      <span class="review__name">Дима</span>' +
                    '      <span class="review__place-date">Пятерочка 31.12.2020</span>' +
                    '    </div>' +
                    '    <div class="review__text">Вкусное шампанское!</div>' +
                    '  </div>' +
                    '  <div class="reviews__review review">' +
                    '    <div class="review__header">' +
                    '      <span class="review__name">Дима</span>' +
                    '      <span class="review__place-date">Пятерочка 31.12.2020</span>' +
                    '    </div>' +
                    '    <div class="review__text">Вкусное шампанское!</div>' +
                    '  </div>' +
                    '</div>' +
                    '<h1 class="balloon-title">Отзыв:</h1>' +
                    '<form class="form" action="#">' +
                    '  <label class="form__block">' +
                    '    <input type="text" name="name" placeholder="Укажите ваше имя" class="form__input" required="">' +
                    '  </label>' +
                    '  <label class="form__block">' +
                    '    <input type="text" name="place" placeholder="Укажите место" class="form__input" required="">' +
                    '  </label>' +
                    '  <label class="form__block">' +
                    '    <textarea name="comment" class="form__input form__input--textarea" required="" placeholder="Оставить отзыв"></textarea>' +
                    '  </label>' +
                    '  <button type="submit" class="btn btn--orange">Добавить</button>' +
                    '</form>' +
                    '</div>'
            });
        }
        else {
            myMap.balloon.close();
        }
    });

}