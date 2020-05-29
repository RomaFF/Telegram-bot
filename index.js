const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const ikb = require('./inline-keyboard');
const modelUs = require('./models/user.model');
const bot = new TelegramBot(config.TOKEN, {polling: true});

const mongoose = require('mongoose');

const User = mongoose.model("User");
const Test = mongoose.model("Test");
const TUser = mongoose.model("TUser");
const TestResult = mongoose.model("TestResult");

mongoose.connect("mongodb://localhost:27017/test_bot", {
    useMongoClient: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

//var MongoClient = require('mongodb').MongoClient;
//var db_url = "mongodb://localhost:27017/";

//==================================================================

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id; 
    let text = 'Привет! Это Телеграмм бот для тестов, выберите студент вы или преподаватель'
    bot.sendMessage(chatId, text, ikb.stud);
});

bot.on('callback_query', (query, msg) => { 
    switch (query.data) {
    //=============================|  Окно "Start"  |===================================================
        case 'Student': {
            let text = 'Добре! Тепер обери один з варіантів';
            bot.sendMessage(query.message.chat.id, text, ikb.sign_up);
            bot.answerCallbackQuery(query.id);
        };
            break
        case 'Teacher': {
            bot.sendMessage(query.message.chat.id, 'Далі обери один з варіантів', ikb.sign_up_teacher);
            bot.answerCallbackQuery(query.id);
        };
            break
    //=============================|  Окно "Студент"  |=============================================
        case 'Return_st': {
          bot.sendMessage(query.message.chat.id, 'В головне меню', ikb.stud);
          bot.answerCallbackQuery(query.id, {text : 'Повертаємось...'});
        };
            break;

        case 'Registration': {
            let fio; let phone_num; let group;
            User.find({TelegramId: query.message.chat.id}, function(err, result) {
                  if (err) return console.log(err);
                    if(result == false) {
                    bot.sendMessage(query.message.chat.id, 'Крок 1 з 3: \nВведи команду /name, а далі своє ПІБ \nНаприклад: \n/name Прізвище І.Б.');
                  } 
                    else { 
                    bot.sendMessage(query.message.chat.id, 'Ти вже зареєстрований', ikb.student_menu);
                    bot.answerCallbackQuery(query.id);
                    }
                });
            bot.onText(/\/name (.+)/, (msg, match) => {
                fio = match[1];
                console.log(fio);
                bot.sendMessage(query.message.chat.id, 'Крок 2 з 3: \nДалі введи команду /phone, а затем свой номер телефона \nНапример: \n/phone +380974253453');
            });
            bot.onText(/\/phone (.+)/, (msg, match) => {
                phone_num = match[1];
                console.log(phone_num);
                bot.sendMessage(query.message.chat.id, 'Крок 3 з 3: \nІ в конці введи команду /group, і далі свою групу \nНаприклад: \n/group ПСК16');
            });
            bot.onText(/\/group (.+)/, (msg, match) => {
                group = match[1];
                    let user = new User({TelegramId: msg.chat.id, FIO: fio, Phone_number: phone_num, Group: group});
                    user.save(function(err){
                      if(err) return console.log(err);
                      console.log("Add user");
                      bot.sendMessage(query.message.chat.id, 'Ти зареєструвався в системі!', ikb.student_menu);
                    });
                  });
                bot.answerCallbackQuery(query.id, {text: 'Зареєстровано'});
            };
            break

        case 'Come_in': {
            User.find({TelegramId: query.message.chat.id}, function(err, result) {
                  if (err) return console.log(err);
                  if(result == false) {
                    bot.sendMessage(query.message.chat.id, 'Ти ще не зареєструвався! Потрібно це виправити!');
                    bot.sendMessage(query.message.chat.id, 'Нажми любую кнопку:)', ikb.sign_up_ops); 
                    bot.answerCallbackQuery(query.id);
                  } 
                    else { 
                    bot.sendMessage(query.message.chat.id, 'Входимо...', ikb.student_menu);
                    bot.answerCallbackQuery(query.id);
                    }
                });
                };
            break
            
        case 'Test_stud_show': {
          bot.sendMessage(query.message.chat.id, 'Пошук тестів...');
          let teacherId; let testName1; let groupForTest; 
          let userGroup; let i = 0; let j = 0; let i1 = 0;
          let userT = []; testMas = [];
          let testStr = '';
          let i2 = 0; let sum = 0; let t1; let t2; let answers1; let answers = [];let userStudentFio;
          let i3 = 0; let i4 = 0; let i5; let ques = ''; let sumEnt = 0; let masAmount = []; let resultOfImp = 0; let countResult = 0;

          User.find({TelegramId: query.message.chat.id}, function(err, users, userGroup) {
            if (err) return console.log(err);
            users.forEach(element => {
              userGroup = element.Group;
              userStudentFio = element.FIO;
            });

          Test.find({testFor: userGroup}, function(err, tests, result) {
            if (err) return console.log(err);
            tests.forEach(element => {
              userT[i] = element.testName;
              i++;
          });

          var options = {
            reply_markup: JSON.stringify({
                 inline_keyboard: userT.map((x, xi) => ([{
                     text: x,
                     callback_data: String(xi),
                 }])),
           }),
          };

          if (i>0) {
          bot.answerCallbackQuery(query.id, {text : 'Тести знайдено!'});
          bot.sendMessage(query.message.chat.id, 'Обери потрібний тест', options);

          bot.on('callback_query', function onCallbackQuery(callbackQuery) {
            let ans = callbackQuery.data;
            for(i1 = 0; i1 < i; i1++)
            {
              if (i1 === Number(ans))
              break;
            };
            Test.find({testName: userT[i1]}, function(err, tests) {
              if (err) return console.log(err);
              tests.forEach(element => {
                teacherId = element.TelegramId;
                testStr = element.testStruct;
                testName1 = element.testName;
                groupForTest = element.testFor;

                if(sum != 0)
                {
                  sum = 0;
                };

                for(i2 = 0; i2<testStr.length; i2++)
                {
                  if(testStr[i2] == '{')
                  {
                    t1 = i2;
                  };
                  if(testStr[i2] == '}')
                  {
                    t2 = i2;
                    for(let jj = 0 ; t1<t2-1 ; t1++)
                    {
                      if(jj == 0)
                      {
                        testMas[sum] = String(testStr[t1+1]);
                        jj++;
                      }
                      else
                      {
                      testMas[sum] += String(testStr[t1+1]);
                      }
                    }
                    sum++;
                  };
                };

                answers = [];
                answers1 = element.testReply;
                console.log(element.testReply);
                answers1 = answers1.replace(/\s/g, '');

                function searchValue (answers1, answers)
                {
                  let f = 0; let f1 = 0;
                  for(f = 0; f < answers1.length; f+=2)
                  {
                    answers[f1] = Number(answers1[f]);
                    f1++;
                  };
                  return answers;
                }
                searchValue(answers1, answers);
                resultOfImp = 0;

                  function goToResult(countResult)
                  {
                    let masOne = testMas[countResult];
                    if(masOne == 'undefined')
                    {
                      countResult ++;
                      masOne = testMas[countResult];
                    }
                    sumEnt = 0; ques = '';
                    masAmount = [];

                    for(i4 = 0; i4 < masOne.length; i4++)
                    {
                      if(masOne[i4] != '$')
                      {
                        ques += masOne[i4];
                      }
                      else 
                      {
                        ques += '\n';
                        masAmount[sumEnt] = sumEnt;
                        sumEnt += 1;
                      };
                    };

                    var options2 = {
                      reply_markup: JSON.stringify({
                        keyboard: masAmount.map((h, hi) => ([{
                          text: h + 1
                          }])),
                    }),
                    };

                    var options3 = {
                      reply_markup: JSON.stringify({
                        one_time_keyboard: true,
                        remove_keyboard: true,
                        keyboard: masAmount.map((h, hi) => ([{
                          text: h + 1
                          }])),
                    }),
                    };
                  
                  if(countResult < sum && countResult != sum - 1)
                  {
                  bot.sendMessage(query.message.chat.id, 'Питання ' + (countResult + 1) + ' з ' + sum + '\n' + ques, options2);
                  }
                  else if(countResult < sum && countResult == sum - 1)
                  {
                  bot.sendMessage(query.message.chat.id, 'Останнє питання ' + (countResult + 1) + ' з ' + sum + '\n' + ques, options3);
                  }
                  else 
                  {
                  bot.sendMessage(query.message.chat.id, 'Тест пройдено!');
                  }
                  };

                  if(countResult < sum)
                  {
                  goToResult(countResult);
                  }
                  bot.on('message', msg => {
                    if(msg.text == answers[countResult])
                    {
                      resultOfImp++;
                     // console.log(resultOfImp);
                    }
                    else {
                      //console.log(resultOfImp);
                    }

                    if(countResult < sum - 1)
                    {
                      countResult++;
                      goToResult(countResult);
                    }
                    else 
                    {
                    bot.sendMessage(msg.chat.id, 'Тест пройдено, твій результат ' + (resultOfImp) + ' з ' + sum).then ( ( )  =>  { 
                      let testresult = new TestResult({TelegramId: msg.chat.id, FIO: userStudentFio, teacher_TelegramID: teacherId, testName: testName1, testResult: resultOfImp, Group: groupForTest});
                        testresult.save(function(err){
                          if(err) return console.log(err);
                          console.log("Add test result");
                          bot.sendMessage(query.message.chat.id, 'В головне меню' , ikb.stud);
                          bot.answerCallbackQuery({callback_query_id: callbackQuery.id, text : 'Дані занесено в систему!',});                       
                        });
                      });
                    }
                 });
              });
            });
            })
            }
            else { 
              bot.sendMessage(query.message.chat.id, 'Схоже що для тебе тестів ще не немає.');
              bot.answerCallbackQuery(query.id);
            };
            });
          });
        };
            break
        
      //=============================|  Окно "Преподаватель"  |=============================================
        case 'Registration_t': {
            let fio; let phone_num;
            TUser.find({TelegramId: query.message.chat.id}, function(err, result) {
              if (err) return console.log(err);
                if(result == false) {
                bot.sendMessage(query.message.chat.id, 'Крок 1 з 2: \nВведи команду /n і своє ФИО \nНаприклад: \n/n Прізвище І.Б.');
              } 
                else { 
                bot.sendMessage(query.message.chat.id, 'Ти вже зареєстрований', ikb.teacher_menu);
                bot.answerCallbackQuery(query.id);
                }
            });
            bot.onText(/\/n (.+)/, (msg, match) => {
                fio = match[1];
                bot.sendMessage(query.message.chat.id, 'Крок 2 з 2: \nДалі введи /ph, і свій номер телефону \nНаприклад: \n/ph +380974253453');
            });
            bot.onText(/\/ph (.+)/, (msg, match) => {
                phone_num = match[1];
                let tuser = new TUser({TelegramId: msg.chat.id, FIO: fio, Phone_number: phone_num});
                      tuser.save(function(err){
                        if(err) return console.log(err);
                        console.log("Add user");
                        bot.sendMessage(query.message.chat.id, 'Ти зареєструвався в системі!', ikb.teacher_menu);
                      });
                });
                bot.answerCallbackQuery(query.id);
        };
            break;

        case 'Come_in_t': {
          TUser.find({TelegramId: query.message.chat.id}, function(err, result) {
            if (err) return console.log(err);
            if(result == false) {
              bot.sendMessage(query.message.chat.id, 'Ти ще не зареєструвався! Потрібно це виправити!');
              bot.sendMessage(query.message.chat.id, 'Натисни "Реєстрація":)', ikb.sign_up_ops_t); 
              bot.answerCallbackQuery(query.id);      
            } 
              else { 
              bot.sendMessage(query.message.chat.id, 'Входимо', ikb.teacher_menu);
              bot.answerCallbackQuery(query.id, {text : 'Входимо...'});    
              }
          });
        };
            break;

        case 'Tests_my' : {
          let arrayOfTests = []; let i = 0; let i1 = 0; let resultsOfTests = ''; 
          bot.answerCallbackQuery(query.id, {text: 'Пошук ваших тестів...'});

          Test.find({TelegramId: query.message.chat.id}, function(err, tests) {
            if (err) return console.log(err);
            tests.forEach(element => {
              arrayOfTests[i] = element.testName;
              i++;
          });

          var options = {
            reply_markup: JSON.stringify({
                 inline_keyboard: arrayOfTests.map((x, xi) => ([{
                     text: x,
                     callback_data: String(xi),
                 }])),
           }),
          };

          if (i>0) {
          bot.answerCallbackQuery(query.id, {text : 'Тести знайдено!'});

          bot.sendMessage(query.message.chat.id, 'Обери потрібний тест', options);
          bot.on('callback_query', function onCallbackQuery(callbackQuery) {
            for(i1 = 0; i1 < i; i1++)
            {
              if (i1 === Number(callbackQuery.data))
              break;
            };

            TestResult.find({testName: arrayOfTests[i1]}, function(err, tests) {
              if (err) return console.log(err);
              tests.forEach(element => {
                resultsOfTests += 'ПІБ       |' + element.FIO + '\n';
                resultsOfTests += 'Група     |' + element.Group + '\n';
                resultsOfTests += 'Результат |' + element.testResult + '\n\n';
              });
              bot.sendMessage(query.message.chat.id, 'Результати:\n\n' + resultsOfTests, ikb.in_menu_teacher);
              bot.answerCallbackQuery(query.id, {text: 'Результати знайдено'});
            });

          });
        }
        else
        bot.sendMessage(query.message.chat.id, 'Ви не додали ще жодного тесту!', ikb.in_menu_teacher);
        bot.answerCallbackQuery(query.id, {text: 'Тести не знайдені'}); 
      });
    };
            break;    

        case 'in_Menu_Teacher': {
          bot.sendMessage(query.message.chat.id, 'Повертаємось...', ikb.teacher_menu);
          bot.answerCallbackQuery(query.id);
        };
            break;

      //=============================|  Окно "Преподаватель основное меню"  |=============================================
        case 'Test_add': {
          let testReply; let testFor; let testName; let testStruct; 
          bot.sendMessage(query.message.chat.id, 'Спочатку введи: /testname і назву тесту. \nНаприклад: /testname Тест філософія');

          bot.onText(/\/testname (.+)/, (msg, match) => {
            testName = match[1];
            bot.sendMessage(query.message.chat.id, 'Далі введи групу, для якої створений цей тест\nВведи /testfor "Назва групи" \nНаприклад: /testfor ПСК16 \nГрупу потрібно вказати як в прикладі!');
        });

          bot.onText(/\/testfor (.+)/, (msg, match) => {
            testFor = match[1];
            bot.sendMessage(query.message.chat.id, 'Далі введи відповіді\nВведи /testr "Номери правильних відповідей" \nНаприклад: /testr 1, 3, 3, [2, 3], 4, [1, 3, 4] \nВ дужках потрібно вказувати якщо правильних відповідей кілька');
        });  
        
          bot.onText(/\/testr (.+)/, (msg, match) => {
            testReply = match[1];
            bot.sendMessage(query.message.chat.id, 'Далі введи текст тесту\nВведи /tt "Текст тесту" \nНаприклад: /tt тест*тест*тест');
        });
          bot.onText(/\/tt (.+)/, (msg, match) => {
            testStruct = match[1];
            bot.sendMessage(query.message.chat.id, 'Тест реєструється...'); 
            console.log(query.id);
            bot.answerCallbackQuery(query.id, {text: 'Додано!'})
            let test = new Test({TelegramId: msg.chat.id, testName: testName, testFor: testFor, testReply: testReply, testStruct: testStruct});
              test.save(function(err){
                if(err) return console.log(err);
                console.log("Add user");
                bot.sendMessage(query.message.chat.id, 'Тест додано!', ikb.teacher_menu)});    
        }); 
      }
            break;

      };
      bot.answerCallbackQuery(query.id);
    });

    bot.on("polling_error", (err) => console.log(err));
            

    
