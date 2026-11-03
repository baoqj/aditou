"""Reproducible, versioned import of the four local original exam booklets.
Never rewrite 0002, existing question content, or teacher-created versions.
"""
from pathlib import Path
import re,json,hashlib,collections
ROOT=Path(__file__).resolve().parents[1]
DOCS=ROOT.parents[1]/'Docs'/'Exam'
if (DOCS/'Exam01').is_dir():DOCS=DOCS/'Exam01'
OUT=ROOT/'migrations'/'0008_exam_content.sql'

def clean(s):
    s=re.sub(r'^> ?', '', s, flags=re.M)
    return re.sub(r'\n{3,}', '\n\n', re.sub(r'\*\*([^*]+)\*\*',r'\1',s)).strip()

def questions(section):
    tokens=list(re.finditer(r'^#### Q(\d+)(?:｜([^\n]+))?\s*$',section,re.M));result={}
    for i,m in enumerate(tokens):
        before=section[:m.start()]
        module=list(re.finditer(r'^### ([^\n]+)',before,re.M))[-1][1]
        body=section[m.end():tokens[i+1].start() if i+1<len(tokens) else len(section)]
        body=re.split(r'^### |^## |^\*\*(?:听力材料|Texte à lire|Reading passage)',body,flags=re.M)[0].strip()
        result[int(m[1])]={'body':body,'module':module,'title':m[2] or ''}
    assert set(result)==set(range(1,51))
    return result

def language(body,lang):
    match=re.search(r'\*\*'+lang+r'[^\n]*?\*\*\s*(.*?)(?=\n\s*\*\*|\Z)',body,re.S)
    assert match, (lang,body)
    return clean(match[1])

def passages(section,label):
    return {m[1]:clean(m[2]) for m in re.finditer(r'^\*\*'+label+r' ([LR]\d)\*\*\s*\n+((?:>[^\n]*(?:\n|$))+)',section,re.M)}

# Only single numeric results are automatically graded. Explanations, working,
# multipart responses and open responses retain the original manual rubric.
NUMERIC={1:{23:'5',24:'7',25:'6',26:'9',27:'6',28:'0',29:'3'},
2:{2:'20',5:'8',10:'2',23:'37',24:'33',25:'17',26:'23',27:'9',31:'13',32:'3',34:'1',36:'13',37:'20',39:'25',41:'4'},
3:{4:'15',11:'5',13:'12',15:'30',24:'385',25:'325',26:'28',28:'4',32:'5',34:'120',35:'6',36:'16',37:'7',39:'48'},
4:{24:'4113',25:'2232',26:'72',27:'8',28:'7',30:'280',32:'8.25',33:'35',34:'26',36:'320'}}
# Keep tasks requiring steps / reasoning manual even if the final result is numeric.
DRAWING={1:{1,2,3,6,33,36},2:{1,3,4},3:{1,2,27,41},4:{1,2,29}}
OBSERVATION={1:{4,5,7,8,18,19,30,35,37,45,47},2:{42,44,48},3:{48},4:{48}}
# Adult setup never enters speech; it is separate from the student prompt.
PREP={
(1,2):('Préparez des crayons de plusieurs couleurs.','Prepare pencils in several colours.'),
(1,4):('Préparez un jeton et une feuille de papier.','Prepare one counter and a sheet of paper.'),
(1,7):('Préparez un crayon et une table.','Have a pencil and a table ready.'),
(1,8):('Préparez deux jetons identiques et une petite boîte.','Prepare two identical counters and a small box.'),
(1,22):('Prononcez les phonèmes séparément, sans dire les noms des lettres : /s/, /a/, /k/. Demandez ensuite à l’enfant de les assembler. Utilisez votre voix ou un enregistrement enseignant.','Say the separate phonemes, not the letter names: /s/, /ʌ/, /n/. Then ask the child to blend them. Use your voice or a teacher recording.'),
(1,23):('Présentez cinq jetons identiques sans annoncer leur nombre.','Present five identical counters without saying how many there are.'),
(1,30):('Placez six jetons, faites-les compter, puis écartez-les sans en ajouter ni en retirer.','Place six counters, have the child count them, then spread them apart without adding or removing any.'),
(1,34):('Du point de vue de l’enfant, placez le crayon rouge à gauche et le bleu à droite. Retirez les autres crayons. Ne nommez pas leur position.','From the child’s viewpoint, place the red pencil on the left and the blue pencil on the right. Remove other pencils. Do not name their positions.'),
(1,35):('Préparez trois bandes de même largeur : A = 10 cm, B = 4 cm, C = 7 cm. Mélangez-les. Ne lisez pas les longueurs à l’enfant.','Prepare three strips of equal width: A = 10 cm, B = 4 cm, C = 7 cm. Shuffle them. Do not read their lengths to the child.'),
(1,45):('Présentez une feuille d’arbre ordinaire. Les observations doivent correspondre à cette feuille.','Provide an ordinary leaf. Observations should match the actual leaf.'),
(1,47):('Préparez 6 à 10 blocs et participez comme partenaire. Observez les échanges, pas seulement le pont final.','Prepare 6–10 blocks and take part as a partner. Observe the interaction, not only the final bridge.'),
(2,42):('Préparez trois bandes : A = 6 cm, B = 11 cm, C = 4 cm. Mélangez-les et ne lisez pas les longueurs.','Prepare three strips: A = 6 cm, B = 11 cm, C = 4 cm. Shuffle them and do not read the lengths.'),
(2,44):('Préparez cinq jetons et deux boîtes placées à gauche et à droite.','Prepare five counters and two boxes placed on the left and right.'),
(2,48):('Participez comme partenaire avec des blocs ou du matériel de construction.','Take part as a partner with blocks or building materials.'),
}

