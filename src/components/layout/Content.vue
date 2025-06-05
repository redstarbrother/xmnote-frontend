<template>
  <div class="content">
    <xm-editor :extensions="options.extensions" :onChanged="onChanged" :onFocus="onFocus" />
    <p>this is home content</p>
  </div>
</template>

<script setup>
import XmEditor from 'xm-editor'
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
} from 'xm-editor'
import 'xm-editor/xm-editor.css'

const options = {
  extensions: [
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
  ],
}

function onChanged({ editor }) {
  console.log(editor.getJSON())
}

function onFocus() {
  console.log('focus')
}
</script>

<style scoped></style>
