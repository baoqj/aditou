import unittest,sys,json,sqlite3,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from import_exam02 import records
class Exam02Test(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.rows,_=records();cls.q={r['id']:r for r in cls.rows}
 def row(self,g,code,locale='fr-CA'):return self.q[f'exam02-g{g}-{code.lower()}-{locale}']
 def test_source_native_coverage_and_skills(self):
  self.assertEqual(len(self.rows),203);valid={s['id'] for s in json.loads((ROOT/'src/data/skills.json').read_text())}
  for g in range(1,5):
   self.assertEqual(len([r for r in self.rows if r['grade']==g]),50 if g==1 else 51)
   self.assertEqual(len([r for r in self.rows if r['grade']==g and r['locale']=='en-CA']),6)
  for r in self.rows:
   self.assertIn(r['module'],valid);self.assertNotEqual(r['module'],'skill.general');self.assertTrue(r['answer']);self.assertTrue(r['script']);self.assertLessEqual(len(r['script']),5000)
   for k in ['prompt','script','answer','explanation','preparation','title']:self.assertNotRegex(r[k],r'[\u4e00-\u9fff]|评分|2027-28')
 def test_all_choices_have_exact_valid_answers(self):
  for r in self.rows:
   opts=json.loads(r['options']);self.assertEqual(len(opts),len(set(opts)))
   if r['response_type']=='qcm':self.assertGreaterEqual(len(opts),2);self.assertIn(r['answer'],opts)
   if r['response_type'] in ['order','multiple']:
    answer=json.loads(r['answer']);self.assertTrue(set(answer)<=set(opts))
    if r['response_type']=='order':self.assertEqual(sorted(answer),sorted(opts))
  self.assertEqual(json.loads(self.row(4,'G1')['options']),['2/4','2/3','3/4'])
  self.assertEqual(self.row(1,'C3')['answer'],'un chien qui court')
  self.assertEqual(self.row(2,'C4')['answer'],'Le chien dort.')
  self.assertEqual(json.loads(self.row(2,'B3')['answer']),['des insectes','des escargots'])
 def test_listening_and_reading_stimuli_stay_in_correct_channels(self):
  for g in [2,3,4]:
   for n in range(1,6):
    r=self.row(g,'A'+str(n));parts=r['script'].split('\n\n');self.assertEqual(parts[0],parts[1]);self.assertGreater(len(parts[0]),100);self.assertNotIn(parts[0],r['prompt'])
   for n in range(1,7):
    r=self.row(g,'B'+str(n));self.assertGreater(len(r['prompt']),350);self.assertLess(len(r['script']),120)
  for g,part,count in [(3,'J',2),(4,'J',3)]:
   for n in range(1,count+1):
    r=self.row(g,part+str(n),'en-CA');parts=r['script'].split('\n\n');self.assertEqual(parts[0],parts[1]);self.assertNotIn(parts[0],r['prompt'])
  self.assertNotIn('Last weekend',self.row(4,'J4','en-CA')['script'])
 def test_dictation_targets_not_shown_and_drawing_setup_provided(self):
  for g,part,nums in [(1,'D',range(2,7)),(2,'D',range(1,6))]:
   for n in nums:
    r=self.row(g,part+str(n));self.assertNotIn(r['answer'],r['prompt']);self.assertIn(r['answer'],r['script']);self.assertEqual(r['text_policy'],'answer_area_only')
  for g,c,word in [(1,'E2','douze'),(2,'E1','trois cent douze'),(3,'G1','quatre mille'),(4,'F1','douze mille')]:self.assertNotIn(word,self.row(g,c)['prompt'])
  for c in ['A4','A5']:self.assertEqual(self.row(1,c)['response_type'],'drawing');self.assertTrue(self.row(1,c)['preparation'])
  for c in ['B5','B6']:self.assertEqual(self.row(1,c)['audio_policy'],'teacher_only');self.assertIn('Consigne à lire',self.row(1,c)['preparation'])
 def test_key_numeric_answers_and_rubrics(self):
  for g,c,ans in [(2,'G4','1.5'),(3,'H5','15'),(4,'F1','12075'),(4,'F3','4023'),(4,'G4','0.3'),(4,'G6','4.25'),(4,'H3','24'),(4,'I4','3000')]:self.assertEqual(self.row(g,c)['answer'],ans)
  for g,points in [(3,4),(4,5)]:
   for c in ['E1','E2']:r=self.row(g,c);self.assertEqual(r['response_type'],'text');self.assertIn(f'Original maximum points: {points}',r['teacher_notes'])
 def test_migration_is_additive_and_idempotent(self):
  db=sqlite3.connect(':memory:')
  for p in sorted((ROOT/'migrations').glob('*.sql')):
   if p.name.startswith('0010'):break
   db.executescript(p.read_text())
  old=db.execute('SELECT * FROM questions ORDER BY id').fetchall()
  sql=(ROOT/'migrations/0010_exam02_questions.sql').read_text();db.executescript(sql);db.executescript(sql)
  self.assertEqual(db.execute("SELECT count(*) FROM questions WHERE id LIKE 'exam02-%'").fetchone()[0],203)
  self.assertEqual(old,db.execute("SELECT * FROM questions WHERE id NOT LIKE 'exam02-%' ORDER BY id").fetchall())
  for r in self.rows:
   stored=db.execute('SELECT '+','.join(r)+' FROM questions WHERE id=?',(r['id'],)).fetchone()
   self.assertEqual(tuple(r.values()),stored,r['id'])
if __name__=='__main__':unittest.main()
