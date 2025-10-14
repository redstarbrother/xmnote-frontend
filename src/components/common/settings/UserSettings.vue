<template>
  <!-- 设置弹出框 -->
  <el-dialog
    v-model="dialogVisible"
    title="用户设置"
    width="80%"
    :before-close="handleClose"
    class="settings-dialog"
    center
  >
    <el-tabs type="border-card">
      <!-- 网站设置 -->
      <el-tab-pane label="网站设置">
        <el-form :model="settings.site" label-width="120px">
          <el-form-item label="网站名称">
            <el-input v-model="settings.site.siteName" />
          </el-form-item>
          <el-form-item label="Logo URL">
            <el-input v-model="settings.site.logoUrl" />
          </el-form-item>
          <el-form-item label="Favicon URL">
            <el-input v-model="settings.site.faviconUrl" />
          </el-form-item>
          <el-form-item label="网站描述">
            <el-input v-model="settings.site.description" type="textarea" />
          </el-form-item>
          
          <el-divider content-position="left">登录设置</el-divider>
          <el-form-item label="允许注册">
            <el-switch v-model="settings.site.allowRegister" />
          </el-form-item>
          <el-form-item label="登录方式">
            <el-select v-model="settings.site.loginMethod">
              <el-option label="邮箱" value="email" />
              <el-option label="用户名" value="username" />
              <el-option label="手机号" value="phone" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用两步验证">
            <el-switch v-model="settings.site.enable2FA" />
          </el-form-item>
          <el-form-item label="允许第三方登录">
            <el-switch v-model="settings.site.allowThirdPartyLogin" />
          </el-form-item>
          
          <el-divider content-position="left">同步设置</el-divider>
          <el-form-item label="存储模式">
            <el-select v-model="settings.site.storageMode">
              <el-option label="自托管" value="self_hosted" />
              <el-option label="云存储" value="cloud" />
            </el-select>
          </el-form-item>
          <el-form-item label="自动同步">
            <el-switch v-model="settings.site.autoSync" />
          </el-form-item>
          <el-form-item label="同步间隔(分钟)">
            <el-input-number v-model="settings.site.syncInterval" :min="1" :max="60" />
          </el-form-item>
          
          <el-divider content-position="left">主题设置</el-divider>
          <el-form-item label="主题模式">
            <el-select v-model="settings.site.themeMode">
              <el-option label="自动" value="auto" />
              <el-option label="亮色" value="light" />
              <el-option label="暗色" value="dark" />
            </el-select>
          </el-form-item>
          <el-form-item label="字体">
            <el-input v-model="settings.site.fontFamily" />
          </el-form-item>
          <el-form-item label="字体大小">
            <el-input-number v-model="settings.site.fontSize" :min="12" :max="24" />
          </el-form-item>
          <el-form-item label="主题色">
            <el-color-picker v-model="settings.site.accentColor" />
          </el-form-item>
          <el-form-item label="布局模式">
            <el-select v-model="settings.site.layoutMode">
              <el-option label="经典" value="classic" />
              <el-option label="现代" value="modern" />
              <el-option label="紧凑" value="compact" />
            </el-select>
          </el-form-item>
          
          <el-divider content-position="left">安全设置</el-divider>
          <el-form-item label="启用加密">
            <el-switch v-model="settings.site.enableEncryption" />
          </el-form-item>
          <el-form-item label="自动锁定时间(分钟)">
            <el-input-number v-model="settings.site.autoLockTime" :min="1" :max="60" />
          </el-form-item>
          <el-form-item label="数据备份">
            <el-switch v-model="settings.site.dataBackup" />
          </el-form-item>
          <el-form-item label="备份计划">
            <el-input v-model="settings.site.backupSchedule" placeholder="Cron表达式，例如: 0 2 * * *" />
          </el-form-item>
          <el-form-item label="启用邮件通知">
            <el-switch v-model="settings.site.enableEmailNotify" />
          </el-form-item>
          <el-form-item label="订阅新闻通讯">
            <el-switch v-model="settings.site.newsletterOptIn" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <!-- 编辑器设置 -->
      <el-tab-pane label="编辑器设置">
        <el-form :model="settings.editor" label-width="120px">
          <el-form-item label="显示工具栏">
            <el-switch v-model="settings.editor.showToolbar" />
          </el-form-item>
          <el-form-item label="工具栏项目">
            <el-select v-model="settings.editor.toolbarItems" multiple>
              <el-option label="加粗" value="bold" />
              <el-option label="斜体" value="italic" />
              <el-option label="下划线" value="underline" />
              <el-option label="删除线" value="strike" />
              <el-option label="标题" value="heading" />
              <el-option label="无序列表" value="bulletList" />
              <el-option label="有序列表" value="orderedList" />
              <el-option label="引用" value="blockquote" />
              <el-option label="代码块" value="codeBlock" />
              <el-option label="图片" value="image" />
              <el-option label="表格" value="table" />
            </el-select>
          </el-form-item>
          <el-form-item label="自动保存">
            <el-switch v-model="settings.editor.autosave" />
          </el-form-item>
          <el-form-item label="自动保存间隔(秒)">
            <el-input-number v-model="settings.editor.autosaveInterval" :min="5" :max="60" />
          </el-form-item>
          <el-form-item label="显示行号">
            <el-switch v-model="settings.editor.showLineNumbers" />
          </el-form-item>
          <el-form-item label="自动换行">
            <el-switch v-model="settings.editor.wordWrap" />
          </el-form-item>
          
          <el-divider content-position="left">编辑模式</el-divider>
          <el-form-item label="专注模式">
            <el-switch v-model="settings.editor.focusMode" />
          </el-form-item>
          <el-form-item label="禅模式">
            <el-switch v-model="settings.editor.zenMode" />
          </el-form-item>
          <el-form-item label="拼写检查">
            <el-switch v-model="settings.editor.spellCheck" />
          </el-form-item>
          <el-form-item label="预览分割方向">
            <el-select v-model="settings.editor.markdownPreviewSplit">
              <el-option label="垂直" value="vertical" />
              <el-option label="水平" value="horizontal" />
            </el-select>
          </el-form-item>
          <el-form-item label="默认文档类型">
            <el-select v-model="settings.editor.defaultDocType">
              <el-option label="笔记" value="note" />
              <el-option label="文档" value="document" />
              <el-option label="待办" value="todo" />
            </el-select>
          </el-form-item>
          
          <el-divider content-position="left">扩展设置</el-divider>
          <el-form-item label="启用的扩展">
            <el-select v-model="settings.editor.enabledExtensions" multiple>
              <el-option label="加粗" value="bold" />
              <el-option label="斜体" value="italic" />
              <el-option label="标题" value="heading" />
              <el-option label="任务列表" value="taskList" />
              <el-option label="图片" value="image" />
              <el-option label="代码块" value="codeBlock" />
            </el-select>
          </el-form-item>
          <el-form-item label="图片上传模式">
            <el-select v-model="settings.editor.imageUploadMode">
              <el-option label="对象存储" value="oss" />
              <el-option label="本地存储" value="local" />
              <el-option label="外部链接" value="external" />
            </el-select>
          </el-form-item>
          <el-form-item label="自动建议标签">
            <el-switch v-model="settings.editor.autosuggestTags" />
          </el-form-item>
          <el-form-item label="启用AI助手">
            <el-switch v-model="settings.editor.enableAIAssistant" />
          </el-form-item>
          <el-form-item label="AI模型">
            <el-select v-model="settings.editor.aiModel">
              <el-option label="DeepSeek Chat" value="deepseek-chat" />
              <el-option label="GPT-4" value="gpt-4" />
              <el-option label="Claude" value="claude" />
            </el-select>
          </el-form-item>
          
          <el-divider content-position="left">导出与分享</el-divider>
          <el-form-item label="默认导出格式">
            <el-select v-model="settings.editor.defaultExportFormat">
              <el-option label="Markdown" value="md" />
              <el-option label="PDF" value="pdf" />
              <el-option label="HTML" value="html" />
            </el-select>
          </el-form-item>
          <el-form-item label="允许公开分享">
            <el-switch v-model="settings.editor.allowPublicShare" />
          </el-form-item>
          <el-form-item label="水印文本">
            <el-input v-model="settings.editor.watermarkText" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <!-- 用户设置 -->
      <el-tab-pane label="用户设置">
        <el-form :model="settings.user" label-width="120px">
          <el-form-item label="语言">
            <el-select v-model="settings.user.language">
              <el-option label="简体中文" value="zh-CN" />
              <el-option label="English" value="en-US" />
            </el-select>
          </el-form-item>
          <el-form-item label="时区">
            <el-select v-model="settings.user.timezone">
              <el-option label="亚洲/上海" value="Asia/Shanghai" />
              <el-option label="美国/纽约" value="America/New_York" />
              <el-option label="欧洲/伦敦" value="Europe/London" />
            </el-select>
          </el-form-item>
          <el-form-item label="编辑器主题">
            <el-select v-model="settings.user.editorTheme">
              <el-option label="Solarized Dark" value="solarized-dark" />
              <el-option label="Solarized Light" value="solarized-light" />
              <el-option label="GitHub" value="github" />
              <el-option label="VS Code" value="vscode" />
            </el-select>
          </el-form-item>
          <el-form-item label="自定义CSS">
            <el-input v-model="settings.user.customCss" type="textarea" rows="4" />
          </el-form-item>
          <el-form-item label="默认文件夹">
            <el-input v-model="settings.user.defaultFolder" />
          </el-form-item>
          <el-form-item label="最近文档数量">
            <el-input-number v-model="settings.user.recentDocsCount" :min="5" :max="30" />
          </el-form-item>
          <el-form-item label="收藏标签">
            <el-select v-model="settings.user.favoriteTags" multiple allow-create filterable>
              <el-option v-for="tag in settings.user.favoriteTags" :key="tag" :label="tag" :value="tag" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用快捷键">
            <el-switch v-model="settings.user.enableShortcuts" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";

