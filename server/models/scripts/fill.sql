drop table comment;
drop table post;
drop table channel;
drop table users;

CREATE TABLE users (
  uid INTEGER NOT NULL PRIMARY KEY,
  username VARCHAR(25) NOT NULL UNIQUE,
  phoneNumber CHAR(10) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  clout INTEGER NOT NULL,
  deletedAt TIMESTAMP default NULL
);


CREATE TABLE channel (
  chid INTEGER NOT NULL PRIMARY KEY,
  cname VARCHAR(30) NOT NULL
);

CREATE TABLE post (
  pid INTEGER NOT NULL,
  chid INTEGER NOT NULL REFERENCES channel(chid),
  uid INTEGER NOT NULL REFERENCES users(uid),
  title VARCHAR(50) NOT NULL,
	detail VARCHAR(150) NOT NULL,
  photoUrl VARCHAR(2000) NOT NULL, 
  upVote INTEGER NOT NULL,
  downVote INTEGER NOT NULL,
  flag INTEGER NOT NULL,
  deletedAt TIMESTAMP default NULL,
  PRIMARY KEY (pid, chid),
  UNIQUE(pid)
);

CREATE TABLE comment (
  cid INTEGER NOT NULL PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES users(uid),
  context VARCHAR(150) NOT NULL,
  deletedAt TIMESTAMP default NULL
);

insert into users values (1, 'amykim', '9191235678', 'password', 0, null);
insert into users values (2, 'bobo', '9181235678', 'password2', 0,  null);

insert into channel values (1, 'food');

insert into post values (1, 1, 1, 'title', 'post content', 'https://firebasestorage.googleapis.com/v0/b/startiq.appspot.com/o/imgs%2FfakeImgForProfile.png?alt=media&token=8224719a-3243-4edd-a4d7-daa37abbd669', 0, 0, 0, null);
insert into post values (2, 1, 1, 'title', 'post content', 'https://firebasestorage.googleapis.com/v0/b/startiq.appspot.com/o/imgs%2FfakeImgForProfile.png?alt=media&token=8224719a-3243-4edd-a4d7-daa37abbd669', 1, 1, 1, null);

insert into comment values (1, 1, 'comment context', null);