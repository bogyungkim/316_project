class Flag {
  bool exists;
  bool banned;
  Flag({this.exists, this.banned});
  factory Flag.fromJson(Map<String, dynamic> json) {
    return Flag(
      exists: json['exists'] as bool,
      banned: json['banned'] as bool,
    );
  }
}

class Vote {
  bool isUpVote;
  bool isDownVote;
  Vote({this.isUpVote, this.isDownVote});
  factory Vote.fromJson(Map<String, dynamic> json) {
    return Vote(
      isUpVote: json['isUpVote'] as bool,
      isDownVote: json['isDownVote'] as bool,
    );
  }
}
