DROP DATABASE IF EXISTS company_management;

USE company_management;

CREATE DATABASE company_management;

CREATE TABLE employee
(
    id int AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id int NOT NULL,
    manager_id int
);

CREATE TABLE department
(
    id int AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    name varchar(30) NOT NULL,
);

CREATE TABLE role
(
    id int AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    title varchar(30) NOT NULL,
    salary decimal,
    department_id int 

);