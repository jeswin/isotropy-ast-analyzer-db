import myDb from "../my-db";

async function getTodos(who) {
  return myDb.todos
    .filter(todo => todo.assignee === who)
    .slice(10, 20);
}
