<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "blockchain_bet_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST["nome"];
    $email = $_POST["email"];
    $carteira_eth = $_POST["carteira_eth"];
    $prognosticos = $_POST["prognosticos"];

    $sql_usuarios = "INSERT INTO usuarios_blockchain (nome, email, carteira_eth) VALUES ('$nome', '$email', '$carteira_eth')";
    $conn->query($sql_usuarios);

    $sql_aposta = "INSERT INTO apostar_blockchain_bet_brasil (prognosticos, apostador) VALUES (JSON_ARRAY($prognosticos), '$carteira_eth')";
    if ($conn->query($sql_aposta) === TRUE) {
        echo "Aposta registrada com sucesso!";
    } else {
        echo "Erro: " . $conn->error;
    }
}

$conn->close();
?>
