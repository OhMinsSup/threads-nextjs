import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

type LexicalNode = SerializedLexicalNode & Record<string, any>;

type FindKeys = string;

interface Result {
  type: FindKeys;
  node: LexicalNode;
  [key: string]: any;
}

function depthFristSearchNode(node: LexicalNode, keys: FindKeys[]) {
  let result: Result[] = [];

  if ("type" in node && keys.includes(node.type)) {
    result.push({ type: node.type, node });
  }

  for (const child of node.children || []) {
    result = result.concat(depthFristSearchNode(child, keys));
  }

  return result;
}

// state내에는 깊은 트리구조로 되어있음 (노드의 노드의 노드...) 이 깊은 트리구조를 가장 빠르게 순회를 하면서 노드의 타입이 keys와 일치하는 노드를 찾아내는 함수 (DFS 알고리즘 사용)
export function getFindByLexicalNodeTypes(
  keys: FindKeys[],
  state: SerializedEditorState<LexicalNode>,
) {
  return depthFristSearchNode(state.root, keys);
}
