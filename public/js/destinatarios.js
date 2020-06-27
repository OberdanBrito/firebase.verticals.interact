let Destinatarios = function () {

    this.Adicionar = function (data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: window.interact.endpoint + '/vlinteract/destinatarios',
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
                    text: 'Não foi possível listar os destinatários'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

   this.Editar = function (data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PATCH',
                url: window.interact.endpoint + '/vlinteract/destinatarios?id=eq.'+data.id,
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
                    text: 'Não foi possível editar o destinatário'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.PesquisaDestinatario = function (id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/destinatarios?id=eq.' + id,
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
                    text: 'Não foi possível pesquisar o destinatário'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.ListarDestinatarios = function (baseid) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/destinatarios?base=eq.' + baseid,
                dataType: 'json',
                success: function (response) {
                    resolve(response);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível listar os destinatários'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

    this.RemoveDestinatario = function (id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'DELETE',
                url: window.interact.endpoint + '/vlinteract/destinatarios?id=eq.' + id,
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
                    text: 'Não foi possivel remover o destinatário'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    };

};