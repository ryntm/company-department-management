 INSERT INTO employee(first_name, last_name, role_id, manager_id)
 VALUES ('James','John', 9, ),
 ('Robert', 'Michaels', 8, 9),
 ('Mary', 'Lind', 7, 9),
 ('Jennifer', 'Beth', 6, 3),
 ('Richard', 'David', 6, 3),
 ('Joe', 'Beau', 5, 4),
 ('Betty', 'Black', 5, 5),
 ('Mark', 'Jacob', 4, 9),
 ('Sandra', 'Dana', 4, 9),
 ('Paul', 'Macky', 3, 8),
 ('Tammy', 'Soon', 3, 9),
 ('Sam', 'Emmett', 2, 3),
 ('Catherine', 'Rogers', 2, 3),
 ('Julia', 'Daniels', 1, 12),
 ('Bill', 'Williams', 1, 13),
 
 INSERT INTO department(name)
 VALUES ('Accounting'),
 ('Sales'),
 ('Software Development'),
 ('Leadership');
 
 INSERT INTO role(title, salary, department_id)
 VALUES ('Junior Accountant', '60000', 1),
 ('Senior Accountant', '80000', 1),
 ('Junior Sale Person', '50000', 2),
 ('Senior Sale Person', '80000', 2),
 ('Junior Developer', '90000', 3),
 ('Senior Developer', '120000', 3),
 ('CFO', '125000', 4),
 ('CTO', '150000', 4),
 ('CEO', '150000', 4);