document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formCliente');
    const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
    const resumoArrecadacaoTable = document.getElementById('resumoArrecadacao').getElementsByTagName('tbody')[0];
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
        const entrega = document.getElementById('entrega').checked;

        if (isNaN(compras)) compras = 0;
        if (isNaN(nivel)) nivel = 1;

        

        if (editIndex === -1) {
            clientes.push({ nome, compras, nivel, cupons, indicados, entrega });
        } else {
            clientes[editIndex] = { nome, compras, nivel, cupons, indicados, entrega };
            editIndex = -1;
        }

        // Adicionando indicados, se houver
        if (indicados) {
            const nomesIndicados = indicados.split(',').map(n => n.trim()).filter(n => n);
            nomesIndicados.forEach(indicado => {
                const existe = clientes.find(c => c.nome === indicado);
                if (!existe) {
                    clientes.push({ nome: indicado, compras: 1, nivel: 1, cupons: 'Cupom 20%', indicados: '', entrega: false });
                }
            });
        }

        form.reset();
        updateTable();
        updateResumoArrecadacao();
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
        updateResumoArrecadacao();
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
            const statusCell = row.insertCell(5);
if (cliente.compras >= 10) {
     row.classList.add("vip-row");
    statusCell.innerHTML = '<span style="color:gold;"><i class="fas fa-star"></i> VIP</span>';
} else {
    statusCell.innerHTML = '<span style="color:gray;">Normal</span>';
}

            const editCell = row.insertCell(6);
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('edit');
            editButton.onclick = () => editCliente(index);
            editCell.appendChild(editButton);

            const deleteCell = row.insertCell(7);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => deleteCliente(index);
            deleteCell.appendChild(deleteButton);
        });
    }

   function updateResumoArrecadacao() {
    resumoArrecadacaoTable.innerHTML = '';
    let totalArrecadado = 0;

    clientes.forEach(cliente => {
        const row = resumoArrecadacaoTable.insertRow();
        let totalCompras = cliente.compras * 5; // cada venda é 5 euros

        // Se a venda tem entrega, adiciona 2 euros
        if (cliente.entrega) {
            totalCompras += cliente.compras * 2; // cada entrega é 2 euros adicionais
        }

        let totalCliente = totalCompras;
        if (cliente.cupons === 'Cupom 20%') {
            totalCliente = totalCompras * 0.8;
        }

        totalArrecadado += totalCliente;

        // Preenchendo as células da tabela
        row.insertCell(0).textContent = cliente.nome;
        row.insertCell(1).textContent = cliente.compras;
        row.insertCell(2).textContent = cliente.cupons;
        row.insertCell(3).textContent = `€ ${totalCliente.toFixed(2)}`;  // Valor com símbolo de euro (€)

        // Definindo o status:
    
        // Ações para editar e excluir
        
    });

    // Exibe o total arrecadado no final da tabela
    const row = resumoArrecadacaoTable.insertRow();
    row.insertCell(0).textContent = 'Total Arrecadado';
    row.insertCell(1).textContent = '';
    row.insertCell(2).textContent = '';
    row.insertCell(3).textContent = `€ ${totalArrecadado.toFixed(2)}`; // Total com símbolo de euro (€)
   
}


    function editCliente(index) {
        const cliente = clientes[index];
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('compras').value = cliente.compras;
        document.getElementById('nivel').value = cliente.nivel;
        document.getElementById('cupons').value = cliente.cupons;
        document.getElementById('indicados').value = cliente.indicados;
        document.getElementById('entrega').checked = cliente.entrega;

        editIndex = index;
        submitButton.textContent = "Atualizar Cliente";
    }

    function deleteCliente(index) {
        clientes.splice(index, 1);
        updateTable();
        updateResumoArrecadacao();
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

let statusClass = 'status neutral';
let statusText = 'Indicado em Espera';

if (cliente.compras >= 1) {
    statusClass = 'status active';
    statusText = 'Cliente Ativo';

    // Exemplo extra: vira VIP com mais de 100 euros arrecadados
    let totalCompras = cliente.compras * 5;
    if (cliente.entrega) totalCompras += cliente.compras * 2;
    if (cliente.cupons === 'Cupom 20%') totalCompras *= 0.8;
    if (totalCompras >= 100) {
        statusText = 'VIP';
        statusClass = 'status vip';
    }
} else if (cliente.compras === 0) {
    statusText = 'Indicado em Espera';
    statusClass = 'status espera';
}
