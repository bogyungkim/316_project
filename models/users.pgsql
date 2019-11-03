CREATE TABLE users (                                                   uid INTEGER NOT NULL PRIMARY KEY,
  phoneNumber CHAR(10) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  level INTEGER NOT NULL,
  netid VARCHAR(32),
  deletedAt TIMESTAMP default NULL
);
