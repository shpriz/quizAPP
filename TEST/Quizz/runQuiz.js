;
//import { questions as Questions } from './questions.js'

// function displayWithOutPicture(question) {
//     // console.log('displayWithOutPicture')
//
//
//     let str = '';
//     str += '<div class="d-flex justify-content-center">' + '<div class="card position-relative w-75">' +
//         '<div class="card-body">' +
//         '<h5 class="card-title">' + question.qText + '</h5>' +
//
//         '<div class="card-text">'
//
//     if (question.qAnswers[0].text.length <= 20) {
//         str += '<div class="d-flex justify-content-center">' +
//             '<div class="row btn-group mt-3" role="group" aria-label="Answers buttons">'
//
//         for (let i = 0; i < question.qAnswers.length; i++) {
//             str += '<button id="btn' + i + '"value="' + question.qAnswers[i].ans + '" type="button" class="col btn btn-outline-primary mr-2" style="width: 160px;">' + question.qAnswers[i].text + '</button>'
//         }
//
//         str += '</div>' + '</div>'
//     } else {
//         str += '<div class="d-flex justify-content-center">' +
//             '<div class="row btn-group-vertical w-100 " role="group" aria-label="Answers buttons">'
//         for (let i = 0; i < question.qAnswers.length; i++) {
//             str += '<button id="btn' + i + '"value="' + question.qAnswers[i].ans + '"  type="button" class="col btn btn-outline-primary btn-block mt-3 mr-2">' + question.qAnswers[i].text + '</button>'
//         }
//         str += '</div>' + '</div>'
//     }
//
//
//     str += '   <p></p>' +
//         '</div>' +
//         //  '<div class="row mt-4"><a href="#" id="nextBtn" class="col-4 btn btn-primary stretched-link">Go somewhere</a></div' +
//
//         '</div>' + '</div>'
//
//
//
//     return str;
// }


    class Quiz {

        displayQuestion(id, spisokVoprosov, picture) {

            $('div.quizz-container').html(function () {
                // console.log(spisokVoprosov[id]);


                let str = '<div class="card border-light w-75 h-100">'

                str += '<div class="card-body" style="height: 18rem;">' +
                    '<h4 class="card-title mb-3">' + '</h4>' +
                    '<p class="card-text h5 mb-5">Раздел ' + parseInt(spisokVoprosov[id].test_id + 1) + ': ' + spisokVoprosov[id].profile + '.</p>' +
                    '<p class="card-text h3 mb-5">' + spisokVoprosov[id].text + '</p>'
                //'<div class="d-grid gap-3 row-cols-1 row-cols-md-2" role="group" aria-label="Button group with nanswers">' +

                str += '<div class="row text-center">'
                let j = 0;
                for (let o of spisokVoprosov[id].answers) {

                    if (o <= 20) {
                        str += '<div class="d-flex justify-content-center">' +
                            '<div class="row btn-group mt-3" role="group" aria-label="Answers buttons">'

                        // for (let i = 0; i < spisokVoprosov[id].answers; i++) {
                        str += `<button value="${parseFloat(spisokVoprosov[id].ballsAnswers[j])}" type="button" class="col btn btn-outline-primary mr-2" style="width: 160px;">${o}</button>`
                        // }

                        str += '</div>' + '</div>'
                    } else {
                        str += '<div class="d-flex justify-content-center">' +
                            '<div class="row btn-group-vertical w-100 " role="group" aria-label="Answers buttons">'
                        // for (let i = 0; i < spisokVoprosov[id].answers.length; i++) {
                        str += `<button value="${parseFloat(spisokVoprosov[id].ballsAnswers[j])}"  type="button" class="col btn btn-outline-primary btn-block mt-3 mr-2">${o}</button>`
                        // }
                        str += '</div>' + '</div>'
                    }


                    // str +=  '<div class="d-flex justify-content-center">' +
                    //              '<div class="col"><button type="button" value="' + parseFloat(spisokVoprosov[id].ballsAnswers[j]) + '" class="col btn btn-outline-primary btn-block mt-3 mr-2">' + o + '</button ></div>'
                    // // str += ' <li class="list-group-item list-group-item-action list-group-item-light" value="' + spisokVoprosov[id].ballsAnswers[j] + '">' + o + '</li>'
                    // str += '</div>'
                    j++;
                }
                // '<button type="button" class="btn btn-primary btn-block">' + getAnswers(0) + '</button>';
                str += ' </div>'
                str += '</div>'

                return str;
            });
        }

        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    $(document).ready(function () {

        let quiz = new Quiz();

        let mySet = new Set();

        let spisok = []; // собираем список вопросов из БД

        let testCount = 5; // количество типов тестов

        let voprosovCount = Questions.length;
        // let count=0;
        // let tmp = true;

        // генерировать случайных вопросов пачку
        //

        for (let rnd = 0; rnd <= voprosovCount; rnd++) {

            if (Questions[rnd] !== undefined) spisok.push(Questions[rnd]);


        }
        // do {
        //     let rnd = 0 // quiz.getRandomInt(1, voprosovCount);
        //
        //
        //
        //     if (rnd !== 0 && !mySet.has(rnd)) {
        //         mySet.add(rnd);
        //         if (Questions[rnd] !== undefined) spisok.push(Questions[rnd]);
        //         // count++;
        //     }
        //
        //     //    console.log('rnd =', rnd, Questions[rnd-1] )
        // }
        // while (mySet.size < voprosovCount);


        // создаем суммы для расчетов количества набранных балов
        let summa = []
        let sumH = [];
        for (let i = 0; i <= testCount; i++) {
            summa[i] = 0;
            sumH[i] = 0;

        } // создали и обнулили начальные значения сумм


        let clickid = 0;
        quiz.displayQuestion(clickid, spisok, false); // отображен первый вопрос

        let quizAnswers = []


        $("div.quizz-container").on("click", ":button", function (event) {
            // $("div.quizz-container").on("click", ':li', function() {
            const button = event.target

            let answer = {
                'test_id': '',
                "answer_id": 0,
                'text': '',
                'values': 0,
                'summa_ballov': 0,
                'result': ""
            };

            if (clickid < spisok.length) {
                quiz.displayQuestion(clickid, spisok, false);
                let kk = (button.value);
                kk= parseInt(kk);
                let result = kk; //spisok[clickid].ballsAnswers[kk];
                console.log('clickid= ', clickid, 'kk = ', kk, 'result=', result)

                answer["test_id"]  = spisok[clickid].test_id
                answer["answer_id"] = clickid
                answer.text = button.text
                answer.values = kk

                summa[spisok[clickid].test_id] += result;

                console.log(clickid, spisok.length)
                if (clickid === spisok.length) {
                    if (summa[1] >= 13 && summa[1] <= 23) {
                        answer.summa_ballov = summa[1];
                        answer.result = 'высокий уровень ухода за полостью рта у жителей психоневрологических интернатов';
                    }

                    if (summa[1] >= 24 && summa[1] <= 34) {
                        answer.summa_ballov = summa[1];
                        answer.result = 'удовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов';
                    }
                    if (summa[1] >= 35 && summa[1] <= 45) {
                        answer.summa_ballov = summa[1];
                        answer.result = 'неудовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов';
                    }
                    if (summa[1] >= 46) {
                        answer.summa_ballov = summa[1];
                        answer.result = 'низкий уровень ухода за полостью рта у жителей психоневрологических интернатов';
                    }

                    // TEST 2
                    if (summa[2] >= 10 && summa[2] <= 18) {
                        answer.summa_ballov = summa[2];
                        answer.result = 'высокий уровень ухода за полостью рта у жителей психоневрологических интернатов';
                    }
                    if (summa[2] >= 19 && summa[2] <= 28) {
                        answer.summa_ballov = summa[2];
                        answer.result = 'удовлетворительный уровень  оказания стоматологической помощи жителям психоневрологических интернатов';

                    }
                    if (summa[2] >= 29 && summa[2] <= 35) {
                        answer.summa_ballov = summa[2];
                        answer.result = 'неудовлетворительный уровень  оказания стоматологической помощи жителям психоневрологических интернатов';
                    }

                    if (summa[2] >= 36) {
                        answer.summa_ballov = summa[2];
                        answer.result = 'низкий уровень ухода за полостью рта у жителей психоневрологических интернатов';
                    }


                    // TEST 3
                    if (summa[3] >= 8 && summa[3] <= 15) {
                        answer.summa_ballov = summa[3];
                        answer.result = 'большинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему';
                    }
                    if (summa[3] >= 16 && summa[3] <= 23) {
                        answer.summa_ballov = summa[3];
                        answer.result = 'меньшинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему';
                    }
                    if (summa[3] >= 24) {
                        answer.summa_ballov  = summa[3];
                        answer.result = 'жители психоневрологических интернатов не ведут здоровый образ жизни или близкий к нем';
                    }

                    // TEST 4
                    if (summa[4] >= 4 && summa[4] <= 8) {
                        answer.summa_ballov  = summa[4];
                        answer.result = 'высокий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
                    }
                    if (summa[4] >= 9 && summa[4] <= 13) {
                        answer.summa_ballov  = summa[4];
                        answer.result = 'удовлетворительный уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
                    }
                    if (summa[4] >= 14) {
                        answer.summa_ballov = summa[4];
                        answer.result = 'низкий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия';
                        console.log(answer.summa_ballov );
                    }




                }

                quizAnswers.push(answer)
                // if (result === 0.5) {
                //     sumH[spisok[clickid].test_id]++;
                //
                // }
                // makeProgress(clickid * 100 / spisok.length)

                console.log("summa [" + spisok[clickid].test_id + "] =" + summa[spisok[clickid].test_id])
            } else {
                // quiz.showGraph(summa);




                //
                //
                //
                //
                //
                //
                for (let item = 0; item < summa.length; ++item) {
                    console.log(summa[item])
                    localStorage.setItem('sss' + item, summa[item]);


                    // console.log("summa[", item, "] =", summa[item])
                }
                localStorage.setItem('quizAnswers', JSON.stringify(quizAnswers));
                console.log(quizAnswers)
                // window.location.href='results/results.html';
                window.location.href = './saveResults.html';


            }

            clickid++;
        });

    });
