import __mongodb from "isotropy-mongodb-server";
async function countTodos(who) {
  return db.todos.length;
}