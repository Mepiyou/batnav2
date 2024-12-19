<?php
$host = 'localhost';
$dbname = 'batnav';
$username = 'gamer';
$password = 'Meps23';

try {

    $pdo = new PDO("mysql:host=$host;dbname=$dbname",$username,$password);
    $pdo -> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e){
    echo "Erreur de connexion a la bd ";
}
