Config = function () {

    this.user = JSON.parse(sessionStorage.user);
    this.bases = new Bases();

    this.View = function (cell) {

        this.correspondentes = new Correspondentes();

        this.layout = cell.attachLayout({
            pattern: '2U',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    header: false,
                    width: 180
                },
                {
                    id: 'b',
                    header: false,
                }
            ]
        });

        this.tree = this.layout.cells('a').attachTreeView({
            iconset: 'font_awesome',
            multiselect: false,
            checkboxes: false,
            dnd: true,
            context_menu: true,
        });

        this.tree.attachEvent('onClick', function (id) {

            if (id === 'contas') {
                configContas(this.layout.cells('b'));

            } else if (id === 'bases') {
                configBases(this.layout.cells('b'));

            } else if (id === 'conexoes') {
                configConexoes(this.layout.cells('b'));

            } else if (this.tree.getUserData(id, 'tipo') === 'itembase') {
                configDestinatario(this.layout.cells('b'), this.tree.getUserData(id, 'info').id);
            }
        }.bind(this));


        this.MontaEstrutura = function () {

            this.bases.Listar().then(response => {
                let bases = [];
                response.filter(function (item) {
                    bases.push({
                        id: item.id,
                        text: item.nome,
                        icons: {
                            file: 'fas fa-address-card',
                            folder_opened: 'fas fa-address-card',
                            folder_closed: 'fas fa-address-card'
                        },
                        userdata: {
                            tipo: 'itembase',
                            info: item
                        }
                    });
                });

                this.tree.clearAll();
                this.tree.loadStruct([
                    {
                        id: 'contas',
                        text: 'Contas',
                        icons: {
                            file: 'fas fa-mail-bulk',
                            folder_opened: 'fas fa-envelope-open',
                            folder_closed: 'fas fa-mail-bulk'
                        }
                    },
                    {
                        id: 'conexoes',
                        text: 'Conexões',
                        icons: {
                            file: 'fas fa-database',
                            folder_opened: 'fas fa-database',
                            folder_closed: 'fas fa-database'
                        }
                    },
                    {
                        id: 'bases',
                        text: `Bases (${response.length})`,
                        open: 1,
                        icons: {
                            file: 'fas fa-folder',
                            folder_opened: 'fas fa-folder-open',
                            folder_closed: 'fas fa-folder'
                        },
                        items: bases
                    }
                ]);
            });
        };

        document.addEventListener('AoAtualizarRegistro', function () {
            this.MontaEstrutura();
        }.bind(this));

        this.MontaEstrutura();

    };


};

let configContas = function (cell) {

    this.user = JSON.parse(sessionStorage.user);
    this.correspondentes = new Correspondentes();

    this.layout = cell.attachLayout({
        pattern: '2E',
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        cells: [
            {
                id: 'a',
                header: false,
                width: 180
            },
            {
                id: 'b',
                header: false,
            }
        ]
    });


    this.toolbar = this.layout.cells('a').attachToolbar({
        iconset: 'awesome',
        items: [
            {id: "novo", type: "button", text: 'Novo', img: 'fas fa-plus-square'},
            {id: "salvar", type: "button", text: 'Salvar', img: 'fas fa-save'},
            {id: "excluir", type: "button", text: 'Excluir', img: 'fas fa-minus-square'}
        ],
        onClick: function (id) {
            if (id === 'novo') {
                this.form.clear();
            } else if (id === 'salvar') {
                this.form.validate();
            } else if (id === 'excluir') {

                if (this.conta === undefined)
                    return;

                dhtmlx.confirm({
                    title: "Atenção",
                    type: "confirm-warning",
                    ok: 'OK',
                    cancel: 'Cancelar',
                    text: "Você confirma a exclusão deste registros?",
                    callback: function () {
                        this.correspondentes.Remover(this.conta).then(() => {
                            this.AtualizaLista();
                        }).finally(() => {
                            this.conta = undefined;
                            this.form.clear()
                        });
                    }.bind(this)
                });
            }
        }.bind(this)
    });

    this.form = this.layout.cells('a').attachForm([
        {
            type: "settings",
            position: "label-left",
            labelWidth: 150,
            inputWidth: 180,
            labelAlign: "right",
            offsetLeft: 20
        },
        {type: 'input', name: 'endereco', label: 'Endereço de email:', required: true, validate: "ValidEmail"},
        {type: 'password', name: 'senha', label: 'Senha:', required: true},
        {type: 'input', name: 'smtp_host', label: 'SMTP host:', required: true},
        {
            type: 'combo', name: 'smtp_secure', label: 'Tipo de segurança:', required: true, options: [
                {text: "SSL", value: "SSL"},
                {text: "TSL", value: "TSL", selected: true}
            ]
        },
        {type: "newcolumn", offset: 20},
        {type: 'input', name: 'smtp_port', label: 'Porta SMTP:', required: true},
        {type: 'checkbox', name: 'smtp_auth', label: 'Autenticar:', required: true},
        {type: 'input', name: 'nome', label: 'Nome do remetente:', required: true},
        {type: 'checkbox', name: 'habilitado', label: 'Habilitado:', required: true}
    ]);

    this.form.attachEvent("onAfterValidate", function (status) {

        if (status === false)
            return;

        this.data = this.form.getFormData();
        this.data.firstuser = this.user.id;
        this.data.condominio = condomino_id;

        this.correspondentes.SalvarEndereco(this.data).then(() => {
            this.AtualizaLista();
            dhtmlx.message({
                text: 'Registro salvo com sucesso',
                expire: 4000
            });
        }).finally(() => {
            this.data = undefined;
            this.form.clear();
        })

    }.bind(this));

    this.grid = this.layout.cells('b').attachGrid();
    this.grid.setHeader("Id,Endereço");
    this.grid.setColTypes("ro,ro");
    this.grid.setInitWidths("0,,");
    this.grid.init();

    this.grid.attachEvent("onRowSelect", function (id) {
        this.correspondentes.Pesquisar(id).then(response => {
            this.form.setFormData(response);
            this.conta = response.id;
        })
    }.bind(this));

    this.AtualizaLista = function () {
        this.correspondentes.Listar().then(response => {
            this.grid.clearAll();
            response.filter(function (item) {
                this.grid.addRow(item.id, [item.id, item.endereco], 0);
            }.bind(this));
        });
    };

    this.AtualizaLista();


};

