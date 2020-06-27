let Processamento = function (cell) {

    let that = this, grid, griddebug, apresentadebug, winAt;

    this.Iniciar = function (params, debug) {

        winAt = new dhtmlXWindows({
            image_path: "codebase/imgs/"
        });

        console.clear();
        cell.progressOn();
        apresentadebug = debug;
        cell.detachObject(true);

        grid = cell.attachGrid();
        grid.setImagePath("./codebase/imgs/");
        grid.setHeader("Id, Torre,Unidade,Remetente,Destinatário");
        grid.setInitWidths("80,80,80,230");

        let xhr = new XMLHttpRequest();

        xhr.open('POST', './ws/interact.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.onloadstart = function () {

            grid.init();
            that.BarradeProgresso();

        };

        xhr.onreadystatechange = function () {

            if (xhr.readyState === XMLHttpRequest.LOADING) {

                let result = xhr.response.split("\n");

                result.filter(function (item) {

                    if (item.length === 0)
                        return;

                    let list = JSON.parse(item);

                    if (list.tipo === 'Processamento')
                        that.ApresentaProcessamento(list);

                });

            } else if (xhr.readyState === XMLHttpRequest.DONE) {
                cell.progressOff();
                that.AvaliaResposta(xhr.response);
                winAt.window('progresso').close();
            }
        };

        xhr.send(params);

    };

    this.BarradeProgresso = function () {

        let winat = "progresso";

        winAt.createWindow({
            id: winat,
            width: 300,
            height: 100,
            center: true
        });

        winAt.window(winat).hideHeader();
        winAt.window(winat).denyMove();
        winAt.window(winat).denyPark();
        winAt.window(winat).denyResize();


    };

    this.AvaliaResposta = function (resposta) {

        let result = resposta.split("\n");

        result.filter(function (item) {

            if (item.length === 0)
                return;

            let list = JSON.parse(item);

            switch (list.tipo) {
                case 'Processamento':
                    that.ApresentaProcessamento(list);
                    break;

                case 'Resumo':
                    that.ApresentaResumo(list);
                    break;
            }
        });

    };

    this.ApresentaProcessamento = function (list) {

        let dados = list.dados;
        if (grid.doesRowExist(dados.id) === false)
            grid.addRow(dados.id, [dados.id, dados.bloco, dados.unidade, dados.remetente, dados.destinatarios]);

        winAt.window("progresso").attachHTMLString(
            "<div id='progressbar'>Processado: " + list.registros.atual + " de " + list.registros.total + "</div>"
        );

    };

    this.ApresentaResumo = function (list) {

        let winat = "resumo";

        winAt.createWindow({
            id: winat,
            width: 500,
            height: 300,
            center: true,
            caption: "Resumo da operação"
        });

        winAt.window(winat).denyPark();
        winAt.window(winat).denyResize();

        let gridr = winAt.window(winat).attachGrid();
        gridr.setImagePath("./codebase/imgs/");
        gridr.setHeader("Correspondente, E-mails enviados");
        gridr.setInitWidths(",150");
        gridr.init();

        list.correspondentes.filter(function (detalhes) {
            gridr.addRow(detalhes.id, [detalhes.endereco, detalhes.registro]);
        });

        let status = winAt.window(winat).attachStatusBar({
            height: 35
        });

        status.setText("Registros:" + list.dados.registros + " Processados:" + list.dados.processados);


        if (apresentadebug === true) {

            that.ApresentaMensagensDebug();

            if (list.debug.length > 0)
                that.CarregaGridDebug(list.debug);

        }


    };

    this.ApresentaMensagensDebug = function () {

        let winat = "debug";

        winAt.createWindow({
            id: winat,
            width: 800,
            height: 500,
            center: true,
            caption: "Mensagens do servidor SMTP"
        });

        griddebug = winAt.window(winat).attachGrid();
        griddebug.setImagePath("./codebase/imgs/");
        griddebug.setHeader("Nível, Mensagem");
        griddebug.setInitWidths("100,");
        griddebug.init();

    };

    this.CarregaGridDebug = function (list) {

        list.filter(function (item) {
            griddebug.addRow(item.dados.id, [item.dados.Nivel, item.dados.Mensagem]);
        });

    }

};