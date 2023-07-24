const inquirer = require('inquirer');

async function init() {
    const express = require('express');
    const mysql = require('mysql2');

    const PORT = process.env.PORT || 8080; //sets the port to run the server on
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

    function runProgram() {// runs the main menu questions 
        inquirer.prompt([{
            type: 'list',
            name: "option",
            message: "What would you like to do?",
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        }])
            .then(data => { //runs function based on prompt choice
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
                    addRole();
                }
                else if (data.option === 'View All Departments') {
                    viewAllDept();
                }
                else if (data.option === 'Add Department') {
                    addDept();
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
        db.query("SELECT * from role", function (err, res) { //grabs all content from role table
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
                    db.query('SELECT id FROM role WHERE title=?', [data.newEmployeeRole], function (err, res) {//grabs id content from role table where title matches inquirer prompt data 
                        if (err) {
                            console.error(err);
                            return
                        }
                        if (res.length === 0) {
                            console.error("Cannot find such a job title");
                        }
                        const convertedRoleId = res[0].id;

                        db.query('INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)', [data.newEmployeeFirstName, data.newEmployeeLastName, convertedRoleId, data.newEmployeeManager], function (err, res) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('Employee Added');
                            runProgram();
                        })

                    });
                })

        })

    }
    function updateEmpRole() {//runs questions and updates employee table
        console.log('Cannot update Role at this Time');
        runProgram();
    }
    function viewAllRoles() { // prints all roles in role table to console.
        db.query(`SELECT * FROM role`, function (err, res) {
            console.log('\n');
            console.table(res);
            if (err) {
                console.log('error from Roles request: ', err);
            }
        })
        runProgram();
    }
    function addRole() { //adds a role to the role table.
        let deptChoices = [];
        db.query("SELECT * from department", function (err, res) {
            if (err) {
                console.error(err);
            }
            deptChoices = res;
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'newRole',
                        message: "What is the new role?",
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary?'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'What department does this role go under?',
                        choices: deptChoices.map(function (object) { return object.name })
                    },])
                .then(data => {
                    db.query('SELECT id FROM department WHERE name=?', [data.department], function (err, res) {
                        if (err) {
                            console.error(err);
                            return
                        }
                        const convertedDeptId = res[0].id;

                        db.query('INSERT INTO  role (title,salary,department_id) VALUES (?,?,?)', [data.newRole, data.salary, convertedDeptId], function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            console.log('Role added');
                            runProgram();
                        })
                    })
                })
        })
    }
    function viewAllDept() { // prints all departments
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
    function addDept() { // runs question asking for name of new department
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newDept',
                    message: "What is the name of the new department?",
                }
            ])
            .then(data => {
                db.query('INSERT INTO department (name) VALUES (?)', [data.newDept], function (err, res) {
                    if (err) {
                        console.log('add dept error :', err);
                    }
                    console.log('Department added');
                    runProgram();
                })
            })
    }
    app.listen(PORT, () => { //starts server listening on port variable
        console.log(`Working on ${PORT}`);
        runProgram();
    });
}

init();