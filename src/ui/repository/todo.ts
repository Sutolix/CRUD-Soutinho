interface Todo {
    id: string;
    date: Date;
    content: string;
    done: boolean;
}

interface TodoRepositoryGetParams {
    page: number;
    limit: number;
}

interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function parseTodosFromServer(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Array<Todo>;
} {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "total" in responseBody &&
        "pages" in responseBody &&
        "todos" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
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
        total: 0,
        pages: 1,
        todos: [],
    };
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(async (res) => {
        const responseParsed = parseTodosFromServer(await res.json());

        return {
            total: responseParsed.total,
            todos: responseParsed.todos,
            pages: responseParsed.pages,
        };
    });
}

export const todoRepository = {
    get,
};
