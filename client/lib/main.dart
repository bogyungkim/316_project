import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'dart:async';
import 'dart:convert';

// Code written in Dart starts executing from the main function. runApp is part of
// Flutter, and requires the component which will be our app's container. In Flutter,
// every component is known as a "widget".
void main() => runApp(new MyApp());

// Every component in Flutter is a widget, even the whole app itself
class VortexApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Welcome to the Vortex',
      home: DefaultTabController(
        length: 4,
        child: Scaffold(
          appBar: AppBar(
            backgroundColor: new Color(0xFF131515),
            bottom: TabBar(

              tabs: [
                Tab(icon: new Image.asset("assets/images/Group3.png")),
                Tab(icon: Icon(Icons.people_outline)),
                Tab(icon: Icon(Icons.restaurant)),
                Tab(icon: Icon(Icons.local_taxi)),

              ],
            ),
            title: Text('Welcome to the Vortex'),
          ),
          body: TabBarView(
            children: [
              new PostList(),
              new PostList(),
              new PostList(),
              new PostList(),
            ],
          ),
        ),
      ),
    );
  }
}

class Todo {
  final String title;
  final String description;

  Todo(this.title, this.description);
}

class CommentsPage extends StatefulWidget {
  @override
  createState() => new CommentsPageState();

  final Todo todo;

  CommentsPage({Key key, @required this.todo}) : super(key: key);
}

class CommentsPageState extends State<CommentsPage> with AutomaticKeepAliveClientMixin<CommentsPage>{
  List<String> _comments = [];
  bool get wantKeepAlive => true;
  List<bool> isFlaggedList = [];
  List<bool>isLikedList = [];
  List<bool>isDislikedList = [];
  List<int>flagCountList = [];
  List<int>likeCountList = [];
  List<int>dislikeCountList = [];
  final commentController = TextEditingController();

  void dispose() {
    // Clean up the controller when the widget is disposed.
    commentController.dispose();
    super.dispose();
  }


    void _addComment(String val){
    if (val.length >0) {
      setState(() => _comments.insert(0, val));
      setState(() => isFlaggedList.insert(0, false));
      setState(() => isLikedList.insert(0, false));
      setState(() => isDislikedList.insert(0, false));
      setState(() => flagCountList.insert(0, 0));
      setState(() => likeCountList.insert(0, 0));
      setState(() => dislikeCountList.insert(0, 0));
    }
  }

  Widget _buildCommentList(){
    return ListView.builder(
      itemBuilder: (context, index) {
        if (index < _comments.length) {
          return _buildCommentItem(_comments[index], index);
        }
        return null;
      },
    );
  }




  void toggleFlagCount(isFlagged, flagCount, index) {
    setState(() {
      if (isFlagged) {
        flagCountList[index] -= 1;
        isFlaggedList[index] = false;
      } else {
        flagCountList[index] += 1;
        isFlaggedList[index] = true;
      }
    });
  }

  void toggleLikeCount(isLiked, likeCount, index) {
    setState(() {
      if (isLiked) {
        likeCountList[index] -= 1;
        isLikedList[index] = false;
      } else {
        likeCountList[index] += 1;
        isLikedList[index] = true;
      }
    });
  }

  void toggleDislikeCount(isDisliked, dislikeCount, index) {
    setState(() {
      if (isDisliked) {
        dislikeCountList[index] -= 1;
        isDislikedList[index] = false;
      } else {
        dislikeCountList[index] += 1;
        isDislikedList[index] = true;
      }
    });
  }


