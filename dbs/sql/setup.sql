create user 'isagi' IDENTIFIED WITH mysql_native_password  BY 'yoichi';
create database `accountdb`;
grant create,select,update,delete,insert,alter on `accountdb`.* to isagi;

create database `assetdb`;
grant create,select,update,delete,insert,alter on `assetdb`.* to isagi;

CREATE TABLE IF NOT EXISTS account(
usid INT UNSIGNED primary key AUTO_INCREMENT,
token char(10),
name char(16),
mail VARBINARY(120),
pass char(255));

CREATE TABLE IF NOT EXISTS sns(
snsid char(16),
usid INT UNSIGNED,
name char(16),
state BOOL);

CREATE TABLE IF NOT EXISTS sns_count(
type char(5) primary key,
cnt INT UNSIGNED);

CREATE TABLE IF NOT EXISTS asset(
asid char(11) primary key,
regist DATETIME,
type SMALLINT UNSIGNED,
corp CHAR(32),
model CHAR(32),
serial CHAR(32),
bouhan CHAR(32),
memo TEXT,
release BOOL,
repdate DATETIME,
repplace TINYINT UNSIGNED,
repno char(10),
state BOOL);

CREATE TABLE IF NOT EXISTS touki(
rid INT UNSIGNED primary key AUTO_INCREMENT,
usid INT UNSIGNED,
asid char(11),
ouid INT UNSIGNED);

CREATE TABLE IF NOT EXISTS assetdb.asset_count(
cnt INT UNSIGNED,
alph char(1));
