#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie
import pymysql as db

result = """
       <li><a href="register.py">Register</a></li>
       <li><a href="login.py">Login</a></li>
   </ul></nav><main>"""

welcome = """<p>Are you a fan of spaceships? What about dinosaur robots? Combine the best of both worlds with 'Space, Asteroids and Dinosaurs'! Play this free online space shooting game now. 
                <a href="register.py">Register</a> or <a href="login.py">login</a> to see your's and other's top scores.<p>"""

try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=True)
            if session_store.get('authenticated'):
                connection = db.connect('cs1.ucc.ie', 'cab2', 'ahnga', 'cs6503_cs1106_cab2')
                cursor = connection.cursor(db.cursors.DictCursor)
                cursor.execute("""SELECT max_points, total_points FROM users
                                  WHERE username = %s""", (session_store.get('username')))
                sql_points = cursor.fetchone()
                max_points = sql_points['max_points']
                total_points = sql_points['total_points']
                result = """
    	                <li><a href="scoreboard.py">Leaderboard</a></li>
                        <li><a href="logout.py">Logout</a></li>
                        </ul></nav>
                        <main>
                        """
                welcome = """<p>Hello %s, nice to see you again.
                             Your highest score is %s points and your total points adds up to %s points.</p>""" % (session_store.get('username'), max_points, total_points)
            session_store.close()
except db.Error:
    welcome = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

        
print('Content-Type: text/html')
print()
print("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial_scale=1.0, width=device-width"/>
        <link rel="shortcut icon" href="images/asteroid.png"/>
        <title>Asteroids</title>
        <link rel="stylesheet" href="asteroids.css">
    </head>
    <body>
         <a href=""><header id="top">
            <h1>Space, Asteroids and Dinosaurs</h1>
        </header></a>

        <nav id=menu>                
            <ul>
                <li><a href="">Home</a></li>
                <li><a href="asteroids.py">Play</a></li>
                <li><a href="tutorial.py">Tutorial</a></li>
                %s
        <section>
                <h1>Welcome!</h1>
            
                    %s
        </section>
        <figure id=link>
             <a target="_blank" href="tutorial.py"><img src="images/tutorial.png" title="Tutorial"
                 alt="Tutorial" /></a>
            <figcaption>Tutorial</figcaption>
             <a target="_blank" href="asteroids.py"><img src="images/play.png" title="Campaign"
                    alt="Campaign" /></a>
            <figcaption>Campaign</figcaption>

        </figure>
        </main>
        <footer>
            <p><small>&copy; Space, Asteroids and Dinosaurs. All rights reserved</small><p>
        </footer>
    </body>
    
</html>""" % (result, welcome))