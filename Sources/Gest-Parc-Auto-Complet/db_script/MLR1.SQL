DROP DATABASE IF EXISTS automobile_db;

CREATE DATABASE IF NOT EXISTS automobile_db;
USE automobile_db;
# -----------------------------------------------------------------------------
#       TABLE : USER
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS USER
 (
   USER_LOGIN VARCHAR(128) NOT NULL  ,
   USER_PASSWORD VARCHAR(128) NOT NULL  
   , PRIMARY KEY (USER_LOGIN) 
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : AUTOMOBILE
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS AUTOMOBILE
 (
   AUTO_ID INTEGER(2) NOT NULL AUTO_INCREMENT ,
   AUTO_NAME VARCHAR(128) NOT NULL  ,
   AUTO_MARK VARCHAR(128) NOT NULL  ,
   AUTO_PRICE BIGINT(4) NOT NULL  
   , PRIMARY KEY (AUTO_ID) 
 ) 
 comment = "";


# -----------------------------------------------------------------------------
#       CREATION DES REFERENCES DE TABLE
# -----------------------------------------------------------------------------

