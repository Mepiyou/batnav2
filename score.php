<?php

/*
require_once("./db_connect.php");
$sql = "UPDATE scores
SET score = (
    SELECT COUNT(type)
    FROM bateaux
    WHERE bateaux.total_cells = bateaux.touched_cells
)
WHERE player = 'player1';
";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC); 
*/

if (isset($_POST['player_id'])) {
    $player_id = $_POST['player_id'];
    // Traitement de player_id
    echo "Le score pour le joueur $player_id est : ..."; // Exemple de réponse
} else {
    echo "player_id non fourni";
}




require_once("./db_connect.php");

if ($player_id = 1){

$sql_count = "SELECT COUNT(type)
              FROM bateaux
              WHERE bateaux.total_cells = bateaux.touched_cells and player_id = 1";

$stmt_count = $pdo->prepare($sql_count);
$stmt_count->execute();
$score = $stmt_count->fetchColumn(); // Récupérer la valeur du COUNT

$sql_update = "UPDATE scores
               SET score = :score
               WHERE player = 'player1'";

$stmt_update = $pdo->prepare($sql_update);
$stmt_update->bindParam(':score', $score, PDO::PARAM_INT);
$stmt_update->execute();


$sql_select = "SELECT score
               FROM scores
               WHERE player = 'player1'";

$stmt_select = $pdo->prepare($sql_select);
$stmt_select->execute();
$new_score = $stmt_select->fetchColumn(); // Récupérer la valeur du score mise à jour

echo "score : $new_score";}


else {

$sql_count = "SELECT COUNT(type)
              FROM bateaux
              WHERE bateaux.total_cells = bateaux.touched_cells and player_id = 2";

$stmt_count = $pdo->prepare($sql_count);
$stmt_count->execute();
$score = $stmt_count->fetchColumn(); // Récupérer la valeur du COUNT

$sql_update = "UPDATE scores
               SET score = :score
               WHERE player = 'player2'";

$stmt_update = $pdo->prepare($sql_update);
$stmt_update->bindParam(':score', $score, PDO::PARAM_INT);
$stmt_update->execute();


$sql_select = "SELECT score
               FROM scores
               WHERE player = 'player2'";

$stmt_select = $pdo->prepare($sql_select);
$stmt_select->execute();
$new_score = $stmt_select->fetchColumn(); // Récupérer la valeur du score mise à jour

echo "score : $new_score";}

?>