// 对话框可见性
const dialogVisible = ref(false);

// 设置数据
const settings = reactive({
  site: {
    siteName: "西木笔记",
    logoUrl: "/assets/logo.svg",
    faviconUrl: "/favicon.ico",
    description: "一个极简、安全、私密的笔记系统。",

    allowRegister: true,
    loginMethod: "email",
    enable2FA: false,
    allowThirdPartyLogin: true,

    storageMode: "self_hosted",
    autoSync: true,
    syncInterval: 5,

    themeMode: "auto",
    fontFamily: "Inter, Noto Sans SC, sans-serif",
    fontSize: 15,
    accentColor: "#4A7B9D",
    layoutMode: "classic",

    enableEncryption: true,
    autoLockTime: 10,
    dataBackup: true,
    backupSchedule: "0 2 * * *",
    enableEmailNotify: false,
    newsletterOptIn: false
  },

  editor: {
    showToolbar: true,
    toolbarItems: [
      "bold",
      "italic",
      "underline",
      "strike",
      "heading",
      "bulletList",
      "orderedList",
      "blockquote",
      "codeBlock",
      "image",
      "table"
    ],
    autosave: true,
    autosaveInterval: 10,
    showLineNumbers: true,
    wordWrap: true,

    focusMode: false,
    zenMode: false,
    spellCheck: false,
    markdownPreviewSplit: "vertical",
    defaultDocType: "note",

    enabledExtensions: ["bold", "italic", "heading", "taskList", "image", "codeBlock"],
    imageUploadMode: "oss",
    shortcutMap: {
      bold: "Ctrl+B",
      italic: "Ctrl+I",
      underline: "Ctrl+U",
      save: "Ctrl+S"
    },
    autosuggestTags: true,
    enableAIAssistant: true,
    aiModel: "deepseek-chat",

    defaultExportFormat: "md",
    allowPublicShare: false,
    watermarkText: "西木笔记 · 保留所有权利"
  },

  user: {
    language: "zh-CN",
    timezone: "Asia/Shanghai",
    editorTheme: "solarized-dark",
    customCss: "",
    defaultFolder: "我的笔记",
    recentDocsCount: 10,
    favoriteTags: ["工作", "灵感", "学习"],
    enableShortcuts: true
  }
});