def records():
    result=[]; hashes={}
    for grade,cn in enumerate('一二三四',1):
        path=DOCS/f'小学{cn}年级_入学模拟题_英法双语_50题.md';text=path.read_text();hashes[path.name]=hashlib.sha256(text.encode()).hexdigest()
        sections=re.split(r'^## (?:第一部分|第二部分|第三部分|第四部分)[^\n]*\n',text,flags=re.M)
        assert len(sections)==5
        teacher,fr,en,answers=map(questions,sections[1:])
        listening={'fr-CA':passages(sections[1],'Texte à écouter'),'en-CA':passages(sections[1],'Listening passage')}
        ranges={}
        for m in re.finditer(r'\*\*听力材料 (L\d)[^\n]*?适用于 Q(\d+)[–—-]Q(\d+)',sections[1]):
            for n in range(int(m[2]),int(m[3])+1): ranges[n]=m[1]
        assert (len(ranges)==7 if grade==1 else len(ranges)==(3 if grade==2 else 4)),ranges
        for locale,students,section,lang,index in [('fr-CA',fr,sections[2],'FR',0),('en-CA',en,sections[3],'EN',1)]:
            reading=passages(section,'Texte à lire' if index==0 else 'Reading passage')
            for n in range(1,51):
                raw=students[n]['body'];prompt=clean(re.split(r'\n\s*\n',raw)[0]);script=language(teacher[n]['body'],lang);answer=language(answers[n]['body'],lang)
                prep=PREP.get((grade,n),('',''))[index]
                if grade==1 and n==23:prompt+='\n\n●  ●  ●  ●  ●'
                reference=re.search(r'\bR[12]\b',prompt)
                if reference:
                    key=reference[0];assert key in reading
                    title=('Texte à lire ' if index==0 else 'Reading passage ')+key
                    prompt=title+'\n'+reading[key]+'\n\n'+prompt
                if n in ranges:
                    passage=listening[locale][ranges[n]]
                    # Every standalone question carries its passage twice, preserving the listening task.
                    script=passage+'\n\n'+passage+'\n\n'+script
                typ='drawing' if n in DRAWING.get(grade,set()) else 'observation' if n in OBSERVATION.get(grade,set()) else 'text'
                explanation=answer
                if n in NUMERIC[grade]:
                    typ='numeric';answer=NUMERIC[grade][n]
                    unit={ (2,34):('$','$'),(2,36):('cm','cm'),(3,11):('cm','cm'),(3,13):('numéro de salle','room number'),(3,15):('minutes','minutes'),(3,32):('$','$'),(3,34):('cm','cm'),(3,36):('cm','cm'),(4,32):('$','$'),(4,33):('minutes','minutes'),(4,34):('cm','cm'),(4,36):('cm','cm')}.get((grade,n),('',''))[index]
                    prompt+='\n\n'+(('Écris seulement le nombre'+(' ('+unit+')' if unit else '')+'.') if index==0 else ('Enter only the number'+(' ('+unit+')' if unit else '')+'.'))
                if grade==1 and n==22:
                    script=('Demande à un adulte de prononcer les sons de cette activité, puis assemble-les.' if index==0 else 'Ask an adult to say the sounds for this activity, then blend them.')
                qid=f'exam-g{grade}-q{n:02}-{locale}-v2'
                notes=teacher[n]['body']+'\n\n'+answers[n]['body']
                if n in ranges:notes+='\n\n'+listening[locale][ranges[n]]
                if reference:notes+='\n\n'+reading[reference[0]]
                result.append(dict(id=qid,logical_id=f'g{grade}-q{n:02}',grade=grade,locale=locale,module=students[n]['module'],title=f'Q{n:02} · '+re.sub(r'^\d+\.\s*','',students[n]['module']),prompt=prompt,script=script,teacher_notes=notes,response_type=typ,options='[]',answer=answer,explanation=explanation,status='published',text_policy='answer_area_only' if ('Écoute l’adulte' in prompt or 'Listen to the adult' in prompt) else 'full',version=2,source=path.name,preparation=prep,audio_policy='teacher_only' if grade==1 and n==22 else 'tts',old_id=f'g{grade}-q{n:02}-{locale}'))
    return result,hashes

