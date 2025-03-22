<?php

// Desabilita erros no navegador
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json'); // Define o tipo de conteúdo como JSON

// Função para calcular o hash da aposta com salt
function calcularHashApostaComSalt(
    $numeros_escolhidos,
    $valor_aposta,
    $id_usuario,
    $data_hora_aposta,
    $id_jogo,
    $salt = null  // Permite passar um salt existente (para verificação)
) {
    $string_para_hash = implode('|', [
        $numeros_escolhidos,
        $valor_aposta,
        $id_usuario,
        $data_hora_aposta,
        $id_jogo
    ]);

    if ($salt === null) {
        $salt = bin2hex(random_bytes(16)); // Gera um novo salt se não for fornecido
    }

    $string_para_hash = $salt . '|' . $string_para_hash;
    $hash = hash('sha256', $string_para_hash);

    return ['hash' => $hash, 'salt' => $salt];
}

// 1. Recebe os dados do formulário (POST request)
$numeros_escolhidos = $_POST['numeros_escolhidos'] ?? null;
$valor_aposta = $_POST['valor_aposta'] ?? null;
$id_usuario = $_POST['id_usuario'] ?? null;
$id_jogo = $_POST['id_jogo'] ?? null;

// Validação básica (adicione validações mais robustas)
if (
    empty($numeros_escolhidos) ||
    empty($valor_aposta) ||
    empty($id_usuario) ||
    empty($id_jogo)
) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Dados incompletos.']);
    exit;
}

// Formata a data/hora (pode vir do formulário ou gerar no servidor)
$data_hora_aposta = date('Y-m-d H:i:s');

// 2. e 3. Calcula o hash
$resultado = calcularHashApostaComSalt(
    $numeros_escolhidos,
    $valor_aposta,
    $id_usuario,
    $data_hora_aposta,
    $id_jogo
);

$hash_da_aposta = $resultado['hash'];
$salt = $resultado['salt'];

// **IMPORTANTE:** Salve o $hash_da_aposta e o $salt no seu banco de dados
// associados à aposta.  Você precisará deles para verificar a aposta depois.

// 4. Retorna a resposta da API em formato JSON
$response = [
    'status' => 'success',
    'hash' => $hash_da_aposta,
    'salt' => $salt,
    'numeros_escolhidos' => $numeros_escolhidos, // Retorna os dados para conferência
    'valor_aposta' => $valor_aposta,
    'id_usuario' => $id_usuario,
    'data_hora_aposta' => $data_hora_aposta,
    'id_jogo' => $id_jogo
];

echo json_encode($response);