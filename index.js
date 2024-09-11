/* FUNDAMENTOS 001

// hello world
console.log("hello world");

// arrays
let metas = ["pedro", "dory"];
console.log(metas[0] + " " + metas[1]);

// objeto
let meta = {
    value: 'jogar bola 1 vez na semana',
    address: 2,
    checked: false,
    isChecked: (info) => {
        console.log(info);
    }
}
meta.isChecked(meta.address + " " + meta.value);

*/

// importando funcao select, input do inquirer instalado
const { select, input, checkbox  } = require('@inquirer/prompts')

// pra guardar metas em arquivo
const fs = require("fs").promises

// variavel para controlar as mensagens
let mensagem = "Bem-vindo ao aplicativo Metas!"

// lista de metas
let metas = []

// funcao que guarda as metas
const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }catch(erro){
        metas = []
    }
}

// funcao que salva as metas
const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

// criando a funcao de cadastrar metas
const cadastrarMetas = async () => {
    const meta = await input ({message: "Digite a meta a ser criada: "})

    if(meta.length == 0){
        mensagem = "A meta não pode ser vazia."
        return
    }

    metas.push({value: meta, checked: false})

    mensagem = "Meta adicionada com sucesso! :)"
}

// criando a funcao de listar as metas
const listarMetas = async () => {

    // controlando excecao de erro sem meta
    if (metas.length == 0){
        mensagem = "Não há metas. :("
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de metas, o espaço para marcar ou desmarcar, e o enter para finalizar.",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

        if(respostas.length == 0){
            mensagem = "Nenhuma meta selecionada. Voltando ao menu."
            return
        }

        respostas.forEach((resposta) => {
            const meta = metas.find((m) => {
                return m.value == resposta
            })

            meta.checked = true
        })

        mensagem = "Meta(s) marcada(s) como concluída(s)."
}

// criando a funcao de ver metas realizadas
const metasRealizadas = async () => {

    // controlando excecao de erro sem meta
    if (metas.length == 0){
        mensagem = "Não há metas. :("
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0){
        mensagem = 'Não existem metas realizadas no momento. :('
        return
    }

    await select ({
        message:"Metas realizadas: " + realizadas.length,
        choices: [...realizadas],
        instructions: false
    })

    mensagem = "Voltando ao menu! :)"
}

// criando a funcao de ver metas abertas
const metasAbertas = async () => {

    // controlando excecao de erro sem meta
    if (metas.length == 0){
        mensagem = "Não há metas. :("
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
        
    })

    if (abertas.length == 0){
        mensagem = 'Não tem meta nenhuma em aberto, boa!!'
        return
    }

    await select ({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas],
        instructions: false
    })

    mensagem = "Voltando ao menu! :)"
}

// criando a funcao de excluir metas
const excluirMetas = async () => {

    // controlando excecao de erro sem meta
    if (metas.length == 0){
        mensagem = "Não há metas. :("
        return
    }

    // mapeando os itens para falso
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    // funcao de checkbox pro usuario escolher a meta
    const itensADeletar = await checkbox ({
        message: "Selecione um item para excluir. Use as setas para mover o cursor, o espaço para selecionar uma meta, e o enter para sair.",
        choices: [...metasDesmarcadas],
        instructions: false
    })

    // caso nada seja escolhido ele sai
    if (itensADeletar.length == 0){
        mensagem = 'Nenhuma meta selecionada para excluir, voltando ao menu.'
        return
    }

    // funcao que deleta o item que tem o valor diferente
    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = 'Meta(s) excluída(s) com sucesso!'

}

// funcao para mensagens ao usuario
const mostrarMensagem = () => {
    console.clear()

    // colocando mensagem depois de apagar o console
    if (mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

// criacao da funcao de execucao do app
const start = async () => {

    // carregando as metas
    await carregarMetas()
    
    // while infinito do app
    while(true){
    
        // metodo para apagar o console e facilitar a leitura do usuario
        await mostrarMensagem()

        // salvar as metas
        await salvarMetas()
        // variavel de selecao, com uso de funcao assincrona e promessas
        const option = await select({
            message: "Menu - ",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Excluir metas",
                    value: "excluir"
                },
                {
                    name: "Sair do Metas",
                    value: "sair"
                }
            ]
        })

        // switch para executar a decisao do usuario
        switch(option){
            case "cadastrar": // cadastrar meta
                await cadastrarMetas()
                break

            case "listar": // listar as metas
                await listarMetas()                
                break

            case "realizadas": // ver metas realizadas
                await metasRealizadas()
                break

            case "abertas": // ver metas abertas
                await metasAbertas()
                break

            case "excluir": // excluir metas
                await excluirMetas()
                break

            case "sair": // sair do Metas
                console.log ("Até a próxima!! :)")
                return false
        }
    }
}

start()