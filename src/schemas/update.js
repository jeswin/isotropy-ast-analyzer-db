import { source } from "../chimpanzee-utils";
import { collection } from "./";
import { capture, Match } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { update } from "../db-statements";

/*
  There are two types of update expressions.
    db.users = db.users.filter(x => x.id === 10 ? { ...x, active: true } : x)
      AND the converse
    db.users = db.users.filter(x => x.id !== 10`` ? x : { ...x, active: true })
*/
const updateExpression = composite(
  {
    type: "ArrowFunctionExpression",
    params: [capture()],
    body: {
      type: "ConditionalExpression",
      test: capture({ selector: "path" }),
      consequent: capture(),
      alternate: capture()
    }
  },
  {
    build: obj => context => result => {
      const negate = R.equals(result.value.alternate, result.value.params[0])
        ? false
        : R.equals(result.value.consequent, result.value.params[0])
          ? true
          : new Skip(
              `Invalid update expression. Use the map() function in the prescribed form.`
            );
      return negate instanceof Skip
        ? negate
        : (() => {
            const result = parse();
          })();
    }
  }
);

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: source([collection])(state, analysisState),
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: source([collection])(state, analysisState),
          property: {
            type: "Identifier",
            name: "map"
          }
        },
        arguments: updateExpression()
      }
    },
    {
      build: obj => context => result =>
        R.equals(result.value.left, result.value.object)
          ? (() => {
              return console.log(result) || Skip("NOPE!");
            })()
          : new Skip(`The result of the map() must be assigned to the same collection.`)
      // result instanceof Match ? insert(result.value.left, { itemsNode: result.value.arguments[0] }) : result
    }
  );
}
