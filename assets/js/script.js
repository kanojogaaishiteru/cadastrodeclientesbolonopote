document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formCliente');
    const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
    let clientes = [];
    let editIndex = -1;
    const submitButton = document.getElementById('submitButton');
    const campoIndicados = document.getElementById('indicados');

    // Carregar os clientes do localStorage assim que a página carregar
    loadClientesFromLocalStorage();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        let compras = parseInt(document.getElementById('compras').value, 10);
        let nivel = document.getElementById('nivel').value;
        let cupons = document.getElementById('cupons').value; // Mantém o valor atual do cupom
        const indicados = document.getElementById('indicados').value;

        // Se o cliente indicar alguém, liberamos um cupom para ele (definir como 20%)
        if (indicados && cupons === 'Sem cupom') {
            cupons = '20%';
            // Adicionar cliente indicado automaticamente
            addIndicado(indicados);
        }

        if (editIndex === -1) {
            // Adicionar novo cliente
            clientes.push({ nome, compras, nivel, cupons, indicados });
        } else {
            // Editar cliente existente
            clientes[editIndex] = { nome, compras, nivel, cupons, indicados };
            editIndex = -1;
        }

        // Limpar formulário e atualizar a tabela
        form.reset();
        updateTable();

        // Voltar o botão para "Adicionar Cliente"
        submitButton.textContent = "Adicionar Cliente";

        // Salvar clientes no localStorage
        saveClientesToLocalStorage();
    });

    function saveClientesToLocalStorage() {
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }

    function loadClientesFromLocalStorage() {
        const storedClientes = localStorage.getItem('clientes');
        if (storedClientes) {
            clientes = JSON.parse(storedClientes);
        }
        updateTable();
    }

    function updateTable() {
        clientesTable.innerHTML = '';
        clientes.forEach((cliente, index) => {
            const row = clientesTable.insertRow();
            row.insertCell(0).textContent = cliente.nome;
            row.insertCell(1).textContent = cliente.compras;
            row.insertCell(2).textContent = cliente.nivel;
            row.insertCell(3).textContent = cliente.cupons;
            row.insertCell(4).textContent = cliente.indicados;

            const editCell = row.insertCell(5);
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('edit');
            editButton.onclick = () => editCliente(index);
            editCell.appendChild(editButton);

            const deleteCell = row.insertCell(6);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => deleteCliente(index);
            deleteCell.appendChild(deleteButton);
        });
    }

    function editCliente(index) {
        const cliente = clientes[index];
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('compras').value = cliente.compras;
        document.getElementById('nivel').value = cliente.nivel;
        document.getElementById('indicados').value = cliente.indicados;

        // Aqui, vamos garantir que o campo de cupom seja configurado corretamente durante a edição
        const campoCupom = document.getElementById('cupons');
        campoCupom.value = cliente.cupons; // Ajusta o campo de cupom ao valor do cliente

        editIndex = index;

        // Alterar o texto do botão para "Atualizar Cliente" durante a edição
        submitButton.textContent = "Atualizar Cliente";
    }

    function deleteCliente(index) {
        clientes.splice(index, 1);
        updateTable();
        saveClientesToLocalStorage(); // Atualizar o localStorage após exclusão
    }

    // Função que adiciona um novo cliente baseado no nome do indicado
    function addIndicado(nomeIndicado) {
        // Verificar se o cliente já existe antes de adicionar
        const clienteExistente = clientes.find(cliente => cliente.nome === nomeIndicado);
        if (!clienteExistente && nomeIndicado.trim() !== '') {
            // Se o indicado não existir, adiciona um novo cliente com o nome dele
            clientes.push({ nome: nomeIndicado, compras: 0, nivel: 1, cupons: 'Sem cupom', indicados: '' });
            updateTable();
            saveClientesToLocalStorage(); // Atualiza o localStorage após adicionar o novo cliente
        }
    }

    // Referências para os botões
    const cupom20Button = document.getElementById('cupom20');
    const semCupomButton = document.getElementById('semCupom');
    const campoCupom = document.getElementById('cupons');

    // Definindo a ação de cada botão
    cupom20Button.addEventListener('click', function() {
        campoCupom.value = '20%';  // Preenche o campo com "20%"
    });

    semCupomButton.addEventListener('click', function() {
        campoCupom.value = 'Sem cupom';  // Preenche o campo com "Sem cupom"
    });
});
