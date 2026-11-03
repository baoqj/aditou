"""Parse Exam02 Markdown tables into reviewed, reproducible web question records."""
from pathlib import Path
import re,json,hashlib,collections
ROOT=Path(__file__).resolve().parents[1]
DOCS=ROOT.parents[1]/'Docs/Exam/Exam02'

def clean(value):
 value=re.sub(r'\*{1,2}([^*]+)\*{1,2}',r'\1',value).strip()
 if (value.startswith('«') and value.endswith('»')) or (value.startswith('“') and value.endswith('”')):value=value[1:-1].strip()
 return value.replace('＝','=')

def answer_text(value):
 value=value.split('评分：')[0].replace('例：','').strip()
 value=re.sub(r'（[^）]*[\u4e00-\u9fff][^）]*）','',value)
 value=value.replace('（',' (').replace('）',')')
 return clean(value)

def parse():
 result=[];sources={}
 for path in sorted(DOCS.glob('*.md')):
  grade=int(re.search(r'Grade(\d)',path.name)[1]);text=path.read_text();sources[str(path.relative_to(ROOT.parents[1]))]=hashlib.sha256(text.encode()).hexdigest()
  sections=list(re.finditer(r'^## Parti?e? ([A-J])\s*—\s*([^\n]+)',text,re.M))
  for i,m in enumerate(sections):
   part=m[1];section=text[m.end():sections[i+1].start() if i+1<len(sections) else len(text)]
   section=re.split(r'^## ',section,flags=re.M)[0]
   preface=section.split('| N°')[0].strip()
   quotes=re.findall(r'^(«.*»|“.*”)\s*$',preface,re.M)
   passage=clean(quotes[0]) if quotes else ''
   reading='\n'.join(clean(line.lstrip('> ')) for line in preface.splitlines() if line.startswith('>'))
   locale='en-CA' if 'English' in m[2] else 'fr-CA'
   for line in section.splitlines():
    cells=[v.strip() for v in line.strip().strip('|').split('|')]
    if len(cells)!=4 or not re.fullmatch(part+r'\d+',cells[0]):continue
    result.append(dict(grade=grade,code=cells[0],part=part,heading=m[2],instruction=clean(cells[1]),sheet=clean(cells[2]),raw_answer=cells[3],locale=locale,passage=passage,reading=reading,source='Exam02/'+path.name))
 return result,sources

# Reviewed primary skill by section, refined below for mixed sections.
SKILLS={1:dict(A='listening_comprehension',B='phonological_awareness',C='reading_comprehension',D='spelling_punctuation',E='number_sense',F='arithmetic',G='geometry',H='vocabulary'),2:dict(A='listening_comprehension',B='reading_comprehension',C='grammar',D='spelling_punctuation',E='number_sense',F='arithmetic',G='geometry',H='patterns_logic',I='vocabulary'),3:dict(A='listening_comprehension',B='reading_comprehension',C='grammar',D='vocabulary',E='written_expression',F='arithmetic',G='number_sense',H='word_problems',I='geometry',J='grammar'),4:dict(A='listening_comprehension',B='reading_comprehension',C='grammar',D='vocabulary',E='written_expression',F='arithmetic',G='fractions',H='word_problems',I='geometry',J='grammar')}
REFINE={1:{'A4':'following_instructions','A5':'following_instructions','C6':'grammar','F6':'word_problems','F7':'word_problems','G3':'patterns_logic','G4':'patterns_logic','G5':'measurement','G6':'time','H1':'listening_comprehension','H2':'listening_comprehension','H4':'grammar','H6':'spelling_punctuation'},2:{'C4':'spelling_punctuation','F6':'word_problems','F7':'word_problems','G3':'time','G4':'money','G5':'measurement','G6':'time','H3':'vocabulary','I1':'listening_comprehension','I2':'listening_comprehension','I5':'grammar','I6':'listening_comprehension'},3:{'F7':'word_problems','G4':'fractions','G5':'fractions','G6':'arithmetic','H1':'money','H3':'time','H5':'measurement','I1':'measurement','I3':'measurement','J1':'listening_comprehension','J2':'listening_comprehension','J4':'vocabulary'},4:{'F1':'number_sense','F2':'number_sense','G5':'number_sense','G6':'money','H1':'money','H4':'fractions','H5':'time','I1':'measurement','I2':'measurement','I4':'measurement','J1':'listening_comprehension','J2':'listening_comprehension','J3':'listening_comprehension'}}
NUMBERS={1:{'E1':'7','E2':'12','E3':'20','E4':'16','F1':'7','F2':'10','F3':'5','F4':'4','F5':'1','G4':'8','G6':'3'},2:{'E1':'312','E3':'599','E6':'45','F1':'43','F2':'92','F3':'36','F4':'55','F5':'30','G1':'4','G4':'1.5','H1':'15','H4':'14','I2':'14'},3:{'A2':'12','F1':'24','F2':'35','F3':'27','F4':'64','F5':'6','F6':'5','G1':'4205','G2':'700','G6':'625','H1':'36','H2':'9','H4':'33','H5':'15','I1':'16','I2':'6','I3':'100'},4:{'F1':'12075','F2':'4700','F3':'4023','F4':'3213','F5':'204','F6':'39','G4':'0.3','G6':'4.25','H1':'10','H2':'192','H3':'24','I1':'28','I2':'36','I3':'90','I4':'3000'}}
CHOICES={
 (1,'A1'):['🐶','🐱','🐰'],(1,'A2'):['🍌','🍎','🍐'],(1,'A3'):['☀️','❄️','🌧️'],
 (1,'B1'):['1','2','3','4'],(1,'B2'):['1','2','3','4'],
 (1,'C1'):['🌙','☀️','⭐'],(1,'C2'):['🏠','🚗','🌳'],(1,'E5'):['8','15','12'],
 (1,'G1'):['○','□','△'],(1,'G2'):['○','□','△'],(1,'G3'):['🔴','🔵'],(1,'G5'):['une fourmi','un serpent','une souris'],
 (1,'H1'):['🐶','🐱','🐟'],(1,'H2'):['5','7','9'],(1,'H3'):['🐶','🚗','🍎'],
 (2,'C1'):['un','une'],(2,'C2'):['est','sont'],(2,'H2'):['▲','●'],
 (4,'C5'):['Un','grand','chien','noir','aboie.'],(3,'G5'):['1/2','1/4']}
