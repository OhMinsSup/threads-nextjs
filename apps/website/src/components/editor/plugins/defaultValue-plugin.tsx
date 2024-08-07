import type { LexicalEditor } from "lexical";
import { useEffect, useLayoutEffect } from "react";
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

import { isBrowser } from "@thread/hooks/utils/dom";

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

interface LexicalDefaultValuePluginProps {
  initialValue?: string;
}

export default function LexicalDefaultValuePlugin({
  initialValue,
}: LexicalDefaultValuePluginProps) {
  const [editor] = useLexicalComposerContext();

  const updateHTML = (
    editorValue: LexicalEditor,
    value: string,
    clear: boolean,
  ) => {
    const root = $getRoot();
    const parser = new DOMParser();
    const dom = parser.parseFromString(value, "text/html");
    const nodes = $generateNodesFromDOM(editorValue, dom);
    if (clear) {
      root.clear();
    }
    root.append(...nodes);
  };

  useIsomorphicLayoutEffect(() => {
    if (editor && initialValue) {
      editor.update(() => {
        updateHTML(editor, initialValue, true);
      });
    }
  }, [initialValue]);

  return null;
}
