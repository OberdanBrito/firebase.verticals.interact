class Correspondentes {

    Listar() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/correspondentes?condominio=eq.' + condomino_id,
                dataType: 'json',
                success: function (response) {
                    resolve(response);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível listar os registros'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Combo(condomino) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/correspondentes?select=id,endereco&condominio=eq.' + condomino,
                dataType: 'json',
                success: function (response) {
                    let options = [];
                    response.filter(function (item) {
                        options.push({value: item.id, text: item.endereco})
                    });
                    resolve(options);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível obter a lista de correspondentes'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Pesquisar(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/correspondentes?id=eq.' + id,
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
    }

    Adicionar() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: window.interact.endpoint + '/vlinteract/correspondentes?select=id',
                dataType: 'json',
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                },
                data: this.data
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível adicionar o registro'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    SalvarEndereco(data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: window.interact.endpoint + '/vlinteract/correspondentes',
                dataType: 'json',
                headers: {
                    Prefer: 'resolution=merge-duplicates,return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                },
                data: data
            });
        });
    };

    Editar(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PATCH',
                url: window.interact.endpoint + '/vlinteract/correspondentes?id=eq.' + id,
                dataType: 'json',
                success: function (response) {
                    resolve(response);
                },
                data: this.data
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível editar o registro'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Remover(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'DELETE',
                url: window.interact.endpoint + '/vlinteract/correspondentes?id=eq.' + id,
                dataType: 'json',
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                },
                data: this.data
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível remover o registro'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

}