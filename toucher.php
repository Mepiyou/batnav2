<?php

$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

$row = $data['row'];
$column = $data['column'];
$bateau_id = $data['bateau_id'];

$response = [
    'status' => 'success',
    'row' => $row,
    'column' => $column,
    'bateau_id' => $bateau_id,
    'message' => 'Données reçues avec succès'
];

require_once("./db_connect.php");

$sql = "UPDATE game SET touche = TRUE WHERE game.row = :row AND game.column = :column AND game.bateau_id = :bateau_id;";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(':row', $row, PDO::PARAM_INT);
$stmt->bindParam(':column', $column, PDO::PARAM_INT);
$stmt->bindParam(':bateau_id', $bateau_id, PDO::PARAM_INT);

$stmt->execute();

$response['message'] = 'Mise à jour effectuée avec succès';



echo json_encode($response);

?>
