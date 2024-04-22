import { useEffect, useLayoutEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BLUR_COMMAND, COMMAND_PRIORITY_EDITOR } from 'lexical';

import type { EditorState, LexicalEditor } from 'lexical';

import { isBrowser } from '~/libs/browser/dom';

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

interface LexicalOnBlurPluginProps {
  onBlur?: (
    editorState: EditorState,
    editor: LexicalEditor,
    event: FocusEvent,
  ) => void;
}

export default function LexicalOnBlurPlugin({
  onBlur,
}: LexicalOnBlurPluginProps) {
  const [editor] = useLexicalComposerContext();

  useIsomorphicLayoutEffect(() => {
    return editor.registerCommand(
      BLUR_COMMAND,
      (payload, editorValue) => {
        onBlur?.(editorValue.getEditorState(), editorValue, payload);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor, onBlur]);

  return null;
}
