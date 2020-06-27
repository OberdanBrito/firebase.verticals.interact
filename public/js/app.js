let siderbar, user, condomino_id, vladm;

class App {

    Start() {

        vladm = new adm();
        user = JSON.parse(sessionStorage.user);
        condomino_id = user.clients[0].client;

        siderbar = new dhtmlXSideBar({
            parent: document.getElementById('container_app'),
            template: 'icons',
            icons_path: 'img/siderbar/',
            single_cell: false,
            width: 50,
            header: false,
            autohide: false,
            items: [
                {
                    id: 'dashboard',
                    text: 'Dashboard',
                    icon: 'iniciar.png',
                    selected: false
                },
                {
                    id: 'editor',
                    text: 'Editor de mensagens',
                    icon: 'editor.png',
                    selected: true
                },
                {
                    id: 'postagem',
                    text: 'Postagem',
                    icon: 'postagem.svg',
                    selected: false
                },
                {
                    id: 'config',
                    text: 'Configurações',
                    icon: 'config.png',
                    selected: false
                }
            ]
        });

        siderbar.attachEvent('onSelect', function (id) {

            let cell = siderbar.cells(id);

            if (id === 'dashboard') {
                new Dashboard().View(cell);
            } else if (id === 'config') {
                new Config().View(cell);
            } else if (id === 'postagem') {
                new Postagem().View(cell);
            } else if (id === 'editor') {
                new Editor().View(cell);
            }

        });

        this.vlbar = new vbar();
        this.vlbar.Construir(document.getElementById('container_vbar')).then(() => {

        }).catch(function (response) {
            console.error(response);
        });

        siderbar.items("editor").setActive();
        new Editor().View(siderbar.cells('editor'));

    }

}