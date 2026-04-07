import React, { useEffect, useState } from "react";
import {
  EditorState,
  convertToRaw,
  ContentState,
  Modifier,
  convertFromRaw,
} from "draft-js";
import dynamic from "next/dynamic";
// import htmlToDraft from "html-to-draftjs"
import draftToHtml from "draftjs-to-html";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, Flex } from "@chakra-ui/react";

export default function RichText({
  setNewPortalContent,
  setOldPortalContent,
  textField,
  newPortalContent,
}) {
  const [initial, setIntial] = useState(true);
  const [editorState, setEditorState] = useState(() => {
    if (newPortalContent) {
      let jsonParse;
      try {
        jsonParse = JSON.parse(newPortalContent);
      } catch (err) {}
      const contentState = convertFromRaw(jsonParse);
      const state = EditorState.createWithContent(contentState);
      return state;
    }
    return EditorState.createEmpty();
  });

  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const handleContentChange = (e) => {
    setNewPortalContent(JSON.stringify(e));
    const textState = convertFromRaw(e);
    setOldPortalContent(textState.getPlainText());
  };

  useEffect(() => {
    function insertCharacter() {
      const currentContent = editorState.getCurrentContent(),
        currentSelection = editorState.getSelection();
      const newContent = Modifier.insertText(
        currentContent,
        currentSelection,
        `${textField}`
      );

      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      );

      const newRawState = convertToRaw(newContent);
      setNewPortalContent(JSON.stringify(newRawState));
      setOldPortalContent(newContent.getPlainText());
      setEditorState(newEditorState);
    }
    if (!initial) {
      if (textField) {
        insertCharacter();
      }
    }
    if (!newPortalContent) {
      if (textField) {
        insertCharacter();
      }
    }
    setIntial(false);
  }, [textField]);

  return (
    // <Flex
    //   direction="column"
    //   flexGrow="2"
    //   border="1px solid"
    //   borderColor="gray.300"
    //   borderRadius="10px"
    //   padding="10px"
    //   mt="20px"
    //   overflow={"hidden"}
    // >
    <Editor
      //@ts-ignore
      editorState={editorState}
      onEditorStateChange={handleEditorStateChange}
      onContentStateChange={handleContentChange}
      editorClassName={"rich-text-editor"}
    />
    // </Flex>
  );
}
