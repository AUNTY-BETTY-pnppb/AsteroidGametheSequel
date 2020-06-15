#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = '<p>You are already logged out</p>'
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=True)
            session_store['authenticated'] = False
            session_store.close()
            result = """
                <p>You are now logged out. Thanks for playing Space, Asteroids and Dinosaurs. Come back soon!</p>
                <p><a href="index.py">Home</a></p> 
                <p><a href="login.py">Login again</a></p>"""
except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

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
            %s
        </main>
        </body>
    </html>""" % (result))