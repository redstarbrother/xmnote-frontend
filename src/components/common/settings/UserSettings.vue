<template>
  <div v-if="dialogVisible" class="settings-overlay" @click="handleClose">
    <div class="settings-container" @click.stop>
      <!-- 左侧导航栏 -->
      <div class="settings-sidebar">
        <div class="sidebar-top">
          <div class="sidebar-header">
            <el-icon class="header-icon" :size="20"><Setting /></el-icon>
            <span class="header-title">设置</span>
          </div>
          
          <div class="sidebar-menu">
            <div
              v-for="tab in tabs"
              :key="tab.id"
              class="menu-item"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <el-icon class="menu-icon" :size="18"><component :is="tab.icon" /></el-icon>
              <span class="menu-label">{{ tab.label }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-bottom">
          <div class="back-btn" @click="handleClose">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回应用</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="settings-content">
        <div class="content-header">
          <div class="header-info">
            <h2 class="content-title">{{ currentTabInfo.label }}</h2>
            <p class="content-desc">{{ currentTabInfo.desc }}</p>
          </div>
          <button class="close-btn" @click="handleClose">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div class="content-body">
          <template v-for="(group, gIndex) in currentGroups" :key="gIndex">
            <div v-if="!group.visibleWhen || group.visibleWhen(settings)" class="setting-group">
              <div v-if="group.title" class="group-title">{{ group.title }}</div>
              
              <!-- Grid layout container -->
              <div class="group-items-grid">
                <template v-for="(item, iIndex) in group.items" :key="iIndex">
                  <div 
                    v-if="!item.visibleWhen || item.visibleWhen(settings)" 
                    class="setting-item-wrapper"
                    :class="[`col-span-${item.colSpan || 1}`]"
                  >
                    <div class="setting-item">
                      <div v-if="item.label" class="item-label-row">
                        <div class="item-label">{{ item.label }}</div>
                        <div v-if="item.type === 'slider'" class="item-value-display">{{ settings[item.section][item.key] }}px</div>
                      </div>
                      <div v-if="item.desc && item.type === 'button'" class="item-desc-text">{{ item.desc }}</div>
                      
                      <div class="item-control">
                        <!-- 头像 Avatar -->
                        <div v-if="item.type === 'avatar'" class="avatar-uploader">
                          <el-avatar :size="64" :src="settings[item.section][item.key]" />
                          <div class="avatar-actions">
                            <el-button type="primary" plain size="small" @click="handleAvatarClick">上传头像</el-button>
                            <span class="avatar-tip">支持 JPG, PNG 格式</span>
                            <input type="file" ref="avatarInput" style="display: none" accept="image/jpeg,image/png" @change="handleAvatarChange" />
                          </div>
                        </div>

                        <!-- 设备列表 Device List -->
                        <div v-else-if="item.type === 'device-list'" class="device-list">
                           <div v-for="dev in settings[item.section][item.key]" :key="dev.id" class="device-item">
                             <div class="device-icon">
                               <el-icon :size="24"><Monitor /></el-icon>
                             </div>
                             <div class="device-info">
                               <div class="device-name">
                                 {{ dev.name }}
                                 <el-tag v-if="dev.current" size="small" type="success" effect="plain">当前设备</el-tag>
                               </div>
                               <div class="device-time">最近登录: {{ dev.time }}</div>
                             </div>
                             <div class="device-action">
                               <el-button v-if="!dev.current" type="danger" link size="small" @click="handleForceLogout(dev)">强制下线</el-button>
                             </div>
                           </div>
                        </div>

                        <!-- 单选组 Radio Group -->
                        <el-radio-group 
                          v-else-if="item.type === 'radio'"
                          v-model="settings[item.section][item.key]"
                        >
                          <el-radio v-for="opt in item.options" :key="opt.value" :value="opt.value" :label="opt.value">{{ opt.label }}</el-radio>
                        </el-radio-group>

                        <!-- 分段控制器 Segmented Control -->
                        <div v-else-if="item.type === 'segmented'" class="segmented-control">
                          <div 
                            v-for="opt in item.options" 
                            :key="opt.value"
                            class="segment-item"
                            :class="{ active: settings[item.section][item.key] === opt.value }"
                            @click="settings[item.section][item.key] = opt.value"
                          >
                            {{ opt.label }}
                          </div>
                        </div>

                        <!-- 颜色选择 Color Circles -->
                        <div v-else-if="item.type === 'color-circles'" class="color-control">
                          <div class="color-circles">
                            <div 
                                v-for="color in item.options" 
                                :key="color"
                                class="color-circle"
                                :class="{ active: settings[item.section][item.key] === color }"
                                :style="{ backgroundColor: color }"
                                @click="settings[item.section][item.key] = color"
                            >
                                <el-icon v-if="settings[item.section][item.key] === color" class="check-icon"><Check /></el-icon>
                            </div>
                          </div>
                          <div class="custom-color-picker">
                            <el-color-picker v-model="settings[item.section][item.key]" size="small" />
                            <span class="custom-color-label">自定义</span>
                          </div>
                        </div>

                        <!-- 下拉框 Select -->
                        <el-select
                          v-else-if="item.type === 'select'"
                          v-model="settings[item.section][item.key]"
                          :placeholder="item.placeholder"
                          :multiple="item.multiple"
                          style="width: 100%"
                        >
                          <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                        </el-select>

                        <!-- 滑块 Slider -->
                        <el-slider
                          v-else-if="item.type === 'slider'"
                          v-model="settings[item.section][item.key]"
                          :min="item.min"
                          :max="item.max"
                          :step="item.step"
                          :show-tooltip="false"
                        />

                        <!-- 开关 Switch -->
                        <el-switch
                          v-else-if="item.type === 'switch'"
                          v-model="settings[item.section][item.key]"
                        />

                        <!-- 可点击文本 Clickable Text -->
                        <div
                          v-else-if="item.type === 'clickable-text'"
                          class="clickable-text-control"
                          @click="handleAction(item)"
                        >
                          <span class="clickable-value">{{ settings[item.section][item.key] }}</span>
                          <el-icon class="edit-icon"><Edit /></el-icon>
                        </div>

                        <!-- 账号绑定项 Bind Item -->
                        <div v-else-if="item.type === 'bind-item'" class="bind-item-control">
                          <div class="bind-info">
                            <span v-if="item.bindType === 'phone' || item.bindType === 'email'" class="bind-value" :class="{ 'unbound': !settings[item.section][item.key] }">
                              {{ settings[item.section][item.key] || '未绑定' }}
                            </span>
                            <span v-else-if="item.bindType === 'wechat'" class="bind-value" :class="{ 'unbound': !settings[item.section][item.key] }">
                              {{ settings[item.section][item.key] ? '已绑定' : '未绑定' }}
                            </span>
                            <span v-else-if="item.bindType === 'password'" class="bind-value" :class="{ 'unbound': !settings[item.section][item.key] }">
                              {{ settings[item.section][item.key] ? '已设置' : '未设置' }}
                            </span>
                          </div>
                          <div class="bind-action">
                            <el-button link type="primary" @click="handleBindAction(item)">
                              <template v-if="item.bindType === 'password'">
                                {{ settings[item.section][item.key] ? '修改' : '去设置' }}
                              </template>
                              <template v-else-if="item.bindType === 'wechat'">
                                {{ settings[item.section][item.key] ? '解绑' : '去绑定' }}
                              </template>
                              <template v-else>
                                {{ settings[item.section][item.key] ? '更换' : '去绑定' }}
                              </template>
                            </el-button>
                          </div>
                        </div>

                        <!-- 输入框 Input -->
                        <el-input
                          v-else-if="item.type === 'input'"
                          v-model="settings[item.section][item.key]"
                          :type="item.inputType || 'text'"
                          :rows="item.rows"
                          :placeholder="item.placeholder"
                          :readonly="item.props?.readonly"
                          :disabled="item.props?.disabled"
                        >
                          <template v-if="item.action" #append>
                            <el-button @click="handleAction(item)">{{ item.actionText || '修改' }}</el-button>
                          </template>
                        </el-input>
                         
                         <!-- 按钮 Button -->
                        <el-button
                            v-else-if="item.type === 'button'"
                            :type="item.props?.type"
                            :plain="item.props?.plain"
                            :danger="item.props?.danger"
                            @click="handleAction(item)"
                            style="width: 100%"
                        >
                            {{ item.buttonText }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>

        <div class="content-footer">
            <span class="auto-save-text">所有设置将自动保存</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/userStore";
import { uploadAvatar, updateUser } from "@/api/user";
import { 
  User, 
  Monitor, 
  Edit, 
  Files, 
  Setting, 
  Close, 
  ArrowLeft,
  Check,
  Tools,
  Iphone,
  Download,
  Delete,
  MagicStick
} from '@element-plus/icons-vue';
import { useDebounceFn } from '@vueuse/core';

// 对话框可见性
const dialogVisible = ref(false);
const activeTab = ref('account');

const userStore = useUserStore();
const avatarInput = ref(null);

const handleAvatarClick = () => {
    if (avatarInput.value && avatarInput.value.length > 0) {
        avatarInput.value[0].click();
    }
};

const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const res = await uploadAvatar(file);
        if (res.code === 200) {
            settings.user.avatar = res.data;
            userStore.updateAvatar(res.data);
            ElMessage.success('头像上传成功');
        } else {
            ElMessage.error(res.message || '头像上传失败');
        }
    } catch (err) {
        ElMessage.error('头像上传失败');
    } finally {
        e.target.value = ''; // clear input
    }
};