let configBases = function (cell) {

    this.user = JSON.parse(sessionStorage.user);
    this.bases = new Bases();

    this.layout = cell.attachLayout({
        pattern: '2E',
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        cells: [
            {
                id: 'a',
                header: false,
                width: 180
            },
            {
                id: 'b',
                header: false,
            }
        ]
    });

    this.toolbar = this.layout.cells('a').attachToolbar({
        iconset: 'awesome',
        items: [
            {id: "novo", type: "button", text: 'Novo', img: 'fas fa-plus-square'},
            {id: "salvar", type: "button", text: 'Salvar', img: 'fas fa-save'},
            {id: "excluir", type: "button", text: 'Excluir', img: 'fas fa-minus-square'}
        ],
        onClick: function (id) {
            if (id === 'novo') {
                this.form.clear();
            } else if (id === 'salvar') {
                this.form.validate();
            } else if (id === 'excluir') {

                if (this.conta === undefined)
                    return;

                dhtmlx.confirm({
                    title: "Atenção",
                    type: "confirm-warning",
                    ok: 'OK',
                    cancel: 'Cancelar',
                    text: "Você confirma a exclusão deste registro?",
                    callback: function () {
                        this.bases.Remover(this.conta).then(() => {
                            this.AtualizaListadeBase();
                        }).finally(() => {
                            this.conta = undefined;
                            this.form.clear();
                            document.dispatchEvent(new CustomEvent('AoAtualizarRegistro', {
                                detail: this
                            }))
                        });
                    }.bind(this)
                });
            }
        }.bind(this)
    });

    this.form = this.layout.cells('a').attachForm([
        {
            type: "settings",
            position: "label-left",
            labelWidth: 150,
            inputWidth: 180,
            labelAlign: "right",
            offsetLeft: 20
        },
        {type: 'input', name: 'nome', label: 'Nome da base:', required: true},
    ]);
    this.form.attachEvent("onAfterValidate", function (status) {

        if (status === false)
            return;

        this.data = this.form.getFormData();
        this.data.firstuser = user.id;
        this.data.condominio = condomino_id;

        this.bases.Salvar(this.data).then(() => {
            this.AtualizaListadeBase();
            dhtmlx.message({
                text: 'Registro salvo com sucesso',
                expire: 4000
            });
        }).finally(() => {
            this.data = undefined;
            this.form.clear();
            document.dispatchEvent(new CustomEvent('AoAtualizarRegistro', {
                detail: this
            }));
        })

    }.bind(this));

    this.grid = this.layout.cells('b').attachGrid();
    this.grid.setHeader("Id,Nome");
    this.grid.setColTypes("ro,ro");
    this.grid.setInitWidths("0,,");
    this.grid.init();
    this.grid.attachEvent("onRowSelect", function (id) {
        this.bases.Pesquisar(id).then(response => {
            this.form.setFormData(response);
            this.conta = response.id;
        })
    }.bind(this));

    this.AtualizaListadeBase = function () {
        this.bases.Listar().then(response => {
            this.grid.clearAll();
            response.filter(function (item) {
                this.grid.addRow(item.id, [item.id, item.nome], 0);
            }.bind(this));
        });
    };

    this.AtualizaListadeBase();

};

