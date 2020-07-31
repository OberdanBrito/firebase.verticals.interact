class Comunicados {

    Listar() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/lista_comunicados',
                dataType: 'json',
                success: function (response) {
                    resolve(response);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível listar os comunicados'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Combo(condomino) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/lista_comunicados?select=id,assunto_datado&condominio=eq.' + condomino,
                dataType: 'json',
                success: function (response) {
                    let options = [];
                    response.filter(function (item) {
                        options.push({value: item.id, text: item.assunto_datado})
                    });
                    resolve(options);
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível listar os clientes disponíveis'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    ObterId() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: window.interact.endpoint + '/vlinteract/rpc/gen_random_uuid',
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
                    text: 'Não foi possível obter o id do novo comunicado'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Pesquisar(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/comunicados?id=eq.' + id,
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
                    text: 'Não foi possível pesquisar o comunicado'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    ObterResumo(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: window.interact.endpoint + '/vlinteract/comunicados?id=eq.' + id + '&select=resumo',
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
                    text: 'Não foi possível pesquisar o comunicado'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Adicionar() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: window.interact.endpoint + '/vlinteract/comunicados',
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
                    text: 'Não foi possível adicionar o comunicado'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Editar() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PATCH',
                url: window.interact.endpoint + '/vlinteract/comunicados?id=eq.'+this.data.id,
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
                    text: 'Não foi possível editar o comunicado'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    Remover(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'DELETE',
                url: window.interact.endpoint + '/vlinteract/comunicados?id=eq.' + id,
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
                    text: 'Não foi possível remover o comunicado'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    HabilitarnoPortal(id, status) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PATCH',
                url: window.interact.endpoint + '/vlinteract/comunicados?id=eq.'+ id,
                dataType: 'json',
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                },
                data: {
                    habilitado_portal: status
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível habilitar a postagem'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }

    AtualizarResumo(id, resumo) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PATCH',
                url: window.interact.endpoint + '/vlinteract/comunicados?id=eq.'+ id,
                dataType: 'json',
                headers: {
                    Prefer: 'return=representation',
                    Accept: 'application/vnd.pgrst.object+json'
                },
                success: function (response) {
                    resolve(response);
                },
                data: {
                    resumo: resumo
                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível atualizar o resumo'
                });
                reject(new Error(jqXHR.responseJSON.message));
            });
        });
    }
}