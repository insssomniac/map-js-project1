let myMap;

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

    let reviews = getReviews();

    myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen()) {
            const coords = e.get('coords');
            myMap.balloon.open(coords, {
                contentBody: balloonBody(0, coords),
            });
        }
        else {
            myMap.balloon.close();
        }
    });

    reviews.reviews.forEach((obj) => {
        addPlacemark(obj.coords);
    });
}

function addPlacemark(coords) {
    let placemark = new ymaps.Placemark(coords, {
        balloonContent: balloonBody(placemarkReviewsFilter(coords), coords)
    });

    placemark.events.add('balloonopen', () => {
        const placemarkCoords = placemark.geometry.getCoordinates()
        placemark.properties.set('balloonContent', balloonBody(placemarkReviewsFilter(placemarkCoords), placemarkCoords));
    });

    myMap.geoObjects.add(placemark);
}

function balloonBody (data, coords) {
    const source = document.getElementById("balloon-template").innerHTML;
    const template = Handlebars.compile(source);

    return template({data: data, coords: coords});
}

function placemarkReviewsFilter(coordinates) {
    let reviews = getReviews();

    let placemarkReviews = {
        "reviews": []
    };

    let elements = reviews.reviews.filter((item) => {
        return item.coords.join() === coordinates.join();
    });

    placemarkReviews.reviews = placemarkReviews.reviews.concat(elements);
    return placemarkReviews;
}

function placemarkExists(coordinates) {
    const reviews = getReviews();

    let elements = reviews.reviews.filter((item) => {
        return item.coords.join() === coordinates.join();
    });

    return elements.length > 0;
}

function getReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || {"reviews": []};
}

document.addEventListener('submit', (e) => {
    e.preventDefault();
    let reviews = getReviews();

    const name = e.target.querySelector('#name').value;
    const place = e.target.querySelector('#place').value;
    const review = e.target.querySelector('#comment').value;
    const coords = e.target.querySelector('#submit').getAttribute('data-coords').split(',');
    const currentDate = new Date();
    const date = `${currentDate.getDate()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`;

    reviews.reviews.push({
        userName: name,
        place: place,
        review: review,
        date: date,
        coords: coords
    });

    if (!placemarkExists(coords)) {
        addPlacemark(coords);
    }

    localStorage.setItem('reviews', JSON.stringify(reviews));
    myMap.balloon.close();
})
