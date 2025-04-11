<template>
    <div class="tiptap-editor-container">
        <div class="editor-toolbar" v-if="editor">
            <div class="toolbar-groups">
                <a-button-group class="format-group">
                    <a-button @click="editor.chain().focus().toggleBold().run()"
                        :class="{ 'is-active': editor.isActive('bold') }" title="加粗">
                        <template #icon><bold-outlined /></template>
                    </a-button>
                    <a-button @click="editor.chain().focus().toggleItalic().run()"
                        :class="{ 'is-active': editor.isActive('italic') }" title="斜体">
                        <template #icon><italic-outlined /></template>
                    </a-button>
                    <a-button @click="editor.chain().focus().toggleUnderline().run()"
                        :class="{ 'is-active': editor.isActive('underline') }" title="下划线">
                        <template #icon><underline-outlined /></template>
                    </a-button>
                    <a-button @click="editor.chain().focus().unsetAllMarks().run()" title="清除格式">
                        <template #icon><clear-outlined /></template>
                    </a-button>
                </a-button-group>

                <a-button-group class="list-group">
                    <a-button @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ 'is-active': editor.isActive('bulletList') }" title="无序列表">
                        <template #icon><unordered-list-outlined /></template>
                    </a-button>
                    <a-button @click="editor.chain().focus().toggleOrderedList().run()"
                        :class="{ 'is-active': editor.isActive('orderedList') }" title="有序列表">
                        <template #icon><ordered-list-outlined /></template>
                    </a-button>
                </a-button-group>

                <a-button-group class="align-group">
                    <a-button @click="editor.chain().focus().setTextAlign('left').run()"
                        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" title="左对齐">
                        <template #icon><align-left-outlined /></template>
                    </a-button>
                    <a-button @click="editor.chain().focus().setTextAlign('center').run()"
                        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" title="居中对齐">
                        <template #icon><align-center-outlined /></template>
                    </a-button>
                    <a-button @click="editor.chain().focus().setTextAlign('right').run()"
                        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" title="右对齐">
                        <template #icon><align-right-outlined /></template>
                    </a-button>
                </a-button-group>

                <a-button-group class="history-group">
                    <a-button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" title="撤销">
                        <template #icon><undo-outlined /></template>
                    </a-button>
                    <a-button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" title="重做">
                        <template #icon><redo-outlined /></template>
                    </a-button>
                </a-button-group>
            </div>
        </div>
        <editor-content :editor="editor" />
    </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { watch, onBeforeUnmount } from 'vue';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    ClearOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    UndoOutlined,
    RedoOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
            types: ['paragraph', 'heading']
        }),
    ],
    editorProps: {
        attributes: {
            class: 'tiptap-editor-content'
        }
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
    }
});

watch(() => props.modelValue, (newContent) => {
    const isSame = newContent === editor.value?.getHTML();
    if (!isSame && editor.value) {
        editor.value.commands.setContent(newContent, false);
    }
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<style scoped>
.tiptap-editor-container {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
}

.editor-toolbar {
    padding: 8px 12px;
    border-bottom: 1px solid #d9d9d9;
    background-color: #fafafa;
}

.toolbar-groups {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

:deep(.tiptap-editor-content) {
    padding: 12px;
    min-height: 150px;
    background-color: #fff;
    outline: none;
}

:deep(.tiptap-editor-content:focus) {
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

:deep(.tiptap-editor-content) {

    ul,
    ol {
        padding-left: 1.5em;
        margin: 0.7em 0;
    }

    li {
        margin: 0.4em 0;
        padding-left: 0.3em;
        line-height: 1.6;
    }

    li p {
        display: inline-block;
        margin: 0;
    }

    p {
        margin: 0.5em 0;
        line-height: 1.6;
    }
}

.is-active {
    color: #1890ff !important;
    background-color: #e6f7ff !important;
}

:deep(.ant-btn) {
    border: none;
    box-shadow: none;
    background: transparent;
    padding: 6px 10px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

:deep(.ant-btn:hover) {
    color: #1890ff;
    background-color: #f0f7ff;
}

:deep(.ant-btn-group) {
    display: flex;
    gap: 2px;
    padding: 2px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>