// 基础配置数据结构
const settings = reactive({
  user: {
    nickname: "西木",
    avatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    phone: "138****1234",
    email: null,
    wechatBound: true,
    hasPassword: true,
    devices: [
        { id: 1, name: 'Chrome / Windows 10', time: '2023-10-27 10:30', current: true },
        { id: 2, name: 'Safari / iPhone 13', time: '2023-10-26 15:20', current: false },
    ]
  },
  appearance: {
    themeMode: "auto", // auto, light, dark
    accentColor: "#409EFF",
    fontFamily: "default", // default, serif, mono
    fontSize: 15,
    lineHeight: "standard", // compact, standard, loose
    contentWidth: "standard", // narrow, standard, wide
    sidebarMode: "auto", // auto, fixed
  },
  editor: {
    autoSave: true,
    autoSaveInterval: 30,
    defaultOpenMode: "edit", // edit, preview, split
    enableMarkdown: true,
    pasteMode: "style", // style, text
    enterMode: "paragraph", // paragraph, break
    codeTheme: "github",
    performanceMode: false
  },
  data: {
      exportFormat: "md",
      autoBackup: true,
      localCache: true,
      offlineMode: false
  },
  advanced: {
      aiSummary: true,
      aiOutline: true,
      experimental: false,
      debugMode: false
  },
  // 保留旧数据结构兼容性
  site: {
      // 占位，防止旧代码报错
  }
});

