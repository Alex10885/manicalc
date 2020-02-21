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
    desktopTemplates = document.getElementById('desktopTemplates'),
    editable = document.getElementById('editable'),
    adaptValue = document.querySelector('.adapt_value'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    desktopTemplateValue = document.querySelector('.desktopTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    calDescription = document.querySelector('.calc-description'),
    metrikaYandex = document.getElementById('metrikaYandex'),
    analyticsGoogle = document.getElementById('analyticsGoogle'),
    sendOrder = document.getElementById('sendOrder')
    cardHead = document.querySelector('.card-head'),
    totalPrice = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset');


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

function dopOptionsString() {
    //Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
    let str = '';

    if(metrikaYandex.checked || analyticsGoogle.checked ||sendOrder.checked){
        str+= 'Подключим';

        if(metrikaYandex.checked){
            str+= ' Яндекс Метрику';

            if(analyticsGoogle.checked && sendOrder.checked){
                str+= ', Гугл Аналитику и отправку заявок на почту.';
                return;
            }
            if(analyticsGoogle.checked || sendOrder.checked){
                str+= ' и';
            }
        }

        if(analyticsGoogle.checked){
            str += ' Гугл Аналитику';

            if(sendOrder.checked){
                str+= ' и';
            }
        }

        if(sendOrder.checked){
            str+= ' отправку заявок на почту';
        }
        str+= '.';
    }

    return str;
}

function renderTextContent(total, site, maxDay, minDay){

    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
    desktopTemplateValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calDescription.textContent =  `
    
    Сделаем ${site}${adapt.checked ? 
    ', адаптированный под мобильные устройства и планшеты' : ''}.
    ${editable.checked ? `Установим панель админстратора, 
    чтобы вы могли самостоятельно менять содержание на сайте без разработчика.` : ''}
    ${dopOptionsString()}
    
    `;
    
}
function priceCalculation(elem = {}){

    let result = 0,
        index  = 0,
        options = [],
        site = '',
        maxDedlineDay = DATA.dedlineDay[index][1],
        minDedlineDay = DATA.dedlineDay[index][0], 
        overPersent = 0;

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
        } else if(item.classList.contains('calc-handler') && item.checked){
            options.push(elem.value);
        } else if (item.classList.contains('want-faster')&& item.checked){
            const overDay = maxDedlineDay - rangeDeadline.value;
            overPersent = overDay * (DATA.dedlinePercent[index]/100);
        } 
    }

    result += DATA.price[index];

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
    
   
    

     
    
    //console.log(result + result * overPersent);

    result += result * overPersent;

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

        priceCalculation(target);
    }

    if(target.classList.contains('calc-handler')){
        priceCalculation(target);
    }

}

function moveBackTotal(){
    if(document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200){
        totalPrice.classList.remove('totalPriceBottom');
        firstFieldset.after(totalPrice);
        window.removeEventListener('scroll', moveBackTotal);
        window.addEventListener('scroll', moveTotal);
        
    }
}

function moveTotal(){
    if(document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200){
        totalPrice.classList.add('totalPriceBottom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
}

startButton.addEventListener('click', function () {
    showElem(mainForm);
    hideElem(firstScreen);
    window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', function () {
    for (const elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET') {
            hideElem(elem);
        }
    }

    cardHead.textContent = 'Заявка на разработку сайта';
    hideElem(totalPrice);
    showElem(total);

});

formCalculate.addEventListener('change', handlerCallBackForm);

priceCalculation();