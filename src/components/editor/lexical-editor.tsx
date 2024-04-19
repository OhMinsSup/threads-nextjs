import React, { useCallback, useState } from 'react';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $createParagraphNode, $getRoot } from 'lexical';

import type {
  InitialConfigType,
  InitialEditorStateType,
} from '@lexical/react/LexicalComposer';
import type {
  EditorState,
  HTMLConfig,
  Klass,
  LexicalNode,
  LexicalEditor as ReactLexicalEditor,
} from 'lexical';

import HashTagNode from '~/components/editor/nodes/hashtag-node';
import MentionNode, {
  $createMentionNode,
} from '~/components/editor/nodes/mention-node';
import AutoLinkPlugin from '~/components/editor/plugins/auto-link-plugin';
import LexicalOnBlurPlugin from '~/components/editor/plugins/blur-plugin';
import LexicalDefaultValuePlugin from '~/components/editor/plugins/defaultValue-plugin';
import HashTagsPlugin from '~/components/editor/plugins/hashtags-plugin';
import MentionsPlugin from '~/components/editor/plugins/mentions-plugin';
import { Skeleton } from '~/components/ui/skeleton';
import { useMemoizedFn } from '~/libs/hooks/useMemoizedFn';
import HashtagsEventsPlugin from './plugins/hashtags-events-plugin';

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-0">
      <span className=" relative block min-w-0 max-w-full overflow-visible whitespace-pre-line break-words text-left text-slate-500 dark:placeholder:text-slate-400">
        스레드를 시작하세요...
      </span>
    </div>
  );
}

export function prepopulatedRichText(mention?: string) {
  const editorState = () => {
    if (mention) {
      const root = $getRoot();

      const paragraph = $createParagraphNode();
      const mentionNode = $createMentionNode(mention);
      paragraph.append(mentionNode);

      root.append(paragraph);
    }

    return undefined;
  };

  return {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    handle: useMemoizedFn(editorState),
  };
}

const EditorNodes: Klass<LexicalNode>[] = [
  MentionNode,
  HashTagNode,
  AutoLinkNode,
  LinkNode,
];

export interface LexicalEditorProps {
  editable?: boolean;
  html?: HTMLConfig;
  editorState?: InitialEditorStateType;
  initialHTMLValue?: string;
  onChange?: (
    editorState: EditorState,
    editor: ReactLexicalEditor,
    tags: Set<string>,
  ) => void;
  onBlur?: (
    editorState: EditorState,
    editor: ReactLexicalEditor,
    event: FocusEvent,
  ) => void;
  hashtagsEventListener?: (
    event: Event,
    editor: ReactLexicalEditor,
    nodeKey: string,
  ) => void;
}
export default function LexicalEditor(props: LexicalEditorProps) {
  return <LexicalEditor.Root {...props} />;
}

LexicalEditor.Root = function LexicalEditorRoot({
  onChange,
  onBlur,
  initialHTMLValue,
  editable,
  hashtagsEventListener,
  ...otherProps
}: LexicalEditorProps) {
  const [editorConfig, setEditorConfig] = useState<InitialConfigType>({
    namespace: 'ThreadEditor',
    nodes: [...EditorNodes],
    onError(error: Error) {
      throw error;
    },
    theme: {
      paragraph: 'm-0',
      text: {
        base: 'js-lexical-text',
      },
      link: 'js-lexical-link',
    },
    editable,
    ...otherProps,
  });

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="col-start-2 row-start-2 row-end-2">
        <LexicalEditor.Editor
          onChange={onChange}
          onBlur={onBlur}
          initialHTMLValue={initialHTMLValue}
          editable={editable}
          hashtagsEventListener={hashtagsEventListener}
        />
      </div>
    </LexicalComposer>
  );
};

interface LexicalEditorEditorProps
  extends Pick<
    LexicalEditorProps,
    | 'onChange'
    | 'onBlur'
    | 'initialHTMLValue'
    | 'editable'
    | 'hashtagsEventListener'
  > {}

LexicalEditor.Editor = function LexicalEditorEditor({
  onChange,
  onBlur,
  initialHTMLValue,
  editable,
  hashtagsEventListener,
}: LexicalEditorEditorProps) {
  const onEditorChange = useCallback(
    (
      editorState: EditorState,
      changedEditor: ReactLexicalEditor,
      tags: Set<string>,
    ) => {
      onChange?.(editorState, changedEditor, tags);
    },
    [onChange],
  );

  const onEditorBlur = useCallback(
    (
      editorState: EditorState,
      editor: ReactLexicalEditor,
      event: FocusEvent,
    ) => {
      onBlur?.(editorState, editor, event);
    },
    [onBlur],
  );

  return (
    <div className="relative">
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="relative overflow-auto outline-none" />
        }
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <AutoLinkPlugin />
      <MentionsPlugin />
      <HashTagsPlugin />
      <OnChangePlugin onChange={onEditorChange} />
      <LexicalOnBlurPlugin onBlur={onEditorBlur} />
      {initialHTMLValue ? (
        <LexicalDefaultValuePlugin initialValue={initialHTMLValue} />
      ) : null}
      {!editable &&
      hashtagsEventListener &&
      typeof hashtagsEventListener === 'function' ? (
        <HashtagsEventsPlugin eventListener={hashtagsEventListener} />
      ) : null}
    </div>
  );
};

LexicalEditor.Skeleton = function LexicalEditorSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[450px]" />
      <Skeleton className="h-4 w-[350px]" />
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[550px]" />
      <Skeleton className="h-4 w-[500px]" />
    </div>
  );
};
