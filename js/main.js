let myMap;
let geoObjects = [];

ymaps.ready(init);

function init() {
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
        } else {
            myMap.balloon.close();
        }
    });

    let placemarkCoords = [];
    for (let i = 0; i < reviews.reviews.length; i++) {
        placemarkCoords[i] = reviews.reviews[i].coords.join();
    }

    const uniqueCoordsSet = new Set(placemarkCoords);
    const uniqueCoords = [...uniqueCoordsSet];

    for (let i = 0; i < uniqueCoords.length; i++) {
        geoObjects[i] = createPlacemark(uniqueCoords[i].split(','));
    }

    let clusterer = new ymaps.Clusterer({
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        clusterBalloonContentLayoutWidth: 500,
        clusterBalloonLeftColumnWidth: 150,
        clusterBalloonContentLayoutHeight: 500,
    });

    myMap.geoObjects.add(clusterer);
    clusterer.add(geoObjects);

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
        
        localStorage.setItem('reviews', JSON.stringify(reviews));

        const existingPlacemark = findExistingPlacemark(clusterer.getGeoObjects(), coords);
        if (existingPlacemark) {
                clusterer.remove(existingPlacemark);
                clusterer.add(createPlacemark(coords));
        } else {
            clusterer.add(createPlacemark(coords));
        }

        myMap.balloon.close();
    })
}

function createPlacemark(coords) {
    let placemark = new ymaps.Placemark(coords, {
        balloonContent: balloonBody(placemarkReviewsFilter(coords), coords)
    });

    ymaps.geocode(coords).then((res) => {
        placemark.properties.set({
            balloonContentHeader: [
                res.geoObjects.get(0).getPremise(),
                res.geoObjects.get(0).getThoroughfare(),
                res.geoObjects.get(0).getPremiseNumber()
            ].filter(Boolean).join(', ')
        })
    });


    placemark.events.add('balloonopen', () => {
        const placemarkCoords = placemark.geometry.getCoordinates()
        placemark.properties.set('balloonContent', balloonBody(placemarkReviewsFilter(placemarkCoords), placemarkCoords));
    });

    return placemark;
}

function balloonBody(data, coords) {
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

function getReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || {"reviews": []};
}

function findExistingPlacemark (array, coords) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].geometry._coordinates.join() === coords.join()) {
            return array[i];
        }
    }

    return false;
}

