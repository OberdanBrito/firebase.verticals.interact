class Editor {

    View(cell) {

        this.comunicados = new Comunicados();
        this.situacao = 'novo';

        this.comunicados.ObterId().then(function (response) {
            this.comunicado = response;
            console.debug('comunicado gerado:', this.comunicado);
        }.bind(this)).then(() => {

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
                        width: 240
                    },
                    {
                        id: 'b',
                        header: false,
                    }
                ]
            });

            this.AdicionarBarradeAssunto();
            this.AdicionarListadeDocumentos();
            this.AdicionarBarraComandos(cell);
            this.AdicionarEditor();
            this.ListaDocumentos();

        });

    }

    AdicionarBarradeAssunto() {

        this.toolbareditor = this.layout.attachToolbar({
            icon_path: 'img/editor/toolbar/'
        });

        this.toolbareditor.clearAll();
        this.toolbareditor.addText('text', 0, 'Assunto:');
        this.toolbareditor.addInput('assunto', 1, "", window.screen.width * 0.87);

    }

    AdicionarBarraComandos(cell) {

        cell.detachToolbar();
        cell.detachRibbon();

        this.ribbon = cell.attachRibbon({
            iconset: "awesome",
            items: ribbonButtons
        });

        this.ribbon.attachEvent("onClick", function (itemId) {


            if (itemId.indexOf('style_') > -1) {
                this.Editor.summernote(itemId.replace('style_', ''));

            } else if (itemId.indexOf('font_') > -1) {
                this.Editor.summernote('fontName', itemId.replace('font_', ''));

            } else if (itemId === 'salvar') {
                this.Finalizar();

            } else if (itemId === 'novo') {
                this.NovoDocumento();

            } else if (itemId === 'negrito') {
                this.Editor.summernote('bold');

            } else if (itemId === 'italico') {
                this.Editor.summernote('italic');

            } else if (itemId === 'underline') {
                this.Editor.summernote('underline');

            } else if (itemId === 'strikethrough') {
                this.Editor.summernote('strikethrough');

            } else if (itemId === 'limpar') {
                this.Editor.summernote('removeFormat');

            } else if (itemId === 'anexar') {

                if (!this.anexos)
                    this.anexos = new Anexos('Anexar arquivo', user.applicationid, condomino_id);

                if (this.listdocumentos.getSelected() === '') {
                    this.comunicados.ObterId().then(response => {
                        this.comunicado = response;
                        this.anexos.View(this.Editor, response, false);
                    });
                } else {
                    this.anexos.View(this.Editor, this.listdocumentos.getSelected());
                }

            } else if (itemId === 'converter') {

                if (!this.anexos)
                    this.anexos = new Anexos('Converte PDF em JPG', user.applicationid, condomino_id);

                if (this.listdocumentos.getSelected() === '') {
                    this.comunicados.ObterId().then(response => {
                        this.comunicado = response;
                        this.anexos.View(this.Editor, response, true);
                    });
                } else {
                    this.anexos.View(this.Editor, this.listdocumentos.getSelected());
                }

            } else if (itemId === 'logo') {

                this.Editor.summernote('pasteHTML', '<p></p>');
                vladm.condominio.ObterLogo(condomino_id).then(response => {
                    this.Editor.summernote('insertImage', response.logo + '?trace=' + this.comunicado);
                });

            } else if (itemId === 'remover') {
                dhtmlx.confirm({
                    title: 'Atenção',
                    type: "confirm-warning",
                    text: "Você confirma a exclusão deste arquivo?",
                    callback: function (result) {

                        if (result === true)
                            this.comunicados.Remover(this.comunicado).then(() => {
                                this.comunicado = undefined;
                                this.ListaDocumentos();
                                this.NovoDocumento();
                            });

                    }.bind(this)
                });
            } else if (itemId === 'enviar_email') {

                siderbar.items("postagem").setActive();
                new Postagem().View(siderbar.cells('postagem'), this.listdocumentos.getSelected());

            } else if (itemId === 'resumir') {

                this.Resumir();

            }
        }.bind(this));

        this.ribbon.attachEvent("onCheck", function (id, state) {
            if (id === 'postar_homepage') {
                this.comunicados.HabilitarnoPortal(this.comunicado, state);
            }
        }.bind(this));
    };

    AdicionarListadeDocumentos() {

        this.listdocumentos = this.layout.cells('a').attachList({
            container: "data_container",
            type: {
                template: "http->./html/tpldocumentos.html",
                height: 'auto'
            }
        });

        this.listdocumentos.attachEvent("onItemClick", function (id) {

            this.ribbon.uncheck('postar_homepage');

            this.comunicado = id;
            this.situacao = 'base';
            this.comunicados.Pesquisar(id).then(response => {

                this.ribbon.enable('enviar_email');
                this.ribbon.enable('publicar');
                this.ribbon.enable('postar_homepage');
                this.ribbon.enable('resumir');
                this.ribbon.enable('imagem_capa');

                this.toolbareditor.setValue('assunto', response.assunto);
                this.Editor.summernote('reset');
                this.Editor.summernote('pasteHTML', response.corpo);

                if (response.habilitado_portal)
                    this.ribbon.check('postar_homepage');

            });
            return true;
        }.bind(this));
    }

    AdicionarEditor() {

        this.layout.attachEvent('onContentLoaded', function (id) {

            if (id !== 'b')
                return;

            this.ifrEditor = this.layout.cells(id).getFrame().contentWindow;
            this.Editor = this.ifrEditor.iniciarEditor(this.layout.cells('b').getHeight() * 0.93);

            this.Editor.on('summernote.change', function (we, contents) {
                this.conteudo = contents;
            }.bind(this));

        }.bind(this));
        this.layout.cells('b').attachURL('./html/editor.html');

    }

    ListaDocumentos() {

        this.comunicados.Listar().then(response => {
            this.listdocumentos.clearAll();
            this.listdocumentos.parse(response, 'json');
        })

    }

    NovoDocumento() {

        this.toolbareditor.setValue('assunto', '', false);
        statusbar.setText();
        this.conteudo = undefined;
        this.comunicado = undefined;
        this.Editor.summernote('reset');
        this.situacao = 'novo';

    }

    Finalizar() {

        let assunto = this.toolbareditor.getInput('assunto').value;

        if (assunto.length === 0) {
            dhtmlx.message({
                title: "Erro na operação",
                type: "alert-error",
                text: "Por favor informe o assunto da mensagem"
            });
            return;
        }

        this.comunicados.data = {
            filedate: window.dhx.date2str(new Date(), '%Y-%m-%d %H:%i:%s'),
            firstuser: user.id,
            id: this.comunicado,
            assunto: assunto,
            corpo: this.conteudo,
            condominio: condomino_id
        };

        if (this.situacao === 'novo') {
            this.comunicados.Adicionar().then(response => {
                this.comunicado = response.id;
                this.ListaDocumentos();
                dhtmlx.message({
                    text: 'Registro salvo com sucesso'
                })
            });
        } else {
            this.comunicados.Editar().then(response => {
                this.ListaDocumentos();
                dhtmlx.message({
                    text: 'Registro salvo com sucesso'
                })
            });
        }

    };

    Resumir() {

        var Wins = new dhtmlXWindows();

        Wins.createWindow({
            id: 'resumir',
            width: 500,
            height: 500,
            center: true,
            modal: true,
            resize: false,
            caption: 'Resumo da postagem'
        });

        let toolbar = Wins.window('resumir').attachToolbar({
            iconset: 'awesome',
            items: [
                {id: "salvar", type: "button", text: 'Salvar', img: 'fas fa-save'}
            ],
            onClick: function () {
                this.comunicados.AtualizarResumo(this.comunicado, this.formresumo.getItemValue('resumo')).then(() => {
                    Wins.window('resumir').close();
                });
            }.bind(this)
        });

        this.formresumo = Wins.window('resumir').attachForm([
            {type: 'editor', name: 'resumo', inputWidth: 485, inputHeight: 400, value: "Resumo da postagem"}
        ]);

        this.comunicados.ObterResumo(this.comunicado).then(response => {
            this.formresumo.setFormData(response);
        });

    }

}