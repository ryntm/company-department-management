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
        }   

        })
}

startUp();