// 导航配置
const tabs = [
  { id: 'account', label: '账户设置', icon: User, desc: '管理您的个人信息、安全选项及登录设备。' },
  { id: 'appearance', label: '外观视觉', icon: Monitor, desc: '定制您喜欢的应用界面风格与内容排版。' },
  { id: 'editor', label: '编辑习惯', icon: Edit, desc: '调整编辑器的行为以适应您的写作流。' },
  { id: 'data', label: '数据管理', icon: Files, desc: '管理您的数据同步、备份和存储方式。' },
  { id: 'advanced', label: '高级选项', icon: Tools, desc: '开发者选项和其他高级设置。' },
];

// 颜色选项
const accentColors = ['#409EFF', '#67C23A', '#F56C6C', '#E6A23C', '#909399', '#79bbff'];

// 设置项 Schema 配置
const schema = {
  account: [
    {
      title: '个人资料',
      items: [
        { label: '头像', section: 'user', key: 'avatar', type: 'avatar', colSpan: 2 },
        { label: '昵称', section: 'user', key: 'nickname', type: 'clickable-text', action: 'changeNickname', colSpan: 1 }
      ]
    },
    {
      title: '账号绑定与安全',
      items: [
        { label: '手机号码', section: 'user', key: 'phone', type: 'bind-item', bindType: 'phone', colSpan: 1 },
        { label: '邮箱地址', section: 'user', key: 'email', type: 'bind-item', bindType: 'email', colSpan: 1 },
        { label: '微信账号', section: 'user', key: 'wechatBound', type: 'bind-item', bindType: 'wechat', colSpan: 1 },
        { label: '登录密码', section: 'user', key: 'hasPassword', type: 'bind-item', bindType: 'password', colSpan: 1 }
      ]
    },
    {
      title: '设备管理',
      items: [
        { section: 'user', key: 'devices', type: 'device-list', colSpan: 2 }
      ]
    },
    {
      title: '危险区域',
      items: [
        { 
          desc: '注销后您的所有数据将被永久删除，无法恢复，请谨慎操作。',
          type: 'button', 
          buttonText: '注销当前账号', 
          action: 'deleteAccount', 
          props: { type: 'danger', plain: true }, 
          colSpan: 2 
        }
      ]
    }
  ],
  appearance: [
    {
      items: [
        { 
          label: '主题模式', 
          section: 'appearance', 
          key: 'themeMode', 
          type: 'radio', 
          colSpan: 2,
          options: [
            { label: '跟随系统', value: 'auto' },
            { label: '浅色', value: 'light' },
            { label: '深色', value: 'dark' },
          ]
        },
        { 
          label: '主题色彩', 
          section: 'appearance', 
          key: 'accentColor', 
          type: 'color-circles', 
          colSpan: 2,
          options: accentColors
        }
      ]
    },
    {
      items: [
        { 
          label: '正文字体', 
          section: 'appearance', 
          key: 'fontFamily', 
          type: 'select', 
          colSpan: 1,
          options: [
            { label: '默认', value: 'default' },
            { label: '衬线字体', value: 'serif' },
            { label: '等宽字体', value: 'mono' }
          ]
        },
        { 
          label: '字号大小', 
          section: 'appearance', 
          key: 'fontSize', 
          type: 'slider', 
          min: 12, max: 24, step: 1,
          colSpan: 1 
        }
      ]
    },
    {
      items: [
        {
          label: '行高',
          section: 'appearance', 
          key: 'lineHeight',
          type: 'segmented',
          colSpan: 2,
          options: [
            { label: '紧凑', value: 'compact' },
            { label: '标准', value: 'standard' },
            { label: '宽松', value: 'loose' }
          ]
        }
      ]
    },
    {
      items: [
        {
          label: '内容宽度',
          section: 'appearance', 
          key: 'contentWidth',
          type: 'segmented',
          colSpan: 1,
          options: [
            { label: '窄', value: 'narrow' },
            { label: '标准', value: 'standard' },
            { label: '宽', value: 'wide' }
          ]
        },
        {
          label: '左侧栏显示方式',
          section: 'appearance', 
          key: 'sidebarMode',
          type: 'radio',
          colSpan: 1,
          options: [
            { label: '自动折叠', value: 'auto' },
            { label: '固定展开', value: 'fixed' }
          ]
        }
      ]
    }
  ],
  editor: [
    {
      title: '常规',
      items: [
        { label: '自动保存', section: 'editor', key: 'autoSave', type: 'switch', colSpan: 1 },
        { label: '保存间隔(秒)', section: 'editor', key: 'autoSaveInterval', type: 'slider', min: 5, max: 120, colSpan: 1, visibleWhen: s => s.editor.autoSave },
        { label: '默认打开模式', section: 'editor', key: 'defaultOpenMode', type: 'select', colSpan: 1,
          options: [
            { label: '编辑', value: 'edit' },
            { label: '预览', value: 'preview' },
            { label: '分屏', value: 'split' }
          ]
        },
        { label: 'Markdown 支持', section: 'editor', key: 'enableMarkdown', type: 'switch', colSpan: 1 },
      ]
    },
    {
      title: '输入体验',
      items: [
        { label: '粘贴行为', section: 'editor', key: 'pasteMode', type: 'radio', colSpan: 1,
          options: [{ label: '保留样式', value: 'style' }, { label: '纯文本', value: 'text' }]
        },
        { label: '回车行为', section: 'editor', key: 'enterMode', type: 'radio', colSpan: 1,
          options: [{ label: '新段落', value: 'paragraph' }, { label: '软换行', value: 'break' }]
        },
      ]
    },
    {
      title: '高级',
      items: [
        { label: '代码块高亮', section: 'editor', key: 'codeTheme', type: 'select', colSpan: 1,
          options: [
             { label: 'GitHub', value: 'github' },
             { label: 'Monokai', value: 'monokai' },
             { label: 'Dracula', value: 'dracula' }
          ]
        },
        { label: '大文档性能模式', section: 'editor', key: 'performanceMode', type: 'switch', colSpan: 1, desc: '适用于万字以上文档，会禁用部分动态效果' },
      ]
    }
  ],
  data: [
      {
          title: '导出与备份',
          items: [
              { label: '默认导出格式', section: 'data', key: 'exportFormat', type: 'select', colSpan: 1,
                options: [
                    { label: 'Markdown', value: 'md' },
                    { label: 'PDF', value: 'pdf' },
                    { label: 'HTML', value: 'html' }
                ]
              },
              { label: '批量导出文件夹', type: 'button', buttonText: '导出...', action: 'batchExport', colSpan: 1 },
              { label: '自动备份', section: 'data', key: 'autoBackup', type: 'switch', colSpan: 1 },
          ]
      },
      {
          title: '存储与网络',
          items: [
              { label: '本地缓存', section: 'data', key: 'localCache', type: 'switch', colSpan: 1 },
              { label: '离线模式', section: 'data', key: 'offlineMode', type: 'switch', colSpan: 1 },
              { label: '清空本地缓存', type: 'button', buttonText: '清空缓存', action: 'clearCache', props: { type: 'warning', plain: true }, colSpan: 2 }
          ]
      }
  ],
  advanced: [
      {
          title: '快捷键设置',
          items: [
              { label: '快捷键', type: 'button', buttonText: '查看快捷键列表', action: 'viewShortcuts', colSpan: 1 },
              { label: '恢复默认', type: 'button', buttonText: '恢复默认快捷键', action: 'resetShortcuts', props: { plain: true }, colSpan: 1 },
          ]
      },
      {
          title: 'AI 辅助功能',
          items: [
              { label: 'AI 总结', section: 'advanced', key: 'aiSummary', type: 'switch', colSpan: 1 },
              { label: 'AI 大纲生成', section: 'advanced', key: 'aiOutline', type: 'switch', colSpan: 1 },
          ]
      },
      {
          title: '系统',
          items: [
              { label: '实验性功能', section: 'advanced', key: 'experimental', type: 'switch', colSpan: 1 },
              { label: '调试模式', section: 'advanced', key: 'debugMode', type: 'switch', colSpan: 1 },
              { 
                  desc: '重置所有设置将恢复到初始状态，此操作不可撤销。',
                  type: 'button', 
                  buttonText: '重置所有设置', 
                  action: 'resetSettings', 
                  props: { type: 'danger', plain: true }, 
                  colSpan: 2 
              }
          ]
      }
  ]
};

