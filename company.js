const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'passwordR',
    database: 'company_management'
})

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(`Connected to DB: Thread ${connection.threadId}`)
})

const startUp = function() {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Employees', 'View Roles', 'View Departments', 'Add Employee', 'Add Role', 'Add Department', 'Delete Employee', 'Delete Roles', 'Delete Department','Quit'],
        name: 'action'
    }).then((res) => {
        if (res.action === 'View Employees') {
            connection.query(
                'SELECT employee1.id, CONCAT(employee1.first_name,\' \', employee1.last_name) AS Name, role.title AS Role, CONCAT(employee2.first_name,\' \', employee2.last_name) AS Manager FROM employee employee1 LEFT JOIN role ON role.id = employee1.role_id LEFT JOIN employee employee2 ON employee2.id = employee1.manager_id GROUP BY CONCAT(employee1.first_name,\' \', employee1.last_name) ORDER BY employee1.id',
                function(err, data) {
                    if (err) {
                        throw err;
                    }
                    console.table(data);
                    startUp();
                }
            )
        } else if (res.action === 'Quit') {
            process.exit();
        } else if (res.action === 'View Departments') {
            connection.query(
                'SELECT * FROM department',
                function(err, data) {
                    if (err) {
                        throw err;
                    }
                    console.table(data);
                    startUp();
                }
            )

        } else if (res.action === 'View Roles') {
            connection.query(
                'SELECT * FROM role',
                function(err, data) {
                    if (err) {
                        throw err;
                    }
                    console.table(data);
                    startUp();
                }
            )
        } else if (res.action === 'Add Department') {
            inquirer.prompt(
                {
                    name: 'newDepartment',
                    type: 'input',
                    message: 'What kind of department would you like to add?',
                }).then((response) => {
                    connection.query(
                'INSERT INTO department (name) VALUES (?)',
                response.newDepartment,
                function(err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log(`${response.newDepartment} was added as a department.`)
                    startUp();
                }
                
                )
                })


        } else if (res.action === 'Add Role') {
            connection.query(
                'SELECT * FROM department',
                function(err, data) {
                    if (err) {
                        throw err;
                    }
                    console.log(data);

                    let departments = [];
                    for (let i = 0; i < data.length; i++) {
                        departments.push(data[i].name)
                    }
                    console.log(departments);
                    inquirer.prompt([
                        {
                            name: 'roleName',
                            message: 'What is the name of the new role?',
                            type: 'input'
                        },
                        {
                            name: 'roleSalary',
                            message: 'What is this role\'s salary?',
                            type: 'input'
                        },
                        {
                            name: 'roleDepartment',
                            message: 'What is this role\'s department?',
                            type: 'list',
                            choices: departments
                        }
                    ]).then((response) => {
                        let dept_id = departments.indexOf(response.roleDepartment) + 1
                        console.log(dept_id);
                        connection.query(
                            'INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)',
                            [response.roleName, response.roleSalary, dept_id],
                            function(err, res) {
                                if (err) {
                                    throw err;
                                }
                                console.log(`${response.roleName} was added as a new role.`)
                                startUp();
                            } 
                        )
                    })
                }
            )
        }
            
            
        })
}

startUp();
