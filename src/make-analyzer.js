import { Seq } from "lazily";
import { match, Match } from "chimpanzee";

export default function makeAnalyzer(schemas, path, state, analysisState) {
  return (
    Seq.of(schemas)
      .map(schema => schema(state, analysisState))
      .map(schema => match(schema, path))
      //.map(x => console.log("\n------\n", util.inspect(x, { depth: 4 })) || print(x, "env.parents") || x)
      .first(x => x instanceof Match)
  );
}
