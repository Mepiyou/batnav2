<?php
/*
require_once("./db_connect.php");
$sql = "UPDATE bateaux
SET touched_cells = (
    SELECT COUNT(*)
    FROM game
    WHERE game.bateau_id = bateaux.bateau_id AND game.touche = TRUE
)
WHERE EXISTS (
    SELECT 1
    FROM game
    WHERE game.bateau_id = bateaux.bateau_id
);
";

$stmt = $pdo->prepare($sql);
$stmt->execute();*/

require_once("./db_connect.php");

if (isset($_GET['player_id'])) {
    $player_id = $_GET['player_id'];

    
    $sql = "UPDATE bateaux
        SET touched_cells = (
        SELECT COUNT(*)
        FROM game
        WHERE game.bateau_id = bateaux.bateau_id
        AND game.touche = TRUE
        AND game.player_id = :player_id 
    )
    WHERE EXISTS (
        SELECT 1
        FROM game
        WHERE game.bateau_id = bateaux.bateau_id
        AND game.player_id = :player_id  
    );
    ";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':player_id', $player_id, PDO::PARAM_INT);
        $stmt->execute();
        echo "Mise à jour réussie.";
    } catch (Exception $e) {
        echo "Erreur lors de la mise à jour : " . $e->getMessage();
    }
} else {
    echo "Player ID non fourni.";
}
?>
