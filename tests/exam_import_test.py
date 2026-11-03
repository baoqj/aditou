import unittest,sqlite3,sys,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from import_exam import records

class ExamContentTest(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.rows,cls.hashes=records();cls.byid={r['id']:r for r in cls.rows}
 def row(self,g,n,locale='en-CA'):return self.byid[f'exam-g{g}-q{n:02}-{locale}-v2']
 def test_grade_language_and_number_coverage(self):
  self.assertEqual(len(self.rows),400)
  for grade in range(1,5):
   for locale in ['en-CA','fr-CA']:
    rows=[r for r in self.rows if r['grade']==grade and r['locale']==locale]
    self.assertEqual(len(rows),50)
    self.assertEqual({r['logical_id'] for r in rows},{f'g{grade}-q{n:02}' for n in range(1,51)})
    for row in rows:self.assertEqual(row['source'],next(name for name in self.hashes if '小学'+'一二三四'[grade-1]+'年级' in name))
 def test_private_and_public_text_boundaries(self):
  for r in self.rows:
   for k in ['title','prompt','script','answer','explanation']:self.assertTrue(r[k],(r['id'],k))
   for k in ['prompt','script','preparation']:
    self.assertIsNone(re.search(r'[\u4e00-\u9fff]|\*\*|^>',r[k]),(r['id'],k))
   self.assertNotIn('评分',r['prompt']);self.assertNotIn('Réponse / démarche',r['prompt']);self.assertNotIn('Answer / working',r['prompt'])
   self.assertIn('评分',r['teacher_notes'])
 def test_reading_context_present_but_not_spoken(self):
  for grade in [2,3,4]:
   for locale in ['en-CA','fr-CA']:
    for n in range(9,16):
     r=self.row(grade,n,locale)
     self.assertRegex(r['prompt'],r'(Reading passage|Texte à lire) R[12]')
     self.assertGreater(len(r['prompt'].split('\n\n')[0]),100)
     self.assertNotIn(r['prompt'].split('\n\n')[0].split('\n',1)[1],r['script'])
 def test_listening_passages_are_complete_and_hidden(self):
  for grade,nums in [(1,range(38,45)),(2,range(6,9)),(3,range(5,9)),(4,range(5,9))]:
   for locale in ['en-CA','fr-CA']:
    for n in nums:
     r=self.row(grade,n,locale);parts=r['script'].split('\n\n')
     self.assertEqual(parts[0],parts[1]);self.assertGreaterEqual(len(parts[0]),80);self.assertNotIn(parts[0],r['prompt']);self.assertLess(len(r['script']),5000)
 def test_critical_adaptations_and_manual_marking(self):
  self.assertIn('___',self.row(2,27)['prompt'])
  self.assertEqual(self.row(1,23)['prompt'].count('●'),5)
  self.assertEqual(self.row(4,24)['answer'],'4113')
  self.assertEqual(self.row(4,32)['answer'],'8.25')
  for locale in ['en-CA','fr-CA']:
   r=self.row(1,22,locale);self.assertEqual(r['audio_policy'],'teacher_only');self.assertIn('/s/',r['preparation']);self.assertNotIn('/s/',r['script'])
  for g,n in [(3,31),(4,31),(4,37),(4,38),(4,41),(4,45)]:self.assertNotEqual(self.row(g,n)['response_type'],'numeric')
 def db(self):
  db=sqlite3.connect(':memory:');db.row_factory=sqlite3.Row
  for p in sorted((ROOT/'migrations').glob('*.sql')):
   if p.name.startswith('0008'):break
   db.executescript(p.read_text())
  return db
 def test_migration_creates_versions_without_overwriting_originals(self):
  db=self.db();old=db.execute("SELECT prompt FROM questions WHERE id='g1-q01-en-CA'").fetchone()[0]
  db.executescript((ROOT/'migrations/0008_exam_content.sql').read_text())
  self.assertEqual(db.execute("SELECT count(*) FROM questions WHERE id LIKE 'exam-%' AND status='published'").fetchone()[0],400)
  r=db.execute("SELECT prompt,status FROM questions WHERE id='g1-q01-en-CA'").fetchone();self.assertEqual(r[0],old);self.assertEqual(r[1],'retired')
  for row in self.rows:
   saved=db.execute('SELECT * FROM questions WHERE id=?',[row['id']]).fetchone()
   self.assertEqual(saved['grade'],row['grade']);self.assertEqual(saved['version'],2)
 def test_teacher_edited_logical_questions_are_skipped(self):
  db=self.db();db.execute("INSERT INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,status,source) VALUES('teacher-version','g1-q01',1,'en-CA','Manual','Teacher','Edited','Edited','text','draft','Teacher')")
  db.executescript((ROOT/'migrations/0008_exam_content.sql').read_text())
  self.assertIsNone(db.execute("SELECT id FROM questions WHERE id='exam-g1-q01-en-CA-v2'").fetchone())
  self.assertEqual(db.execute("SELECT status FROM questions WHERE id='g1-q01-en-CA'").fetchone()[0],'draft')
  self.assertEqual(db.execute("SELECT prompt FROM questions WHERE id='teacher-version'").fetchone()[0],'Edited')

if __name__=='__main__':unittest.main()
