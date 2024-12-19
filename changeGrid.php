<?php
$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

if (!isset($data['player_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'player_id manquant']);
    exit;
}

$player_id = $data['player_id'];

require_once("./db_connect.php");

$response = [];

try {
    $sql = "SELECT game.row, game.column, game.bateau_id, game.touche 
            FROM game 
            WHERE game.player_id = :player_id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':player_id', $player_id, PDO::PARAM_INT);
    $stmt->execute();

    $gameData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($gameData) {
        $response = [
            'status' => 'success',
            'data' => $gameData
        ];
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Aucune donnée trouvée'
        ];
    }

} catch (PDOException $e) {
    $response = [
        'status' => 'error',
        'message' => 'Erreur SQL : ' . $e->getMessage()
    ];
}

echo json_encode($response);

?>