CHOICE_ANSWERS={(1,'G1'):'△',(1,'G2'):'○',(2,'A5'):'Faux',(3,'A3'):'15 min',(3,'A5'):'volcans',(4,'A5'):'5 ¢',(4,'B4'):'Faux'}
ORDER={ (1,'C6'):(['petit','un','a','Léa','chien'],['Léa','a','un','petit','chien']), (2,'E5'):(['205','250','52'],['52','205','250']), (3,'J6'):(['has','She','two','brothers'],['She','has','two','brothers']), (4,'D4'):(['pomme','poire','prune','pêche'],['pêche','poire','pomme','prune']), (4,'G5'):(['0,7','0,07','0,75'],['0,07','0,7','0,75']) }
MULTIPLE={(2,'B3'):['des insectes','des escargots'],(4,'C5'):['grand','noir']}
UNITS={(1,'G6'):'heures',(2,'G4'):'dollars',(3,'A2'):'élèves',(3,'H1'):'dollars',(3,'H5'):'cm',(3,'I1'):'cm',(3,'I3'):'cm',(4,'G6'):'dollars',(4,'H1'):'dollars',(4,'I1'):'cm²',(4,'I2'):'cm',(4,'I3'):'degrés',(4,'I4'):'g'}


def records():
 source_rows,hashes=parse();result=[]
 for row in source_rows:
  g,c,part,lang=row['grade'],row['code'],row['part'],row['locale'];key=(g,c);fr=lang=='fr-CA'
  instruction,sheet=row['instruction'],row['sheet'];original_answer=answer_text(row['raw_answer']);answer=original_answer
  skill='skill.'+REFINE.get(g,{}).get(c,SKILLS[g][part]);options=[];typ='text';policy='tts';prep=''
  is_listening=part=='A' or (g==1 and part=='B') or (g==1 and part=='H' and c in ['H1','H2','H3']) or (g==2 and c in ['I1','I2','I6']) or (g==3 and c in ['J1','J2']) or (g==4 and c in ['J1','J2','J3'])
  is_dictation=(g==1 and part=='D' and c!='D1') or (g==2 and part=='D')
  number_dictation=key in [(1,'E2'),(2,'E1'),(3,'G1'),(4,'F1')]
  is_listening=is_listening or number_dictation
  is_reading=(g==1 and part=='C') or (g>1 and part=='B')
  # Options use spaced separators, so mathematical fractions remain intact.
  label_options=list(re.finditer(r'(?<!\w)(?:\([abc]\)|[abc]\))\s*',sheet))
  stimulus=sheet
  if key in CHOICES:
   options=CHOICES[key];typ='qcm'
   stimulus=sheet
   if key in [(1,'C1'),(1,'C2')]:stimulus=sheet.split('：')[0].strip()
   elif key not in [(2,'C1'),(2,'C2'),(4,'C5'),(1,'G3'),(2,'H2')]:stimulus=''
  elif label_options:
   options=[sheet[m.end():label_options[i+1].start() if i+1<len(label_options) else len(sheet)].strip() for i,m in enumerate(label_options)];stimulus=sheet[:label_options[0].start()].strip();typ='qcm'
  elif re.search(r'V\s*/\s*F$',sheet):
   m=re.search(r'V\s*/\s*F$',sheet);options=['Vrai','Faux'];stimulus=sheet[:m.start()].strip();typ='qcm'
  elif re.search(r'\s/\s|\s[–—]\s',sheet):
   prefix=re.match(r'^(«[^»]+»)\s*(.+)$',sheet);stimulus=prefix[1] if prefix else '';choice_sheet=prefix[2] if prefix else sheet
   options=[s.strip() for s in re.split(r'\s/\s|\s[–—]\s',choice_sheet)];typ='qcm'
  if c in ['E6'] and g==1 or c=='E4' and g==2 or c=='G3' and g==3 or c=='G2' and g==4:
   typ='qcm';options=['<','>','='];stimulus=sheet
  if key in MULTIPLE:typ='multiple';answer=json.dumps(MULTIPLE[key],ensure_ascii=False)
  elif key in ORDER:typ='order';options,sequence=ORDER[key];answer=json.dumps(sequence,ensure_ascii=False);stimulus=''
  elif c in NUMBERS.get(g,{}):typ='numeric';options=[];answer=NUMBERS[g][c];stimulus=sheet
  elif g==1 and c in ['A4','A5']:typ='drawing';options=[];stimulus=''
  elif typ=='qcm':
   target=CHOICE_ANSWERS.get(key,original_answer)
   letter=re.fullmatch(r'\(?([abc])\)?',target)
   answer=options[ord(letter[1])-ord('a')] if letter else target
   assert answer in options,(g,c,answer,options)
  if g==1 and c=='A4':answer='Un cercle à l’intérieur du cadre et une croix sous le cadre.';prep='Préparez une feuille avec un cadre vide. Sur l’ardoise numérique, l’enfant peut tracer le cadre avant d’écouter la consigne.'
  if g==1 and c=='A5':answer='Le premier ballon est bleu et le quatrième est rouge.';prep='Préparez quatre ballons non coloriés, sur papier ou dessinés sur l’ardoise, ainsi que du bleu et du rouge.'
  if g==1 and c in ['B5','B6']:policy='teacher_only';prep='Prononcez le son cible sans dire le nom des lettres : '+('/u/ pour « ou », comme dans « loup ».' if c=='B5' else '/s/, comme au début de « soleil ».')
  # Paper worksheet annotations and blank lines are replaced by web controls.
  if re.search(r'[\u4e00-\u9fff]',stimulus):stimulus='Écris ton calcul et ta réponse.' if '算式' in stimulus else ''
  if re.fullmatch(r'[_\s]+',stimulus or ' '):stimulus=''
  if typ=='qcm' and stimulus==sheet and sheet in [' '.join(options),' / '.join(options)]:stimulus=''
  if is_listening:prompt=('Écoute l’enregistrement ou l’adulte, puis réponds.' if fr else 'Listen to the recording or an adult, then answer.')
  elif is_dictation:prompt='Écoute, puis écris le mot ou la phrase dictée.'
  else:prompt=instruction
  if number_dictation:prompt='Écoute le nombre, puis écris-le en chiffres.'
  if g==1 and c=='H6':prompt='Listen to the word, then write the missing letter.'
  if key in [(2,'C5'),(3,'C1'),(4,'C7')]:prompt={(2,'C5'):'Écris le verbe de cette phrase.',(3,'C1'):'Écris le sujet de cette phrase.',(4,'C7'):'Écris le complément de phrase.'}[key]
  if key==(4,'C5'):prompt='Sélectionne les adjectifs.'
  if key==(1,'C6'):prompt='Remets les mots dans le bon ordre.'
  if stimulus:prompt+='\n\n'+stimulus
  if is_reading and row['reading']:prompt=row['reading']+'\n\n'+prompt
  if typ=='numeric':prompt+='\n\n'+(('Écris seulement le nombre'+(' ('+UNITS[key]+')' if key in UNITS else '')+'.') if fr else 'Enter only the number.')
  if g==1 and c=='A4':prompt+='\n\nPrépare d’abord un cadre vide sur ta feuille ou sur l’ardoise.'
  if g==1 and c=='A5':prompt+='\n\nPrépare d’abord quatre ballons non coloriés.'
  if is_reading:script='Lis le texte ou les mots et la question par toi-même, puis réponds.'
  else:
   shared=row['passage'] if (part=='A' or g==3 and c in ['J1','J2'] or g==4 and c in ['J1','J2','J3']) else ''
   script=(shared+'\n\n'+shared+'\n\n'+instruction) if shared else instruction+'\n\n'+instruction
  if policy=='teacher_only':prep+='\n\nConsigne à lire : '+instruction
  if policy=='teacher_only':script='Demande à un adulte de prononcer le son cible, puis choisis ta réponse.'
  explanation=answer if typ in ['text','drawing'] else original_answer
  if typ in ['qcm','multiple','order']:explanation=('Réponse attendue : ' if fr else 'Expected answer: ')+(' ; '.join(json.loads(answer)) if typ in ['multiple','order'] else answer)
  if g==1 and c in ['A4','A5']:explanation=answer
  max_points=4 if g==3 and part=='E' else 5 if g==4 and part=='E' else 1
  rubric=''
  if g==3 and c=='E1':rubric='Évaluer le contenu, les phrases complètes avec majuscules et points, l’orthographe et la cohérence.'
  if g==3 and c=='E2':rubric='Vérifier la salutation et la conclusion, la date et le lieu, les phrases et l’orthographe.'
  if g==4 and c=='E1':rubric='Évaluer la structure début-développement-fin, les temps du passé, les phrases et la ponctuation, l’orthographe et les accords, les détails et la cohérence.'
  if g==4 and c=='E2':rubric='Vérifier le point de vue, au moins deux raisons, les connecteurs, les phrases et la ponctuation, l’orthographe.'
  if rubric:explanation+='\n\n'+rubric
  notes='Source: '+row['source']+' · '+c+'\nOriginal section: '+row['heading']+'\nTeacher: '+instruction+'\nStudent sheet: '+sheet+'\nOriginal answer / rubric: '+row['raw_answer']+'\nOriginal maximum points: '+str(max_points)+'\nApplication scoring: 0–2 per question; original writing rubric is retained for manual review.'
  if row['passage']:notes+='\nShared listening passage: '+row['passage']
  if row['reading']:notes+='\nIndependent reading: '+row['reading']
  qid=f'exam02-g{g}-{c.lower()}-{lang}'
  result.append(dict(id=qid,logical_id=f'exam02-g{g}-{c.lower()}',grade=g,locale=lang,module=skill,title=f'Exam02 · {c} · '+re.sub(r'（.*','',row['heading']).strip(),prompt=prompt,script=script,teacher_notes=notes,response_type=typ,options=json.dumps(options,ensure_ascii=False),answer=answer,explanation=explanation,status='published',text_policy='answer_area_only' if is_dictation or is_listening else 'full',version=1,source=row['source'],preparation=prep,audio_policy=policy))
 assert len(result)==203,len(result)
 for r in result:
  for k in ['prompt','script','answer','explanation','preparation','title']:
   assert not re.search(r'[\u4e00-\u9fff]',r[k]),(r['id'],k,r[k])
  assert len(r['script'])<=5000
 return result,hashes

