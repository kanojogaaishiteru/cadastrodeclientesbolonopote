document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formCliente');
    const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
    let clientes = [];
    let editIndex = -1;
    const submitButton = document.getElementById('submitButton');
    const campoIndicados = document.getElementById('indicados');

    loadClientesFromLocalStorage();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        let compras = parseInt(document.getElementById('compras').value, 10);
        let nivel = parseInt(document.getElementById('nivel').value, 10);
        let cupons = document.getElementById('cupons').value.trim();
        const indicados = document.getElementById('indicados').value.trim();

        if (isNaN(compras)) compras = 0;
        if (isNaN(nivel)) nivel = 1;

        if (cupons === '20%' && compras > 0) {
            cupons = 'Sem cupom';
        }

        if (indicados && cupons === 'Sem cupom') {
            cupons = '20%';
        }

        if (editIndex === -1) {
            clientes.push({ nome, compras, nivel, cupons, indicados });
        } else {
            clientes[editIndex] = { nome, compras, nivel, cupons, indicados };
            editIndex = -1;
        }

        if (indicados) {
            const nomesIndicados = indicados.split(',').map(n => n.trim()).filter(n => n);
            nomesIndicados.forEach(indicado => {
                const existe = clientes.find(c => c.nome === indicado);
                if (!existe) {
                    clientes.push({ nome: indicado, compras: 1, nivel: 1, cupons: 'Cupom 20%', indicados: '' });
                }
            });
        }

        form.reset();
        updateTable();
        submitButton.textContent = "Adicionar Cliente";
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
        document.getElementById('cupons').value = cliente.cupons;
        document.getElementById('indicados').value = cliente.indicados;

        editIndex = index;
        submitButton.textContent = "Atualizar Cliente";
    }

    function deleteCliente(index) {
        clientes.splice(index, 1);
        updateTable();
        saveClientesToLocalStorage();
    }

    const cupom20Button = document.getElementById('cupom20');
    const semCupomButton = document.getElementById('semCupom');
    const campoCupom = document.getElementById('cupons');

    cupom20Button.addEventListener('click', function() {
        campoCupom.value = 'Cupom 20%';
    });

    semCupomButton.addEventListener('click', function() {
        campoCupom.value = 'Sem cupom';
    });
});
