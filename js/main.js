window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('service-worker.js')
  }
})


let isConnect = isOnline();
let coords;

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);
function isOnline(event) {
  var condition = navigator.onLine ? "online" : "offline";
  return condition;
}

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
    const backBtn = document.querySelector('.end-screen__back-btn');
    
    backBtn.addEventListener('click', () => {
      endScreen.style.display = 'none';
      startScreen.style.display = 'flex';
    })

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
        // let inputForm = document.querySelector('.check-screen__form');
        let isCheck;
        let elements = document.querySelectorAll('.check-screen__radio');
        let elementsInput = document.querySelectorAll('.check-screen__radio__input')
        for (let i = 0; i < elementsInput.length; i++) {
          if (elementsInput[i].checked) {
            isCheck = elements[i].childNodes[2].textContent;
          }
        }

        formResult(coordForLog, isCheck);
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

let coordForLog;
function formResult(coords, type) {


    let logInfo = {
      x: coords[0],
      y: coords[1],
      type: type
    }

  console.log(logInfo);

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
    // suka 
    coordForLog = coords;

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
