interface Todo {
    id: string;
    date: Date;
    content: string;
    done: boolean;
}

interface todoRepositoryGetParams {
    page: number;
    limit: number;
}

interface todoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function parseTodosFromServer(responseBody: unknown): { todos: Array<Todo> } {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== "object") {
                    throw new Error("Invalid todo from API");
                }

                const { id, content, date, done } = todo as {
                    id: string;
                    content: string;
                    date: string;
                    done: string;
                };

                return {
                    id,
                    content,
                    date: new Date(date),
                    done: String(done).toLocaleLowerCase() === "true",
                };
            }),
        };
    }

    return {
        todos: [],
    };
}

function get({
    page,
    limit,
}: todoRepositoryGetParams): Promise<todoRepositoryGetOutput> {
    return fetch("/api/todos").then(async (res) => {
        const data = parseTodosFromServer(await res.json());

        const ALL_TODOS = data.todos;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
        const totalPages = Math.ceil(ALL_TODOS.length / limit);

        return {
            todos: paginatedTodos,
            total: paginatedTodos.length,
            pages: totalPages,
        };
    });
}

export const todoRepository = {
    get,
};
