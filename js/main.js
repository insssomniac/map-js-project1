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
                contentBody: balloonBody(reviews),
                contentFooter: coords
            });
        }
        else {
            myMap.balloon.close();
        }
    });

    reviews.reviews.forEach((obj) => {
        let placemark = new ymaps.Placemark(obj.coords);

        myMap.geoObjects.add(placemark);
    });
}

let reviews = {
    "reviews": [
        {
            userName: "Сергей",
            place: "Кафе",
            review: "Очень хорошее место!",
            date: "12.01.2020",
            coords: [55.764331253399725, 37.622104301452616]
        },
        {
            userName: "Дима",
            place: "Пятерочка",
            review: "Вкусное шампанское!",
            date: "31.12.2020",
            coords: [55.76316145474593, 37.62568992344673]
        },
        {
            userName: "Виталий",
            place: "ресторан",
            review: "Хорошо внутри, вкусная еда",
            date: "25.12.2020",
            coords: [55.7627017218261, 37.61594814030466]
        },
        {
            userName: "Елена",
            place: "ресторан",
            review: "Норм",
            date: "25.12.2020",
            coords: [55.76224198346906, 37.64040988652047]
        }
    ]
}

function balloonBody (data) {
    const source = document.getElementById("balloon-template").innerHTML;
    const template = Handlebars.compile(source);

    return template(data);
}

