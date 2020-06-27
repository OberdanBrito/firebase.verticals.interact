let Postagem = function () {

    this.View = function (cell, comunicado_id) {

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
                    height: 180,
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

        this.toolbar = this.layout.cells('a').attachToolbar({
            iconset: 'awesome',
            items: [
                {id: "iniciar", type: "button", text: 'Iniciar', img: 'fas fa-play'},
            ],
            onClick: function (id) {
                if (id === 'iniciar') {
                    this.form.validate();
                }
            }.bind(this)
        });

        this.form = this.layout.cells('a').attachForm();
        this.form.loadStruct(campospostagem, function () {

            let combocomunicados = this.form.getCombo('comunicado');
            new Comunicados().Combo(condomino_id).then(response => {
                combocomunicados.addOption(response);

                if (comunicado_id !== undefined) {
                    combocomunicados.selectOption(combocomunicados.getIndexByValue(comunicado_id));
                }

            });

            let combocorrespondentes = this.form.getCombo('conta');
            new Correspondentes().Combo(condomino_id).then(response => {
                combocorrespondentes.addOption(response);
            });

            let combobases = this.form.getCombo('base');
            new Bases().Combo(condomino_id).then(response => {
                combobases.addOption(response);
            });

        }.bind(this));

        this.form.attachEvent("onAfterValidate", function (status) {

            if (status === false)
                return;

            let data = this.form.getFormData();
            data.firstuser = user.id;
            data.condominio = condomino_id;
            this.SalvarPostagem(data).then(response => {
                this.IniciarPostagem(response.id);
            })

        }.bind(this));

    };

    this.SalvarPostagem = function (data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: window.interact.endpoint + '/postagem?select=id',
                dataType: 'json',
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                },
                data: data
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível salvar a postagem'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.IniciarPostagem = function (id) {

        this.grid = this.layout.cells('b').attachGrid();
        this.grid.setImagePath("./codebase/imgs/");
        this.grid.setHeader("Id,Data,Torre,Unidade,Destinatário,Email,Situação,Erro");
        this.grid.attachHeader(",#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
        this.grid.setInitWidths("50,170,80,80,");

        let xhr = new XMLHttpRequest();
        xhr.open('POST', window.interact.webservice + '?id=' + id + '&clienteid=' + condomino_id, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onloadstart = function () {
            statusbar.setText('Iniciando o processo de envio');
            this.grid.init();
            this.toolbar.disableItem('iniciar');
            this.form.forEachItem(function (name) {
                this.form.disableItem(name);
            }.bind(this));

        }.bind(this);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.LOADING) {
                let result = xhr.response.split("\n");
                result.filter(function (item) {
                    if (item.length === 0)
                        return;
                    let list = JSON.parse(item);
                    if (list.tipo === 'processamento')
                        this.ApresentaProcessamento(list)
                }.bind(this));
            } else if (xhr.readyState === XMLHttpRequest.DONE) {
                this.AvaliaResposta(xhr.response);
            }
        }.bind(this);
        xhr.onerror = function () {
        };
        xhr.send();
    };

    this.ApresentaProcessamento = function (dados) {

        if (this.grid.doesRowExist(dados.id) === false)
            this.grid.addRow(dados.id, [dados.atual, dados.data, dados.bloco, dados.unidade, dados.nome, dados.email, dados.situacao, dados.erros], 0);

        statusbar.setText('Processado: ' + dados.atual + ' de ' + dados.total);

    };

    this.AvaliaResposta = function (resposta) {

        let result = resposta.split("\n");

        result.filter(function (item) {

            if (item.length === 0)
                return;

            let list = JSON.parse(item);

            switch (list.tipo) {
                case 'processamento':
                    this.ApresentaProcessamento(list)
                    break;

                case 'resumo':
                    dhtmlx.alert({
                        title: 'Atenção',
                        type: 'alert',
                        text: 'Processo de envio finalizado'
                    });

                    this.toolbar.enableItem('iniciar');
                    this.form.forEachItem(function (name) {
                        this.form.enableItem(name);
                    }.bind(this));

                    break;
            }
        }.bind(this));

    };


};