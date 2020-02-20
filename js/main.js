const DAY_STRING = ['день', 'дня', 'дней'];

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
    totalPriceSum = document.querySelector('.total_price__sum'),
    adapt = document.getElementById('adapt'),
    mobileTemplates = document.getElementById('mobileTemplates'),
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value');


function declOfNum(n, titles) {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
            0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
      }

function showElem(elem) {
    elem.style.display = 'block';
}

function hideElem(elem) {
    elem.style.display = 'none';
}

function renderTextContent(total, site, maxDay, minDay){

    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);
}

function priceCalculation(elem){

    let result = 0,
        index  = 0,
        options = [],
        site = '',
        maxDedlineDay = DATA.dedlineDay[index][1],
        minDedlineDay = DATA.dedlineDay[index][0];

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
            site = item.dataset.site;
            maxDedlineDay = DATA.dedlineDay[index][1];
            minDedlineDay = DATA.dedlineDay[index][0];
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
    
   
    result += DATA.price[index];

    renderTextContent(result, site, maxDedlineDay, minDedlineDay);

   
}

function handlerCallBackForm(event) {
    const target = event.target;

    if(adapt.checked){
        mobileTemplates.disabled = false;
    }else{
        mobileTemplates.disabled = true;
        mobileTemplates.checked = false;
    }

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