$(function() {

    let Aqu = abilitiesQuestions;

    function makeProgress() {
        //if (i < spisok.length*100) {
        // i = i + 1;
        //console.log(i)
        // Получаем секунды
        let seconds = 45

        let qId = 0;
        let testid = 0;

        let results = []
        for (let i = 0; i < 8; i++) {
            results[i] = 0;
        }
        // refreshTimer(45, 0, quiz, qId, testid, results)
        quiz.displayQuestion(0, 0);


        // let timer = setInterval(function() {
        //     //let seconds = from;
        //     //  seconds = timeMinut % 60 // Получаем секунды
        //     // minutes = timeMinut / 60 % 60 // Получаем минуты
        //     // hour = timeMinut / 60 / 60 % 60 // Получаем часы
        //     // Условие если время закончилось то...
        //     if (seconds <= 0) {
        //
        //         if (qId === 0 & testid === 0) {
        //
        //             qId++;
        //         } else {
        //             clearInterval(timer);
        //
        //             $("div.quiz-container").on("click", ":button", function(index) {
        //                 //  timerShow.remove("div.progress-bar")
        //
        //                 let _this = $(this); // текущий элемент
        //
        //                 //    quiz.displayQuestion(testid, qId);
        //                 if (testid < 8) {
        //                     results[testid] += parseInt(_this.val());
        //
        //                     qId++;
        //                 } else {
        //                     testid++;
        //                     qId = 0;
        //
        //                     if (true) {
        //
        //                     } else {
        //                         for (let item = 0; item < results.length; ++item) {
        //                             // console.log(item+1, "/", summa[item+1]);
        //                             sessionStorage.getItem('abilities' + item, results[item], { expires: 1 });
        //                             //  console.log("summa[" , item , "] =" , summa[item])
        //                         }
        //                         window.location.href = 'results/results.html';
        //                     }
        //                 }
        //             })
        //         }
        //
        //         // Таймер удаляется
        //         clearInterval(timer);
        //         // Выводит сообщение что время закончилось
        //         alert("Время закончилось");
        //     } else { // Иначе
        //         // Создаём строку с выводом времени
        //         //let strTimer = '${seconds}';
        //         // Выводим строку в блок для показа таймера
        //         // timerShow.innerHTML = strTimer;
        //         //console.log(strTimer)
        //         setTimer(seconds)
        //     }
        //     --seconds; // Уменьшаем таймер
        // }, 1000)
        // }

    }


    function displayQuestion(test_id, qid) {

        $('div.quiz-container').html(function() {

            //  makeProgress();

            let question = Aqu[test_id].questions[qid].question;
            let str = '';
            //  console.log(question)
            if (question !== undefined) {
                if (question.picture.length > 0) {

                    str = displayWithPicture(test_id, qid, question);
                } else {
                    str = displayWithOutPicture(question);
                }


                // '<div class="row mt-4"><a href="#" id="nextBtn" class="col-4 btn btn-primary stretched-link">Go somewhere</a></div' +
                // '</div>'

            } else {
                str = '<div>Вопросы не обнаружены</div>'
            }


            return str;


        })




        function displayWithPicture(test_id, qid, question) {

            let str = '';
            //   console.log('displayWithPicture')
            str += '<div class="row no-gutters bg-light position-relative">' +
                '<div class="col-md-4 mb-md-4 p-md-4">'

            let pic = qid + '/' + question.picture[0].file
            //  console.log('../img/' + test_id + pic)
            // str += '<a href = "../img/' + test_id + qid + '/' + question.picture[1].file + '" title="hello world" id="data-spzoom">'
            //  '<source srcset="../img/' + test_id + pic + '" type="image/svg+xml">'
            // str += '<div class="zoom-box">'
            str += '<img src="../img/' + test_id + pic + '" class="card-img" alt="thumb" data-bs-toggle="modal" data-bs-target="#exampleModal">'
            //  str += '</div>'

            $('#myModal').html(function() {
                return generateModal('<img src="../img/' + test_id + pic + '"class="card-img w-100" alt="thumb">');
            })
            //  console.log('../img/' + pic)
            str += '</div>' +
                '<div class="col col-sm-8 col-md-8 p-2 pl-md-1 pt-5" style="height: 100px;">' +
                '<h5 class="w-100  mt-1">' + question.qText + '</h5>' +
                '<div class="btn-group w-100 mt-5" role="group" aria-label="Answers area">'

            /*           for (let i = 0; i < question.qAnswers.length; i++) {
                                str +=  '<button type="button" class="btn btn-outline-primary mr-2">' + question.qAnswers[i].text + '</button>'
                  
                              }
*/


            if (question.qAnswers[0].text.length <= 30) { // если короткий ответ
                str += '<div class="d-flex justify-content-center">' +
                    '<div class="row btn-group " role="group" aria-label="Answers buttons">'

                for (let i = 0; i < question.qAnswers.length; i++) {
                    str += '<button id="btn' + i + 'value="' + question.qAnswers[i].ans + '" type="button" class="col btn btn-outline-primary mr-2 non-selected" style="width: 10rem;">' + question.qAnswers[i].text + '</button>'
                }

                str += '</div>' + '</div>'
            } else { // если длинный ответ

                str += '<div class="row btn-group-vertical w-100 mt-1" role="group" aria-label="Answers buttons">'
                for (let i = 0; i < question.qAnswers.length; i++) {
                    str += '<button id="btn' + i + '"value="' + question.qAnswers[i].ans + '" type="button" class="col btn btn-outline-primary btn-block mt-2 non-selected">' + question.qAnswers[i].text + '</button>'
                }
                str += '</div>'
            }


            str += '   <p></p>' +
                '</div>' +
                //  '<div class="row mt-4"><a href="#" id="nextBtn" class="col-4 btn btn-primary ">Go somewhere</a></div' +

                '</div>' +
                '</div>' +
                '</div>'


            return str;

        }

        function generateModal(image) {


            return '<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog modal-xl">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h5 class="modal-title" id="exampleModalLabel">Увеличенный рисунок</h5>' +
                '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                '</div>' +
                '<div class="modal-body">' +
                image +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
        }

        function displayWithOutPicture(question) {
            // console.log('displayWithOutPicture')


            let str = '';
            str += '<div class="d-flex justify-content-center">' + '<div class="card position-relative w-75">' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + question.qText + '</h5>' +

                '<div class="card-text">'

            if (question.qAnswers[0].text.length <= 20) {
                str += '<div class="d-flex justify-content-center">' +
                    '<div class="row btn-group mt-3" role="group" aria-label="Answers buttons">'

                for (let i = 0; i < question.qAnswers.length; i++) {
                    str += '<button id="btn' + i + '"value="' + question.qAnswers[i].ans + '" type="button" class="col btn btn-outline-primary mr-2" style="width: 160px;">' + question.qAnswers[i].text + '</button>'
                }

                str += '</div>' + '</div>'
            } else {
                str += '<div class="d-flex justify-content-center">' +
                    '<div class="row btn-group-vertical w-100 " role="group" aria-label="Answers buttons">'
                for (let i = 0; i < question.qAnswers.length; i++) {
                    str += '<button id="btn' + i + '"value="' + question.qAnswers[i].ans + '"  type="button" class="col btn btn-outline-primary btn-block mt-3 mr-2">' + question.qAnswers[i].text + '</button>'
                }
                str += '</div>' + '</div>'
            }


            str += '   <p></p>' +
                '</div>' +
                //  '<div class="row mt-4"><a href="#" id="nextBtn" class="col-4 btn btn-primary stretched-link">Go somewhere</a></div' +

                '</div>' + '</div>'



            return str;
        }

    } // end wuiz-container

    // end class


    function timer() {
        let current = 45 * 88

        function go() {
            dispalayTimer(current);


            if (current == 0) {
                clearInterval(timerId);
            }
            --current;
        }

        go();
        let timerId = setInterval(go, 1000);
    }


    let testid = 0
    let qid = 0



    let results = []

    for (let i = 0; i < Aqu.length; i++) {
        results[i] = 0;
    }



    // timer()
    displayQuestion(0, 0)
    //showQuestion(testid, qid)
    // showVopros(0, 0)
    qid++

    $("div.quiz-container").on("click", ":button", function() {
        let _this = $(this); // текущий элемент

        results[testid] += parseInt(_this.val());
        let count = 11;
        //let ttt = setTimeout(timer, 1000)
        //  clearInterval(ttt);

        // timer(false)


        //console.log(ttt)

        if (testid === 7 & qid === count) {
            for (let item = 0; item < results.length; ++item) {
                // console.log(item+1, "/", summa[item+1]);
                localStorage.setItem('abilities' + item, results[item], { expires: 1 });
                //  console.log("summa[" , item , "] =" , summa[item])
            }
            window.location.href = 'results/results.html';
            

            // window.location.href = 'testprofile.html';

        }


        if (qid < count) {
            // timer(seconds)

            //showVopros(testid, qid)
            displayQuestion(testid, qid)
            //ShowQuestion(testid, qid)
            // console.log(qid, testid, results[testid])


            // qtimer = setTimeout(displayQuestion, delay, testid, qid);
        } else {

            qid = 0;
            testid++;

            // showVopros(testid, qid)
            displayQuestion(testid, qid)
            // ShowQuestion(testid, qid)
            // clearInterval(ttt);

            // setInterval(displayQuestion, 45000, testid, qid)

        }
        // displayQuestion(testid, qid)
        qid++
        // timer(true)

    })




});