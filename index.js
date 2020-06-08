const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados");
    })
    .catch((erro) => {
        console.log(erro);
    })

//Usar o ejs como view engine
app.set("view engine", 'ejs');
app.use(express.static('public'));

//Body Parser "pegar dados formulario"
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (req,res) => {
    Pergunta.findAll({ raw:true, order:[
        ['id','DESC'] //ASCENDING OR DESCINDING
    ] }).then(perguntas => {
        res.render("index",{
            perguntas:perguntas
        });
    })
});

app.get("/perguntar", (req,res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta",(req,res) => {
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    Pergunta.create({
        titulo:titulo,
        descricao:descricao
    }).then(()=>{
        res.redirect("/")
    });
});
app.post("/salvarresposta",(req,res)=>{
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;
    Resposta.create({
        corpo:corpo,
        pergunta:perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId);
    })
})

app.get("/pergunta/:id",(req,res)=>{
    let id = req.params.id;
    Pergunta.findOne({
        where:{id:id}
    }).then(pergunta=>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {pergunta:pergunta.id},
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas
                });
            })
            
        }else{
            res.render("erro");
        }     
    });
});

app.listen(8080, ()=>{console.log("App rodando");});