#!/usr/local/bin/python3
    
from cgitb import enable
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie
from cgi import FieldStorage
import pymysql as db
from html import escape

result = "<p>You are not allowed to see this content. Please register an account or login.</p>"
total = ""
menu = """<li><a href="register.py">Register</a></li>
       <li><a href="login.py">Login</a></li>"""
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=False)
            if session_store.get('authenticated'):
                connection = db.connect)
                cursor = connection.cursor(db.cursors.DictCursor)
                cursor.execute(""" SELECT username, max_points 
                                FROM users 
                                ORDER BY max_points DESC""")

                result = """
                            <table id=highscore>
                                <caption>Highest Score</caption>
                                        <tr>
                                            <th>User</th>
                                            <th>Score</th>
                                        </tr>"""

                for row in cursor.fetchall():
                    result += """
                                <tr>
                                    <td>%s</td>
                                    <td>%s</td>
                                </tr>""" % (row["username"], row["max_points"])

                result += "</table>"

                cursor.execute(""" SELECT username, total_points 
                                FROM users 
                                ORDER BY total_points DESC""")

                total = """
                            <table>
                                <caption>Accmulated Points</caption>
                                        <tr>
                                            <th>User</th>
                                            <th>Points</th>
                                        </tr>"""

                for row in cursor.fetchall():
                    total += """
                                <tr>
                                    <td>%s</td>
                                    <td>%s</td>
                                </tr>""" % (row["username"], row["total_points"])

                total += "</table>"

                menu = """<li><a href="">Leaderboard</a></li>
                        <li><a href="logout.py">Logout</a></li>"""
                cursor.close()
                connection.close()
            session_store.close()

except (db.Error, IOError):
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

        
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
    </head>
    <body>
        <a href="index.py"><header id="top">
            <h1>Space, Asteroids and Dinosaurs</h1>
        </header></a>
        <nav id=menu>                
            <ul>
                <li><a href="index.py">Home</a></li>
                <li><a href="asteroids.py">Play</a></li>
                <li><a href="tutorial.py">Tutorial</a></li>
                %s
            </ul>
        </nav>
        <main>
            <h1>The Leaderboards</h1>
                %s
                %s
        </main>
    </body>
</html>""" % (menu, result, total))
