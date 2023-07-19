function init() {
    const express = require('express');
    const inquirer = require('inquirer');
    const mysql = require('mysql2');

    const PORT = process.env.PORT || 8080;
    const app = express();

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    const db = mysql.createConnection(
        {
            host: 'localhost',
            user: 'root', // generic user
            password: '224Ardmore', //generic pass
            database: 'buisness_db'//our database
        },
        console.log(`Connected to the buisness_db database.`)
    );
    let message = (`

    ███████ ███    ███ ██████  ██       ██████  ██    ██ ███████ ███████     ███    ███  █████  ███    ██  █████   ██████  ███████ ██████  
    ██      ████  ████ ██   ██ ██      ██    ██  ██  ██  ██      ██          ████  ████ ██   ██ ████   ██ ██   ██ ██       ██      ██   ██ 
    █████   ██ ████ ██ ██████  ██      ██    ██   ████   █████   █████       ██ ████ ██ ███████ ██ ██  ██ ███████ ██   ███ █████   ██████  
    ██      ██  ██  ██ ██      ██      ██    ██    ██    ██      ██          ██  ██  ██ ██   ██ ██  ██ ██ ██   ██ ██    ██ ██      ██   ██ 
    ███████ ██      ██ ██      ███████  ██████     ██    ███████ ███████     ██      ██ ██   ██ ██   ████ ██   ██  ██████  ███████ ██   ██ 
                                                                                                                                           
                                                                                                                                           
    `);
    console.log(message);
    console.log(`
    -------------------------------
    |~WELCOME TO EMPLOYEE MANAGER~|
    -------------------------------`);

    function runPrompt() {
        inquirer.prompt([{
            type: 'list',
            name: "option",
            message: "What would you like to do?",
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        }])
            .then(data => {
                if (data.option === 'View All Employees') {
                    db.query('SELECT * FROM employee', function (err, res) {
                        console.log(res);
                        console.log("error from employee: ", err);
                    })
                }
                else if (data.option === 'Add Employee') { }
                else if (data.option === 'Update Employee Role') { }
                else if (data.option === 'View All Roles') {
                    db.query('SELECT * FROM role', function (err, res) {
                        console.log(res);
                        console.log('error from Roles request: ', err);
                    })
                }
                else if (data.option === 'Add Role') { }
                else if (data.option === 'View All Departments') {
                    db.query('SELECT * FROM department', function (err, res) {
                        console.log(res);
                        console.log('error from Departments Request: ', err);
                    })
                }
                else if (data.option === 'Add Department') { }
                else {
                    return console.log('A choice must be made');
                }

            })
    }//end of runPrompt
    app.listen(PORT, () => { console.log(`Working on ${PORT}`); });
    runPrompt();
}//end of init func
init();


// db.query('SELECT * FROM department', function (err, res, fields) {
//     console.log(res);
//     console.log("error from department: ", err);
// });
// db.query('SELECT * FROM role', function (err, res) {
//     console.log(res);
//     console.log("error from role: ", err);
// });

// });
// app.use((req, res) => { res.status(404).end(); });