// 打开设置对话框
const open = () => {
  loadSavedSettings();
  dialogVisible.value = true;
};

// 关闭设置对话框
const handleClose = () => {
  dialogVisible.value = false;
};

// 取消按钮
const cancel = () => {
  dialogVisible.value = false;
};

// 保存设置
const save = () => {
  try {
    // 保存设置到本地存储
    localStorage.setItem('xmnote-settings', JSON.stringify(settings));
    
    // 应用设置
    applySettings();
    
    // 显示成功消息
    ElMessage({
      message: '设置已保存',
      type: 'success'
    });
    
    dialogVisible.value = false;
  } catch (error) {
    console.error('保存设置失败:', error);
    ElMessage({
      message: '保存设置失败',
      type: 'error'
    });
  }
};

// 应用设置
const applySettings = () => {
  // 应用主题设置
  document.documentElement.style.setProperty('--font-family', settings.site.fontFamily);
  document.documentElement.style.setProperty('--font-size', `${settings.site.fontSize}px`);
  document.documentElement.style.setProperty('--accent-color', settings.site.accentColor);
  
  // 应用主题模式
  if (settings.site.themeMode === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.documentElement.classList.remove('light-mode');
  } else if (settings.site.themeMode === 'light') {
    document.documentElement.classList.add('light-mode');
    document.documentElement.classList.remove('dark-mode');
  } else {
    // 自动模式，根据系统设置
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }
  
  // 应用布局模式
  document.body.className = document.body.className
    .replace(/layout-\w+/g, '')
    .trim() + ` layout-${settings.site.layoutMode}`;
  
  // 应用自定义CSS
  let customStyleElement = document.getElementById('xmnote-custom-css');
  if (!customStyleElement) {
    customStyleElement = document.createElement('style');
    customStyleElement.id = 'xmnote-custom-css';
    document.head.appendChild(customStyleElement);
  }
  customStyleElement.textContent = settings.user.customCss;
  
  console.log('设置已应用');
};

// 加载保存的设置
const loadSavedSettings = () => {
  try {
    const savedSettings = localStorage.getItem('xmnote-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // 合并保存的设置到当前设置
      Object.keys(parsedSettings).forEach(key => {
        if (settings[key]) {
          settings[key] = { ...settings[key], ...parsedSettings[key] };
        }
      });
      console.log('已加载保存的设置');
    }
  } catch (error) {
    console.error('加载设置失败:', error);
  }
};

// 组件挂载时加载设置
onMounted(() => {
  loadSavedSettings();
  // 应用已保存的设置
  applySettings();
});

// 暴露方法给父组件
defineExpose({
  open
});
</script>

<style lang="scss" scoped>
// 设置弹出框样式
:deep(.settings-dialog) {
  .el-dialog__body {
    max-height: 50vh;
    overflow-y: auto;
  }
}
</style>