def sqlstr(v):return str(v) if isinstance(v,int) else "'"+v.replace("'","''")+"'"
def main():
    rows,hashes=records();assert len(rows)==400
    sql=['-- Generated by scripts/import_exam.py; versioned content, no overwrite of teacher edits.',"ALTER TABLE questions ADD COLUMN preparation TEXT NOT NULL DEFAULT '';", "ALTER TABLE questions ADD COLUMN audio_policy TEXT NOT NULL DEFAULT 'tts' CHECK(audio_policy IN ('tts','teacher_only'));" ]
    for row in rows:
        old=row['old_id'];fields={k:v for k,v in row.items() if k!='old_id'}
        sql.append('INSERT OR IGNORE INTO questions('+','.join(fields)+') SELECT '+','.join(sqlstr(v) for v in fields.values())+' WHERE EXISTS(SELECT 1 FROM questions WHERE id='+sqlstr(old)+" AND status='draft') AND NOT EXISTS(SELECT 1 FROM questions WHERE logical_id="+sqlstr(row['logical_id'])+' AND locale='+sqlstr(row['locale'])+' AND id NOT IN ('+sqlstr(old)+','+sqlstr(row['id'])+'));')
        sql.append("UPDATE questions SET status='retired' WHERE id="+sqlstr(old)+" AND status='draft' AND EXISTS(SELECT 1 FROM questions WHERE id="+sqlstr(row['id'])+');')
    OUT.write_text('\n'.join(sql)+'\n')
    report={'source_hashes':hashes,'logical_questions':200,'language_versions':len(rows),'by_grade_locale':dict(collections.Counter(f"{r['grade']} {r['locale']}" for r in rows)),'by_response_type':dict(collections.Counter(r['response_type'] for r in rows)),'listening_passage_versions':36,'independent_reading_versions':42,'teacher_only_audio':[r['id'] for r in rows if r['audio_policy']=='teacher_only'],'notes':['Grade means grade of entry, not current grade.','Listening passages are included twice in speech, never in student prompt.','Independent reading passages are included in the student prompt, never in speech.','Only unambiguous single-number responses are auto-graded; original open response rubrics remain in teacher notes.','New versions skip logical questions already edited by teachers.']}
    (ROOT/'artifacts'/'exam-import-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