let configConexoes = function (cell) {

    this.user = JSON.parse(sessionStorage.user);
    this.conexoes = new admConexoes(condomino_id);

    this.layout = cell.attachLayout({
        pattern: '2E',
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        cells: [
            {
                id: 'a',
                header: false,
                width: 180
            },
            {
                id: 'b',
                header: false,
            }
        ]
    });

    this.toolbar = this.layout.cells('a').attachToolbar({
        iconset: 'awesome',
        items: [
            {id: "novo", type: "button", text: 'Novo', img: 'fas fa-plus-square'},
            {id: "salvar", type: "button", text: 'Salvar', img: 'fas fa-save'},
            {id: "excluir", type: "button", text: 'Excluir', img: 'fas fa-minus-square'}
        ],
        onClick: function (id) {
            if (id === 'novo') {
                this.form.clear();
            } else if (id === 'salvar') {
                this.form.validate();
            } else if (id === 'excluir') {

                if (this.conta === undefined)
                    return;

                dhtmlx.confirm({
                    title: "Atenção",
                    type: "confirm-warning",
                    ok: 'OK',
                    cancel: 'Cancelar',
                    text: "Você confirma a exclusão deste registro?",
                    callback: function () {
                        this.conexoes.Remover(this.conta).then(() => {
                            this.AtualizaLista();
                        }).finally(() => {
                            this.conta = undefined;
                            this.form.clear();
                            document.dispatchEvent(new CustomEvent('AoAtualizarRegistro', {
                                detail: this
                            }))
                        });
                    }.bind(this)
                });
            }
        }.bind(this)
    });

    this.form = this.layout.cells('a').attachForm([
        {type: "settings", position: "label-left", labelWidth: 150, inputWidth: 180, labelAlign: "right", offsetLeft: 20},
        {type: 'block', width:800, list:[
            {type: 'input', name: 'nome', label: 'Nome da conexão:', required: true},
            {type:"newcolumn"},
            {type: 'combo', name: 'tipo', label: 'Conexões disponíveis:', required: true, options: [
                {text: "PostgreSQL", value: "postgresql"},
            ]},
        ]},
        {type: 'block', width:800, list:[
            {type: 'input', name: 'endereco', label: 'Endereço:', required: true},
            {type:"newcolumn"},
            {type: 'input', name: 'porta', label: 'Porta:', required: true},
        ]},
        {type: 'block', width:800, list:[
            {type: 'input', name: 'banco', label: 'Nome do banco:', required: true},
        ]},
        {type: 'block', width:800, list:[
            {type: 'input', name: 'usuario', label: 'Usuário:', required: true},
            {type:"newcolumn"},
            {type: 'password', name: 'senha', label: 'Senha:', required: true},
        ]},
        {type: 'block', width:800, list:[
            {type: 'input', name: 'origem', label: 'Tabela de origem:', required: true},
        ]}
    ]);
    this.form.attachEvent("onAfterValidate", function (status) {

        if (status === false)
            return;

        this.data = this.form.getFormData();
        this.data.firstuser = user.id;
        this.data.clienteid = condomino_id;

        this.conexoes.Salvar(this.data).then(() => {
            this.AtualizaLista();
            dhtmlx.message({
                text: 'Conexão salva com sucesso',
                expire: 4000
            });
        }).finally(() => {
            this.data = undefined;
            this.form.clear();
            document.dispatchEvent(new CustomEvent('AoAtualizarRegistro', {
                detail: this
            }));
        })

    }.bind(this));

    this.grid = this.layout.cells('b').attachGrid();
    this.grid.setHeader("Id,Nome");
    this.grid.setColTypes("ro,ro");
    this.grid.setInitWidths("0,,");
    this.grid.init();
    this.grid.attachEvent("onRowSelect", function (id) {
        this.conexoes.Pesquisar(id).then(response => {
            this.form.setFormData(response);
            this.conta = response.id;
        })
    }.bind(this));

    this.AtualizaLista = function () {
        this.conexoes.Listar().then(response => {
            this.grid.clearAll();
            response.filter(function (item) {
                this.grid.addRow(item.id, [item.id, item.nome], 0);
            }.bind(this));
        });
    };

    this.AtualizaLista();

};

