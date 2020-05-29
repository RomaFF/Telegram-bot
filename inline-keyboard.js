
module.exports = {
stud: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Студент',
                    callback_data: 'Student'
                },
                {
                    text: 'Викладач',
                    callback_data: 'Teacher'
                }
            ],
            [
                {
                    text: 'СКХТ НУХТ',
                    url: 'https://www.stxt.com.ua/'
                }  
            ]
        ]
    }
},

sign_up: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Реєстрація',
                    callback_data: 'Registration'
                },
                {
                    text: 'Увійти',
                    callback_data: 'Come_in'
                }
            ],
            [
                {
                    text: 'Повернутись',
                    callback_data: 'Return_st'
                }  
            ],
            [
                {
                    text: 'СКХТ НУХТ',
                    url: 'https://www.stxt.com.ua/'
                }  
            ]
        ]
    }
},

sign_up_ops: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Реєстрація',
                    callback_data: 'Registration'
                },
                {
                    text: 'Натисни "Реєстрація"',
                    callback_data: 'Registration'
                }
            ],
            [
                {
                    text: 'Реєстрація!!!',
                    callback_data: 'Registration'
                }
            ]
        ]
    }
},

sign_up_teacher: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Реєстрація',
                    callback_data: 'Registration_t'
                },
                {
                    text: 'Увійти',
                    callback_data: 'Come_in_t'
                }
            ],
            [
                {
                    text: 'Повернутись',
                    callback_data: 'Return_st'
                }  
            ],
            [
                {
                    text: 'СКХТ НУХТ',
                    url: 'https://www.stxt.com.ua/'
                }  
            ]
        ]
    }
},

sign_up_ops_t: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Регистрация',
                    callback_data: 'Registration_t',
                },
                {
                    text: 'Нажми "Регистрация"',
                    callback_data: 'Registration_t'
                }
            ],
            [
                {
                    text: 'Регистрация или ничего!',
                    callback_data: 'Registration_t'
                }
            ]
        ]
    }
},

teacher_menu: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Додати тест',
                    callback_data: 'Test_add'
                },
                {
                    text: 'Переглянути мої тести',
                    callback_data: 'Tests_my'
                }
            ],
            [
                {
                    text: 'СКХТ НУХТ',
                    callback_data: 'SkhtUrl',
                    URL: 'https://www.stxt.com.ua/'
                }  
            ],
            [
                {
                    text: 'Повернутись',
                    callback_data: 'Return_st'
                }  
            ]
        ]
    }
},

in_menu_teacher: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Повернутись',
                    callback_data: 'in_Menu_Teacher'
                },
            ],
            [
                {
                    text: 'На початкове меню ',
                    callback_data: 'Return_st'
                }  
            ],
        ]
    }
},

student_menu: {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Переглянути тести',
                    callback_data: 'Test_stud_show'
                }
            ],
            [
                {
                    text: 'Переглянути результати проходження тестів',
                    callback_data: 'Test_stud_result'
                }
            ]
        ]
    }
}
}