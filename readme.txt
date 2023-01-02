Requirements: 
    Node install : https://nodejs.org/en/download/
    npm install
    MySQL install (sql server & workbench only): https://dev.mysql.com/downloads/installer/
    mysql -u root -p
    mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'WM1234'

Infos:
    Auto execution: C:\Windows\System32\cmd.exe /c PowerShell.exe -WindowStyle hidden [command]
    Remote connection to MySql server:
        create user 'username'@'ip' identified by 'password'; // creating user
        grant all on *.* to 'username'@'ip'; // granting privileges
        flush privileges; // refresh privileges
        select host, user from mysql.user; // See users
        Create a new connection on mysql workbench with same username ip and password
        Add sql port to the firewall inbound rules (wf.msc)
        flush hosts // refresh connected hosts
        Or just use this if you don't wanna create new user: 
        UPDATE mysql.user SET Host='%' WHERE Host='localhost' AND User='username';

Todo: 
    Create silmilaire app:
        disable editing description and and file status
        hide save and delete button