import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert' as convert;

class Post {
  int pid;
  int chid;
  int uid;
  String title;
  String detail;
  String photoUrl;
  List<dynamic> upVotes;
  List <dynamic> downVotes;
  String deletedat;
  List <dynamic> flags;
  Post({this.pid, this.chid, this.uid, this.title, this.detail, this.photoUrl, this.upVotes, this.downVotes, this.flags, this.deletedat});
  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      pid: json['pid'],
      chid: json['chid'],
      uid:  json['uid'],
      title: json['title'],
      detail: json['detail'],
      photoUrl: json['photourl'],
      deletedat: json['deletedat'],
      upVotes: json['upVotes'] as List<dynamic>,
      downVotes: json['downVotes'] as List<dynamic>,
      flags: json['flags'] as List<dynamic>,
    );
  }
}

Future<List<Post>> fetchPosts(http.Client client, int chid) async {
  final response =
  await client.get('https://n8lk77uomc.execute-api.us-east-1.amazonaws.com/dev/posts/$chid');
  Map<String, dynamic> map = convert.jsonDecode(response.body);
  var list = map['results'] as List;
  int statusCode = response.statusCode;
  if (statusCode == 200){
    return list.map<Post>((json) => Post.fromJson(json)).toList();
  }
  if (statusCode == 400){
    return null;
  }
  return null;

}
