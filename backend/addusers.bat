node -e "const sqlite3=require('sqlite3'); const db=new sqlite3.Database('./database.sqlite'); db.run(\"update users set status='Deleted' where username='editor_user'\", function(e){ if(e) throw e; console.log('updated rows:', this.changes); db.close(); });"
curl -i -H "token: editor_user" http://localhost:3000/
curl -i -X POST http://localhost:3000/users/login/editor_user
