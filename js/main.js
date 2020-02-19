const DATA = {
    whichSite:       ['landing', 'multiPage', 'onlineStore'],
    price:           [4000, 8000, 26000],
    desktopTemplates:[50, 40, 30],
    adapt:           20,
    mobileTemplates: 15,
    editable:        10,
    metrikaYandex:   [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder:       500,
    dedlineDay:      [[2, 7],[3, 10],[7, 14]],
    dedlinePercent:  [20, 17, 15]
}

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total');
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum');

function showElem(elem) {
    elem.style.display = 'block';
}

function hideElem(elem) {
    elem.style.display = 'none';
}

function priceCalculation(elem){

    let result = 0,
        index  = 0,
        options = [];

    if(elem.name === 'whichSite'){
        for (const item of formCalculate.elements) {
            if(item.type === 'checkbox'){
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }

    for (const item of formCalculate.elements) {
        if(item.name === 'whichSite' && item.checked ){
            index = DATA.whichSite.indexOf(item.value);
        } else if(item.classList.contains('calc-handler') && item.checked)
            options.push(elem.value);
        
    }

    options.forEach(function(key){
        if(typeof(DATA[key]) === 'number'){
            if(key === 'sendOrder'){
               result += DATA[key];
            }else{
                result += DATA.price[index] * DATA[key]/100;
            }
        }else{
            if(key === 'desktopTemplates'){
                result += DATA.price[index] * DATA[key][index]/100;
            }else{
                result += DATA[key][index];
            }
        }
    });
    
    console.log(options);
    result += DATA.price[index];
    totalPriceSum.textContent = result;
}

function handlerCallBackForm(event) {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        if (target.checked) {
            showElem(fastRange);
        } else {
            hideElem(fastRange);
        }
    }

    if(target.classList.contains('calc-handler')){
        priceCalculation(target);
    }

}

startButton.addEventListener('click', function () {
    showElem(mainForm);
    hideElem(firstScreen);
});

endButton.addEventListener('click', function () {
    for (const elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElem(elem);
        }
    }

    showElem(total);
});

formCalculate.addEventListener('change', handlerCallBackForm);