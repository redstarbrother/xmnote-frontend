<template>
  <div class="content-container">
    <div class="content-title">
      <input class="content-title-input" @keyup.enter="handleEnterTitle" />
    </div>
    <div class="content-editor">
      <XmEditor
        :extensions="extensions"
        :showToolbar="false"
        :backgroundColorOnFocus="'#ffffff'"
        :showBorder="false"
        :height="'100%'"
      />
    </div>
    <div class="content-footer">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import XmEditor from "xm-editor";
import {
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  BulletList,
  OrderedList,
  TaskList,
  Blockquote,
  HorizontalRule,
  CodeBlock,
} from "xm-editor";
import "xm-editor/xm-editor.css";

const extensions = [
  Heading,
  Bold,
  Italic,
  Underline,
  Strike,
  BulletList,
  OrderedList,
  TaskList,
  Blockquote,
  HorizontalRule,
  CodeBlock,
];

const xmEditorRef = ref(null);

const handleEnterTitle = () => {
  console.log("回车键被按下！");

};
</script>

<style scoped lang="scss">
.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  height: calc(100vh - 100px);

  .content-title {
    width: 80%;

    .content-title-input {
      width: 100%;
      font-size: 40px;
      font-weight: 600;
      height: 60px;
      border: none;
      outline: none;
    }
  }

  .content-editor {
    width: 80%;
    flex-grow: 1
  }
}
</style>