const currentTabInfo = computed(() => {
  return tabs.find(t => t.id === activeTab.value) || tabs[0];
});

const currentGroups = computed(() => {
  return schema[activeTab.value] || [];
});

// 自动保存逻辑
const save = async () => {
  try {
    localStorage.setItem('xmnote-settings', JSON.stringify(settings));
    applySettings();
    console.log('Settings saved automatically');
  } catch (error) {
    console.error('Save failed:', error);
  }
};

const debouncedSave = useDebounceFn(save, 800);

// 监听设置变化
watch(settings, () => {
  debouncedSave();
}, { deep: true });

// 应用设置
const applySettings = () => {
  const root = document.documentElement;
  const a = settings.appearance;
  
  // 字体映射
  const fontMap = {
    default: "Inter, Noto Sans SC, sans-serif",
    serif: "'Noto Serif SC', serif",
    mono: "'JetBrains Mono', monospace"
  };

  root.style.setProperty('--font-family', fontMap[a.fontFamily] || fontMap.default);
  root.style.setProperty('--font-size', `${a.fontSize}px`);
  root.style.setProperty('--accent-color', a.accentColor);
  
  // 主题模式
  root.classList.remove('light-mode', 'dark-mode');
  if (a.themeMode === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark-mode' : 'light-mode');
  } else {
    root.classList.add(a.themeMode === 'light' ? 'light-mode' : 'dark-mode');
  }
  
  // 行高映射
  const lhMap = { compact: '1.4', standard: '1.6', loose: '1.8' };
  root.style.setProperty('--line-height', lhMap[a.lineHeight] || '1.6');

  // 内容宽度映射
  const widthMap = { narrow: '680px', standard: '900px', wide: '1200px' };
  root.style.setProperty('--content-width', widthMap[a.contentWidth] || '900px');
};

