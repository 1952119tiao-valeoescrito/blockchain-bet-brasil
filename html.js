<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interagir com Blockchain</title>
    <script src="https://cdn.jsdelivr.net/npm/web3@1.8.0/dist/web3.min.js"></script>
</head>
<body>
    <form id="apostaForm">
        <label for="prognosticos">Prognósticos (separados por vírgula):</label>
        <input type="text" id="prognosticos" required>
        <button type="submit">Enviar Aposta</button>
    </form>

    <script src="app.js"></script>
</body>
</html>