  Widget _buildCommentItem(String comment, int index) {
    bool isFlagged = isFlaggedList[index];
    bool isLiked = isLikedList[index];
    bool isDisliked = isDislikedList[index];
    int flagCount = flagCountList[index];
    int likeCount = likeCountList[index];
    int dislikeCount = dislikeCountList[index];
    return new ListTile(
      title: new Text(comment),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
      trailing: Row(mainAxisSize: MainAxisSize.min,
        children: <Widget> [
          IconButton(icon: Icon(Icons.flag),  color: isFlagged ? Colors.redAccent:null, iconSize: 30, onPressed: () {
            setState(() {
              //_pressed(isPressed);
              toggleFlagCount(isFlagged, flagCount, index);

            });
          }),
          Text(flagCount.toString()),
          IconButton(icon: Icon(Icons.keyboard_arrow_up),  color: isLiked ? Colors.deepPurpleAccent:null, iconSize: 30, onPressed: () {
            setState(() {
              //_pressed(isPressed);
              toggleLikeCount(isLiked, likeCount, index);
            });
          }),
          Text(likeCount.toString()),



          IconButton(icon: Icon(Icons.keyboard_arrow_down), color: isDisliked ? Colors.orangeAccent:null, iconSize: 30, onPressed: () {
            setState(() {
              toggleDislikeCount(isDisliked, dislikeCount, index);
            });
          }),
          Text(dislikeCount.toString()),
        ],
      ),



    );
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: new AppBar(
            title: Text("Comments"),
            backgroundColor: new Color(0xFF131515)),
        body: Column(children: <Widget>[
          new ListTile(
              title: new Text(widget.todo.title),
              subtitle: new Text(widget.todo.description),
              contentPadding: const EdgeInsets.all(20.0)
          ),
          Expanded(child: _buildCommentList()),

          new TextField(
            controller: commentController,
            onSubmitted: (String submittedStr) {
              _addComment(submittedStr);
              commentController.clear();
            },
            decoration: InputDecoration(
                contentPadding: const EdgeInsets.all(20.0),
                hintText: "add a comment"

            ),
          )
        ]));
  }
}


class PostList extends StatefulWidget {
  @override
  createState() => new PostListState();
}


class PostListState extends State<PostList> with AutomaticKeepAliveClientMixin<PostList>{
  List<String> _postItems = [];
  bool get wantKeepAlive => true;
  List<bool> isFlaggedList = [];
  List<bool>isLikedList = [];
  List<bool>isDislikedList = [];
  List<int>flagCountList = [];
  List<int>likeCountList = [];
  List<int>dislikeCountList = [];
  Future<Post> post;
//  List<String> _authors = [];
  List<String> _subtitles = [];
  final titleController = TextEditingController();
  final subtitleController = TextEditingController();

  void dispose() {
    // Clean up the controller when the widget is disposed.
    titleController.dispose();
    subtitleController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    post = fetchPost();
  }

//  void _addPostItem(String task) {
//    if(task.length > 0) {
//      setState(() => _postItems.insert(0, task));
//      setState(() => isFlaggedList.insert(0, false));
//      setState(() => isLikedList.insert(0, false));
//      setState(() => isDislikedList.insert(0, false));
//      setState(() => flagCountList.insert(0, 0));
//      setState(() => likeCountList.insert(0, 0));
//      setState(() => dislikeCountList.insert(0, 0));
//    }
//  }
//
  void _addPostItem(String task, String subtitle) {
    if(task.length > 0) {
      _postItems.insert(0, task);
      isFlaggedList.insert(0, false);
      isLikedList.insert(0, false);
      isDislikedList.insert(0, false);
      flagCountList.insert(0, 0);
      likeCountList.insert(0, 0);
      dislikeCountList.insert(0, 0);
//      _authors.insert(0, author);
      _subtitles.insert(0,subtitle);
    }
  }

  void _removePostItem(int index) {
    setState(() => _postItems.removeAt(index));
  }

  _commentPressed(String title, String subtitle){
    setState(() {
      Navigator.push(context, MaterialPageRoute(builder: (context) => CommentsPage(todo: Todo(title, subtitle))));
    });
  }

