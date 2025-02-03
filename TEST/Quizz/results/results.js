// import profileResults from './profileResults.js' //импортируем профили и описание результатов тестирования


const interest = [];
const abilities = [];
const sumH = [];
//const prof = [];

const relationship = ['Интенресы', 'Способности'];
//const relationship = ['Cлабо выраженный интерес к профилю', 'Умеренный интерес к профилю', 'Повышенный интерес к профилю'];
const color = ["#5D8EE5", "#F46d63"];
const profiles = ['Творч.', 'Информ.-техн.', 'Пр.-техн.', "Фин.-эк.", 'Соц.-гум.', "Инж.-техн.", 'Естеств.-науч.', 'Военно-спорт.'];
// let profiles = [];

const sum = arr => arr.reduce((res, el) => res + (Array.isArray(el) ? sum(el) : el), 0);



$(document).ready(function () {


    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy + ' г.';

    // let username = localStorage.getItem('name') //$.cookie('name');
    let lastname = localStorage.getItem('firstname') //$.cookie('firstname');
    // let otchestvo = localStorage.getItem('otchestvo') // $.cookie('otchestvo');
    // let mes/sage = localStorage.getItem('message') //$.cookie('message');
    // let datepicker = localStorage.getItem('datepicker')
    // let classes = localStorage.getItem('classes')
    // let age = localStorage.getItem('age')
    // let school = localStorage.getItem('school')
    // let schoolend = localStorage.getItem('schoolend')
    // let city = localStorage.getItem('city')
    // let gender = localStorage.getItem('gender')

    // let email = localStorage.getItem('email')


    for (let i = 0; i < 8; ++i) {
        interest.push(parseInt(localStorage.getItem('sss' + i)))
        abilities.push(parseInt(localStorage.getItem('abilities' + i))) // масштабируем интересы в 2 раза
        //  console.log("interest [" + i + "] = " + interest[i])
        sumH.push(parseFloat(localStorage.getItem('sumH' + i)))

    }

    console.log("original interest = ", interest)
    console.log("sumH = ", sumH)


    let tempInterest = interest;
    // let topValues = interest.sort((a, b) => b - a).slice(0, 3); // определяем количество интересов = 3 с максимальнвм баллом
    // console.log("temp =", tempInterest)




    let chart1;

    let chart;

    // var pdf, page_section, HTML_Width, HTML_Height, top_left_margin, PDF_Width, PDF_Height, canvas_image_width, canvas_image_height;


    //
    // function calculatePDF_height_width(selector, index) {
    //     page_section = $(selector).eq(index);
    //     HTML_Width = page_section.width();
    //     HTML_Height = page_section.height();
    //     top_left_margin = 15;
    //     PDF_Width = HTML_Width + (top_left_margin * 2);
    //     PDF_Height = (PDF_Width * 1.2) + (top_left_margin * 2);
    //     canvas_image_width = HTML_Width;
    //     canvas_image_height = HTML_Height;
    // }
    //

//
//
//     //Generate PDF
//     function generatePDF() {
//         pdf = "";
//         $("#downloadbtn").hide();
//         $("#genmsg").show();
//         html2canvas($(".print-wrap:eq(0)")[0], {
//             allowTaint: true
//         }).then(function (canvas) {
//
//             calculatePDF_height_width(".print-wrap", 0);
//             var imgData = canvas.toDataURL("image/png", 1.0);
//             pdf = new jsPDF('l', 'mm', [PDF_Width, PDF_Height]);
//             pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, HTML_Width, HTML_Height);
//
//
//             // html2canvas($(".print-wrap:eq(1)")[0], { allowTaint: true }).then(function(canvas) {
//
//             //     calculatePDF_height_width(".print-wrap", 1);
//
//             //     var imgData = canvas.toDataURL("image/png", 1.0);
//             //     pdf.addPage(PDF_Width, PDF_Height);
//             //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, HTML_Width, HTML_Height);
//
//             // });
//
//
//             // calculatePDF_height_width(".print-wrap", 2);
//
//             // var imgData = canvas.toDataURL("image/png", 1.0);
//             // pdf.addPage(PDF_Width, PDF_Height);
//             // pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, HTML_Width, HTML_Height);
//
//
//             //console.log((page_section.length-1)+"==="+index);
//             setTimeout(function () {
//
//                 //Save PDF Doc
//                 pdf.save('ФП_' + username + ".pdf");
//
// //                //Generate BLOB object
// //                var blob = pdf.output("blob");
// //
// //                //Getting URL of blob object
// //                var blobURL = URL.createObjectURL(blob);
// //
// //                //Showing PDF generated in iFrame element
// //                var iframe = document.getElementById('sample-pdf');
// //                iframe.src = blobURL;
// //
// //                //Setting download link
// //                //  var downloadLink = document.getElementById('pdf-download-link');
// //                //  downloadLink.href = blobURL;
// //
// //                $("#sample-pdf").slideDown();
// //
// //
// //                $("#downloadbtn").show();
// //                $("#genmsg").hide();
//             }, 0);
//         });
//     };
//




    $("a.saveButton").on("click", function (e) {
        // document.getElementById("nothingtoprint").style.display = "";

        generatePDF()
        // window.location.href = '../saveResults.html'
        // chart.print()
        // const element = document.getElementById("invoice");

        // var opt = {
        //     margin: [20, 20, 20, 10],
        //     filename: username + '.pdf',
        //     image: { type: 'jpg', quality: 0.98 },
        //     html2canvas: { scale: 1, dpi: 192, letterRendering: false },
        //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'p' }
        // };
        // // Choose the element and save the PDF for our user.
        // // 
        // // console.log(element)
        // html2pdf()
        //     .set(opt)
        //     .from(element)
        //     .save();


    })

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

    let topValues = [myArrayMax(interest)]
    let topValuesAb = [myArrayMax(abilities)]

    // console.log(interest, topValues)

    function find(needle, haystack) {
        let results = [];
        let idx = haystack.indexOf(needle);
        while (idx !== -1) {
            results.push(idx);
            idx = haystack.indexOf(needle, idx + 1);
        }
        return results;
    }

    let indices = [];


    topValues.forEach(function (value, index, array) {
        indices = find(value, interest)

    })
    //console.log(topValues)
    // console.log(indices)

    let indicesAb = [];
    topValuesAb.forEach(function (value, index, array) {
        indicesAb = find(value, abilities)

    })
    //  sessionStorage.clear(); // очищаем все данные 


    $('#today').html(function () {
        return 'Дата тестирования: <strong>' + today + '</strong>';
    })

    // $('#massage').html(function () {
    //     return message
    // })

    $('#users').html(function () {
        return 'Испытуемый: <strong>' + lastname + "</strong>"
    })
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


    function profileTitle(num) {
        return "Результаты: " + profileResults[num].profileTitle;
    }

    function profileComment(num) {
        return profileResults[num].comment;
    }

    function groupProfessions(num) {
        let str = ''
        for (let item of profileResults[num].groupProfession) {
            str += '<p><mark>' + item.name + '</mark></p>'
            str += '<p>' + item.text + '</p>'
        }
        return str;
    }

    function typeProfession(num) {
        return profileResults[num].typicalProfession;
    }

    function sredstvaTrudaProfessions(num) {
        return profileResults[num].sredstvaTruda;
    }

    function osnUmeniya(num) {
        return profileResults[num].umeniya;
    }

    function schoolsSubjects(num) {
        return profileResults[num].schoolsSubjects;
    }

    function rounded(number, from) {
        let num = number / from * 100;


        return ' (' + num.toFixed(2) + ' %)'
    }


    $('#insertData2').html(function () {
        let str = '<div><h4><span class="badge bg-info">Лучшее предложение</span></h4></div>' + createTestResults(compareTest(interest, abilities)); //createTestResults(compareTest(interest, abilities)); //'<div><h4><span class="badge bg-info">Совпадения</span></h4></div>' + createTestResults(compareTest(interest, abilities));
        str += '<div><h4><span class="badge bg-info">Мои интересы</span></h4></div>' + createTestResults(indices);
        str += '<div><h4><span class="badge bg-info">Мои способности</span></h4></div>' + createTestResults(indicesAb);
        return str
    })


    function createTestResults(indecs) {
        let str = '';
        if (indecs.length === 0) {
            str = '<div  class="row mb-3">' +
                '<div  class="col">' +
                '<span  class="badge rounded-pill bg-light text-dark">Существенных совпадений между способностями и интересами не обнаружено.'
            str += '</span>' +
                ' </div>' +
                '</div>'
        } else {
            for (let index of indecs) {
                //console.log(index)
                str += '<div  class="row mb-3">' +
                    '<div  class="col">' +
                    ' <h3><span  class="badge rounded-pill bg-light text-dark">'
                str += profileTitle(index)
                str += '</span></h3>' +
                    ' </div>' +
                    '</div>' +
                    '<div  class="row mb-4">' +
                    '     <div  class="col">' +
                    '<span id="profileComment">'
                str += profileComment(index);
                str += '</span>' +
                    '</div>' +
                    ' </div>' +

                    '<div  class="row mb-3">' +
                    ' <div  class="col">' +
                    '<h5>В рамках данного профиля выделяют следующие группы профессий:</h5>' +
                    '</div>' +
                    '</div>' +

                    '<div  class="row">' +
                    '<div  class="col" id="groupProfessions">'
                str += groupProfessions(index)
                str += '</div>' +
                    ' </div>' +

                    ' <div  class="row">' +
                    '<div  class="col-3">' +
                    '<p  class="text-end">Типичные профессии</p>' +
                    '</div>' +
                    '<div  class="col text-start">';
                str += typeProfession(index);

                str += '</div>' +
                    '</div>' +

                    '<div  class="row mt-3">' +
                    '<div  class="col-3 text-end">' +
                    '<p  class="text-end">Средства труда профессии</p>' +
                    '</div>' +
                    '<div  class="col" id="sredstvaTrudaProfessions">'
                str += sredstvaTrudaProfessions(index)
                str += '</div>' +
                    '</div>' +

                    '<div  class="row mt-3">' +
                    ' <div  class="col-3 text-end">' +
                    '<p  class="text-end">Основные способности и умения</p>' +
                    ' </div>' +
                    '<div  class="col" id="osnUmeniya">'
                str += osnUmeniya(index)
                str += '</div>' +
                    '</div>' +

                    '<div  class="row mt-4">' +
                    ' <div  class="col-3 text-end">' +
                    ' <p  class="text-end">Школьные предметы</p>' +
                    '</div>' +
                    '<div  class="col" id="schoolsSubjects">'
                str += schoolsSubjects(index)
                str += '</div>' +
                    '</div>' +
                    '</div>'
            }
        }
        return str
    }

    function compareTest(left, right) {
        let indics = [];

        let h = 2
        for (let index = 0; index < left.length; index++) {

            // for (let index2 = 0; index2 < right.length; index2++) {

            let minL = Math.min(left) - h // percentage(left[index], left) * 0.95;

            let maxL = Math.max(left) + h // percentage(left[index], left) * 1.05;

            let minR = Math.min(right) - h // percentage(right[index], right) * 0.95;

            let maxR = Math.max(right) + h // percentage(right[index], right) * 1.05;


            console.log("index", minL, minR, maxL, maxR);
            let sleva = percentage(left[index], left);
            let sprava = percentage(right[index], right);

            if (sleva === sprava |
                sleva < maxR & sleva > minR |
                sprava < maxL & sprava > minL) {

                indics.push(index);
            }
            //}
        }

        console.log(indics);

        return indics;


    }

    function getAbilitiesLevel(data, i) {
        const interest = [0, 1, 2];

        let interestLevel = 0;
        if (data[i] < 5) {
            interestLevel = interest[0];
        }
        if (data[i] >= 5 && data[i] <= 8) {
            interestLevel = interest[1];
        }
        if (data[i] > 8) {
            interestLevel = interest[2];
        }

        return interestLevel;
    }

    function getSummaBallov(item, profileIndex) {

        let i = profileIndex;
        let str = 0;
        let summa = 0;


        //let item = data;


        switch (i) {

            case 0: // Творческий
                if (item <= 7) str = 1;
                if (item > 7 & item <= 9) str = 2;
                if (item > 9 & item <= 12) str = 3;
                if (item > 12 & item <= 15) str = 4;
                if (item > 15 & item <= 18) str = 5;
                if (item > 18 & item <= 21) str = 6;
                if (item > 21 & item <= 23) str = 7;
                if (item > 23 & item <= 26) str = 8;
                if (item > 26 & item <= 29) str = 9;
                if (item > 30) str = 10;


                summa = str * 100 / 30

                break;

            case 1: // информац-технолог
                if (item <= 1) str = 1;
                if (item === 2) str = 2;
                if (item > 2 & item <= 4) str = 3;
                if (item === 5) str = 4;
                if (item === 6) str = 5;
                if (item === 7) str = 6;
                if (item > 7 & item <= 9) str = 7;
                if (item === 10) str = 8;
                if (item === 11) str = 9;
                if (item > 11) str = 10;
                summa = str * 100 / 11

                break;

            case 2: // инженерно-технич
                if (item <= 2) str = 1;
                if (item > 2 & item <= 4) str = 2;
                if (item === 5) str = 3;
                if (item > 5 & item <= 8) str = 4;
                if (item > 8 & item <= 10) str = 5;
                if (item === 11) str = 6;
                if (item === 12) str = 7;
                if (item === 13) str = 8;
                if (item === 14) str = 9;
                if (item > 14) str = 10;

                summa = str * 100 / 15

                break;

            case 3: //финансово-экономич
                if (item <= 1) str = 1;
                if (item === 2) str = 2;
                if (item === 3) str = 3;
                if (item === 4) str = 4;
                if (item > 4 & item <= 6) str = 5;
                if (item > 6 & item <= 8) str = 6;
                if (item === 9) str = 7;
                if (item > 9 & item <= 11) str = 8;
                if (item > 11 & item <= 13) str = 9;
                if (item > 13) str = 10;

                summa = str * 100 / 15

                break;

            case 4: // соц-гум
                if (item <= 3) str = 1;
                if (item === 4) str = 2;
                if (item === 5) str = 3;
                if (item === 6) str = 4;
                if (item === 7) str = 5;
                if (item === 8) str = 6;
                if (item === 9) str = 7;
                if (item === 10) str = 8;
                if (item > 10 & item <= 12) str = 9;
                if (item > 12) str = 10;
                summa = str * 100 / 15

                break;

            case 5: // естеств-научн
                if (item <= 2) str = 1;
                if (item === 3) str = 2;
                if (item > 3 & item <= 5) str = 3;
                if (item > 5 & item <= 8) str = 4;
                if (item > 8 & item <= 10) str = 5;
                if (item === 11) str = 6;
                if (item === 12) str = 7;
                if (item === 13) str = 8;
                if (item === 14) str = 9;
                if (item === 15) str = 10;

                summa = str * 100 / 15

                break;
            case 6: // военно-спортивный
                if (item <= 1) str = 1;
                if (item > 1 & item <= 3) str = 2;
                if (item > 3 & item <= 5) str = 3;
                if (item === 6) str = 4;
                if (item > 6 & item <= 8) str = 5;
                if (item === 9) str = 6;
                if (item > 9 & item <= 11) str = 7;
                if (item === 12) str = 8;
                if (item === 13) str = 9;
                if (item > 13) str = 10;

                summa = str * 100 / 15

                break;


            default:
                str = 0;
                break;
        }
        return str; // summa;
    }


    function getInterest(data, i) {
        const interest = [0, 1, 2];

        let interestLevel = 0;
        //  let i = index // data.indexOf(data[index]);
        //  console.log("index", index, "i= ", i)
        switch (i) {
            case 0:
                if (data[i] <= 9) {
                    interestLevel = interest[0]; //слабовыраженный интерес
                }
                if (data[i] > 9 && data[i] <= 19) { // умеренный интерес
                    interestLevel = interest[1];
                }
                if (data[i] > 19) {
                    interestLevel = interest[2]; //повыашенный интерес
                }
                break;
            case 1:
                if (data[i] <= 9) {
                    interestLevel = interest[0];
                }
                if (data[i] > 9 && data[i] <= 18) {
                    interestLevel = interest[1];
                }
                if (data[i] > 18) {
                    interestLevel = interest[2];
                }
                break;
            case 2:
                if (data[i] <= 11) {
                    interestLevel = interest[0];
                }
                if (data[i] > 11 && data[i] <= 19) {
                    interestLevel = interest[1];
                }
                if (data[i] > 19) {
                    interestLevel = interest[2];
                }
                break;
            case 3:
                if (data[i] <= 10) {
                    interestLevel = interest[0];
                }
                if (data[i] > 10 && data[i] <= 19) {
                    interestLevel = interest[1];
                }
                if (data[i] > 19) {
                    interestLevel = interest[2];
                }
                break;
            case 4:
                if (data[i] <= 9) {
                    interestLevel = interest[0];
                }
                if (data[i] > 9 && data[i] <= 19) {
                    interestLevel = interest[1];
                }
                if (data[i] > 19) {
                    interestLevel = interest[2];
                }
                break;
            case 5:
                if (data[i] <= 9) {
                    interestLevel = interest[0];
                }
                if (data[i] > 9 && data[i] <= 20) {
                    interestLevel = interest[1];
                }
                if (data[i] > 20) {
                    interestLevel = interest[2];
                }
                break;
            case 6:
                if (data[i] <= 9) {
                    interestLevel = interest[0];
                }
                if (data[i] > 9 && data[i] <= 19) {
                    interestLevel = interest[1];
                }
                if (data[i] > 19) {
                    interestLevel = interest[2];
                }
                break;
            case 7:
                if (data[i] <= 11) {
                    interestLevel = interest[0];
                }
                if (data[i] > 11 && data[i] <= 21) {
                    interestLevel = interest[1];
                }
                if (data[i] > 21) {
                    interestLevel = interest[2];
                }
                break;

        }

        return interestLevel;

    }



    function getPointsAbilities(interestD, abilitiesD) {

        let point = [];

        point[0] = {
            type: 'area',
            name: 'Интересы',
            points: []
        }

        point[1] = {
            type: 'area', //'column',
            name: 'Способности',
            points: []
        }


        interestD.forEach(function (value, index, array) {
            let pointss = {};
            pointss.name = profiles[index];
            pointss.y = percentage(value, array); // getSummaBallov(value, index); // * 100 / sum(array);

            //  pointAb.name = profiles[index];
            //  pointAb.y = array[index];

            if (pointss.name !== undefined && pointss.y !== undefined) {
                point[0].points.push(pointss);
                //   point[1].points.push(pointAb);
            }
        })

        abilitiesD.forEach(function (value, index, array) {

            let pointss = {};
            //  pointss.name = profiles[index];
            //   pointss.y = array[index];

            pointss.name = profiles[index];
            //let tmp = getSummaBallov(array[index], index) 
            let tmp = percentage(value, array) //getSummaBallov(value, index) // * 100 / sum(array);

            pointss.y = tmp
            if (pointss.name !== undefined && pointss.y !== undefined) {
                //  point[0].points.push(pointss);
                point[1].points.push(pointss);
            }
        })
        // console.log(point)
        return point;

    }

    function percentage(val, array) {
        return val * 100 / sum(array)


    }

    function getDoublePoints(inter, abil) {

        let point = [];

        point[0] = {
            name: relationship[0],
            id: "interest",
            color: color[0],
            points: []
        }

        point[1] = {
            name: relationship[1],
            id: "abilities",
            color: color[1],
            points: []
        }

        for (let i = 0; i < 8; i++) {
            let points = {};
            let pointa = {};

            points.x = profiles[i];
            points.y = inter[i] // * 100 / sum(inter);

            if (points.x !== undefined && points.y !== undefined) {
                point[0].points.push(points)
            }
            //  console.log(0, points)

            pointa.x = profiles[i];

            pointa.y = abil[i] // * 100 / sum(abil);
            if (points.x !== undefined && points.y !== undefined) {
                point[1].points.push(pointa)
            }


            //   console.log(1, points)

        }



        return point;

    }

    function getPoints(mas1, mas2) {

        let point = [{
                name: 'Способности',
                yAxis: 'nomralAxis',
                defaultPoint_label: {
                    visible: true,
                    color: 'blue'
                },
                points: [
                    mas1.forEach(function (value, index, array) {

                        points.x = profiles[index];
                        points.y = getSummaBallov(array, index); // * 100 / sum(array) ///

                    })

                    /* { x: 'Q1', y: 530 },
                     { x: 'Q2', y: 740 },
                     { x: 'Q3', y: 667 },
                     { x: 'Q4', y: 838 }*/
                ],
                id: 's1'
            },
            {
                name: 'Hammer',
                yAxis: 'stackedAxis',
                points: [
                    {
                        x: 'Q1',
                        y: 325
                    },
                    {
                        x: 'Q2',
                        y: 367
                    },
                    {
                        x: 'Q3',
                        y: 382
                    },
                    {
                        x: 'Q4',
                        y: 371
                    }
                ]
            }
        ] // end point


        mas1.forEach(function (value, index, array) {
            let points = {};
            let i = getInterest(array, index);
            // let j = getAbilities(abilitiesD, g)

            points.x = profiles[index];
            points.y = getSummaBallov(array, index); // * 100 / sum(array) ///
            //console.log(points)
            if (points.x !== undefined && points.y !== undefined) {
                point[i].points.push(points)
            }
        })
        return point;
    }

    function getPointsInterest(interestD) {

        let point = [];
        let k = 0;
        for (let k = 0; k < 3; k++) {
            point[k] = {
                name: relationship[k],
                id: "interest" + k,
                color: color[k],
                points: []
            }
            // console.log(point[k])
        }
        interestD.forEach(function (value, index, array) {
            let points = {};
            let i = getInterest(array, index);
            // let j = getAbilities(abilitiesD, g)

            points.x = profiles[index];
            points.y = value; // getSummaBallov(array, index); // * 100 / sum(array) ///
            //console.log(points)
            if (points.x !== undefined && points.y !== undefined) {
                point[i].points.push(points)
            }
        })


        /*
                for (let g in interestD) {
                    let points = {};
                    let i = getInterest(interestD, g);
                    // let j = getAbilities(abilitiesD, g)

                    points.x = profiles[g];
                    points.y = interestD[g];
                    if (points.x !== undefined && points.y !== undefined) {
                        point[i].points.push(points)
                    }

                }

        */

        // console.log(point)
        return point;

    }

    /*
        var chart = JSC.chart('chartDiv3', {
            debug: true,
            type: 'horizontalColumn',
            title_label_text: 'Результаты тестирования',
            title: {
                position: 'center',
                label: {
                    // text: 'Результаты тестирования',
                    style: {fontSize: 26, fontWeight: 'normal'}
                }
            },

            legend: {
                position: 'bottom'
            },
            // { x: profiles[0], y: gepoints(0, data) },
            yAxis: {label_text: 'Сумма баллов за тест'},
            xAxis_label_text: 'Профиль',
            series: getPoints(data, 3)

        });
    */






    chart = JSC.chart('chartDiv', JSC.merge({
        type: 'horizontal column solid',
        title_label: {
            text: 'Результаты тестирования "Интересы и Способности", балл'
        },
        palette: 'fiveColor33',

        legend: {
            template: '%icon %name',
            position: ' ',
            layout: 'vertical'
        },
        defaultAxis: {
            defaultTick: {
                line_visible: true
            }
        },

        yAxis: {
            alternateGridFill: 'none',
            // label_text: 'Сумма баллов за тест',
            /* markers: [{
                 value: [10, 20]
             }],*/

            scale: {
                range: {
                    min: 0, // minimum will be 0, unless there is a lower value.
                    max: 12,
                    padding: 0.2

                },
                interval: 1,

                scale_range: {
                    padding: .2,
                    min: 0
                },




            },
            /*   customTicks: [{
                        value: [0, 4],
                        //label_text: ' ур.',
                        gridLine: { width: 1, color: 'black' },
                        label_text: 'Пониженный интерес'
                    },
                    {
                        value: [4, 8],
                        // label_text: 'Уровень неопределенности',
                        gridLine: { width: 1, color: 'black' },
                        label_text: 'Умененный интерес'


                    },
                    {
                        value: [8, 12],
                        gridLine: { width: 1, color: 'black' },
                        label_text: 'Повышенный интерес'

                        //  label_text: 'Пониженный уровень'
                    }
                ],
            */
        },
        xAxis: {
            label_text: 'Профиль',


        },

        defaultPoint: {
            label: {
                text: '%value'
            },
            outline_width: 2
        },
        series: getDoublePoints(interest, abilities) //getPointsInterest(interest)
    }, ));


    // количество баллов 0.5
    // 

    chart1 = JSC.chart('chartDiv1', JSC.merge({
        debug: false,

        type: 'horizontal column',
        title_label_text: 'достоверность',
        legend: {
            visible: false
        },
        yAxis: {
            label_text: '',
            markers: [{
                    value: [0 /*'3/1/2017'*/ , 3 /*'3/30/2017'*/ ],
                    color: ['#00fa9a', .5],
                    // label_text: 'Vacation'
                }
                // { value: 392, color: '#02a423', legendEntry_name: 'Max Quarter', line_width: 2 }
            ],
            scale: {
                range: {
                    min: 0, // minimum will be 0, unless there is a lower value.
                    max: 12,
                    padding: 0.2

                },
                interval: 1,

                scale_range: {
                    padding: .2,
                    min: 0
                },



            },
        },
        xAxis_label_text: '',
        defaultPoint: {
            label: {
                text: '%value'
            },
            outline_width: 2
        },

        series: getPointsInterest(sumH)
    }));


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

    // generatePDF();
    //    setTimeout(function () {
    //        
    //
    //        //your code to be executed after 1 second
    //    }, 1000);



    // setTimeout(function () {
    //
    //
    //     window.location.href = '../saveResultsT.html'
    //     //your code to be executed after 1 second
    // }, 3500);



    // 
    //document.getElementById("nothingtoprint").style.display = "none";
    // document.getElementById("nothingtoprint").hidden = true;

})
