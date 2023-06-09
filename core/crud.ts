import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

// console.log("CRUD");

type UUID = string;

interface Todo {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };
    const todos: Array<Todo> = [...read(), todo];

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );
    return todo;
}

export function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    return db.todos ? db.todos : [];
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos: Array<Todo> = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );

    if (!updatedTodo) {
        throw new Error("Please, provide a valid ID!");
    }

    return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
    return update(id, { content });
}

function deleteById(id: UUID): void {
    const todos: Array<Todo> = read();
    const todosWithoutOne = todos.filter((todo) => {
        return todo.id !== id;
    });
    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos: todosWithoutOne,
            },
            null,
            2
        )
    );
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
// CLEAR_DB();
// const firstTodo = create("Primeira TODO");
// const secondTodo = create("Segunda TODO");
// deleteById(secondTodo.id);
// const thirdTodo = create("Terceira TODO");
// update(thirdTodo.id, {
//     content: "Hello World",
//     done: true,
// });
// updateContentById(firstTodo.id, "Olá Mundo");

// console.log(read());
