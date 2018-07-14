let cl = 0; // клики
var point = []; //массив меток
var myMap; // карта
var multiRoute; //мультимаршрут
var cols; //список меток

function clik() { //пополняем массив меток
    if (point.length != 0) {
        if (point[point.length - 1].metka != document.getElementById("gorod").value) {
            point.push({ btn: "btn" + cl, metka: " " + document.getElementById("gorod").value });
            add("btn" + cl, " " + document.getElementById("gorod").value);
            col();
        } else {
            alert("Эй!");
        }
    } else {
        point.push({ btn: "btn" + cl, metka: document.getElementById("gorod").value });
        add("btn" + cl, " " + document.getElementById("gorod").value);
        col();
    }
}

function add(btn, title) { //создаём элемменты списка
    let div = document.createElement('div');
    div.id = btn;
    div.className = "btn";
    div.draggable = "true";
    body.appendChild(div);

    let myCheckNew = document.createElement('input');
    myCheckNew.type = "button";
    myCheckNew.name = btn;
    myCheckNew.value = '×';
    myCheckNew.addEventListener("click", btn_cl);
    div.appendChild(myCheckNew);

    div.appendChild(document.createTextNode(title));

    cl++;
}

function col() { //получаем все элементы списка и даём им события
    cols = document.querySelectorAll('.btn');
    cols.forEach(col => {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false)
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
    });
    ymaps.ready(label);
}

function btn_cl() { //удлаить элемент списка
    document.getElementById(this.name).remove();
    for (var i = 0; i < point.length; i++) {
        if (point[i].btn == this.name) {
            point.splice(i, 1);
            break;
        }
    }
    ymaps.ready(label);
}

function label() { //содаём мультимаршрут
    if (multiRoute)
        myMap.geoObjects.remove(multiRoute);
    var poi = point.map(point => point.metka)

    multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: poi,
        params: {},
    }, {
        boundsAutoApply: true,
        draggable: true
    });
    myMap.geoObjects.add(multiRoute);
}

function init() { // создаём карту
    myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 12,
        controls: ['geolocationControl']
    });
}

ymaps.ready(init);



// дропы
var dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault)
        e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDragEnd(e) {
    cols.forEach(col => {
        col.classList.remove('over');
    });
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (dragSrcEl != this) {
        let id1 = this.id;
        let id2 = dragSrcEl.id;

        document.getElementById("body").remove();

        let body = document.createElement('div');
        body.id = "body";
        body.className = "vh";
        con.appendChild(body);

        let h1 = document.createElement('h1');
        h1.innerText = "Метки";
        body.appendChild(h1);

        let i1 = point.findIndex(point => point.btn == id1);

        let i2 = point.findIndex(point => point.btn == id2);

        [point[i1], point[i2]] = [point[i2], point[i1]];

        point.forEach(point => { add(point.btn, point.metka) });

        col();
    }

    return false;
}


function enter(e) {
    if (e.keyCode == 13 && document.getElementById("gorod") == document.activeElement) {
        clik();
    }
}


addEventListener("keydown", enter);