def main():
 rows,hashes=records();skills=json.loads((ROOT/'src/data/skills.json').read_text());valid={s['id'] for s in skills};assert all(r['module'] in valid for r in rows)
 lit=lambda v:str(v) if isinstance(v,int) else "'"+v.replace("'","''")+"'"
 sql=['-- Exam02 source-native questions: 50 Grade 1, 51 each Grades 2–4.','-- Deterministic IDs prevent duplicate imports; no prior questions are updated.']
 for row in rows:sql.append('INSERT OR IGNORE INTO questions('+','.join(row)+') VALUES('+','.join(lit(v) for v in row.values())+');')
 (ROOT/'migrations/0010_exam02_questions.sql').write_text('\n'.join(sql)+'\n')
 report={'source_sha256':hashes,'total':len(rows),'by_grade':dict(collections.Counter(str(r['grade']) for r in rows)),'by_grade_locale':dict(collections.Counter(f"{r['grade']} {r['locale']}" for r in rows)),'by_response_type':dict(collections.Counter(r['response_type'] for r in rows)),'by_skill':dict(collections.Counter(r['module'] for r in rows)),'teacher_only':[r['id'] for r in rows if r['audio_policy']=='teacher_only'],'source_scoring_notes':['Original source: 1 point per ordinary question; Grade 3 writing 4 points, Grade 4 writing 5 points. Application uses its existing 0–2 scale; original weights/rubrics retained in teacher_notes.','Grade 3 source declares 55 points, but 51 questions with two 4-point tasks total 57. The inconsistent source total is not used as an application score.'],'language_policy':'Preserve source language: French sections plus six English tasks per grade. No mechanical translation of phonics, dictation or grammar.'}
 (ROOT/'artifacts/exam02-import-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 audit=['# Exam02 question audit','','| Grade | Source task | Language | Response | Skill | Answer |','|---|---|---|---|---|---|']
 for r in rows:audit.append('| '+ ' | '.join([str(r['grade']),r['id'].split('-')[2].upper(),r['locale'],r['response_type'],r['module'],r['answer'].replace('\n',' ').replace('|','\\|')])+' |')
 (ROOT/'docs/exam02-classification.md').write_text('\n'.join(audit)+'\n')
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
