async function get() {
    return fetch("/api/todos").then(async (res) => {
        const data = await res.json();
        return data.todos;
    });
}

export const todoController = {
    get,
};
