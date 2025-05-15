// modulos externos
const chalk = require('chalk');
const inquirer = require('inquirer');

//modulos internos
const fs = require('fs');
const { parse } = require('path');
const { json } = require('stream/consumers');
const { stringify } = require('querystring');


operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'o que você deseja fazer?',
            choices: ['Criar conta','Consultar saldo','Depositar','Sacar','sair']
        },

    ])
    .then((answer) => {
        const action = answer['action'];

        if(action === 'Criar conta'){
            createAccount()
        }

        if( action === 'Consultar saldo'){
            consultarSaldo()
        }

        if( action === 'Depositar'){
            deposito()
        }

        if( action === 'Sacar'){
            sacar()
        }

    }).catch(err => console.log(err))
}

//creat account
function createAccount() {
    console.log(chalk.bgGreen('parabéns por escolher nosso banco'));
    console.log(chalk.green('Defina as opções da sua conta'));

    buildAccount()

}

function buildAccount(){
    inquirer.prompt([
        {
            name: 'p1',
            message: 'digite o nome da conta:'
        }
    ])
    .then((answer) => {
        const userAccount = answer.p1
        console.log(`nome da conta: ${userAccount}`)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${userAccount}.json`)){
            console.log(chalk.bgRed.black('Esta conta ja existe, escolha outro nome.'))
            return buildAccount()

        }

        fs.writeFileSync(`accounts/${userAccount}.json`, '{"balance": 0}')

        console.log(chalk.bgGreen('Parabéns, Sua conta foi criada com sucesso!'))

        operation()


    }).catch(err => console.log(err))
}

// Consultar saldo

function consultarSaldo(){
    inquirer.prompt([
        {
            name: 'p1',
            message: 'digite o nome da sua conta:'
        }

    ]).then((answer) => {
        const accountName = answer.p1;
        if(fs.existsSync(`accounts/${accountName}.json`)){
            const userAccount = fs.readFileSync(`accounts/${accountName}.json`)
            const infoAccount = JSON.parse(userAccount)
            const saldo = infoAccount.balance

            console.log(`Seu Saldo é de: ${saldo}`);

            operation();
        } else {
            console.log(chalk.bgRed("Conta não encontrada!"))
        }

        

    }).catch()
}

// Depositar

function deposito(){
    inquirer.prompt([
        {
            name: 'p1',
            message: 'Digite o nome da conta:'
        },

    ]).then((answer) => {
        const accountName = answer.p1;
        
        if(fs.existsSync(`accounts/${accountName}.json`)){

            inquirer.prompt([
                {
                    name: 'p2',
                    message: 'Digite a quantia que você deseja depositar'
                }
            ]).then((answer) => {
                const valor = Number(answer.p2)
                const userAccount = fs.readFileSync(`accounts/${accountName}.json`, 'utf8');
                const infoAccount = JSON.parse(userAccount);
                infoAccount.balance += valor;

                fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(infoAccount, null, 2))

                console.log(chalk.bgGreen.black('Depósito efetuado com sucesso!'))
                console.log(chalk.bgBlue(`Se saldo agora é de: ${infoAccount.balance}`))

                operation();

            })

        } else {
            console.log(chalk.red('esta conta não existe! digite um no valido ou crie uma nova conta.'));
        }

        
    })
}

// sacar 

function sacar() {
    inquirer.prompt([
        {
            name: 'p1',
            message: 'Digite o name da conta:'
        }
    ]).then((answer) => {
        const userAccount = answer.p1

        if(fs.existsSync(`accounts/${userAccount}.json`)){
            inquirer.prompt([
                {
                    name: 'p1',
                    message: 'digite o valor para saque:'
                }
            ]).then((answer) => {
                const valorSaque = Number(answer.p1);
                const accout = fs.readFileSync(`accounts/${userAccount}.json`, 'utf8')
                const infoAccount = JSON.parse(accout);

                infoAccount.balance -= valorSaque;

                fs.writeFileSync(`accounts/${userAccount}.json`, JSON.stringify(infoAccount, null, 2))

                console.log(chalk.bgGreen(`Saque efetuado com sucesso! valor: ${valorSaque}`))
                console.log(`Saldo atual é de ${infoAccount.balance}`)

                operation();
                
            })
        } else {
            console.log(chalk.bgRed('Conta Não encontrada!'))
            sacar()
        }
    })
}





