<?php
function executeGameUpdates($pdo)
{
    try {
        // 1) Mettre à jour la table 'game' pour définir 'touche' à false
        $query1 = "UPDATE `game` SET `touche` = false";
        $stmt1 = $pdo->prepare($query1);
        $stmt1->execute();

        // 2) Mettre à jour la table 'bateaux' pour calculer 'touched_cells'
        $query2 = "UPDATE bateaux
                   SET touched_cells = (
                       SELECT COUNT(*)
                       FROM game
                       WHERE game.bateau_id = bateaux.bateau_id AND game.touche = TRUE
                   )
                   WHERE EXISTS (
                       SELECT 1
                       FROM game
                       WHERE game.bateau_id = bateaux.bateau_id
                   )";
        $stmt2 = $pdo->prepare($query2);
        $stmt2->execute();

        // 3) Mettre à jour la table 'scores' pour 'player1'
        $query3 = "UPDATE scores
                   SET score = (
                       SELECT COUNT(type)
                       FROM bateaux
                       WHERE bateaux.total_cells = bateaux.touched_cells
                   )
                   WHERE player = 'player1'";
        $stmt3 = $pdo->prepare($query3);
        $stmt3->execute();

        // 4) Mettre à jour la table 'scores' pour 'player2'
        $query4 = "UPDATE scores
                   SET score = (
                       SELECT COUNT(type)
                       FROM bateaux
                       WHERE bateaux.total_cells = bateaux.touched_cells
                   )
                   WHERE player = 'player2'";
        $stmt4 = $pdo->prepare($query4);
        $stmt4->execute();

        // Réponse en JSON pour indiquer le succès
        return ['success' => true, 'message' => 'Toutes les requêtes ont été exécutées avec succès!'];

    } catch (PDOException $e) {
        // Réponse en JSON en cas d'erreur
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

require_once("./db_connect.php");
$playerId = isset($_GET['player_id']) ? $_GET['player_id'] : null;

if ($playerId === null) {
    echo json_encode(['error' => 'player_id est requis']);
    exit;
}

$sql = "SELECT COUNT(bateau_id) 
        FROM `bateaux` 
        WHERE `touched_cells` = `total_cells` AND `player_id` = :player_id";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(':player_id', $playerId, PDO::PARAM_INT);
$stmt->execute();

$count = $stmt->fetchColumn();

$response = ['victory' => false];

if ($count == 6) {
    $response['victory'] = true;
    $updateResponse = executeGameUpdates($pdo); 
    //$response = array_merge($response, $updateResponse); // Fusionner la réponse de la mise à jour avec la réponse finale
}

echo json_encode($response); // Envoi de la réponse JSON finale
