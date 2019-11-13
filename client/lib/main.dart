// Import MaterialApp and other widgets which we can use to quickly create a material app
import 'package:flutter/material.dart';

// Code written in Dart starts exectuting from the main function. runApp is part of
// Flutter, and requires the component which will be our app's container. In Flutter,
// every component is known as a "widget".
void main() => runApp(new VortexApp());

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
class PostList extends StatefulWidget {
  @override
  createState() => new PostListState();
}

class PostListState extends State<PostList> with AutomaticKeepAliveClientMixin<PostList>{
  List<String> _postItems = [];
  bool get wantKeepAlive => true;
  List<bool>isLikedList = [];
  List<bool>isDislikedList = [];
  List<int>likeCountList = [];
  List<int>dislikeCountList = [];



  void _addPostItem(String task) {
    if(task.length > 0) {
      setState(() => _postItems.insert(0, task));
      setState(() => isLikedList.insert(0, false));
      setState(() => isDislikedList.insert(0, false));
      setState(() => likeCountList.insert(0, 0));
      setState(() => dislikeCountList.insert(0, 0));
    }
  }

  void _removePostItem(int index) {
    setState(() => _postItems.removeAt(index));
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
    return new ListView.builder(
      itemBuilder: (context, index) {
        // itemBuilder will be automatically be called as many times as it takes for the
        // list to fill up its available space
        if(index < _postItems.length) {
          return _buildPostItem(_postItems[index], index);
        }
        return null;
      },
    );
  }
  // Build a single  item
  Widget _buildPostItem(String postText, int index) {
    bool isLiked = isLikedList[index];
    bool isDisliked = isDislikedList[index];
    int likeCount = likeCountList[index];
    int dislikeCount = dislikeCountList[index];

    return new ListTile(
        title: new Text(postText),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
        trailing: Row(mainAxisSize: MainAxisSize.min,
          children: <Widget> [
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



        onTap: () => _promptFlagPost(index)
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
                  body: new TextField(
                    autofocus: true,
                    onSubmitted: (val) {
                      _addPostItem(val);
                      Navigator.pop(context); // Close the add post screen
                    },
                    decoration: new InputDecoration(
                        hintText: 'Write a new post!',
                        contentPadding: const EdgeInsets.all(16.0)
                    ),
                  )
              );
            }
        )
    );
  }
}