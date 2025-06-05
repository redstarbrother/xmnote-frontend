<template>
  <div class="content">
    <XmEditor :options="options" />
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
</script>

<style scoped></style>
