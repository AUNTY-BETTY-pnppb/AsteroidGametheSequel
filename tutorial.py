#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

user = ""
result = """
       <li><a href="register.py">Register</a></li>
       <li><a href="login.py">Login</a></li>
   </ul></nav>"""
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=False)
            if session_store.get('authenticated'):
                user = "%s" % session_store.get('username')
                result = """
    	                <li><a href="scoreboard.py">Leaderboard</a></li>
                        <li><a href="logout.py">Logout</a></li>
                        </ul></nav>"""
            session_store.close()
except IOError:
    user = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

        
print('Content-Type: text/html')
print()
print("""
    <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="shortcut icon" href="images/asteroid.png"/>
        <title>Asteroids</title>
        <link rel="stylesheet" href="asteroids.css">
        <script src="tutorial.js" type="module"></script>
    </head>
    <body>
        <a href="index.py"><header id="top">
            <h1>Space, Asteroids and Dinosaurs</h1>
        </header></a>
        <nav id=menu>                
            <ul>
                <li><a href="index.py">Home</a></li>
                <li><a href="asteroids.py">Play</a></li>
                <li><a href="">Tutorial</a></li>
                %s
        <canvas width="1500" height="650">
        </canvas>
        <p id="username">%s</p>
    </body>
</html>""" % (result, user))