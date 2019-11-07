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