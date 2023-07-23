const inquirer = require('inquirer');

async function init() {
    const express = require('express');
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

    function runProgram() {
        inquirer.prompt([{
            type: 'list',
            name: "option",
            message: "What would you like to do?",
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        }])
            .then(data => {
                if (data.option === 'View All Employees') {
                    viewAllEmp();
                }
                else if (data.option === 'Add Employee') {
                    addEmp();
                }
                else if (data.option === 'Update Employee Role') {
                    updateEmpRole();
                }
                else if (data.option === 'View All Roles') {
                    viewAllRoles();
                }
                else if (data.option === 'Add Role') {

                }
                else if (data.option === 'View All Departments') {
                    viewAllDept();
                }
                else if (data.option === 'Add Department') {

                }
                else {
                    return console.log('A choice must be made');
                }

            })
    }
    function viewAllEmp() {//shows all employees in employee table
        db.query(`
        SELECT employee.id, first_name, last_name,manager_id, title AS job_title, salary, department_id FROM employee
        INNER JOIN role
        ON role_id = role.id
        ORDER BY employee.id ASC
        `, function (err, res) {
            console.log('\n');
            console.table(res);
            console.log("error from employee: ", err);
        })
        runProgram();
    }
    function addEmp() { // Does two process, i) queries roles form role table to populate role query in ii) where emp info is collected
        let roleChoices = [];
        db.query("SELECT * from role", function (err, res) {
            if (err) {
                console.error(err);
            }
            roleChoices = res;
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'newEmployeeFirstName',
                    message: 'What is the employees first name?'
                },
                {
                    type: 'input',
                    name: 'newEmployeeLastName',
                    message: 'What is the employees last name?'
                },
                {
                    type: 'list',
                    name: 'newEmployeeRole',
                    message: 'What is the employees role?',
                    choices: roleChoices.map(function (object) { return object.title })
                },
                {
                    type: 'input',
                    name: 'newEmployeeManager',
                    message: 'Who is the employees manager?',
                }]).then(data => {

                    db.query('SELECT id FROM role WHERE title=?', [data.newEmployeeRole], function (err, res) {
                        if (err) {
                            console.error(err);
                            return
                        }
                        if (res.length === 0) {
                            console.error("Cannot find such a job title")
                        }
                        const convertedRoleId = res[0].id;

                        db.query('INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', [data.newEmployeeFirstName, data.newEmployeeLastName, convertedRoleId, data.newEmployeeManager], function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('Employee Added');
                        })

                    });
                })

        })

    }
    function updateEmpRole() {

        inquirer.prompt([
            {
                type: 'input',
                name: 'employee',
                message: 'Please Enter Employee ID',
            },
            {
                type: 'input',
                name: 'title',
                message: 'Please Enter the job_title',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please Enter the Salary of the role',
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Please Enter the department id for that role',
            }
        ]).then(data => {
            db.query('INPUT INTO employee (employee,title,salary,department_id) VALUES (?,?,?,?)', [data.employee, data.title, data.salary, data.department_id]), function (err, res) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Changed employees Role');
                }
            }
        })
    }
    function viewAllRoles() {
        db.query(`SELECT * FROM role`, function (err, res) {
            console.log('\n');
            console.table(res);
            if (err) {
                console.log('error from Roles request: ', err);
            }
        })
        runProgram();
    }
    function viewAllDept() {
        db.query('SELECT * FROM department', function (err, res) {
            console.log('---------------------------------------------------------------------------------------');
            console.table(res);
            console.log('---------------------------------------------------------------------------------------');

            if (err) {
                console.log('error from Departments Request: ', err);
            }
        })

        runProgram();
    }
    app.listen(PORT, () => {
        console.log(`Working on ${PORT}`);
        runProgram();

    });
}

init();