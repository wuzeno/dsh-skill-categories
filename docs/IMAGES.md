# 图片说明 / Image provenance

| 文件 / File | 来源与用途 / Source and purpose |
| --- | --- |
| `images/hero.png` | 本项目原创程序绘制的功能示意；不是产品截图。Original programmatic concept illustration, not a UI capture. |
| `images/overview.png` | 0.4.0 独立浏览器 fixture 截图的展示排版；示例数据，不是宿主实测。Standalone fixture with sample data, not host acceptance evidence. |
| `images/categories.png` | 用户为本次发布提供的早期分类弹窗截图，裁剪并加展示底图。User-supplied early-version category dialog, cropped and framed. |
| `images/import.png` | 用户提供的早期导入归类截图，裁剪并遮盖个人路径。Early import dialog, cropped with personal paths obscured. |
| `images/reference.png` | 用户提供的早期分类引用截图，仅保留说明和按钮区域，遮盖聊天输入内容。Early reference-picker screenshot, cropped to instructions and launch button, with chat input obscured. |

早期截图仍可能显示合并前的界面元素；0.4.0 已合并「分类整理」与「技能」列表。截图不能说明当前所有宿主主题、版本与数据均已验收。

Early captures may show pre-merge UI elements. Version 0.4.0 combines categories and skills into one list. These assets do not establish compatibility or acceptance across host versions or themes.

截图中的宿主主题、背景与第三方界面元素不因收录而成为本项目原创代码；根 MIT 许可证不授予这些元素的额外权利，也不表示第三方背书。公开仓库不包含用户截图原件、个人 profile 或聊天记录导出。

Host themes, backgrounds and third-party UI elements shown incidentally in screenshots are not claimed as original project code. The root MIT license grants no additional rights to those elements and implies no third-party endorsement. Raw user screenshots, personal profiles and chat exports are not included.

`python scripts/make-public-assets.py` 可重绘原创功能示意。生成用户截图排版时需自行提供只读素材目录（`--screenshots`），脚本不会下载或上传素材。Pillow 仅用于生成文档图片，不是插件运行依赖。

The artwork script redraws the original concept image. Screenshot layouts require separately supplied inputs through `--screenshots`; the script does not download or upload images. Pillow is a documentation tool, not a plugin runtime dependency.
