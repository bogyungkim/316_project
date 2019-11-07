drop table comment;
drop table publishes;
drop table post;
drop table channel;
drop table users;

CREATE TABLE users (
  uid INTEGER NOT NULL PRIMARY KEY,
  phoneNumber CHAR(10) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  level INTEGER NOT NULL,
  netid VARCHAR(32),
  deletedAt TIMESTAMP default NULL,
  UNIQUE(netid)
);


CREATE TABLE channel (
  chid INTEGER NOT NULL PRIMARY KEY
);

CREATE TABLE post (
  pid INTEGER NOT NULL,
  chid INTEGER NOT NULL REFERENCES channel(chid),
  uid INTEGER NOT NULL REFERENCES users(uid),
  pContext VARCHAR(150) NOT NULL,
  vote INTEGER NOT NULL,
  location VARCHAR(40) NOT NULL,
  report INTEGER NOT NULL,
  netid VARCHAR(32),
  deletedAt TIMESTAMP default NULL,
  FOREIGN KEY (netid) REFERENCES users(netid),
  PRIMARY KEY (pid, chid),
  UNIQUE(pid)
);

CREATE TABLE publishes (
  pid INTEGER NOT NULL PRIMARY KEY REFERENCES post(pid),
  uid INTEGER NOT NULL REFERENCES users(uid),
  time TIMESTAMP NOT NULL
);

CREATE TABLE comment (
  cid INTEGER NOT NULL PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(uid),
  vote INTEGER NOT NULL,
  cContext VARCHAR(150) NOT NULL,
  report INTEGER,
  netid VARCHAR(32),
  deletedAt TIMESTAMP default NULL,
  FOREIGN KEY (netid) REFERENCES users(netid)
);

insert into users values (1, '9191235678', 'password', 1, 'net1', null);
insert into users values (2, '9181235678', 'password2', 2, 'net2', null);

insert into channel values (1);

insert into post values (1, 1, 1, 'post content', 0, 'WU', 0, 'net1', null);
insert into publishes values (1, 1, '2019-11-01 19:10:25-07');

insert into post values (2, 1, 2, 'post content2', 0, 'WU', 0, 'net2', null);
insert into publishes values (2, 2, '2019-11-02 19:10:25-07');

insert into comment values (1, 1, 0, 'comment content', 0, 'net1', null);