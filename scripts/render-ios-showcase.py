from pathlib import Path
from html import escape

root=Path(__file__).resolve().parents[1]/'dist'
out=root/'assets/ios'
def text(x,y,value,size=14,color='#262c38',weight=400):
 size={10:13,11:13,12:15,13:16,14:17,15:18,16:19,17:20,22:26,23:27,24:28}.get(size,size)
 return f'<text letter-spacing="-.25" x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}">{escape(value)}</text>'
def box(x,y,w,h,fill='#fff',stroke='#e2e5eb',r=12,shadow=True):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"'+(' filter="url(#shadow)"' if shadow else '')+'/>'
def line(x,y,x2,y2):return f'<path d="M{x} {y}H{x2}" stroke="#eceef2"/>' if y==y2 else f'<path d="M{x} {y}L{x2} {y2}" stroke="#eceef2"/>'
def arrow(d):return f'<path d="{d}" fill="none" stroke="#34383d" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow)"/>'
def tag(x,y,label,w=122,color='#7654e8'):
 return box(x,y,w,27,color,color,14,False)+text(x+12,y+18,label,11,'white',500)+f'<path d="M{x+17} {y+27}l-5 11 14-8" fill="{color}"/>'
def check(x,y,color='#38a47b'):
 return f'<circle cx="{x}" cy="{y}" r="12" fill="{color}" fill-opacity=".12"/><path d="m{x-5} {y} 3 3 7-7" stroke="{color}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
def avatar(x,y):
 return f'<g transform="translate({x} {y})"><circle r="25" fill="#f7c853"/><clipPath id="avatar"><circle r="22"/></clipPath><g clip-path="url(#avatar)"><path d="M-22 27Q-20 8 0 8Q20 8 22 27" fill="#5a70a2"/><ellipse cy="-3" rx="12" ry="16" fill="#dca580"/><path d="M-13-6q-3-22 15-16 13 3 11 18L6-13q-7 9-19 7" fill="#34323c"/><path d="M-4 5q4 3 8 0" stroke="#875b4e" fill="none"/><circle cx="-4" cy="-3" r="1"/><circle cx="4" cy="-3" r="1"/></g></g>'
def button(x,y,w,label):return box(x,y,w,42,'#7756ea','#7756ea',14,False)+text(x+w/2,y+27,label,12,'white',500).replace('<text ','<text text-anchor="middle" ',1)
def header(x,y,w,title):return text(x+18,y+29,title,16,weight=600)+line(x,y+45,x+w,y+45)
def base(content):
 return '''<svg xmlns="http://www.w3.org/2000/svg" width="680" height="520" viewBox="0 0 680 520"><defs><filter id="shadow" x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#152c48" flood-opacity=".10"/></filter><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#e6e9ef" stroke-width=".7"/></pattern><radialGradient id="fade"><stop offset=".35" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="mask"><rect width="680" height="520" fill="url(#fade)"/></mask><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="m1 1 5 3-5 3" fill="none" stroke="#34383d" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></marker></defs><rect width="680" height="520" fill="url(#grid)" mask="url(#mask)"/><g font-family="Inter,Arial,sans-serif">'''+content+'</g></svg>'




# SVG images cannot inherit the landing page fonts. Embed small WOFF2 subsets.
import base64, io
from fontTools import subset
from fontTools.ttLib import TTFont
font_styles='<style>'
for index,weight in enumerate([400,500,600]):
 font=TTFont(root/'assets/fonts'/f'inter-{index}.ttf')
 options=subset.Options()
 sub=subset.Subsetter(options=options)
 sub.populate(unicodes=list(range(32,127))+list(range(0x400,0x500))+[0x2014,0x2013,0x2026,0xB7,0x203A,0x2304])
 sub.subset(font)
 font.flavor='woff2'
 buf=io.BytesIO();font.save(buf)
 data=base64.b64encode(buf.getvalue()).decode()
 font_styles+=f"@font-face{{font-family:Inter;font-style:normal;font-weight:{weight};src:url(data:font/woff2;base64,{data}) format('woff2')}}"
font_styles+='</style>'

def card(x,y,w,h):
 return box(x,y,w,h,'#ffffff','#ffffff',24)+f'<rect x="{x+1}" y="{y+1}" width="{w-2}" height="{h-2}" rx="23" fill="url(#glass)" stroke="#e6e5f1" stroke-opacity=".65"/>'
def row(x,y,w,title,sub,accent='#7958ee',done=False):
 s=box(x,y,w,65,'#fff','#eeedf6',17,False)
 s+=check(x+23,y+26) if done else f'<circle cx="{x+23}" cy="{y+26}" r="9" fill="none" stroke="{accent}" stroke-width="1.8"/>'
 return s+text(x+43,y+27,title,13,weight=500)+text(x+43,y+47,sub,10,'#7a8190')
def save(key,s):
 svg=base(s)
 svg=svg.replace('<defs>', '<defs>'+font_styles)
 svg=svg.replace('viewBox="0 0 680 520"', 'viewBox="35 25 610 465"')
 if key=='objects':svg=svg.replace('35 25 610 465','35 25 610 490')
 svg=svg.replace('<rect width="680" height="520" fill="url(#grid)" mask="url(#mask)"/>','')
 svg=svg.replace('<defs>','<defs><linearGradient id="glass" x2=".8" y2="1"><stop stop-color="#f2f7ff" stop-opacity=".8"/><stop offset=".55" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#f4f0ff" stop-opacity=".8"/></linearGradient>')
 svg=svg.replace('dy="3" stdDeviation="3"','dy="10" stdDeviation="12"').replace('flood-opacity=".10"','flood-opacity=".09"')
 (out/f'showcase-{key}.svg').write_text(svg,encoding='utf-8')

# Objects: tall directory behind a broad, overlapping object detail sheet.
s='<g transform="rotate(-3 227 240)">'+card(75,54,286,373)+text(98,109,'Объекты',22,weight=600)
s+=box(94,127,247,35,'#fff','#eeedf6',13,False)+text(110,149,'Поиск объекта',12,'#9299a6')
for y,title,addr in [(178,'БЦ Север','Учебная улица, дом 1'),(254,'ЖК Сосновый','Учебная улица, дом 2'),(330,'Офис Центральный','Учебная улица, дом 4')]:
 s+=box(94,y,247,65,'#fff','#eeedf6',17,False)+text(111,y+27,title,15,weight=600)+text(111,y+46,addr,10,'#778190')+text(320,y+35,'›',20,'#9397a6')
s+='</g>'+card(278,207,326,271)+text(302,266,'БЦ Север',24,weight=600)+text(303,293,'Учебная улица, дом 1',12,'#757e8e')
s+=box(300,314,282,43,'#f1edff','#f1edff',15,False)+text(318,341,'Контакты',14,'#7654e8',500)+text(557,341,'⌄',17,'#7654e8')
s+=button(300,377,282,'Написать отчёт')+text(304,447,'Отчёты и информация об объекте',11,'#7b8291')
save('objects',s)

# NFC: a radial scanning scene with a single confirmation receipt.
s=''
for r,op in [(157,.16),(116,.25),(77,.38)]:s+=f'<circle cx="299" cy="231" r="{r}" fill="none" stroke="#a497f1" stroke-opacity="{op}" stroke-width="1.6"/>'
s+=box(247,179,104,104,'#fff','#f4f1ff',52)
s+='<path d="M278 216q13 15 0 30m15-40q22 25 0 50m17-60q30 35 0 70" fill="none" stroke="#7958ee" stroke-width="6" stroke-linecap="round"/>'
s+=text(155,354,'Поиск NFC-метки',17,weight=600)+text(140,383,'Поднесите телефон к метке',12,'#767c8b')
s+=card(366,338,258,108)+check(395,372)+text(418,376,'Вход сохранён',15,weight=600)+text(389,416,'БЦ Север',12,'#737b8a')+text(552,416,'09:41',12,'#737b8a')
s+=box(97,87,132,46,'#fff','#eeedf6',23)+text(163,116,'NFC · БЦ Север',11,'#7654e8',500).replace('<text ', '<text text-anchor="middle" ',1)
save('scan',s)

# Report: one large editorial sheet with overlapping photo attachments.
s=card(158,49,373,405)+text(183,100,'Новый отчёт',22,weight=600)+text(184,128,'БЦ Север',12,'#797f8e')
s+=box(180,151,329,144,'#fff','#eeedf6',18,False)
for i,t in enumerate(['Проверена вентиляция:','Решётки и фильтры в норме.','Посторонних шумов нет.']):s+=text(197,178+i*24,t,13)
s+=button(180,393,329,'Отправить отчёт')
# Photos are genuine existing project assets embedded by relative URL in the SVG.
import base64
for x,y,a,name in [(55,269,-9,'technical-room.png'),(383,270,7,'utility-inspection.png')]:
 p=root/'assets'/name
 data=base64.b64encode(p.read_bytes()).decode()
 s+=f'<g transform="rotate({a} {x+90} {y+55})">'+box(x,y,177,112,'#fff','#fff',12)+f'<clipPath id="photo{x}"><rect x="{x+6}" y="{y+6}" width="165" height="100" rx="8"/></clipPath><image href="data:image/png;base64,{data}" x="{x+6}" y="{y+6}" width="165" height="100" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo{x})"/></g>'
save('report',s)

# Tasks: a single staggered stack; completion slips out of the main list.
s=card(116,60,404,350)+text(142,105,'Задачи',24,weight=600)+text(424,103,'На сегодня',11,'#7b8190')
s+=row(135,128,366,'Проверить вентиляцию','БЦ Север · 29 октября','#ed718a')
s+=row(135,205,366,'Осмотреть электрощит','ЖК Сосновый · 30 октября','#e9b744')
s+=row(135,282,366,'Провести обход','Офис Центральный · 1 ноября','#85909c',True)
s+='<g transform="rotate(-4 390 399)">'+card(246,364,349,90)+check(275,397)+text(299,401,'Проверить освещение',15,'#798190',500)+text(299,428,'ТЦ Горизонт · выполнено',11,'#878d9b')+'</g>'
save('tasks',s)

# History: large hours tile and a continuous vertical event timeline.
s=card(62,101,241,220)+text(85,135,'ЧАСЫ ЗА НЕДЕЛЮ',11,'#7c8191',500)+text(85,211,'13',64,weight=600)+text(185,210,'ч',29,'#8d72dd')+text(85,251,'26 октября — 1 ноября',11,'#7c8191')
for i,h in enumerate([16,30,23,39,28,14,8]):s+=f'<rect x="{85+i*27}" y="{303-h}" width="17" height="{h}" rx="5" fill="#a88af0" opacity="{.4+i*.08}"/>'
s+=text(363,90,'История',23,weight=600)+text(363,121,'Сегодня',12,'#808697')
s+='<path d="M346 157V411" stroke="#c8b9ef" stroke-width="2" stroke-dasharray="3 7"/>'
for y,title,sub,time,c in [(142,'Выход с объекта','БЦ Север','18:02','#a58bdc'),(244,'Отчёт отправлен','Проверка вентиляции','13:00','#7d9be4'),(346,'Вход на объект','БЦ Север','09:41','#55b895')]:
 s+=f'<circle cx="346" cy="{y+30}" r="5" fill="{c}" stroke="white" stroke-width="3"/>'+card(365,y,252,85)+text(383,y+29,title,14,weight=500)+text(383,y+54,sub,10,'#7c8492')+text(560,y+69,time,10,'#7c8492')
save('history',s)
