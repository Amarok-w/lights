window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('service-worker.js')
  }
})


let isConnect = navigator.onLine;
let coords;

function connectionTest() {

  function connectionError() {
    const screen = document.querySelector('.connection-error-screen');
    const button = document.querySelector('.connection-error-screen__reload-but');

    screen.style.display = 'flex';
    button.addEventListener('click', () => {
      location.reload();
    })
  }

  function connectionTrue() {
    const startScreen = document.querySelector('.start-screen');
    const mapScreen = document.querySelector('.map-screen');
    const checkScreen = document.querySelector('.check-screen');
    const endScreen = document.querySelector('.end-screen');
    
    startScreen.style.display = 'block'


    const startBut = document.querySelector('.start-screen__but');
    startBut.addEventListener('click', () => {
      startScreen.style.display = 'none'
      mapScreen.style.display = 'block'
    })

    const mapBut = document.querySelector('.map-screen__but');
    mapBut.addEventListener('click', () => {
      if (coords) {
        mapScreen.style.display = 'none'
        checkScreen.style.display = 'block'
      }
    })

    const anotherText = document.querySelector('.check-screen__text-input');
    const checkForm = document.querySelector('.check-screen__form');
    const radioButtons = document.querySelectorAll('.check-screen__radio input');
    const nextBtn = document.querySelector('.check-screen__but');

    let formValidate = false;

    checkForm.addEventListener('change', el => {

      formValidate = true;

      if (el.target.id != '') {
        anotherText.removeAttribute('disabled')
        // toggleHelp = !toggleHelp;
      } else {
        anotherText.setAttribute('disabled', '');
      }
    })

    nextBtn.addEventListener('click', () => {
      if (formValidate) {
        checkScreen.style.display = 'none'
        endScreen.style.display = 'block'
      }
    })

    // ---
    



  }

  if (!isConnect) {
    connectionError();
  } else {
    connectionTrue();
  }
}

// map

// ymaps = window.ymaps;
ymaps.ready(init);

function init() {
  let myPlacemark;
  let myMap = new ymaps.Map('map', {
    center: [55.76, 37.64],
    zoom: 10
  }, {
    searchControlProvider: 'yandex#search'
  })

  myMap.events.add('click', function (e) {
    coords = e.get('coords');

    // Если метка уже создана – просто передвигаем ее.
    if (myPlacemark) {
      myPlacemark.geometry.setCoordinates(coords);
    }
    // Если нет – создаем.
    else {
      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      // Слушаем событие окончания перетаскивания на метке.
      myPlacemark.events.add('dragend', function () {
        getAddress(myPlacemark.geometry.getCoordinates());
      });
    }
    getAddress(coords);
  });

  // Создание метки.
  function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {
      iconCaption: 'поиск...'
    }, {
      preset: 'islands#violetDotIconWithCaption',
      draggable: true
    });
  }

  // Определяем адрес по координатам (обратное геокодирование).
  function getAddress(coords) {
    myPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);

      myPlacemark.properties
        .set({
          // Формируем строку с данными об объекте.
          iconCaption: [
            // Название населенного пункта или вышестоящее административно-территориальное образование.
            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
            // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
          ].filter(Boolean).join(', '),
          // В качестве контента балуна задаем строку с адресом объекта.
          balloonContent: firstGeoObject.getAddressLine()
        });
    });
  }

}

// map

connectionTest();
// console.log(navigator.onLine);