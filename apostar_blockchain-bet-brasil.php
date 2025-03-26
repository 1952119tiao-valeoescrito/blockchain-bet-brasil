<?php
// api/api_apostar.php

// Configuração do cabeçalho para indicar que a resposta é JSON
header('Content-Type: application/json');

// Permitir requisições de qualquer origem (CORS - CUIDADO em produção!)
header('Access-Control-Allow-Origin: https://1952119tiao-valeoescrito.github.io/blockchain-bet-brasil/');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responde à preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método não permitido
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Inclui o arquivo de configuração do banco de dados (se necessário)
// include 'config.php';

// Defina as informações de conexão com o banco de dados
server with default setting (user 'root' with no password) */
define('DB_SERVER', 'mysql48-farm1.kinghost.net');
define('DB_USERNAME', 'valeoescrito');
define('DB_PASSWORD', 'Kmvd96uJ');
define('DB_NAME', 'valeoescrito');

// Cria a conexão
$conexao = new mysqli($servname, $username, $password, $database);

// Verifica a conexão
if ($conexao->connect_error) {
    http_response_code(500); // Erro interno do servidor
    echo json_encode(['error' => 'Falha na conexão com o banco de dados: ' . $conexao->connect_error]);
    exit;
}

// Coleta os dados do formulário (recebidos via POST)
$num_extracao    = mysqli_real_escape_string($conexao, $_POST['num_extracao']);
$data_extracao   = mysqli_real_escape_string($conexao, $_POST['data_extracao']);
$country_pais    = mysqli_real_escape_string($conexao, $_POST['country_pais']);
$email_indicacao = mysqli_real_escape_string($conexao, $_POST['email_indicacao']);
$valor_aposta    = mysqli_real_escape_string($conexao, $_POST['valor_aposta']);
$numeros_escolhidos = mysqli_real_escape_string($conexao, $_POST['numeros_escolhidos']);
$hash_aposta     = mysqli_real_escape_string($conexao, $_POST['hash_aposta']);
$data_aposta     = date('Y-m-d H:i:s');

// Cria a query de inserção
$query = "INSERT INTO `apostar-blockchain-bet-brasil` 
          (`num_extracao`, `data_extracao`, `country_pais`, `email_indicacao`, `valor_aposta`, `numeros_escolhidos`, `hash_aposta`, `data_aposta`) 
          VALUES 
          ('$num_extracao', '$data_extracao', '$country_pais', '$email_indicacao', '$valor_aposta', '$numeros_escolhidos', '$hash_aposta', '$data_aposta')";

// Executa a query
if (mysqli_query($conexao, $query)) {
    http_response_code(200); // OK
    echo json_encode(['success' => 'Aposta inserida com sucesso!']);
} else {
    http_response_code(500); // Erro interno do servidor
    echo json_encode(['error' => 'Erro ao inserir aposta: ' . mysqli_error($conexao)]);
}

// Fecha a conexão com o banco de dados
mysqli_close($conexao);
?>