// 加载设置
const loadSavedSettings = () => {
  try {
    const saved = localStorage.getItem('xmnote-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge logic...
      if(parsed.appearance) Object.assign(settings.appearance, parsed.appearance);
      if(parsed.editor) Object.assign(settings.editor, parsed.editor);
      if(parsed.user) Object.assign(settings.user, parsed.user);
      if(parsed.data) Object.assign(settings.data, parsed.data);
      if(parsed.advanced) Object.assign(settings.advanced, parsed.advanced);
    }
    
    // 使用 userStore 的真实数据覆盖默认或缓存的用户信息
    if (userStore.username) {
        settings.user.nickname = userStore.username;
    }
    if (userStore.avatarUrl) {
        settings.user.avatar = userStore.avatarUrl;
    }
    if (userStore.userInfo?.email) {
        settings.user.email = userStore.userInfo.email;
    }
    // Mock 手机号和微信绑定情况，实际中应从 userStore 或用户信息接口获取
    // settings.user.phone = userStore.userInfo?.phone || '138****1234';
    // settings.user.wechatBound = !!userStore.userInfo?.wechatId;
    
  } catch (e) {
    console.error('Load settings failed', e);
  }
};

const handleBindAction = (item) => {
    // 检查兜底逻辑
    const boundMethodsCount = [
        settings.user.phone,
        settings.user.email,
        settings.user.wechatBound
    ].filter(Boolean).length;

    const isUnbinding = settings[item.section][item.key] && (item.bindType === 'wechat' || item.bindType === 'phone' || item.bindType === 'email');
    const actionText = settings[item.section][item.key] ? (item.bindType === 'wechat' ? '解绑' : '更换') : '绑定';

    if (isUnbinding && actionText === '解绑' && boundMethodsCount <= 1) {
        ElMessage.warning('至少需要保留一种登录方式');
        return;
    }

    if (item.bindType === 'password') {
        if (settings[item.section][item.key]) {
            ElMessageBox.prompt('请输入新密码', '修改密码', {
              inputType: 'password',
              inputPattern: /.{6,}/,
              inputErrorMessage: '密码长度至少为6位'
            }).then(() => {
              ElMessage.success('密码修改成功');
            }).catch(() => {});
        } else {
            ElMessageBox.prompt('请设置初始密码', '设置密码', {
              inputType: 'password',
              inputPattern: /.{6,}/,
              inputErrorMessage: '密码长度至少为6位'
            }).then(() => {
              settings.user.hasPassword = true;
              ElMessage.success('密码设置成功');
            }).catch(() => {});
        }
        return;
    }

    // 对于其他绑定项
    ElMessageBox.confirm(`确定要${actionText} ${item.label} 吗？\n（此功能前端占位展示，后续对接真实接口）`, `${actionText}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
    }).then(() => {
        // Mock toggle
        if (item.bindType === 'wechat') {
            settings.user.wechatBound = !settings.user.wechatBound;
            ElMessage.success(settings.user.wechatBound ? '微信绑定成功' : '微信已解绑');
        } else {
            ElMessage.info('此操作需配合验证码，已记录意图');
        }
    }).catch(() => {});
};

const handleAction = (item) => {
  if (item.action === 'changeNickname') {
      ElMessageBox.prompt('请输入新昵称', '修改昵称', {
          inputValue: settings.user.nickname,
          inputPattern: /.+/,
          inputErrorMessage: '昵称不能为空'
      }).then(async ({ value }) => {
          if (value === settings.user.nickname) return;
          try {
              const res = await updateUser({ username: value });
              if (res && res.code === 200) {
                  settings.user.nickname = value;
                  userStore.updateUsername(value);
                  ElMessage.success('昵称修改成功');
              } else {
                  ElMessage.error(res?.message || '修改失败');
              }
          } catch (e) {
              ElMessage.error('修改失败');
          }
      }).catch(() => {});
  } else if (item.action === 'deleteAccount') {
    ElMessageBox.confirm('注销后您的所有数据将被永久删除，无法恢复。确定要继续吗？', '危险操作确认', { 
        type: 'warning',
        confirmButtonText: '确认注销',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger'
    })
      .then(() => {
        ElMessage.success('账号已注销');
      })
      .catch(() => {});
  } else if (item.action === 'changePassword') {
      ElMessageBox.prompt('请输入新密码', '修改密码', {
        inputType: 'password',
        inputPattern: /.{6,}/,
        inputErrorMessage: '密码长度至少为6位'
      }).then(({ value }) => {
        ElMessage.success('密码修改成功');
      }).catch(() => {});
  } else if (item.action === 'resetSettings') {
      ElMessageBox.confirm('确定要重置所有设置吗？', '确认', { type: 'warning' })
      .then(() => {
        localStorage.removeItem('xmnote-settings');
        location.reload();
      })
      .catch(() => {});
  } else if (item.action === 'clearCache') {
      ElMessageBox.confirm('确定要清空本地缓存吗？可能会导致图片重新加载。', '清空缓存', { type: 'warning' })
      .then(() => {
          ElMessage.success('本地缓存已清空');
      })
      .catch(() => {});
  } else if (item.action === 'batchExport') {
      ElMessage.info('批量导出功能开发中...');
  } else if (item.action === 'viewShortcuts') {
      ElMessage.info('快捷键列表功能开发中...');
  } else if (item.action === 'resetShortcuts') {
      ElMessage.success('快捷键已恢复默认');
  }
};

const handleForceLogout = (device) => {
    ElMessageBox.confirm(`确定要强制下线设备 "${device.name}" 吗？`, '下线确认', {
        confirmButtonText: '下线',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        const index = settings.user.devices.findIndex(d => d.id === device.id);
        if (index > -1) {
            settings.user.devices.splice(index, 1);
            ElMessage.success('设备已强制下线');
        }
    }).catch(() => {});
};

const open = () => {
  loadSavedSettings();
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};

onMounted(() => {
  loadSavedSettings();
  applySettings();
});

defineExpose({ open });
</script>

<style lang="scss" scoped>
/* Color Variables */
$primary-color: var(--accent-color, #409EFF);
$bg-color-active: #ECF5FF; 
$text-color-primary: #303133;
$text-color-secondary: #606266;
$text-color-placeholder: #909399;
$border-color: #EBEEF5;
$bg-white: #FFFFFF;
$bg-gray: #F5F7FA;

.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.settings-container {
  width: 900px;
  height: 680px;
  max-width: 95vw;
  max-height: 90vh;
  background: $bg-white;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Sidebar Styling */
.settings-sidebar {
  width: 240px;
  background: #FAFAFA;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 12px;
  flex-shrink: 0;

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    margin-bottom: 24px;
    
    .header-icon {
      color: $primary-color;
      font-weight: bold;
    }

    .header-title {
      font-size: 18px;
      font-weight: 700;
      color: #111;
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    color: $text-color-secondary;
    margin-bottom: 4px;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0,0,0,0.03);
    }

    &.active {
      background: $bg-color-active;
      color: $primary-color;
      font-weight: 500;
    }
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    color: $text-color-placeholder;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: $text-color-primary;
    }
  }
}

/* Content Area Styling */
.settings-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: $bg-white;
  min-width: 0;
  
  .content-header {
    padding: 32px 40px 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;

    .header-info {
      .content-title {
        font-size: 24px;
        font-weight: 700;
        color: #111;
        margin: 0 0 8px 0;
      }
      .content-desc {
        font-size: 14px;
        color: $text-color-placeholder;
        margin: 0;
      }
    }

    .close-btn {
      border: none;
      background: transparent;
      color: #999;
      cursor: pointer;
      font-size: 20px;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
      
      &:hover {
        background: #f0f0f0;
      }
    }
  }

  .content-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 40px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #E0E0E0;
      border-radius: 3px;
    }
  }

  .content-footer {
    padding: 16px 40px;
    border-top: 1px solid $border-color;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    
    .auto-save-text {
      font-size: 12px;
      color: $text-color-placeholder;
    }
  }
}

/* Form Groups & Items */
.setting-group {
  margin-bottom: 32px;

  .group-title {
    font-size: 14px;
    font-weight: 600;
    color: $text-color-primary;
    margin-bottom: 16px;
  }
}

.group-items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px; /* Space between columns/rows */
}

.setting-item-wrapper {
  &.col-span-1 { grid-column: span 1; }
  &.col-span-2 { grid-column: span 2; }
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .item-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .item-label {
      font-size: 14px;
      font-weight: 600; 
      color: #444;
    }
    
    .item-value-display {
      font-size: 12px;
      color: $text-color-placeholder;
    }
  }

  .item-desc-text {
    font-size: 13px;
    color: $text-color-secondary;
    line-height: 1.5;
    margin-top: -8px;
    margin-bottom: 4px;
  }

  .item-control {
    width: 100%;
  }
}

/* Avatar Uploader */
.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 20px;
  
  .avatar-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .avatar-tip {
      font-size: 12px;
      color: $text-color-placeholder;
    }
  }
}

/* Device List */
.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .device-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: $bg-gray;
    border-radius: 8px;
    gap: 16px;
    
    .device-icon {
      color: $text-color-secondary;
    }
    
    .device-info {
      flex: 1;
      
      .device-name {
        font-size: 14px;
        font-weight: 500;
        color: $text-color-primary;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .device-time {
        font-size: 12px;
        color: $text-color-placeholder;
        margin-top: 4px;
      }
    }
  }
}

/* Custom Controls Styling */

/* Segmented Control */
.segmented-control {
  display: flex;
  background: $bg-white;
  border: 1px solid $border-color;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
  
  .segment-item {
    flex: 1;
    text-align: center;
    padding: 8px;
    font-size: 14px;
    color: $text-color-secondary;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    user-select: none;
    
    &:hover {
      background: #fafafa;
    }
    
    &.active {
      background: $bg-color-active;
      color: $primary-color;
      font-weight: 600;
    }
  }
}

/* Color Circles */
.color-control {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
}

.color-circles {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  .color-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: transform 0.2s;
    border: 2px solid transparent; // Reserve space for border
    
    &:hover {
      transform: scale(1.1);
    }
    
    &.active {
      box-shadow: 0 0 0 2px white, 0 0 0 4px $primary-color; // Ring effect
    }
    
    .check-icon {
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.custom-color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .custom-color-label {
    font-size: 12px;
    color: $text-color-secondary;
  }
}

/* Overriding Element Plus Defaults to match cleaner look */
:deep(.el-radio-group) {
  display: flex;
  gap: 24px;
}

:deep(.el-radio) {
  margin-right: 0;
  height: auto;
  
  .el-radio__label {
    padding-left: 8px;
    color: $text-color-primary;
  }
  
  &.is-checked .el-radio__label {
    color: $text-color-primary; // Keep text color dark even when selected
  }
}

:deep(.el-input__wrapper), :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #DCDFE6 inset;
  padding: 8px 12px;
  border-radius: 4px;
  
  &.is-focus {
    box-shadow: 0 0 0 1px $primary-color inset !important;
  }
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.clickable-text-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 32px;
  box-sizing: border-box;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--el-text-color-regular, #606266);
}

.clickable-text-control:hover {
  background-color: var(--el-fill-color, #f0f2f5);
  border-color: var(--el-border-color-hover, #c0c4cc);
  color: var(--el-color-primary, #409eff);
}

.clickable-text-control .clickable-value {
  font-size: 14px;
}

.clickable-text-control .edit-icon {
  opacity: 0.5;
  transition: opacity 0.2s;
}
.clickable-text-control:hover .edit-icon {
  opacity: 1;
}

.bind-item-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 32px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
}

.bind-item-control .bind-value {
  font-size: 14px;
  color: var(--el-text-color-regular, #606266);
}

.bind-item-control .bind-value.unbound {
  color: var(--el-text-color-placeholder, #a8abb2);
}
</style>
