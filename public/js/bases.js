let Bases = function () {

    this.Listar = function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/bases?condominio=eq.' + condomino_id,
                dataType: 'json',
                success: function (response) {
                    resolve(response);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível acessar a lista de bases'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.Combo = function(condomino) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/lista_bases?select=id,basedestinatarios&condominio=eq.' + condomino,
                dataType: 'json',
                success: function (response) {
                    let options = [];
                    response.filter(function (item) {
                        options.push({value: item.id, text: item.basedestinatarios})
                    });
                    resolve(options);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível acessar a lista de bases'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.Salvar = function (data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: window.interact.endpoint + '/bases',
                dataType: 'json',
                headers: {
                    Prefer: 'resolution=merge-duplicates,return=representation',
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
                    text: 'Não foi possível salvar a base'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.Remover = function (id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'DELETE',
                url: window.interact.endpoint + '/bases?id=eq.' + id,
                dataType: 'json',
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível remover a base'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.Pesquisar = function (id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/bases?id=eq.' + id,
                dataType: 'json',
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível pesquisar o registro'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };


};