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
        choices: ['View Employees', 'View Roles', 'View Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role', 'Delete Employee', 'Delete Roles', 'Delete Department','Quit'],
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
                        let dept_id = data[departments.indexOf(response.roleDepartment)].id;
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
        } else if (res.action === 'Add Employee') {
            connection.query(
                'SELECT * FROM role',
                function(err, roles) {
                    if (err) {
                        throw err;
                    }
                    let roleList = [];
                    for (let i = 0; i < roles.length; i++) {
                        roleList.push(roles[i].title)
                    };

                    connection.query(
                        'SELECT id, CONCAT(first_name, \' \', last_name) AS full_name FROM employee',
                        (err, people) => {
                            if (err) {
                                throw err;
                            }
                            let peopleList = [];
                            for (let i = 0; i < people.length; i++) {
                                peopleList.push(people[i].full_name)
                            }
                            inquirer.prompt([
                                {
                                    name: 'employeeFirstName',
                                    message: 'What is their first name?',
                                    type: 'input'
                                },
                                {
                                    name: 'employeeLastName',
                                    message: 'What is their last name?',
                                    type: 'input'
                                },
                                {
                                    name: 'employeeRole',
                                    message: 'What will be their role?',
                                    type: 'list',
                                    choices: roleList
                                },
                                {
                                    name: 'employeeManager',
                                    message: 'Who is their manager?',
                                    type: 'list',
                                    choices: peopleList
                                }
                            ]).then((response) => {
                                let managerID = people[peopleList.indexOf(response.employeeManager)].id;
                                let roleID = role[roleList.indexOf(response.employeeRole)].id;
                                connection.query(
                                    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
                                    [response.employeeFirstName, response.employeeLastName, roleID, managerID],
                                    function(err, res) {
                                        if (err) {
                                            throw err;
                                        } 
                                        console.log(`${response.employeeFirstName} ${response.employeeLastName} has been added as a new employee.`)
                                        startUp();
                                    }
                                )
                            })
                }
                )
                }
            )
        } else if (res.action === 'Delete Roles') {
            connection.query(
                'SELECT * FROM role',
                function(err, roles) {
                    if (err) {
                        throw err;
                    }
                    let roleList = [];
                    for (let i = 0; i < roles.length; i++) {
                        roleList.push(roles[i].title)
                    }
                    inquirer.prompt(
                        {
                            name: 'deleteRole',
                            type: 'list',
                            message: 'Which role would you like to delete?',
                            choices: roleList
                        }
                    ).then((response) => {
                        connection.query(
                            'DELETE FROM role WHERE title = ?',
                            response.deleteRole,
                            function(err, res) {
                                if (err) {
                                    throw err;
                                }
                                console.log(`${response.deleteRole} has been deleted as a role.`)
                                startUp();
                            }
                        )
                    })
                } 
            )
        } else if (res.action === 'Delete Department') {
            connection.query(
                'SELECT * FROM department',
                function(err, departments) {
                    if (err) {
                        throw err;
                    }
                    let departmentList = [];
                    for (let i = 0; i < departments.length; i++) {
                        departmentList.push(departments[i].name);
                    }
                    inquirer.prompt(
                        {
                            name: 'deleteDepartment',
                            type: 'list',
                            message: 'Which department would you like to remove?',
                            choices: departmentList
                        }
                    ).then((response) => {
                        let departmentID = departments[departmentList.indexOf(response.deleteDepartment)].id;
                        connection.query(
                            'DELETE FROM department WHERE id = ?',
                            departmentID,
                            function(err, res) {
                                if (err) {
                                    throw err;
                                }
                                console.log(`${response.deleteDepartment} was removed as a department.`);
                                startUp();
                            }
                        )
                    })
                }
            )
        
        } else if (res.action === 'Update Employee Role') {
            connection.query(
                'SELECT id, CONCAT(first_name, \' \', last_name) AS employee_name FROM employee',
                function(err, employees) {
                    if (err) {
                        throw err;
                    }
                    let employeeList = [];
                    for (let i = 0; i < employees.length; i++) {
                        employeeList.push(employees[i].employee_name)
                    }
                    connection.query(
                        'SELECT * FROM role',
                        function(err, roles) {
                            if (err) {
                                throw err;
                            }
                            let roleList = [];
                            for (let i = 0; i < roles.length; i++) {
                                roleList.push(roles[i].title)
                            }
                            inquirer.prompt([
                                {
                                    name: 'chooseEmployee',
                                    type: 'list',
                                    message: 'Which employee\'s role would you like to update?',
                                    choices: employeeList
                                },
                                {
                                    name: 'newRole',
                                    type: 'list',
                                    message: 'What role would you like to change them to?',
                                    choices: roleList
                                }
                                ]
                            ).then((response) => {
                                let employeeID = employees[employeeList.indexOf(response.chooseEmployee)].id;
                                let newRoleID = roles[roleList.indexOf(response.newRole)].id;
                                connection.query(
                                    'UPDATE employee SET role_id = ? WHERE id = ?',
                                    [newRoleID, employeeID],
                                    function(err, res) {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log(`${response.chooseEmployee} is now a ${response.newRole}`);
                                        startUp();
                                    }
                                )
                            })
                        }

                        )
                    })
                } else {
                    startUp();
                }
            })
        }
            


startUp();
