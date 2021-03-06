import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    /*
    A database write; which is an assignment expression
      eg:
        myDb.todos = myDb.todos.concat({ title, assignee });
    */
    analyzeAssignmentExpression(path, state) {
      return makeAnalyzer(
        [schemas.insert, schemas.update, schemas.writeError],
        path,
        state,
        analysisState
      );
    }
  };
}