let configDestinatario = function (cell, baseid) {

    this.user = JSON.parse(sessionStorage.user);
    this.destinatarios = new Destinatarios();
    this.situacao = 'novo';

    this.layout = cell.attachLayout({
        pattern: '2E',
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        cells: [
            {
                id: 'a',
                header: false,
                width: 180
            },
            {
                id: 'b',
                header: false,
            }
        ]
    });

    this.toolbar = this.layout.cells('a').attachToolbar({
        iconset: 'awesome',
        items: [
            {id: "novo", type: "button", text: 'Novo', img: 'fas fa-plus-square'},
            {id: "salvar", type: "button", text: 'Salvar', img: 'fas fa-save'},
            {id: "excluir", type: "button", text: 'Excluir', img: 'fas fa-minus-square'}
        ],
        onClick: function (id) {
            if (id === 'novo') {
                this.NovoRegistro();
            } else if (id === 'salvar') {
                this.form.validate();
            } else if (id === 'excluir') {

                if (this.conta === undefined)
                    return;

                dhtmlx.confirm({
                    title: "Atenção",
                    type: "confirm-warning",
                    ok: 'OK',
                    cancel: 'Cancelar',
                    text: "Você confirma a exclusão deste registros?",
                    callback: function () {
                        this.destinatarios.RemoveDestinatario(this.conta).then(() => {
                            this.AtualizaListaDestinatarios();
                        }).finally(() => {
                            this.NovoRegistro();
                            document.dispatchEvent(new CustomEvent('AoAtualizarRegistro', {
                                detail: this
                            }))
                        });
                    }.bind(this)
                });
            }
        }.bind(this)
    });

    this.form = this.layout.cells('a').attachForm([
        {
            type: "settings",
            position: "label-left",
            labelWidth: 150,
            inputWidth: 180,
            labelAlign: "right",
            offsetLeft: 20
        },
        {type: 'input', name: 'email', label: 'Endereço de email:', required: true, validate: "ValidEmail"},
        {type: 'input', name: 'nome', label: 'Nome do destinatário:'},
        {type: 'input', name: 'bloco', label: 'Bloco:'},
        {type: 'input', name: 'unidade', label: 'Unidade:'},
    ]);

    this.form.attachEvent("onAfterValidate", function (status) {

        if (status === false)
            return;

        this.data = this.form.getFormData();
        this.data.firstuser = user.id;
        this.data.condominio = condomino_id;
        this.data.base = baseid;

        if (this.situacao === 'novo') {
            this.destinatarios.Adicionar(this.data).then(() => {
                this.AtualizaListaDestinatarios();
                dhtmlx.message({
                    text: 'Registro salvo com sucesso',
                    expire: 4000
                });
            }).finally(() => {
                this.NovoRegistro();
                document.dispatchEvent(new CustomEvent('AoAtualizarRegistro', {
                    detail: this
                }));
            })
        } else {
            this.destinatarios.Editar(this.data).then(() => {
                this.AtualizaListaDestinatarios();
                dhtmlx.message({
                    text: 'Atualizado com sucesso',
                    expire: 4000
                });
            }).finally(() => {
                this.NovoRegistro();
                document.dispatchEvent(new CustomEvent('AoAtualizarRegistro', {
                    detail: this
                }));
            })
        }


    }.bind(this));

    this.grid = this.layout.cells('b').attachGrid();
    this.grid.setHeader("Id,Email,Destinatário,Bloco,Unidade");
    this.grid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    this.grid.setColTypes("ro,ro,ro,ro,ro");
    this.grid.setInitWidths("0,,,,");
    this.grid.init();
    this.grid.attachEvent("onRowSelect", function (id) {
        this.situacao = 'hist';
        this.destinatarios.PesquisaDestinatario(id).then(response => {
            this.form.setFormData(response);
            this.conta = response.id;
        })
    }.bind(this));


    this.NovoRegistro = function () {
        this.form.clear();
        this.data = undefined;
        this.conta = undefined;
        this.situacao = 'novo';
    };

    this.AtualizaListaDestinatarios = function () {
        this.destinatarios.ListarDestinatarios(baseid).then(response => {
            this.grid.clearAll();
            response.filter(function (item) {
                this.grid.addRow(item.id, [item.id, item.email, item.nome, item.bloco, item.unidade], 0);
            }.bind(this));
        });
    };

    this.AtualizaListaDestinatarios();

};