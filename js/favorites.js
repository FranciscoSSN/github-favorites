import { GithubUser } from "./GithubUser.js";

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();

    }

    async add(username) {
        // async await -> aguarde uma promessa
        // fazendo tratamento de error com async await
        try {

            const userExists = this.entries.find(entry => entry.login === username);

            if(userExists) {
                throw new Error("Usuário já cadastrado!");
            }

            const user = await GithubUser.search(username);

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado');
            }

            this.entries = [user, ...this.entries];
            this.update();
            this.saveLocalStorage();

        }catch(error) {
            alert(error);
        }

    }

    saveLocalStorage() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    load() {
        // dados
        // salvar no localstorage
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    }

    delete(user) {
        // higher-oder function (map, filter, find, reduce)
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);

        this.entries = filteredEntries;
        this.update();
        this.saveLocalStorage();
    }
}

// classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);

        this.tbody = this.root.querySelector('table tbody')


        this.update();
        this.onadd();
    }

    onadd() {
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input');

            this.add(value);
        }
    }

    update() {
        this.removeAllTr();

        this.entries.forEach((user) => {
            //criou a linha
            const row = this.createRow();

            // pesquisou e alterou o elemento
            row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
            row.querySelector(".user img").alt = `Imagem de ${user.name}`;
            row.querySelector(".user a").href = `https://github.com/${user.login}`;
            row.querySelector(".user p").textContent = user.name;
            row.querySelector(".repositories").textContent = user.public_repos;
            row.querySelector(".followers").textContent = user.followers;

            row.querySelector(".remove").onclick = () => {
              const isOk = confirm("Deseja deletar está linha?");

              if(isOk) {
                this.delete(user);
              }
            }

            // criou a linha
            this.tbody.append(row);
        });
    }

    createRow() {
        // criando os elementos
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/FranciscoSSN.png" alt="Imagem de Francisco">
                <a href="https://github.com/FranciscoSSN" target="_blank">
                    <p>Francisco Neto</p>
                    <span>FranciscoSSN</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                3
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `;

        return tr;
    }

    removeAllTr() {
        // remover os elementos
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove();
        });
    }
}
