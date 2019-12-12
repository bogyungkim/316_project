# Vortex
```
An anonymous, proximity-based social media application catered towards Duke students,
but with the capability to easily expand to students on other college campuses.
```
* Brief overveiw of how the code is structured (client side)
  
The bulk of the front-end exists in creating PostList, as PostList has to both retrieve
information from the server and be able to make and alter information on posts. We decided
to go with parallel lists to contain posts rather than a list of Posts items so that we could
choose what information was retained within frontend and increase running efficiency of the
app. Because the apis returned Post items as lists that contained many sublists as well as
some information that was mainly important for handling in backend, we decided that first
processing this information for whether user id was contained in list, then storing only
relevant front-end information like list length would be the most efficient way to run the app.
When creating comments, we decided that the best method was to modify and reimplement a
revised version of our postlist with parallel lists, as we believe the logic that creates an
efficient postlist would hold up for a commentslist. It also enabled us to easily integrate
server requests.
We also decided to separate postlists and comments lists into segmentable classes whose
code be reused for each postlist and comment list we created. This enabled us to save code
for redundant parts of our front-end design. Instead of creating a new post list for each
channel, and a new comments list for each post, we can make one call to postlist or
comments and they will be populated differently.
Lastly, we pass only relevant information between classes when switching between users,
posts, and comments pages. For example, we only pass information like uid and pid to
comments, rather than the entire user and post class, as some of that information is not
relevant to the comments page. In doing this, we ensure smaller and faster transfers between
pages and classes, which will make a difference in terms of performance, especially on
slower devices.

* Brief overview of how the code is structured (server side)
> Server
    > .Serverless
    > Controller
        > helper.js
        > upload_controller.js
        > user_controller.js
    > Models
        > Scripts
              > fill.sql      
        > queries.js
    > node_modules
    > configuration files (.babelrc, .env, package.json, package-lock.json, webpack-config.js, 
serverless.yml)
    > index.js
    > README.md
    > API.md

We have three different layers (index.js, queries.js, and controller.js), which are consecutively connected to call APIs. Index.js will call either queries.js or controller.js based on their usability of PostgreSQL database. Queries will call APIs with database calls, and controllers will call APIs related to AWS S3 and user authentication. Further details about configuration files are described in application architecture and configuration files section.

* How to set up our system
Since our database and backend webserver are serverless, there is no need to set up server and database. But if you want to run locally, you can follow the steps https://github.com/bogyungkim/316_project/blob/master/server/README.md

But we can present how data within the database are deployed when the app is running by showing DataGrip. What needs to be done is to compile and deploy our application. When we present, we will demo using the simulator. Meanwhile, to execute the app in a new environment, one needs to install the following to run flutter: 

Once  all the pre-requisites above are installed, open IOS simulator or one can use one’s own device. (We used android studio ios simulator.)  Then, one should run 'flutter run' in Client folder of our github codes.  (https://flutter.dev/docs/get-started/install/macos)

* Limitations and further improvement

Although our app does great job on what it is designed to be, we still have some room for future improvements. 

As we mentioned above, the current system allows users to upvote, downvote or flag on the post that they wrote. Also we only have 4 channels, so we can definitely work on expanding the number of channels to better facilitate the communication. And the app does not allow users to edit the title or content of their posts or comments. 
  
If we have more time, we would like to make a couple more features to make our app safer and more engaging. We could make a few more tables such as Token Table to avoid handing uid directly to frontend. Also, we could have a table which seperates user authentication information (uid, password) not to give our hashed password to the frontend side.

Also, we are planning to work on a proximity feature which only allows users who are located within a certain distance from the campus at the time of making posts to communicate in the application. We believe this feature will make the app more safe and trustworthy. The clout system has another room for improvement. In order to make users keep revisiting the app, we need to give them the incentive for doing so and giving the users clout seems to be perfect.

Lastly the flag system would be made more complex, and could consist of choices for flagging, for example choosing if a post is offensive or if it just doesn’t fit into a certain channel and should be posted elsewhere. Different levels of flags result in different consequences.

Like above, we have some features that need further development and some more to be newly made. We are excited to keep working on this app and see how far it can go.
