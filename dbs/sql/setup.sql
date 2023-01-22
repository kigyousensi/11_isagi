create user 'isagi' IDENTIFIED WITH mysql_native_password  BY 'yoichi';
create database `accountdb`;
grant create,select,update,delete,insert,alter on `accountdb`.* to isagi;

create database `assetdb`;
grant create,select,update,delete,insert,alter on `assetdb`.* to isagi;

CREATE TABLE IF NOT EXISTS accountdb.account(
usid char(12) primary key,
token char(24),
name varchar(16),
mail VARBINARY(128),
pass char(255),
state bit(1));


CREATE TABLE IF NOT EXISTS accountdb.corp(
usid char(8) primary key,
id MEDIUMINT  UNSIGNED,
store SMALLINT UNSIGNED,
pass char(255),
mail VARBINARY(64),
name varchar(12),
right TINYINT UNSIGNED,
state bit(1));

CREATE TABLE IF NOT EXISTS accountdb.corp_prof(
coid char(6),
name varchar(32),
area SMALLINT UNSIGNED,
uno MEDIUMINT UNSIGNED,
state bit(1));

CREATE TABLE IF NOT EXISTS accountdb.store_d(
coid char(6),
stid SMALLINT UNSIGNED,
name varchar(16));

