import 'package:flutter/material.dart';
import 'vortex.dart';
import 'user_api.dart';
import 'package:http/http.dart' as http;


class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  TextStyle style = TextStyle(fontFamily: 'Montserrat', fontSize: 20.0);
  final userController = TextEditingController();
  final passwordController = TextEditingController();
  final allController = TextEditingController();
  final phonecontroller = TextEditingController();

  @override
  Widget build(BuildContext context) {

    final passwordField = TextField(
        obscureText: true,
        style: style,
        decoration: InputDecoration(
            contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
            hintText: "Password",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
        controller: passwordController
    );

    final allField = TextField(
        obscureText: false,
        style: style,
        decoration: InputDecoration(
            contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
            hintText: "Phone number or username",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
        controller: allController
    );

    void authenticate(User value) {
      Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => VortexApp(user: value)));
    }

    void _userPopup(String error) {
      showDialog(
          context: context,
          builder: (BuildContext context) {
            return new AlertDialog(
                title: new Text(error),
            );
          }
      );
    }

    final loginButton = Material(
      elevation: 5.0,
      borderRadius: BorderRadius.circular(30.0),
      color: Colors.deepPurpleAccent,
      child: MaterialButton(
        minWidth: MediaQuery.of(context).size.width,
        padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
        onPressed: () {
          Future<User> future = fetchUser(http.Client(), allController.text, passwordController.text);
          future.then((value) => authenticate(value))
              .catchError((error) => _userPopup(error));
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
        controller: userController
    );

    final phoneNumberField = TextField(
        obscureText: false,
        style: style,
        decoration: InputDecoration(
            contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
            hintText: "Phone (Ex:1234567890)",
            border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(32.0))),
        controller: phonecontroller
    );

    final SignUpFinalButton = Material(
        elevation: 5.0,
        borderRadius: BorderRadius.circular(30.0),
        color: Colors.orangeAccent,
        child: MaterialButton(
          minWidth: MediaQuery.of(context).size.width,
          padding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
          onPressed: () {
            Future<User> future = fetchNewUser(http.Client(), userController.text, passwordController.text, phonecontroller.text);
            future.then((value) => authenticate(value))
                .catchError((error) => _userPopup(error));
          },
          child: Text("Sign Up",
              textAlign: TextAlign.center,
              style: style.copyWith(
                  color: Colors.white, fontWeight: FontWeight.bold)),
        )
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
                    SizedBox(height: 45.0),
                    SizedBox(
                      height: 300.0,
                      child: Image.asset(
                        "assets/images/Group3.png",
                        fit: BoxFit.contain,
                      ),
                    ),
                    SizedBox(height: 45.0),
                    allField,
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