  void _promptFlagPost(int index) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return new AlertDialog(
              title: new Text('Flag "${_postItems[index]}" as inappropriate?'),
              actions: <Widget>[
                new FlatButton(
                    child: new Text('CANCEL'),
                    // The alert is actually part of the navigation stack, so to close it, we
                    // need to pop it.
                    onPressed: () => Navigator.of(context).pop()
                ),
                new FlatButton(
                    child: new Text('FLAG POST'),
                    onPressed: () {
                      _removePostItem(index);
                      Navigator.of(context).pop();
                    }
                )
              ]
          );
        }
    );
  }

  // Build the whole list of post items
  Widget _buildPostList() {
    return FutureBuilder<Post>(
        future: post,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            if(_postItems.indexOf(snapshot.data.title) == -1){
            _addPostItem(snapshot.data.title, snapshot.data.body);}
          } else if (snapshot.hasError) {
            return Text("${snapshot.error}");
          }

          return new ListView.builder(
            itemBuilder: (context, index) {
              // itemBuilder will be automatically be called as many times as it takes for the
              // list to fill up its available space
              if (index < _postItems.length) {
                return _buildPostItem(_postItems[index], _subtitles[index], index);
              }
              return null;
            },
          );
        }
      );
    }

  // Build a single  item
  Widget _buildPostItem(String postText, String subtitle, int index) {
    bool isFlagged = isFlaggedList[index];
    bool isLiked = isLikedList[index];
    bool isDisliked = isDislikedList[index];
    int flagCount = flagCountList[index];
    int likeCount = likeCountList[index];
    int dislikeCount = dislikeCountList[index];

    return new ListTile(
        leading: new Image.asset("assets/images/Group3.png"),
        title: new Text(postText),
//        subtitle: new Text(author),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
        trailing: Row(mainAxisSize: MainAxisSize.min,
          children: <Widget> [
            IconButton(icon: Icon(Icons.flag),  color: isFlagged ? Colors.redAccent:null, iconSize: 30, onPressed: () {
              setState(() {
                //_pressed(isPressed);
                toggleFlagCount(isFlagged, flagCount, index);
                _promptFlagPost(index);

              });
            }),
            Text(flagCount.toString()),
            IconButton(icon: Icon(Icons.keyboard_arrow_up),  color: isLiked ? Colors.deepPurpleAccent:null, iconSize: 30, onPressed: () {
              setState(() {
                //_pressed(isPressed);
                toggleLikeCount(isLiked, likeCount, index);
              });
            }),
            Text(likeCount.toString()),



            IconButton(icon: Icon(Icons.keyboard_arrow_down), color: isDisliked ? Colors.orangeAccent:null, iconSize: 30, onPressed: () {
              setState(() {
                toggleDislikeCount(isDisliked, dislikeCount, index);
              });
            }),
            Text(dislikeCount.toString()),
          ],
        ),



        onTap: () => _commentPressed(postText, subtitle)
    );
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return new Scaffold(
//      appBar: new AppBar(
//          title: new Text('Vortex Feed'),
//          backgroundColor: new Color(0xFF7646FF)
//      ),
      body: _buildPostList(),
      floatingActionButton: new FloatingActionButton(
          heroTag: null,
          onPressed: _pushAddPostScreen,
          tooltip: 'Add Post',
          child: new Icon(Icons.add),
          backgroundColor: Color(0xFFFFAE34)
      ),
    );
  }

  void toggleFlagCount(isFlagged, flagCount, index) {
    setState(() {
      if (isFlagged) {
        flagCountList[index] -= 1;
        isFlaggedList[index] = false;
      } else {
        flagCountList[index] += 1;
        isFlaggedList[index] = true;
      }
    });
  }

  void toggleLikeCount(isLiked, likeCount, index) {
    setState(() {
      if (isLiked) {
        likeCountList[index] -= 1;
        isLikedList[index] = false;
      } else {
        likeCountList[index] += 1;
        isLikedList[index] = true;
      }
    });
  }

  void toggleDislikeCount(isDisliked, dislikeCount, index) {
    setState(() {
      if (isDisliked) {
        dislikeCountList[index] -= 1;
        isDislikedList[index] = false;
      } else {
        dislikeCountList[index] += 1;
        isDislikedList[index] = true;
      }
    });
  }

  void _pushAddPostScreen() {
    // Push this page onto the stack
    Navigator.of(context).push(
      // MaterialPageRoute will automatically animate the screen entry, as well as adding
      // a back button to close it
        new MaterialPageRoute(
            builder: (context) {
              return new Scaffold(
                  appBar: new AppBar(
                    title: new Text('Add New Post'),
                    backgroundColor: Color(0xFF131515),
                  ),
                  body: new Column(
                    children: <Widget>[
                      new TextField(
                        autofocus: true,
//                        onSubmitted: (val) {
//                          _addPostItem(val);
//                        },
                        controller: titleController,
                        decoration: new InputDecoration(
                            hintText: 'Title',
                            contentPadding: const EdgeInsets.all(16.0)
                        ),
                      ),
                      new TextField(
                        autofocus: true,
//                        onSubmitted: (dval) {
//                          _addPostItem(dval);
//                        },
                        controller: subtitleController,
                        decoration: new InputDecoration(
                            hintText: 'Description',
                            contentPadding: const EdgeInsets.all(16.0)
                        ),
                      ),
                      FlatButton(
                        child: Text('Submit'),
                        onPressed: () {
                          _addPostItem(titleController.text, subtitleController.text);
                          Navigator.pop(context);
                        }
                      ),
                    ]
                  )
              );
            }
        )
    );
  }
}




