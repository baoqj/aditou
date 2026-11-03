from pathlib import Path
import re,json,hashlib,uuid
root=Path(__file__).resolve().parents[1]
def lit(v): return "'"+str(v).replace("'","''")+"'"
def insert(table,obj): return 'INSERT OR IGNORE INTO '+table+'('+','.join(obj)+') VALUES('+','.join(lit(v) for v in obj.values())+');'
rows=[]
salt=str(uuid.uuid4())
rows.append(insert('accounts',dict(id='platform-admin',email='admin@gmail.com',name='Administrateur',role='admin',password_hash=hashlib.pbkdf2_hmac('sha256',b'Admin1234',salt.encode(),100000).hex(),salt=salt)))
rows.append(insert('classes',dict(id='class-initial',name='Atelier Bilingue · Groupe découverte',grade=2,locale='fr-CA',teacher_id='platform-admin')))
def blocks(section):
    result={}; module=''; current=None
    for line in section.splitlines():
        if line.startswith('### '): module=line[4:].strip()
        m=re.match(r'#### Q(\d+)(?:｜(.*))?$',line)
        if m: current=int(m[1]); result[current]={'module':module,'title':m[2] or '', 'lines':[]}
        elif current: result[current]['lines'].append(line)
    return result
def clean(s):
    s=re.sub(r'\*\*([^*]+)\*\*',r'\1',s)
    s=re.sub(r'_{3,}','',s)
    return re.sub(r'\n{3,}','\n\n',s).strip()
count=0
for grade,cn in enumerate(['一','二','三','四'],1):
    exam_dir=root.parent.parent/'Docs'/'Exam'
    if (exam_dir/'Exam01').is_dir(): exam_dir=exam_dir/'Exam01'
    path=exam_dir/f'小学{cn}年级_入学模拟题_英法双语_50题.md'
    text=path.read_text(); sections=re.split(r'^## (?:第一部分|第二部分|第三部分|第四部分)[^\n]*\n',text,flags=re.M)
    if len(sections)!=5: raise ValueError(path)
    teacher,fr,en,answers=map(blocks,sections[1:])
    for n in range(1,51):
        t=teacher[n]; tb='\n'.join(t['lines']); ab='\n'.join(answers[n]['lines'])
        for locale,students,pattern,apattern in [('fr-CA',fr,r'\*\*FR[^\n]*?\*\*\s*(.*?)(?=\n\s*\*\*EN|\Z)',r'\*\*FR[^\n]*?\*\*\s*(.*?)(?=\n\s*\*\*EN|\Z)'),('en-CA',en,r'\*\*EN[^\n]*?\*\*\s*(.*?)(?=\n\s*\*\*|\Z)',r'\*\*EN[^\n]*?\*\*\s*(.*?)(?=\n\s*\*\*|\Z)')]:
            sm=re.search(pattern,tb,re.S); am=re.search(apattern,ab,re.S)
            script=clean(sm[1]) if sm else ''
            # Listening passages require editorial association, all imports remain drafts.
            script=script.split('**听力材料')[0].strip()
            prompt=clean('\n'.join(students[n]['lines']).split('### ')[0])
            answer=clean(am[1]) if am else ''
            response='drawing' if re.search(r'Dessin|Drawing|espace de dessin',prompt,re.I) else 'text'
            obj=dict(id=f'g{grade}-q{n:02}-{locale}',logical_id=f'g{grade}-q{n:02}',grade=grade,locale=locale,module=students[n]['module'],title=f'Q{n:02} · '+students[n]['module'],prompt=prompt,script=script,teacher_notes=clean(tb)+'\n\n'+clean(ab),response_type=response,answer=answer,explanation=answer,status='draft',text_policy='answer_area_only' if re.search(r'Écoute l.adulte|Listen to the adult',prompt) else 'full',source=path.name)
            rows.append(insert('questions',obj)); count+=1
# Small verified written practice set. These do not require hidden listening passages.
samples=[
(1,'Compter et raisonner','Les petits oiseaux','Il y a 4 oiseaux. 3 autres arrivent. Combien y en a-t-il en tout ?','There are 4 birds. 3 more arrive. How many birds are there in all?','7','4 + 3 = 7.','numeric',[]),
(1,'Formes et espace','Les côtés du triangle','Combien de côtés a un triangle ?','How many sides does a triangle have?','3','Un triangle a 3 côtés. / A triangle has 3 sides.','numeric',[]),
(2,'Compter et raisonner','Le partage des jetons','Tu as 12 jetons. Tu en donnes 5. Combien t’en reste-t-il ?','You have 12 counters. You give away 5. How many are left?','7','12 − 5 = 7.','numeric',[]),
(2,'Calcul mental','Le saut de grenouille','Une grenouille part de la case 8 et avance de 6 cases. Sur quelle case arrive-t-elle ?','A frog starts on square 8 and jumps forward 6 squares. Which square does it land on?','14','8 + 6 = 14.','numeric',[]),
(3,'Calcul et logique','Deux opérations','Commence à 12. Ajoute 5, puis enlève 2. Quel est le résultat ?','Start with 12. Add 5, then subtract 2. What is the result?','15','12 + 5 − 2 = 15.','numeric',[]),
(4,'Calcul et logique','Les groupes égaux','Il y a 6 boîtes avec 8 crayons chacune. Combien de crayons en tout ?','There are 6 boxes with 8 pencils in each. How many pencils in total?','48','6 × 8 = 48.','numeric',[]),
(2,'Formes et espace','Dessiner un triangle','Dessine un triangle fermé. Tu peux utiliser le tableau ci-dessous.','Draw a closed triangle. You can use the drawing board below.','Trois côtés et trois sommets. / Three sides and three corners.','Validation par un adulte. / An adult will review this drawing.','drawing',[]),
(2,'Mots et idées','Une réponse personnelle','Décris une activité que tu aimes et explique pourquoi.','Describe an activity you enjoy and explain why.','Une idée pertinente avec une raison. / A relevant idea and a reason.','Réponse ouverte : validation par un adulte. / Open response: adult review.','text',[])]
for n,(grade,module,title,fr,en,ans,ex,typ,opts) in enumerate(samples,1):
 for locale,prompt in [('fr-CA',fr),('en-CA',en)]:
  rows.append(insert('questions',dict(id=f'practice-{n}-{locale}',logical_id=f'practice-{n}',grade=grade,locale=locale,module=module,title=title,prompt=prompt,script=prompt,response_type=typ,answer=ans,explanation=ex,status='published',source='Exercices de démarrage · révision écrite',options=json.dumps(opts))))
(root/'migrations'/'0002_seed.sql').write_text('\n'.join(rows))
print(f'Imported {count} draft language versions; {len(samples)*2} published written practice versions. Admin password stored only as PBKDF2 hash in migration.')
