let ribbonButtons = [
    {type: "block", text: "Comunicado", mode: "cols", list: [
        {type: "button", id: "salvar", text: "Salvar", isbig: true, img: "fa fa-save"},
        {type: "button", id: "novo", text: "Novo", img: "far fa-file-alt"},
        {type: "button", id: "remover", text: "Remover", img: "far fa-trash-alt"}
    ]},
    {type: "block", text: "Edição", mode: "cols", list: [
        {id: "estilo", type:"buttonSelect", text: "Estilo", isbig: true, img: "fas fa-text-height", items:[
            {id:"style_formatPara",  text: 'Normal'},
            {id:"style_formatH1",  text: '<h1>Título 1</h1>'},
            {id:"style_formatH2",  text: '<h2>Título 2</h2>'},
            {id:"style_formatH3",  text: '<h3>Título 3</h3>'},
            {id:"style_formatH4",  text: '<h4>Título 4</h4>'},
            {id:"style_formatH5",  text: '<h5>Título 5</h5>'},
            {id:"style_formatH6",  text: '<h6>Título 6</h6>'},
        ]},
        {id: "menu", type:"buttonSelect", text: "Fonte", img: "fas fa-font", items:[
            {id:"font_Arial",  text: '<p style=\'font-family: Arial\'>Arial</p>'},
            {id:"font_Arial Black",  text: '<p style=\'font-family: Arial Black\'>Arial Black</p>'},
            {id:"font_Comic Sans MS",  text: '<p style=\'font-family: Comic Sans MS\'>Comic Sans MS</p>'},
            {id:"font_Courier New",  text: '<p style=\'font-family: Courier New\'>Courier New</p>'},
            {id:"font_Helvetica",  text: '<p style=\'font-family: Helvetica\'>Helvetica</p>'},
            {id:"font_Impact",  text: '<p style=\'font-family: Impact\'>Impact</p>'},
            {id:"font_Tahoma",  text: '<p style=\'font-family: Tahoma\'>Tahoma</p>'},
            {id:"font_Times New Roman",  text: '<p style=\'font-family: Times New Roman\'>Times New Roman</p>'},
        ]},
        {type: "button", id: "negrito", text: "Negrito", isbig: false, img: "fas fa-pen-alt"},
        {type: "button", id: "italico", text: "Itálico", isbig: false, img: "fas fa-italic"},
        {type: "button", id: "underline", text: "Underline", isbig: false, img: "fas fa-underline"},
        {type: "button", id: "strikethrough", text: "Riscado", isbig: false, img: "fas fa-strikethrough"},
        {type: "button", id: "limpar", text: "Limpar estilos", isbig: false, img: "fas fa-remove-format"},
    ]},
    {type: "block", text: "Composição", mode: "cols", list: [
        {type: "button", id: "anexar", text: "Anexar", isbig: true, img: "fas fa-paperclip"},
        {type: "button", id: "logo", text: "Inserir Logo", isbig: false, img: "far fa-registered"},
        {type: "button", id: "converter", text: "PDF para imagem", isbig: false, img: "far fa-file-pdf"},
    ]},
    {type: "block", text: "Mala direta", mode: "cols", list: [
        {type: "button", id: "enviar_email", text: "Enviar<br>emails", isbig: true, disable: true, img: "far fa-paper-plane"},
    ]},
    {type: "block", text: "Postagens", mode: "cols", list: [
        {type: "button", id: "publicar", text: "Publicar<br>no portal", isbig: true, disable: true, img: "fas fa-share-square"},
        {type: "checkbox", id: "postar_homepage", text: "Disponível no portal", isbig: false, disable: true, img: "far fa-paper-plane"},
        {type: "button", id: "resumir", text: "Resumo da publicação", isbig: false, disable: true, img: "fas fa-passport"},
        {type: "button", id: "imagem_capa", text: "Imagem da capa", isbig: false, disable: true, img: "fab fa-pied-piper-square"},
    ]}
];

let campospostagem = [
    {type: "settings", position: "label-left", labelWidth: 150, inputWidth: 180, labelAlign: "right", offsetLeft: 20},
    {type: 'combo', name: 'comunicado', label: 'Comunicado:', required: true, inputWidth: 600},
    {type: 'combo', name: 'conta', label: 'Conta de email:', required: true, inputWidth: 600},
    {type: 'combo', name: 'base', label: 'Base de cadastro:', required: true, inputWidth: 600},
    //{type: 'checkbox', name: 'reenviar', label: 'Forçar o re-envio do comunicado para destinatários já reicidentes', position: "label-right", labelAlign: "left", offsetLeft: 165, labelWidth: 500},
];