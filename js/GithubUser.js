export class GithubUser {
    static search(username) {
        // busca na api do github o usuario
        const endpoint = `https://api.github.com/users/${username}`;

        // retornando uma promessa
        return fetch(endpoint)
        // retorna os dados e transformo em JSON
        .then(data => data.json())
        // desestruturo os dados que quero e o fectch retorna um objeto pra mim
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}
