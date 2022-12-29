create user 'isagi' IDENTIFIED WITH mysql_native_password  BY 'yoichi';
create database `accountdb`;
grant create,select,update,delete,insert,alter on `accountdb`.* to isagi;

create database `assetdb`;
grant create,select,update,delete,insert,alter on `assetdb`.* to isagi;

CREATE TABLE IF NOT EXISTS account(
usid char(16) primary key,
token char(32),
name char(16),
mail VARBINARY(120),
pass char(255),
state bit(1));

CREATE TABLE IF NOT EXISTS account_count(
grptyp TINYINT UNSIGNED,
grpcnt MEDIUMINT UNSIGNED,
grpof TINYINT UNSIGNED,
accnt MEDIUMINT UNSIGNED,
gn varchar(32));

CREATE TABLE IF NOT EXISTS sns(
usid char(16),
snsid char(4),
state bit(1));

CREATE TABLE IF NOT EXISTS asset(
asid char(11) primary key,
regist DATETIME,
type varchar(16),
corp CHAR(32),
model CHAR(32),
sup CHAR(32),
serial CHAR(32),
bouhan CHAR(32),
memo varchar(64),
icorp varchar(24),
ino char(32),
idate DATETIME,
itel1 char(16),
itel2 char(16),
release bit(1),
repsw bit(1),
repdate DATETIME,
repno char(10),
proof bit(1),
state bit(1));

CREATE TABLE IF NOT EXISTS touki(
rid INT UNSIGNED primary key AUTO_INCREMENT,
usid INT UNSIGNED,
asid char(11),
ouid INT UNSIGNED,
pin char(6));

CREATE TABLE IF NOT EXISTS assetdb.asset_count(
cnt INT UNSIGNED,
alph char(1));
