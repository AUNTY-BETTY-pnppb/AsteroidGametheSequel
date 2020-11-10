#!/usr/local/bin/python3

from cgitb import enable 
enable()

from cgi import FieldStorage
from html import escape
from hashlib import sha256
from time import time
from shelve import open
from http.cookies import SimpleCookie
import pymysql as db

form_data = FieldStorage()
username = ''
result = ''
if len(form_data) != 0:
    username = escape(form_data.getfirst('username', '').strip())
    password = escape(form_data.getfirst('password', '').strip())
    if not username or not password:
        result = '<p>Error: user name and password are required</p>'
    else:
        sha256_password = sha256(password.encode()).hexdigest()
        try:
            connection = db.connect()
            cursor = connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT max_points FROM users 
                              WHERE username = %s
                              AND password = %s""", (username, sha256_password))
            if cursor.rowcount == 0:
                result = '<p>Error: incorrect user name or password</p>'
            else:
                sql_points = cursor.fetchone()
                current_points = sql_points['max_points']
                cookie = SimpleCookie()
                sid = sha256(repr(time()).encode()).hexdigest()
                cookie['sid'] = sid
                session_store = open('sess_' + sid, writeback=True)
                session_store['authenticated'] = True
                session_store['username'] = username
                session_store['max_points'] = current_points
                session_store.close()
                result = """
                   <p>Succesfully logged in!</p>
                   <p>Welcome back to Space, Asteroids and Dinosaurs.</p>
                   <ul>
                       <li><a href="index.py">Home</a></li> 
                       <li><a href="logout.py">Logout</a></li>
                   </ul>"""
                print(cookie)
            cursor.close()  
            connection.close()
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
            <title>Space, Asteroids and Dinosaurs</title>
            <link rel="stylesheet" href="asteroids.css">
        </head>
        <body>
            <a href="index.py"><header id="top">
                <h1>Space, Asteroids and Dinosaurs</h1>
            </header></a>
            <main>
            <form action="login.py" method="post">
                <label for="username">Username: </label>
                <input type="text" name="username" id="username" value="%s" />
                <label for="password">Password: </label>
                <input type="password" name="password" id="password" />
                <input type="submit" value="Login" />
            </form>
            %s
            </main>
        </body>
    </html>""" % (username, result))
