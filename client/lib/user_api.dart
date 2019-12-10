import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert' as convert;

class User {
  final int uid;
  final String phonenumber;
  final String password;
  final String username;
  final String deletedat;
  final int clout;

  User({this.uid, this.phonenumber, this.password, this.username, this.deletedat,
    this.clout});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
        uid: json['uid'],
        phonenumber: json['phonenumber'],
        password: json['password'],
        username: json['username'],
        deletedat: json['deletedat'],
        clout: json['clout']
    );
  }
}

Future<User> fetchUser(http.Client client, username, password) async {
  final String url = 'https://n8lk77uomc.execute-api.us-east-1.amazonaws.com/dev/login';
  Map<String, String> headers = {"Content-Type": "application/json"};
  String json = '{"id": "$username", "password": "$password"}';
  final response = await client.post(url, headers: headers, body: json);
  int statusCode = response.statusCode;
  if (statusCode == 200)
  {
    Map<String, dynamic> map = convert.jsonDecode(response.body);
    User person = User.fromJson(map['result']);
    if (person.deletedat == null)
      return person;
    if (person.deletedat != null)
      return Future.error("you have been deleted!");
  }

  if (statusCode == 400)
  {
    return Future.error("username or password incorrect!");
  }

  return null;

}
Future<User> fetchNewUser(http.Client client, String username, String password, String phone) async {
  final String url = 'https://n8lk77uomc.execute-api.us-east-1.amazonaws.com/dev/users';
  Map<String, String> headers = {"Content-Type": "application/json"};
  String json = '{"username": "$username", "phoneNumber": "$phone", "password": "$password", "clout": 0}';
  final response = await client.post(url, headers: headers, body: json);
  int statusCode = response.statusCode;
  if (statusCode == 200) {
    Map<String, dynamic> map = convert.jsonDecode(response.body);
    User person = User.fromJson(map['result']);
    if (person.deletedat == null) return person;
  }
  if (statusCode == 400) {
    return Future.error("this phone number is banned");
  }
  return null;
}