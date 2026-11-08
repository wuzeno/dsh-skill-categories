"""Build repository artwork. Pillow required. Screenshots are optional, read-only inputs."""
from pathlib import Path
import argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'images'
OUT.mkdir(parents=True, exist_ok=True)
FONTROOT = Path('C:/Windows/Fonts')
def font(size, bold=False, zh=False):
    names = ['msyhbd.ttc' if bold else 'msyh.ttc'] if zh else ['segoeuib.ttf' if bold else 'segoeui.ttf', 'DejaVuSans.ttf']
    for name in names:
        try: return ImageFont.truetype(str(FONTROOT / name) if FONTROOT.exists() else name, size)
        except OSError: pass
    return ImageFont.load_default(size=size)
BG = '#0c131d'; PANEL = '#121e2b'; LINE = '#293d50'; INK = '#eef4f9'; MUTED = '#9eb1c2'; TEAL = '#7be0ce'
def base(w, h):
    im = Image.new('RGB', (w,h), BG); d = ImageDraw.Draw(im)
    for x in range(0,w,60): d.line((x,0,x,h), fill='#101b27')
    for y in range(0,h,60): d.line((0,y,w,y), fill='#101b27')
    return im,d

def text(d, xy, s, size=24, color=INK, bold=False, zh=False): d.text(xy, s, font=font(size,bold,zh), fill=color)
def box(d, rect, fill=PANEL, outline=LINE, r=14): d.rounded_rectangle(rect, radius=r, fill=fill, outline=outline, width=2)
def pill(d,x,y,label,width,color=TEAL):
    box(d,(x,y,x+width,y+40),fill='#122a2c',outline='#28534f',r=8); text(d,(x+14,y+6),label,19,color)
def doc(d,x,y,label,w=230,accent=False):
    box(d,(x,y,x+w,y+60),outline=TEAL if accent else LINE,r=8)
    d.rectangle((x+16,y+19,x+30,y+38),outline=TEAL if accent else MUTED,width=2)
    text(d,(x+43,y+16),label,19)

def hero():
    im,d = base(1800,1080)
    text(d,(90,56),'DEEPSEEK HARNESS  /  COMMUNITY PLUGIN',20,MUTED)
    text(d,(86,118),'DSH Skill Categories',78,bold=True)
    text(d,(91,226),'Organize your skills. Find the right one when you need it.',29,MUTED)
    text(d,(92,278),'分类整理 · 导入后归类 · 会话内引用',27,TEAL,zh=True)
    # Three restrained, connected editorial panels. This is a diagram, never a screenshot.
    for x, num, title, sub in [(90,'01','Organize','Categories + tags'),(650,'02','Import','Choose a category after import'),(1210,'03','Reference','Search within the current session')]:
        box(d,(x,400,x+500,894),r=18)
        text(d,(x+28,425),num,20,TEAL); text(d,(x+28,463),title,34,bold=True); text(d,(x+28,516),sub,21,MUTED)
    pill(d,118,575,'Writing',110); pill(d,240,575,'Development',166)
    doc(d,118,643,'writing-skill',w=444); doc(d,118,719,'coding-skill',w=444,accent=True)
    text(d,(118,817),'Metadata only. Files stay in place.',20,MUTED)
    doc(d,678,575,'new-skill',w=444)
    text(d,(680,662),'Import completed',22,TEAL,bold=True)
    box(d,(678,706,1122,773),r=8); text(d,(696,726),'Category: Development',23)
    text(d,(680,817),'Skip classification without undoing import.',19,MUTED)
    box(d,(1238,575,1682,633),r=8); text(d,(1257,592),'Search skills, tags or categories',20,MUTED)
    doc(d,1238,656,'coding-skill',w=444,accent=True)
    box(d,(1238,744,1682,794),fill='#0b141e',r=8); text(d,(1257,756),'/coding-skill',22,TEAL)
    text(d,(1238,817),'Insert a reference. Do not send.',20,MUTED)
    for x in (608,1168):
        d.line((x-8,646,x+22,646),fill=TEAL,width=3); d.line((x+13,637,x+22,646,x+13,655),fill=TEAL,width=3)
    d.line((90,947,1710,947),fill=LINE,width=2)
    text(d,(90,979),'CONCEPT ILLUSTRATION — NOT AN APPLICATION SCREENSHOT',18,MUTED)
    text(d,(1468,979),'0.4.0 / PREVIEW',18,TEAL)
    im.save(OUT/'hero.png',optimize=True)

def board(filename, src, title, subtitle, label, crop=None, redact=None):
    shot=Image.open(src).convert('RGB')
    if redact:
        sd=ImageDraw.Draw(shot)
        for rect in redact: sd.rectangle(rect,fill='#111b26')
    if crop: shot=shot.crop(crop)
    height = max(680, min(1120, shot.height + 310))
    im,d=base(1600,height)
    text(d,(64,42),label.upper(),18,TEAL)
    text(d,(60,86),title,48,bold=True)
    text(d,(64,154),subtitle,23,MUTED)
    available = height - 300
    shot.thumbnail((1464,available),Image.Resampling.LANCZOS)
    x=(1600-shot.width)//2; y=216+(available-shot.height)//2
    box(d,(x-8,y-8,x+shot.width+8,y+shot.height+8),r=10)
    im.paste(shot,(x,y))
    text(d,(64,height-46),'Screenshots are contextual; appearance varies with host theme and plugin version.',18,MUTED)
    im.save(OUT/filename,optimize=True)

def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--screenshots',type=Path); args=parser.parse_args()
    hero()
    wide = ROOT/'preview'/'unified-publish.png'
    preview = wide if wide.exists() else ROOT/'preview'/'unified-0.4.png'
    if preview.exists(): board('overview.png',preview,'One list. Categories included.','Unified skills page in v0.4.0 — independent fixture, sample data.','INDEPENDENT FIXTURE / NOT A HOST CAPTURE',crop=(14,158,1408,1006) if preview == wide else None)
    if args.screenshots:
        p=args.screenshots
        board('categories.png',p/'自定义分类.png','Make room for your own categories.','Create, rename and reorder categories without moving skill files.','USER SCREENSHOT / EARLIER UI / CROPPED',crop=(14,18,1138,550))
        board('import.png',p/'导入自动寻求分类.png','Import first. Put it in place.','Successful imports can be classified immediately; skipping keeps the import.','USER SCREENSHOT / EARLIER UI / PATH REDACTED',crop=(154,374,1277,1152),redact=[(154,470,1277,515),(154,753,1277,787)])
        # Keep only the footer instruction and launch control: transparent dialog elsewhere exposes chat text.
        board('reference.png',p/'聊天窗按分类引用技能.png','Bring the right skill into the conversation.','Filter by category, then insert /skill-name into your draft. No auto-send.','USER SCREENSHOT / EARLIER UI / CROPPED',crop=(151,1090,1140,1384),redact=[(151,1219,1140,1311)])
    print('Created public artwork in', OUT)
if __name__=='__main__': main()
