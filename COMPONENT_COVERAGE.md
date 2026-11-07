# Component coverage

Generated from `artyverse-design-master.json`; source catalog contracts preserved separately. Catalog names map to native patterns and shared implementations. Counts do not represent standalone React component exports. “Verified” means the named workflow smoke scope, not every variant/state, WCAG certification, or production coverage.

{
  "catalogued": 151,
  "required": 64,
  "implementedCatalogMappings": 64,
  "verifiedWorkflowSmokeMappings": 24,
  "standaloneComponentCount": null,
  "warning": "These are catalog-to-native-pattern mappings, not a claim of 151 distinct shipped components or exhaustive state coverage."
}

| Catalog pattern | Scope | Status | Location |
|---|---|---|---|
| AppShell | Required now | Verified (workflow smoke) | src/App.tsx |
| Page | Required now | Verified (workflow smoke) | src/components/UI.tsx |
| Container | Required now | Implemented (subset) | src/style.css |
| Section | Required now | Implemented (subset) | src/style.css |
| Stack | Supporting | Specified | — |
| Inline | Supporting | Specified | — |
| Spacer | Supporting | Specified | — |
| Divider | Required now | Implemented (subset) | src/style.css |
| Surface | Required now | Implemented (subset) | src/style.css |
| Card | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| CardHeader | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| CardBody | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| CardFooter | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| Panel | Required now | Implemented (subset) | src/pages/Editor.tsx |
| GlassPanel | Future | Specified | — |
| Hero | Required now | Verified (workflow smoke) | src/pages/Workspace.tsx |
| BentoGrid | Future | Specified | — |
| Sidebar | Required now | Verified (workflow smoke) | src/App.tsx |
| Topbar | Required now | Verified (workflow smoke) | src/App.tsx |
| Navbar | Future | Specified | — |
| Footer | Required now | Verified (workflow smoke) | src/App.tsx |
| Breadcrumbs | Required now | Implemented (subset) | src/App.tsx |
| Tabs | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| TabList | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| Tab | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| TabPanel | Supporting | Specified | — |
| Accordion | Future | Specified | — |
| AccordionItem | Future | Specified | — |
| AccordionHeader | Future | Specified | — |
| AccordionPanel | Future | Specified | — |
| Disclosure | Future | Specified | — |
| Popover | Supporting | Specified | — |
| Tooltip | Supporting | Specified | — |
| Toast | Required now | Implemented (subset) | src/core/store.tsx |
| Toaster | Supporting | Specified | — |
| Snackbar | Supporting | Specified | — |
| Modal | Required now | Verified (workflow smoke) | src/components/UI.tsx |
| Dialog | Required now | Verified (workflow smoke) | src/components/UI.tsx |
| Drawer | Required now | Implemented (subset) | src/App.tsx |
| BottomSheet | Future | Specified | — |
| CommandPalette | Required now | Verified (workflow smoke) | src/App.tsx |
| ContextMenu | Supporting | Specified | — |
| Menu | Supporting | Specified | — |
| MenuItem | Supporting | Specified | — |
| Dropdown | Supporting | Specified | — |
| Select | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| Combobox | Supporting | Specified | — |
| Button | Required now | Verified (workflow smoke) | src/components/UI.tsx |
| IconButton | Required now | Verified (workflow smoke) | src/style.css |
| SplitButton | Future | Specified | — |
| ToggleButton | Future | Specified | — |
| ButtonGroup | Required now | Implemented (subset) | src/style.css |
| Link | Required now | Implemented (subset) | src/App.tsx |
| NavLink | Required now | Implemented (subset) | src/App.tsx |
| Badge | Required now | Implemented (subset) | src/components/UI.tsx |
| Chip | Required now | Implemented (subset) | src/pages/Workflows.tsx |
| Tag | Supporting | Specified | — |
| Avatar | Required now | Implemented (subset) | src/App.tsx |
| AvatarGroup | Future | Specified | — |
| Progress | Supporting | Specified | — |
| ProgressBar | Supporting | Specified | — |
| Spinner | Supporting | Specified | — |
| Skeleton | Supporting | Specified | — |
| Step | Future | Specified | — |
| Stepper | Future | Specified | — |
| Timeline | Future | Specified | — |
| Kpi | Future | Specified | — |
| StatCard | Future | Specified | — |
| Form | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| Field | Required now | Implemented (subset) | src/pages/Editor.tsx |
| Label | Required now | Implemented (subset) | src/pages/Editor.tsx |
| HelpText | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| ErrorText | Required now | Implemented (subset) | src/style.css |
| Input | Required now | Verified (workflow smoke) | src/pages/Editor.tsx |
| Textarea | Required now | Verified (workflow smoke) | src/pages/Workflows.tsx |
| SearchInput | Required now | Verified (workflow smoke) | src/components/UI.tsx |
| PasswordInput | Not applicable | Specified | — |
| NumberInput | Required now | Verified (workflow smoke) | src/pages/Editor.tsx |
| OtpInput | Not applicable | Specified | — |
| Checkbox | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| Radio | Supporting | Specified | — |
| Switch | Supporting | Specified | — |
| Slider | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| RangeSlider | Future | Specified | — |
| DatePicker | Future | Specified | — |
| TimePicker | Future | Specified | — |
| Calendar | Future | Specified | — |
| FileUpload | Required now | Verified (workflow smoke) | src/core/store.tsx |
| Dropzone | Supporting | Specified | — |
| Table | Future | Specified | — |
| DataTable | Future | Specified | — |
| TableToolbar | Future | Specified | — |
| Pagination | Future | Specified | — |
| SortButton | Supporting | Specified | — |
| FilterBar | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| ColumnPicker | Future | Specified | — |
| List | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| ListItem | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| VirtualList | Future | Specified | — |
| Tree | Supporting | Specified | — |
| TreeItem | Supporting | Specified | — |
| Explorer | Future | Specified | — |
| CodeEditor | Future | Specified | — |
| MonacoEditor | Not applicable | Specified | — |
| Terminal | Not applicable | Specified | — |
| LogViewer | Future | Specified | — |
| Image | Required now | Implemented (subset) | src/pages/Editor.tsx |
| Icon | Required now | Implemented (subset) | src/App.tsx |
| SvgIcon | Required now | Implemented (subset) | src/components/UI.tsx |
| Video | Supporting | Specified | — |
| Audio | Required now | Verified (workflow smoke) | src/pages/Voice.tsx |
| Player | Supporting | Specified | — |
| Carousel | Required now | Verified (workflow smoke) | src/pages/DesignOS.tsx |
| Gallery | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| Lightbox | Supporting | Specified | — |
| Map | Not applicable | Specified | — |
| Chart | Future | Specified | — |
| BarChart | Future | Specified | — |
| LineChart | Future | Specified | — |
| AreaChart | Future | Specified | — |
| PieChart | Future | Specified | — |
| Sparkline | Future | Specified | — |
| NotificationCenter | Future | Specified | — |
| ActivityFeed | Future | Specified | — |
| Chat | Required now | Verified (workflow smoke) | src/pages/Workflows.tsx |
| ChatInput | Required now | Verified (workflow smoke) | src/pages/Workflows.tsx |
| ChatMessage | Required now | Verified (workflow smoke) | src/pages/Workflows.tsx |
| PromptBox | Required now | Verified (workflow smoke) | src/pages/Workspace.tsx |
| AgentStatus | Future | Specified | — |
| PipelineStatus | Future | Specified | — |
| OverlayCanvas | Future | Specified | — |
| BlueprintLayer | Future | Specified | — |
| DiffHeatmap | Not applicable | Specified | — |
| Ruler | Future | Specified | — |
| Guides | Future | Specified | — |
| Minimap | Future | Specified | — |
| ZoomControls | Required now | Verified (workflow smoke) | src/pages/Editor.tsx |
| ParallaxScene | Future | Specified | — |
| TiltCard | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| SpatialCard | Required now | Verified (workflow smoke) | src/pages/DesignOS.tsx |
| OrbitControls | Future | Specified | — |
| ThreeCanvas | Not applicable | Specified | — |
| SplatViewer | Not applicable | Specified | — |
| ModelViewer | Not applicable | Specified | — |
| AuthGate | Not applicable | Specified | — |
| SignIn | Not applicable | Specified | — |
| SignUp | Not applicable | Specified | — |
| UserMenu | Future | Specified | — |
| SettingsPanel | Required now | Implemented (subset) | src/pages/Workspace.tsx |
| ThemePicker | Required now | Implemented (subset) | src/pages/DesignOS.tsx |
| LanguagePicker | Required now | Implemented (subset) | src/pages/Workspace.tsx |
