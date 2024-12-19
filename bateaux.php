<?php
require_once("./db_connect.php");

if (isset($_GET['player_id'])) {
    $player_id = $_GET['player_id'];

    try {
        // Requête pour récupérer les données du joueur
        $sql = 'SELECT COUNT(bateau_id) as restant, type as type_bateau
                FROM bateaux 
                WHERE bateaux.total_cells = bateaux.touched_cells 
                AND player_id = :player_id
                GROUP BY bateaux.type';
                
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':player_id', $player_id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retourner les résultats en format JSON
        echo json_encode($result);
    } catch (Exception $e) {
        // Retourner l'erreur au format JSON
        echo json_encode(["error" => "Erreur lors de la récupération des données : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "player_id non fourni"]);
}
?>
