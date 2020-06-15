#!/usr/local/bin/python3

from cgitb import enable 
enable()

from cgi import FieldStorage
from html import escape

import pymysql as db
            
print('Content-Type: text/plain')
print()

form_data = FieldStorage()
points = escape(form_data.getfirst('score', '').strip())
username = escape(form_data.getfirst('username', '').strip())

try:    
    connection = db.connect('cs1.ucc.ie', 'cab2', 'ahnga', 'cs6503_cs1106_cab2')
    cursor = connection.cursor(db.cursors.DictCursor)
    cursor.execute("""SELECT max_points FROM users 
                              WHERE username = %s""", (username))
    if cursor.rowcount > 0:
        sql_points = cursor.fetchone()
        current_points = int(sql_points['max_points'])
        cursor.execute("""UPDATE users
                          SET total_points = total_points + %s 
                          WHERE username = %s""", (points, username))
        if int(points) > current_points:
            cursor.execute("""UPDATE users
                              SET max_points = %s
                              WHERE username = %s""", (points, username))
            print('success')
        else:
            print('wassup')
        connection.commit()
    else:
        print('failure')
        

    cursor.close()  
    connection.close()
except db.Error:
    print('problem')