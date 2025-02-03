$(document).ready(function () {

    function convertToCSV(objArray) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line !== '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }

    function exportCSVFile(headers, items, fileTitle) {
        if (headers) {
            items.unshift(headers);
        }

        // Convert Object to JSON
        let jsonObject = JSON.stringify(items);

        let csv = convertToCSV(jsonObject);

        let exportedFilenmae = fileTitle + '.csv' || 'export.csv';

        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    var headers = {
            'test_id': '',
            "answer_id": 0,
            'text': '',
            'values': 0,
            'summa_ballov': 0,
            'result': ""
        };




    let lastname = localStorage.getItem('name') //$.cookie('firstname');
    let quizAnswers = JSON.parse(localStorage.getItem('quizAnswers'));
    let summa = []

    for (let i = 0; i < 5; ++i) {
        summa.push(parseInt(localStorage.getItem('sss' + i)))
        console.log(summa)
    }

    console.log("quizAnswers = ", quizAnswers)

    let str = []

    if (summa[1] >= 13 && summa[1] <= 23) {
        quizAnswers.summa_ballov = summa[1];
        quizAnswers.result = 'высокий уровень ухода за полостью рта у жителей психоневрологических интернатов';
        str.push( quizAnswers.result)
    }

    if (summa[1] >= 24 && summa[1] <= 34) {
        quizAnswers.summa_ballov = summa[1];
        quizAnswers.result = 'удовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов';
        str.push( quizAnswers.result)
    }
    if (summa[1] >= 35 && summa[1] <= 45) {
        quizAnswers.summa_ballov = summa[1];
        quizAnswers.result = 'неудовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов';
        str.push( quizAnswers.result)
    }
    if (summa[1] >= 46) {
        quizAnswers.summa_ballov = summa[1];
        quizAnswers.result = 'низкий уровень ухода за полостью рта у жителей психоневрологических интернатов';
        console.log(quizAnswers.summa_ballov );
        str.push( quizAnswers.result)
        }

    // TEST 2
    if (summa[2] >= 10 && summa[2] <= 18) {
        quizAnswers.summa_ballov = summa[2];
        quizAnswers.result = 'высокий уровень ухода за полостью рта у жителей психоневрологических интернатов';
        str.push( quizAnswers.result)
    }
    if (summa[2] >= 19 && summa[2] <= 28) {
        quizAnswers.summa_ballov = summa[2];
        quizAnswers.result = 'удовлетворительный уровень  оказания стоматологической помощи жителям психоневрологических интернатов';
        str.push( quizAnswers.result)

    }
    if (summa[2] >= 29 && summa[2] <= 35) {
        quizAnswers.summa_ballov = summa[2];
        quizAnswers.result = 'неудовлетворительный уровень  оказания стоматологической помощи жителям психоневрологических интернатов';
        str.push( quizAnswers.result)
    }

    if (summa[2] >= 36) {
        quizAnswers.summa_ballov = summa[2];
        quizAnswers.result = 'низкий уровень ухода за полостью рта у жителей психоневрологических интернатов';
        str.push( quizAnswers.result)
    }


    // TEST 3
    if (summa[3] >= 8 && summa[3] <= 15) {
        quizAnswers.summa_ballov = summa[3];
        quizAnswers.result = 'большинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему';
        str.push( quizAnswers.result)
    }
    if (summa[3] >= 16 && summa[3] <= 23) {
        quizAnswers.summa_ballov = summa[3];
        quizAnswers.result = 'меньшинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему';
        str.push( quizAnswers.result)
    }
    if (summa[3] >= 24) {
        quizAnswers.summa_ballov  = summa[3];
        quizAnswers.result = 'жители психоневрологических интернатов не ведут здоровый образ жизни или близкий к нему';
        str.push( quizAnswers.result)
    }

    // TEST 4
    if (summa[4] >= 4 && summa[4] <= 8) {
        quizAnswers.summa_ballov  = summa[4];
        quizAnswers.result = 'высокий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
        str.push( quizAnswers.result)
    }
    if (summa[4] >= 9 && summa[4] <= 13) {
        quizAnswers.summa_ballov  = summa[4];
        quizAnswers.result = 'удовлетворительный уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
        str.push( quizAnswers.result)
    }
    if (summa[4] >= 14) {
        quizAnswers.summa_ballov = summa[4];
        quizAnswers.result = 'низкий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
        str.push( quizAnswers.result);
    }

    $('div.showresults').html( function (e){

        console.log(str)
        let otvet =''

        for (let idx =0; idx < str.length; idx++){
            otvet += '<p>Тест ' + parseFloat(idx + 1) + '<br>' + str[idx] + '</p><br>'
        }
        return  '<div> <p>' + otvet + '</p></div>'
        }

    )



//     Оценка результатов.
//         Каждому из вариантов ответа на вопрос соответствует определённое количество баллов (от 1 до 4). По окончании тестирования баллы каждого раздела суммируются, полученная сумма баллов оценивается по специальной шкале.
//         Оценочная шкала для блока 1 “Уход за полостью рта у жителей психоневрологических интернатов”:
//     13 баллов - 23 баллов - высокий уровень ухода за полостью рта у жителей психоневрологических интернатов;
//     24 балла - 34 баллов - удовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов;
//     35 - 45 - неудовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов;
//     46 баллов и более - низкий уровень ухода за полостью рта у жителей психоневрологических интернатов;
//
//     Оценочная шкала для блока 2 “Стоматологическая помощь, оказываемая жителям психоневрологического интерната и ее качество”:
//     10 баллов - 18 баллов - высокий уровень оказания стоматологической помощи жителям психоневрологических интернатов;
//     19 баллов - 28 баллов - удовлетворительный уровень  оказания стоматологической помощи жителям психоневрологических интернатов;
//     29 баллов - 35 баллов - неудовлетворительный уровень  оказания стоматологической помощи жителям психоневрологических интернатов;
//     36 баллов и более - низкий уровень  оказания стоматологической помощи жителям психоневрологических интернатов;
//
//     Оценочная шкала для блока 3 “Образ жизни и питание жителей психоневрологических интернатов”
// 8 баллов - 15 баллов - большинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему.
//     16 баллов - 23 балла - меньшинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему.
//     24 балла и более -  жители психоневрологических интернатов не ведут здоровый образ жизни или близкий к нему.
//
//     Оценочная шкала для блока 4 “Уход за полостью рта у лиц, находящихся в отделении милосердия (отделении паллиативной помощи)”:
//     4 балла - 8 баллов - высокий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия
//     9 баллов - 13 баллов - удовлетворительный уровень ухода за полостью рта у лиц, находящихся в отделении милосердия;
//     14 и более баллов - низкий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия


    let itemsFormatted = [];

// format the data
    quizAnswers.forEach((item) => {
        itemsFormatted.push({
            test_id: item.test_id, // remove commas to avoid errors,
            answer_id: item.answer_id,
            text: item.text,
            values: item.values,
           summa_ballov: item.summa_ballov,
           result: item.result
        });
    });

    let fileTitle = name; // or 'my-unique-title'

    exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download

});