class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Login'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  TextStyle style = TextStyle(fontFamily: 'Montserrat', fontSize: 20.0);

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.

    final emailField = TextField(
      obscureText: false,
      style: style,
      decoration: InputDecoration(
          contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          hintText: "Email",
          border:
          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
    );

    final passwordField = TextField(
      obscureText: true,
      style: style,
      decoration: InputDecoration(
          contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          hintText: "Password",
          border:
          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
    );

    final loginButton = Material(
      elevation: 5.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.deepPurpleAccent,
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => VortexApp()),
          );
        },
        child: Text("Login",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );



    final usernameField = TextField(
      obscureText: false,
      style: style,
      decoration: InputDecoration(
          contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          hintText: "Username",
          border:
          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
    );

    final phoneNumberField = TextField(
      obscureText: false,
      style: style,
      decoration: InputDecoration(
          contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          hintText: "Phone (Ex:1234567890)",
          border:
          OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
    );

    final SignUpFinalButton = Material(
      elevation: 5.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.orangeAccent,
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => VortexApp()),
          );
        },
        child: Text("Sign Up",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );





    void _SignUpScreen() {
      // Push this page onto the stack
      Navigator.of(context).push(
        // MaterialPageRoute will automatically animate the screen entry, as well as adding
        // a back button to close it
          new MaterialPageRoute(
              builder: (context) {
                return Scaffold(
                    body: SingleChildScrollView(
                      child: Center(
                        child: Container(
                          color: Colors.white,
                          child: Padding(
                            padding: const EdgeInsets.all(36.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                SizedBox(
                                  height: 300.0,
                                  child: Image.asset(
                                    "assets/images/Group.png",
                                    fit: BoxFit.contain,
                                  ),
                                ),
                                SizedBox(height: 45.0),
                                usernameField,
                                SizedBox(height: 25.0),
                                emailField,
                                SizedBox(height: 25.0),
                                phoneNumberField,
                                SizedBox(height: 25.0),
                                passwordField,
                                SizedBox(
                                    height: 40.0
                                ),
                                SignUpFinalButton,
                              ],
                            ),
                          ),
                        ),
                      ),
                    )
                );

              }
          )
      );
    }

    final signupButton = Material(
      elevation: 5.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.orangeAccent,
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: _SignUpScreen,
        child: Text("Sign Up",
            textAlign: TextAlign.center,
            style: style.copyWith(
                color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );


    return Scaffold(
        body: SingleChildScrollView(
          child: Center(
            child: Container(
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(36.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(
                      height: 300.0,
                      child: Image.asset(
                        "assets/images/Group3.png",
                        fit: BoxFit.contain,
                      ),
                    ),
                    SizedBox(height: 45.0),
                    usernameField,
                    SizedBox(height: 25.0),
                    passwordField,
                    SizedBox(
                      height: 35.0,
                    ),
                    SizedBox(
                        height: 40.0
                    ),
                    loginButton,
                    SizedBox(
                      height: 15.0,
                    ),
                    signupButton,
                    SizedBox(
                      height: 15.0,
                    )

                  ],
                ),
              ),
            ),
          ),
        )
    );
  }
}

class Post {
  final int pid;
  final int chid;
  final int uid;
  final String title;
  final String body;
  final int upvote;
  final int downvote;
  final int flag;
  final DateTime deletedat;
  final String username;

  Post({this.pid, this.chid, this.uid, this.body, this.deletedat, this.downvote,
        this.flag, this.title, this.upvote, this.username});

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      uid: json['uid'],
      pid: json['pid'],
      chid: json['chid'],
      title: json['title'],
      body: json['body'],
      upvote: json['upVote'],
      downvote: json['downVote'],
      flag: json['flag'],
      deletedat: json['deletedAt'],
      username: json['username']
    );
  }
}

class User {
  final int uid;
  final String phonenumber;
  final String password;
  final String username;

  User({this.uid, this.phonenumber, this.password, this.username});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
        uid: json['uid'],
        phonenumber: json['phonenumber'],
        password: json['password'],
        username: json['username']
    );
  }
}

Future<Post> fetchPost() async {
  final response =
  await http.get('https://jsonplaceholder.typicode.com/posts/1');

  if (response.statusCode == 200) {
    // If server returns an OK response, parse the JSON.
    return Post.fromJson(json.decode(response.body));
  } else {
    // If that response was not OK, throw an error.
    throw Exception('Failed to load post');
  }
}