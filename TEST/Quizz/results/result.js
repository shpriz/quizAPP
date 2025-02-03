// import profileResults from './profileResults.js' //импортируем профили и описание результатов тестирования


//const interest = [];
//const abilities = [];
//const sumH = [];

////const relationship = ['Cлабо выраженный интерес к профилю', 'Умеренный интерес к профилю', 'Повышенный интерес к профилю'];
//const color = ["#5D8EE5", "#F46d63"];
//const profiles = ['Творч.', 'Информ.-техн.', 'Пр.-техн.', "Фин.-эк.", 'Соц.-гум.', "Инж.-техн.", 'Естеств.-науч.', 'Военно-спорт.'];
// var profiles = [];

//const sum = arr => arr.reduce((res, el) => res + (Array.isArray(el) ? sum(el) : el), 0);


$(document).ready(function () {

    let prof = [];

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy + ' г.';

    // let username = localStorage.getItem('name') //$.cookie('name');
    let lastname = localStorage.getItem('firstname') //$.cookie('firstname');
    // let otchestvo = localStorage.getItem('otchestvo') // $.cookie('otchestvo');
    let message = localStorage.getItem('message') //$.cookie('message');
    // let datepicker = localStorage.getItem('datepicker')
    // let classes = localStorage.getItem('classes')
    // let age = localStorage.getItem('age')
    // let school = localStorage.getItem('school')
    // let schoolend = localStorage.getItem('schoolend')
    // let city = localStorage.getItem('city')
    // let gender = localStorage.getItem('gender')
    //
    // let email = localStorage.getItem('email')

    for (let i = 0; i < 10; ++i) {
        prof.push(parseFloat(localStorage.getItem('prof' + i)))
    }

    console.log("original interest = ", interest)
    console.log("sumH = ", sumH)
    console.log("prof = ", prof)


    function saveresultTofile(){

        let element = document.getElementById("invoice");

        let opt = {
            margin: [10, 20, 10, 10],
            filename: 'профиль_' + username + '.pdf',
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'l'
            }
        };

        // Choose the element and save the PDF for our user.
        html2pdf()
            .set(opt)
            .from(element)
            .save();




    }


    function myArrayMax(arr) {

        let len = arr.length
        let max = -Infinity;
        let i = 0;
        while (len--) {
            if (arr[len] > max) {
                max = arr[len];
                i = len;
            }
        }
        return max;
    }

    // var topValues = [myArrayMax(interest)]
    //  var topValuesAb = [myArrayMax(abilities)]

    // console.log(interest, topValues)

    // function find(needle, haystack) {
    //     var results = [];
    //     var idx = haystack.indexOf(needle);
    //     while (idx !== -1) {
    //         results.push(idx);
    //         idx = haystack.indexOf(needle, idx + 1);
    //     }
    //     return results;
    // }

    // var indices = [];


    // topValues.forEach(function(value, index, array) {
    //     indices = find(value, interest)

    // })
    //console.log(topValues)
    // console.log(indices)

    // var indicesAb = [];
    // topValuesAb.forEach(function(value, index, array) {
    //     indicesAb = find(value, abilities)

    // })
    //  sessionStorage.clear(); // очищаем все данные 


    // $('#today').html(function () {
    //     return 'Дата тестирования: <strong>' + today + '</strong>';
    // })
    //
    // $('#massage').html(function () {
    //     return message
    // })
    //
    // $('#users').html(function () {
    //     return 'Испытуемый: <strong>' + lastname + "</strong>"
    // })
    // $('#city').html(function () {
    //     if (city != undefined | city != NaN)
    //         return 'Город:   <strong>' + city + '</strong>' + gender
    // })
    // $('#email').html(function () {
    //     if (email != undefined | email != NaN)
    //         return 'Электронная почта:   <strong><a href="mailto:' + email + '">' + email + '</a></strong>'
    // })
    // $('#classes').html(function () {
    //     if (classes != undefined | classes != NaN)
    //         return 'Класс:   <strong>' + classes + '</strong>'
    // })
    //
    // $('#school').html(function () {
    //     if (schoolend != undefined | schoolend != NaN)
    //         return 'Школа <strong> ' + school //+ ' </strong> закончена   <strong>  ' + schoolend + '  </strong> лет назад'
    // })
    // $('#age').html(function () {
    //     if (age != undefined | age != NaN)
    //         return 'Возраст: <strong>' + age + ' лет</strong>'
    // })
    //
    // $('#birthday').html(function () {
    //     if (age != undefined | age != NaN) {
    //         return 'Дата рождения: <strong>' + datepicker + '</strong>'
    //     } else {
    //         return 'Дата рождения: <strong>' + 'не определена' + '</strong>'
    //     }
    // })
    //
    // function profileTitle(num) {
    //     return "ПРОФИЛЬ: " + profileResults[num].profileTitle;
    // }

    // function profileComment(num) {
    //     return profileResults[num].comment;
    // }
    // function groupProfessions(num) {
    //     var str = ''
    //     for (var item of profileResults[num].groupProfession) {
    //         str += '<p><mark>' + item.name + '</mark></p>'
    //         str += '<p>' + item.text + '</p>'
    //     }
    //     return str;
    // }

    // function typeProfession(num) {
    //     return profileResults[num].typicalProfession;
    // }

    // function sredstvaTrudaProfessions(num) {
    //     return profileResults[num].sredstvaTruda;
    // }

    // function osnUmeniya(num) {
    //     return profileResults[num].umeniya;
    // }

    // function schoolsSubjects(num) {
    //     return profileResults[num].schoolsSubjects;
    // }

    function rounded(number, from) {
        var num = number / from * 100;


        return ' (' + num.toFixed(2) + ' %)'
    }

    $('#insertData').html(function () {

        var str = '<div class="row mt-3">'

        str += '</br>' //'<div><h4><span class="badge bg-info">Тест «ПРОФИЛЬ»</span></h4></div>'

        var medic = prof[0] + prof[1] + prof[7]

        var econom = prof[6] + prof[8]
        str += '<div class="col w-50"><ul class="list-group">'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        str += 'ФИЗИКА И МАТЕМАТИКА'
        str += '<span class="badge bg-primary rounded-pill">' + prof[0] + ' ' + rounded(prof[0], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">'
        str += 'ХИМИЯ И БИОЛОГИЯ'
        str += '<span class="badge bg-primary rounded-pill">' + prof[1] + rounded(prof[1], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        str += 'РАДИОТЕХНИКА И ЭЛЕКТРОНИКА'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[2] + rounded(prof[2], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">'
        str += 'МЕХАНИКА И КОНСТРУИРОВАНИЕ'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[3] + rounded(prof[3], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        str += 'ГЕОГРАФИЯ И ГЕОЛОГИЯ'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[4] + rounded(prof[4], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">'
        str += 'ЛИТЕРАТУРА И ИСКУССТВО'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[5] + rounded(prof[5], 5) + ' /5</span>'
        str += '</li>'
        str += '</ul></div>'
        str += '<div class="col w-50"><ul class="list-group">'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        str += 'ИСТОРИЯ И ПОЛИТИКА'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[6] + rounded(prof[6], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">'
        str += 'ПЕДАГОГИКА'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[7] + rounded(prof[7], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        str += 'ПРЕДПРИНИМАТЕЛЬСТВО И ДОМОВОДСТВО'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[8] + rounded(prof[8], 5) + ' /5</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">'
        str += 'СПОРТ И ВОЕННОЕ ДЕЛО'
        str += ' <span class="badge bg-primary rounded-pill">' + prof[9] + rounded(prof[9], 5) + ' /5</span>'
        str += '</li>'

        str += '<li class="list-group-item d-flex justify-content-between align-items-center">'
        str += 'МЕДИЦИНА'
        str += ' <span class="badge bg-primary rounded-pill">' + medic + rounded(medic, 15) + ' /15</span>'
        str += '</li>'
        str += '<li class="list-group-item d-flex justify-content-between align-items-center list-group-item-primary">'
        str += 'СОЦИАЛЬНО-ЭКОНОМИЧЕСКИЙ'
        str += ' <span class="badge bg-primary rounded-pill">' + econom + rounded(econom, 10) + ' /10</span>'
        str += '</li>'
        str += '</ul></div>'
        str += '</div>'


        return str;
    })

    // $('#insertData2').html(function() {
    //     var str = '<div><h4><span class="badge bg-info">Лучшее предложение</span></h4></div>' + createTestResults(compareTest(interest, abilities)); //createTestResults(compareTest(interest, abilities)); //'<div><h4><span class="badge bg-info">Совпадения</span></h4></div>' + createTestResults(compareTest(interest, abilities));
    //     str += '<div><h4><span class="badge bg-info">Мои интересы</span></h4></div>' + createTestResults(indices);
    //     str += '<div><h4><span class="badge bg-info">Мои способности</span></h4></div>' + createTestResults(indicesAb);
    //     return str
    // })


    // function createTestResults(indecs) {
    //     var str = '';
    //     if (indecs.length === 0) {
    //         str = '<div  class="row mb-3">' +
    //             '<div  class="col">' +
    //             '<span  class="badge rounded-pill bg-light text-dark">Существенных совпадений между способностями и интересами не обнаружено.'
    //         str += '</span>' +
    //             ' </div>' +
    //             '</div>'
    //     } else {
    //         for (var index of indecs) {
    //             //console.log(index)
    //             str += '<div  class="row mb-3">' +
    //                 '<div  class="col">' +
    //                 ' <h3><span  class="badge rounded-pill bg-light text-dark">'
    //             str += profileTitle(index)
    //             str += '</span></h3>' +
    //                 ' </div>' +
    //                 '</div>' +
    //                 '<div  class="row mb-4">' +
    //                 '     <div  class="col">' +
    //                 '<span id="profileComment">'
    //             str += profileComment(index);
    //             str += '</span>' +
    //                 '</div>' +
    //                 ' </div>' +

    //                 '<div  class="row mb-3">' +
    //                 ' <div  class="col">' +
    //                 '<h5>В рамках данного профиля выделяют следующие группы профессий:</h5>' +
    //                 '</div>' +
    //                 '</div>' +

    //                 '<div  class="row">' +
    //                 '<div  class="col" id="groupProfessions">'
    //             str += groupProfessions(index)
    //             str += '</div>' +
    //                 ' </div>' +

    //                 ' <div  class="row">' +
    //                 '<div  class="col-3">' +
    //                 '<p  class="text-end">Типичные профессии</p>' +
    //                 '</div>' +
    //                 '<div  class="col text-start">';
    //             str += typeProfession(index);

    //             str += '</div>' +
    //                 '</div>' +

    //                 '<div  class="row mt-3">' +
    //                 '<div  class="col-3 text-end">' +
    //                 '<p  class="text-end">Средства труда профессии</p>' +
    //                 '</div>' +
    //                 '<div  class="col" id="sredstvaTrudaProfessions">'
    //             str += sredstvaTrudaProfessions(index)
    //             str += '</div>' +
    //                 '</div>' +

    //                 '<div  class="row mt-3">' +
    //                 ' <div  class="col-3 text-end">' +
    //                 '<p  class="text-end">Основные способности и умения</p>' +
    //                 ' </div>' +
    //                 '<div  class="col" id="osnUmeniya">'
    //             str += osnUmeniya(index)
    //             str += '</div>' +
    //                 '</div>' +

    //                 '<div  class="row mt-4">' +
    //                 ' <div  class="col-3 text-end">' +
    //                 ' <p  class="text-end">Школьные предметы</p>' +
    //                 '</div>' +
    //                 '<div  class="col" id="schoolsSubjects">'
    //             str += schoolsSubjects(index)
    //             str += '</div>' +
    //                 '</div>' +
    //                 '</div>'
    //         }
    //     }
    //     return str
    // }
    /*
        var chart1 = JSC.chart('chartDiv1', {
            debug: true,
            type: 'horizontal column',
            title: {
                position: 'center',
                label: {
                    text: 'Результаты тестирования "способности". (Результаты в процентах)',
                    style: { fontSize: 15, fontWeight: 'normal' }
                }
            },

            legend: {
                position: 'bottom',
                template: '%icon,%name',

            },
            legend_visible: true,
            xAxis: {


                id: 'stackedAxis',
                label_text: 'Volume by product',
                orientation: 'opposite',
                scale_type: 'stacked'

                //  spacingPercentage: 0.05,
                //   defaultTick: { padding: 10 }

            },

            defaultSeries: {
                opacity: 0.44,
                defaultPoint_marker: {
                    outline: { width: 5 },
                    size: 6,

                }
            },
            series: getPointsInterest(sumH)

        });
    */


    // // круговая диаграмма
    // var chart2 = JSC.chart('chartDiv2', {
    //     debug: true,
    //     type: 'radar spider ',
    //     title: {
    //         position: 'center',
    //         label: {
    //             text: 'Результаты тестирования "способности". (Результаты в процентах)',
    //             style: { fontSize: 15, fontWeight: 'normal' }
    //         }
    //     },

    //     legend: {
    //         position: 'bottom',
    //         template: '%icon,%name',

    //     },
    //     legend_visible: true,
    //     xAxis: {
    //         spacingPercentage: 0.05,
    //         defaultTick: { padding: 10 }

    //     },

    //     defaultSeries: {
    //         opacity: 0.44,
    //         defaultPoint_marker: {
    //             outline: { width: 5 },
    //             size: 6,

    //         }
    //     },
    //     series: getPointsAbilities(interest, abilities)

    // });

    saveresultTofile()


    setTimeout(function () {


            window.location.href = '../../quizz/saveResults.html';
            //your code to be executed after 1 second
        },
        3500);
})
