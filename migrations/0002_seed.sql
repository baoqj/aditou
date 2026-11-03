INSERT OR IGNORE INTO accounts(id,email,name,role,password_hash,salt) VALUES('platform-admin','admin@gmail.com','Administrateur','admin','3919ff9f8d48de8fe6b0e79438b5255c350759eb595cd9f2379fbcf05f5ad9c7','4a5dbbbc-f3f2-46e1-871c-b889ad4ec60f');
INSERT OR IGNORE INTO classes(id,name,grade,locale,teacher_id) VALUES('class-initial','Atelier Bilingue · Groupe découverte','2','fr-CA','platform-admin');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q01-fr-CA','g1-q01','1','fr-CA','1. Écouter et agir','Q01 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine un cercle.','FR — à lire : Dessine un cercle.

EN — read aloud: Draw a circle.

FR : Un cercle reconnaissable.

EN: A recognisable circle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','drawing','Un cercle reconnaissable.','Un cercle reconnaissable.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q01-en-CA','g1-q01','1','en-CA','1. Listen and act','Q01 · 1. Listen and act','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','Draw a circle.','FR — à lire : Dessine un cercle.

EN — read aloud: Draw a circle.

FR : Un cercle reconnaissable.

EN: A recognisable circle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','drawing','A recognisable circle.','A recognisable circle.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q02-fr-CA','g1-q02','1','fr-CA','1. Écouter et agir','Q02 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Prends le crayon bleu et fais un point.','FR — à lire : Prends le crayon bleu et fais un point.

EN — read aloud: Take the blue pencil and make a dot.

FR : Un point bleu.

EN: A blue dot.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','drawing','Un point bleu.','Un point bleu.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q02-en-CA','g1-q02','1','en-CA','1. Listen and act','Q02 · 1. Listen and act','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','Take the blue pencil and make a dot.','FR — à lire : Prends le crayon bleu et fais un point.

EN — read aloud: Take the blue pencil and make a dot.

FR : Un point bleu.

EN: A blue dot.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','drawing','A blue dot.','A blue dot.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q03-fr-CA','g1-q03','1','fr-CA','1. Écouter et agir','Q03 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine un carré, puis fais un point à l’intérieur.','FR — à lire : Dessine un carré, puis fais un point à l’intérieur.

EN — read aloud: Draw a square, then put a dot inside it.

FR : Un carré avec un point à l’intérieur.

EN: A square with a dot inside.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','drawing','Un carré avec un point à l’intérieur.','Un carré avec un point à l’intérieur.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q03-en-CA','g1-q03','1','en-CA','1. Listen and act','Q03 · 1. Listen and act','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','Draw a square, then put a dot inside it.','FR — à lire : Dessine un carré, puis fais un point à l’intérieur.

EN — read aloud: Draw a square, then put a dot inside it.

FR : Un carré avec un point à l’intérieur.

EN: A square with a dot inside.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','drawing','A square with a dot inside.','A square with a dot inside.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q04-fr-CA','g1-q04','1','fr-CA','1. Écouter et agir','Q04 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Je réalise l’action. Observation de l’adulte :','Pose un jeton sur la feuille, puis enlève-le.','FR — à lire : Pose un jeton sur la feuille, puis enlève-le.

EN — read aloud: Put one counter on the paper, then take it off.

FR : Le jeton est posé, puis retiré.

EN: The counter is placed on the paper, then removed.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','text','Le jeton est posé, puis retiré.','Le jeton est posé, puis retiré.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q04-en-CA','g1-q04','1','en-CA','1. Listen and act','Q04 · 1. Listen and act','Listen to the adult, then do the activity.

I carry out the action. Adult observation:','Put one counter on the paper, then take it off.','FR — à lire : Pose un jeton sur la feuille, puis enlève-le.

EN — read aloud: Put one counter on the paper, then take it off.

FR : Le jeton est posé, puis retiré.

EN: The counter is placed on the paper, then removed.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','text','The counter is placed on the paper, then removed.','The counter is placed on the paper, then removed.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q05-fr-CA','g1-q05','1','fr-CA','1. Écouter et agir','Q05 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Je réalise l’action. Observation de l’adulte :','Touche ton nez, puis tape une fois dans tes mains.','FR — à lire : Touche ton nez, puis tape une fois dans tes mains.

EN — read aloud: Touch your nose, then clap once.

FR : Le nez est touché avant un seul claquement de mains.

EN: Touches nose, then claps once.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','text','Le nez est touché avant un seul claquement de mains.','Le nez est touché avant un seul claquement de mains.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q05-en-CA','g1-q05','1','en-CA','1. Listen and act','Q05 · 1. Listen and act','Listen to the adult, then do the activity.

I carry out the action. Adult observation:','Touch your nose, then clap once.','FR — à lire : Touche ton nez, puis tape une fois dans tes mains.

EN — read aloud: Touch your nose, then clap once.

FR : Le nez est touché avant un seul claquement de mains.

EN: Touches nose, then claps once.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','text','Touches nose, then claps once.','Touches nose, then claps once.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q06-fr-CA','g1-q06','1','fr-CA','1. Écouter et agir','Q06 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dans ton espace de dessin, fais un trait en haut et un point en bas.','FR — à lire : Dans ton espace de dessin, fais un trait en haut et un point en bas.

EN — read aloud: In your drawing space, make a line at the top and a dot at the bottom.

FR : Un trait en haut, un point en bas.

EN: A line at the top and a dot at the bottom.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','drawing','Un trait en haut, un point en bas.','Un trait en haut, un point en bas.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q06-en-CA','g1-q06','1','en-CA','1. Listen and act','Q06 · 1. Listen and act','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','In your drawing space, make a line at the top and a dot at the bottom.','FR — à lire : Dans ton espace de dessin, fais un trait en haut et un point en bas.

EN — read aloud: In your drawing space, make a line at the top and a dot at the bottom.

FR : Un trait en haut, un point en bas.

EN: A line at the top and a dot at the bottom.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','drawing','A line at the top and a dot at the bottom.','A line at the top and a dot at the bottom.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q07-fr-CA','g1-q07','1','fr-CA','1. Écouter et agir','Q07 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Je réalise l’action. Observation de l’adulte :','Avant de prendre ton crayon, touche la table.','FR — à lire : Avant de prendre ton crayon, touche la table.

EN — read aloud: Before you pick up your pencil, touch the table.

FR : La table est touchée avant de prendre le crayon.

EN: Touches the table before picking up the pencil.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','text','La table est touchée avant de prendre le crayon.','La table est touchée avant de prendre le crayon.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q07-en-CA','g1-q07','1','en-CA','1. Listen and act','Q07 · 1. Listen and act','Listen to the adult, then do the activity.

I carry out the action. Adult observation:','Before you pick up your pencil, touch the table.','FR — à lire : Avant de prendre ton crayon, touche la table.

EN — read aloud: Before you pick up your pencil, touch the table.

FR : La table est touchée avant de prendre le crayon.

EN: Touches the table before picking up the pencil.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','text','Touches the table before picking up the pencil.','Touches the table before picking up the pencil.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q08-fr-CA','g1-q08','1','fr-CA','1. Écouter et agir','Q08 · 1. Écouter et agir','Écoute l’adulte, puis réalise l’activité.

Je réalise l’action. Observation de l’adulte :','Prends deux jetons. Mets-en un dans la boîte et laisse l’autre sur la table.','FR — à lire : Prends deux jetons. Mets-en un dans la boîte et laisse l’autre sur la table.

EN — read aloud: Take two counters. Put one in the box and leave the other on the table.

### 模块 2：词汇、分类与日常概念

题目和选项均口头朗读。孩子可以口答或指认成人临时摆出的实物；不要求读选项。

FR : Un jeton dans la boîte et un sur la table.

EN: One counter in the box and one on the table.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。

### 词汇、分类与日常概念：答案','text','Un jeton dans la boîte et un sur la table.','Un jeton dans la boîte et un sur la table.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q08-en-CA','g1-q08','1','en-CA','1. Listen and act','Q08 · 1. Listen and act','Listen to the adult, then do the activity.

I carry out the action. Adult observation:','Take two counters. Put one in the box and leave the other on the table.

### 模块 2：词汇、分类与日常概念

题目和选项均口头朗读。孩子可以口答或指认成人临时摆出的实物；不要求读选项。','FR — à lire : Prends deux jetons. Mets-en un dans la boîte et laisse l’autre sur la table.

EN — read aloud: Take two counters. Put one in the box and leave the other on the table.

### 模块 2：词汇、分类与日常概念

题目和选项均口头朗读。孩子可以口答或指认成人临时摆出的实物；不要求读选项。

FR : Un jeton dans la boîte et un sur la table.

EN: One counter in the box and one on the table.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。

### 词汇、分类与日常概念：答案','text','One counter in the box and one on the table.','One counter in the box and one on the table.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q09-fr-CA','g1-q09','1','fr-CA','2. Mots et idées du quotidien','Q09 · 2. Mots et idées du quotidien','Quel mot ne va pas avec les autres : pomme, banane, chaise, orange ? Pourquoi ?

Réponse orale. L’adulte peut noter mes mots :','Quel mot ne va pas avec les autres : pomme, banane, chaise, orange ? Pourquoi ?','FR — à lire : Quel mot ne va pas avec les autres : pomme, banane, chaise, orange ? Pourquoi ?

EN — read aloud: Which word does not belong: apple, banana, chair, orange? Why?

FR : Chaise : les autres sont des fruits.

EN: Chair: the others are fruits.

评分： 2 分：选 chaise/chair 并说明水果与家具的差别；1 分：只选对；0 分：选择与理由均不成立。','text','Chaise : les autres sont des fruits.','Chaise : les autres sont des fruits.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q09-en-CA','g1-q09','1','en-CA','2. Everyday words and ideas','Q09 · 2. Everyday words and ideas','Which word does not belong: apple, banana, chair, orange? Why?

Oral answer. An adult may record my words:','Which word does not belong: apple, banana, chair, orange? Why?','FR — à lire : Quel mot ne va pas avec les autres : pomme, banane, chaise, orange ? Pourquoi ?

EN — read aloud: Which word does not belong: apple, banana, chair, orange? Why?

FR : Chaise : les autres sont des fruits.

EN: Chair: the others are fruits.

评分： 2 分：选 chaise/chair 并说明水果与家具的差别；1 分：只选对；0 分：选择与理由均不成立。','text','Chair: the others are fruits.','Chair: the others are fruits.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q10-fr-CA','g1-q10','1','fr-CA','2. Mots et idées du quotidien','Q10 · 2. Mots et idées du quotidien','Quel mot veut dire le contraire de « grand » : petit, haut ou long ?

Réponse orale. L’adulte peut noter mes mots :','Quel mot veut dire le contraire de « grand » : petit, haut ou long ?','FR — à lire : Quel mot veut dire le contraire de « grand » : petit, haut ou long ?

EN — read aloud: Which word means the opposite of “big”: small, tall or long?

FR : Petit.

EN: Small.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Petit.','Petit.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q10-en-CA','g1-q10','1','en-CA','2. Everyday words and ideas','Q10 · 2. Everyday words and ideas','Which word means the opposite of “big”: small, tall or long?

Oral answer. An adult may record my words:','Which word means the opposite of “big”: small, tall or long?','FR — à lire : Quel mot veut dire le contraire de « grand » : petit, haut ou long ?

EN — read aloud: Which word means the opposite of “big”: small, tall or long?

FR : Petit.

EN: Small.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Small.','Small.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q11-fr-CA','g1-q11','1','fr-CA','2. Mots et idées du quotidien','Q11 · 2. Mots et idées du quotidien','Le jouet est dans la boîte. Est-il à l’intérieur ou à l’extérieur ?

Réponse orale. L’adulte peut noter mes mots :','Le jouet est dans la boîte. Est-il à l’intérieur ou à l’extérieur ?','FR — à lire : Le jouet est dans la boîte. Est-il à l’intérieur ou à l’extérieur ?

EN — read aloud: The toy is in the box. Is it inside or outside?

FR : À l’intérieur.

EN: Inside.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','À l’intérieur.','À l’intérieur.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q11-en-CA','g1-q11','1','en-CA','2. Everyday words and ideas','Q11 · 2. Everyday words and ideas','The toy is in the box. Is it inside or outside?

Oral answer. An adult may record my words:','The toy is in the box. Is it inside or outside?','FR — à lire : Le jouet est dans la boîte. Est-il à l’intérieur ou à l’extérieur ?

EN — read aloud: The toy is in the box. Is it inside or outside?

FR : À l’intérieur.

EN: Inside.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Inside.','Inside.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q12-fr-CA','g1-q12','1','fr-CA','2. Mots et idées du quotidien','Q12 · 2. Mots et idées du quotidien','À quoi sert un parapluie quand il pleut ?

Réponse orale. L’adulte peut noter mes mots :','À quoi sert un parapluie quand il pleut ?','FR — à lire : À quoi sert un parapluie quand il pleut ?

EN — read aloud: What is an umbrella used for when it rains?

FR : À se protéger de la pluie / à rester au sec.

EN: To keep rain off us / to stay dry.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','À se protéger de la pluie / à rester au sec.','À se protéger de la pluie / à rester au sec.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q12-en-CA','g1-q12','1','en-CA','2. Everyday words and ideas','Q12 · 2. Everyday words and ideas','What is an umbrella used for when it rains?

Oral answer. An adult may record my words:','What is an umbrella used for when it rains?','FR — à lire : À quoi sert un parapluie quand il pleut ?

EN — read aloud: What is an umbrella used for when it rains?

FR : À se protéger de la pluie / à rester au sec.

EN: To keep rain off us / to stay dry.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','To keep rain off us / to stay dry.','To keep rain off us / to stay dry.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q13-fr-CA','g1-q13','1','fr-CA','2. Mots et idées du quotidien','Q13 · 2. Mots et idées du quotidien','Un chat, un chien et un cheval sont-ils des animaux, des vêtements ou des meubles ?

Réponse orale. L’adulte peut noter mes mots :','Un chat, un chien et un cheval sont-ils des animaux, des vêtements ou des meubles ?','FR — à lire : Un chat, un chien et un cheval sont-ils des animaux, des vêtements ou des meubles ?

EN — read aloud: Are a cat, a dog and a horse animals, clothes or furniture?

FR : Des animaux.

EN: Animals.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Des animaux.','Des animaux.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q13-en-CA','g1-q13','1','en-CA','2. Everyday words and ideas','Q13 · 2. Everyday words and ideas','Are a cat, a dog and a horse animals, clothes or furniture?

Oral answer. An adult may record my words:','Are a cat, a dog and a horse animals, clothes or furniture?','FR — à lire : Un chat, un chien et un cheval sont-ils des animaux, des vêtements ou des meubles ?

EN — read aloud: Are a cat, a dog and a horse animals, clothes or furniture?

FR : Des animaux.

EN: Animals.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Animals.','Animals.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q14-fr-CA','g1-q14','1','fr-CA','2. Mots et idées du quotidien','Q14 · 2. Mots et idées du quotidien','Quel mot veut presque dire la même chose que « content » : heureux, triste ou froid ?

Réponse orale. L’adulte peut noter mes mots :','Quel mot veut presque dire la même chose que « content » : heureux, triste ou froid ?','FR — à lire : Quel mot veut presque dire la même chose que « content » : heureux, triste ou froid ?

EN — read aloud: Which word means almost the same as “happy”: glad, sad or cold?

FR : Heureux.

EN: Glad.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Heureux.','Heureux.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q14-en-CA','g1-q14','1','en-CA','2. Everyday words and ideas','Q14 · 2. Everyday words and ideas','Which word means almost the same as “happy”: glad, sad or cold?

Oral answer. An adult may record my words:','Which word means almost the same as “happy”: glad, sad or cold?','FR — à lire : Quel mot veut presque dire la même chose que « content » : heureux, triste ou froid ?

EN — read aloud: Which word means almost the same as “happy”: glad, sad or cold?

FR : Heureux.

EN: Glad.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Glad.','Glad.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q15-fr-CA','g1-q15','1','fr-CA','2. Mots et idées du quotidien','Q15 · 2. Mots et idées du quotidien','Pour mettre tes chaussettes et tes chaussures, que mets-tu d’abord ?

Réponse orale. L’adulte peut noter mes mots :','Pour mettre tes chaussettes et tes chaussures, que mets-tu d’abord ?','FR — à lire : Pour mettre tes chaussettes et tes chaussures, que mets-tu d’abord ?

EN — read aloud: When putting on socks and shoes, which do you put on first?

### 模块 3：语音意识与声音辨别

Q16–Q22 全部口头进行，学生卷不显示词语。FR 和 EN 的词项为独立适配，不能交叉使用。音节按自然口语拍手，不按字母数量。Q22 发音素，不读字母名称：FR /s/、/a/、/k/；EN /s/、/ʌ/、/n/。先分开发音，再让孩子合成。

FR : Les chaussettes.

EN: Socks.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 语音意识与声音辨别：答案','text','Les chaussettes.','Les chaussettes.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q15-en-CA','g1-q15','1','en-CA','2. Everyday words and ideas','Q15 · 2. Everyday words and ideas','When putting on socks and shoes, which do you put on first?

Oral answer. An adult may record my words:','When putting on socks and shoes, which do you put on first?

### 模块 3：语音意识与声音辨别

Q16–Q22 全部口头进行，学生卷不显示词语。FR 和 EN 的词项为独立适配，不能交叉使用。音节按自然口语拍手，不按字母数量。Q22 发音素，不读字母名称：FR /s/、/a/、/k/；EN /s/、/ʌ/、/n/。先分开发音，再让孩子合成。','FR — à lire : Pour mettre tes chaussettes et tes chaussures, que mets-tu d’abord ?

EN — read aloud: When putting on socks and shoes, which do you put on first?

### 模块 3：语音意识与声音辨别

Q16–Q22 全部口头进行，学生卷不显示词语。FR 和 EN 的词项为独立适配，不能交叉使用。音节按自然口语拍手，不按字母数量。Q22 发音素，不读字母名称：FR /s/、/a/、/k/；EN /s/、/ʌ/、/n/。先分开发音，再让孩子合成。

FR : Les chaussettes.

EN: Socks.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 语音意识与声音辨别：答案','text','Socks.','Socks.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q16-fr-CA','g1-q16','1','fr-CA','3. Jouer avec les sons','Q16 · 3. Jouer avec les sons','Écoute l’adulte, puis réalise l’activité.

Réponse orale. L’adulte peut noter mes mots :','Quel mot commence par le même son que « maman » : moto, lapin ou soleil ?','FR — à lire : Quel mot commence par le même son que « maman » : moto, lapin ou soleil ?

EN — read aloud: Which word starts with the same sound as “moon”: mouse, rabbit or sun?

FR : Moto : le premier son est /m/.

EN: Mouse: the first sound is /m/.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Moto : le premier son est /m/.','Moto : le premier son est /m/.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q16-en-CA','g1-q16','1','en-CA','3. Playing with sounds','Q16 · 3. Playing with sounds','Listen to the adult, then do the activity.

Oral answer. An adult may record my words:','Which word starts with the same sound as “moon”: mouse, rabbit or sun?','FR — à lire : Quel mot commence par le même son que « maman » : moto, lapin ou soleil ?

EN — read aloud: Which word starts with the same sound as “moon”: mouse, rabbit or sun?

FR : Moto : le premier son est /m/.

EN: Mouse: the first sound is /m/.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Mouse: the first sound is /m/.','Mouse: the first sound is /m/.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q17-fr-CA','g1-q17','1','fr-CA','3. Jouer avec les sons','Q17 · 3. Jouer avec les sons','Écoute l’adulte, puis réalise l’activité.

Réponse orale. L’adulte peut noter mes mots :','Quel mot rime avec « bateau » : gâteau, pomme ou chat ?','FR — à lire : Quel mot rime avec « bateau » : gâteau, pomme ou chat ?

EN — read aloud: Which word rhymes with “boat”: coat, fish or cat?

FR : Gâteau.

EN: Coat.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Gâteau.','Gâteau.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q17-en-CA','g1-q17','1','en-CA','3. Playing with sounds','Q17 · 3. Playing with sounds','Listen to the adult, then do the activity.

Oral answer. An adult may record my words:','Which word rhymes with “boat”: coat, fish or cat?','FR — à lire : Quel mot rime avec « bateau » : gâteau, pomme ou chat ?

EN — read aloud: Which word rhymes with “boat”: coat, fish or cat?

FR : Gâteau.

EN: Coat.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Coat.','Coat.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q18-fr-CA','g1-q18','1','fr-CA','3. Jouer avec les sons','Q18 · 3. Jouer avec les sons','Écoute l’adulte, puis réalise l’activité.

Je réalise l’action. Observation de l’adulte :','Frappe dans tes mains pour les syllabes de « lapin ». Combien en entends-tu ?','FR — à lire : Frappe dans tes mains pour les syllabes de « lapin ». Combien en entends-tu ?

EN — read aloud: Clap the syllables in “rabbit”. How many do you hear?

FR : Deux : la-pin.

EN: Two: rab-bit.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Deux : la-pin.','Deux : la-pin.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q18-en-CA','g1-q18','1','en-CA','3. Playing with sounds','Q18 · 3. Playing with sounds','Listen to the adult, then do the activity.

I carry out the action. Adult observation:','Clap the syllables in “rabbit”. How many do you hear?','FR — à lire : Frappe dans tes mains pour les syllabes de « lapin ». Combien en entends-tu ?

EN — read aloud: Clap the syllables in “rabbit”. How many do you hear?

FR : Deux : la-pin.

EN: Two: rab-bit.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Two: rab-bit.','Two: rab-bit.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q19-fr-CA','g1-q19','1','fr-CA','3. Jouer avec les sons','Q19 · 3. Jouer avec les sons','Écoute l’adulte, puis réalise l’activité.

Je réalise l’action. Observation de l’adulte :','Frappe les syllabes de « papillon ». Combien en entends-tu ?','FR — à lire : Frappe les syllabes de « papillon ». Combien en entends-tu ?

EN — read aloud: Clap the syllables in “banana”. How many do you hear?

FR : Trois : pa-pi-llon.

EN: Three: ba-na-na.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Trois : pa-pi-llon.','Trois : pa-pi-llon.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q19-en-CA','g1-q19','1','en-CA','3. Playing with sounds','Q19 · 3. Playing with sounds','Listen to the adult, then do the activity.

I carry out the action. Adult observation:','Clap the syllables in “banana”. How many do you hear?','FR — à lire : Frappe les syllabes de « papillon ». Combien en entends-tu ?

EN — read aloud: Clap the syllables in “banana”. How many do you hear?

FR : Trois : pa-pi-llon.

EN: Three: ba-na-na.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Three: ba-na-na.','Three: ba-na-na.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q20-fr-CA','g1-q20','1','fr-CA','3. Jouer avec les sons','Q20 · 3. Jouer avec les sons','Écoute l’adulte, puis réalise l’activité.

Réponse orale. L’adulte peut noter mes mots :','Quel mot commence par le même son que « soleil » : serpent, lapin ou moto ?','FR — à lire : Quel mot commence par le même son que « soleil » : serpent, lapin ou moto ?

EN — read aloud: Which word starts with the same sound as “sun”: snake, rabbit or moon?

FR : Serpent : /s/.

EN: Snake: /s/.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Serpent : /s/.','Serpent : /s/.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q20-en-CA','g1-q20','1','en-CA','3. Playing with sounds','Q20 · 3. Playing with sounds','Listen to the adult, then do the activity.

Oral answer. An adult may record my words:','Which word starts with the same sound as “sun”: snake, rabbit or moon?','FR — à lire : Quel mot commence par le même son que « soleil » : serpent, lapin ou moto ?

EN — read aloud: Which word starts with the same sound as “sun”: snake, rabbit or moon?

FR : Serpent : /s/.

EN: Snake: /s/.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Snake: /s/.','Snake: /s/.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q21-fr-CA','g1-q21','1','fr-CA','3. Jouer avec les sons','Q21 · 3. Jouer avec les sons','Écoute l’adulte, puis réalise l’activité.

Réponse orale. L’adulte peut noter mes mots :','Quel mot commence par le même son que « chat » : chien, table ou vélo ?','FR — à lire : Quel mot commence par le même son que « chat » : chien, table ou vélo ?

EN — read aloud: Which word starts with the same sound as “ship”: sheep, table or bike?

FR : Chien : le son /ʃ/.

EN: Sheep: the sound /ʃ/.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Chien : le son /ʃ/.','Chien : le son /ʃ/.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q21-en-CA','g1-q21','1','en-CA','3. Playing with sounds','Q21 · 3. Playing with sounds','Listen to the adult, then do the activity.

Oral answer. An adult may record my words:','Which word starts with the same sound as “ship”: sheep, table or bike?','FR — à lire : Quel mot commence par le même son que « chat » : chien, table ou vélo ?

EN — read aloud: Which word starts with the same sound as “ship”: sheep, table or bike?

FR : Chien : le son /ʃ/.

EN: Sheep: the sound /ʃ/.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Sheep: the sound /ʃ/.','Sheep: the sound /ʃ/.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q22-fr-CA','g1-q22','1','fr-CA','3. Jouer avec les sons','Q22 · 3. Jouer avec les sons','Écoute l’adulte, puis réalise l’activité.

Réponse orale. L’adulte peut noter mes mots :','Écoute ces sons : /s/ — /a/ — /k/. Quel mot forment-ils ?','FR — à lire : Écoute ces sons : /s/ — /a/ — /k/. Quel mot forment-ils ?

EN — read aloud: Listen to these sounds: /s/ — /ʌ/ — /n/. What word do they make?

### 模块 4：数量、加减与数概念

允许使用筹码。先确认孩子看见全部筹码，不靠颜色或大小区分数量。Q23 摆 5 个；Q30 的 6 个筹码先排紧，再在孩子注视下拉开间距，不添加或拿走。

FR : Sac.

EN: Sun.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 数量、加减与数概念：答案','text','Sac.','Sac.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q22-en-CA','g1-q22','1','en-CA','3. Playing with sounds','Q22 · 3. Playing with sounds','Listen to the adult, then do the activity.

Oral answer. An adult may record my words:','Listen to these sounds: /s/ — /ʌ/ — /n/. What word do they make?

### 模块 4：数量、加减与数概念

允许使用筹码。先确认孩子看见全部筹码，不靠颜色或大小区分数量。Q23 摆 5 个；Q30 的 6 个筹码先排紧，再在孩子注视下拉开间距，不添加或拿走。','FR — à lire : Écoute ces sons : /s/ — /a/ — /k/. Quel mot forment-ils ?

EN — read aloud: Listen to these sounds: /s/ — /ʌ/ — /n/. What word do they make?

### 模块 4：数量、加减与数概念

允许使用筹码。先确认孩子看见全部筹码，不靠颜色或大小区分数量。Q23 摆 5 个；Q30 的 6 个筹码先排紧，再在孩子注视下拉开间距，不添加或拿走。

FR : Sac.

EN: Sun.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 数量、加减与数概念：答案','text','Sun.','Sun.','draft','answer_area_only','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q23-fr-CA','g1-q23','1','fr-CA','4. Compter et raisonner','Q23 · 4. Compter et raisonner','Compte ces jetons. Combien y en a-t-il ?

Réponse orale. L’adulte peut noter mes mots :','Compte ces jetons. Combien y en a-t-il ?','教师操作（不朗读）： 摆出 5 个相同筹码。

FR — à lire : Compte ces jetons. Combien y en a-t-il ?

EN — read aloud: Count these counters. How many are there?

FR : 5.

EN: 5.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','5.','5.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q23-en-CA','g1-q23','1','en-CA','4. Counting and number sense','Q23 · 4. Counting and number sense','Count these counters. How many are there?

Oral answer. An adult may record my words:','Count these counters. How many are there?','教师操作（不朗读）： 摆出 5 个相同筹码。

FR — à lire : Compte ces jetons. Combien y en a-t-il ?

EN — read aloud: Count these counters. How many are there?

FR : 5.

EN: 5.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','5.','5.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q24-fr-CA','g1-q24','1','fr-CA','4. Compter et raisonner','Q24 · 4. Compter et raisonner','Tu as 4 jetons. Je t’en donne encore 3. Combien en as-tu maintenant ?

Réponse / démarche :','Tu as 4 jetons. Je t’en donne encore 3. Combien en as-tu maintenant ?','FR — à lire : Tu as 4 jetons. Je t’en donne encore 3. Combien en as-tu maintenant ?

EN — read aloud: You have 4 counters. I give you 3 more. How many do you have now?

FR : 7 jetons.

EN: 7 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','7 jetons.','7 jetons.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q24-en-CA','g1-q24','1','en-CA','4. Counting and number sense','Q24 · 4. Counting and number sense','You have 4 counters. I give you 3 more. How many do you have now?

Answer / working:','You have 4 counters. I give you 3 more. How many do you have now?','FR — à lire : Tu as 4 jetons. Je t’en donne encore 3. Combien en as-tu maintenant ?

EN — read aloud: You have 4 counters. I give you 3 more. How many do you have now?

FR : 7 jetons.

EN: 7 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','7 counters.','7 counters.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q25-fr-CA','g1-q25','1','fr-CA','4. Compter et raisonner','Q25 · 4. Compter et raisonner','Tu as 8 jetons. Tu en enlèves 2. Combien en reste-t-il ?

Réponse / démarche :','Tu as 8 jetons. Tu en enlèves 2. Combien en reste-t-il ?','FR — à lire : Tu as 8 jetons. Tu en enlèves 2. Combien en reste-t-il ?

EN — read aloud: You have 8 counters. You take away 2. How many are left?

FR : 6 jetons.

EN: 6 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6 jetons.','6 jetons.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q25-en-CA','g1-q25','1','en-CA','4. Counting and number sense','Q25 · 4. Counting and number sense','You have 8 counters. You take away 2. How many are left?

Answer / working:','You have 8 counters. You take away 2. How many are left?','FR — à lire : Tu as 8 jetons. Tu en enlèves 2. Combien en reste-t-il ?

EN — read aloud: You have 8 counters. You take away 2. How many are left?

FR : 6 jetons.

EN: 6 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6 counters.','6 counters.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q26-fr-CA','g1-q26','1','fr-CA','4. Compter et raisonner','Q26 · 4. Compter et raisonner','Quel nombre est le plus grand : 6 ou 9 ?

Réponse / démarche :','Quel nombre est le plus grand : 6 ou 9 ?','FR — à lire : Quel nombre est le plus grand : 6 ou 9 ?

EN — read aloud: Which number is greater: 6 or 9?

FR : 9.

EN: 9.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9.','9.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q26-en-CA','g1-q26','1','en-CA','4. Counting and number sense','Q26 · 4. Counting and number sense','Which number is greater: 6 or 9?

Answer / working:','Which number is greater: 6 or 9?','FR — à lire : Quel nombre est le plus grand : 6 ou 9 ?

EN — read aloud: Which number is greater: 6 or 9?

FR : 9.

EN: 9.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9.','9.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q27-fr-CA','g1-q27','1','fr-CA','4. Compter et raisonner','Q27 · 4. Compter et raisonner','Quel nombre manque : 4, 5, …, 7 ?

Réponse / démarche :','Quel nombre manque : 4, 5, …, 7 ?','FR — à lire : Quel nombre manque : 4, 5, …, 7 ?

EN — read aloud: Which number is missing: 4, 5, …, 7?

FR : 6.

EN: 6.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6.','6.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q27-en-CA','g1-q27','1','en-CA','4. Counting and number sense','Q27 · 4. Counting and number sense','Which number is missing: 4, 5, …, 7?

Answer / working:','Which number is missing: 4, 5, …, 7?','FR — à lire : Quel nombre manque : 4, 5, …, 7 ?

EN — read aloud: Which number is missing: 4, 5, …, 7?

FR : 6.

EN: 6.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6.','6.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q28-fr-CA','g1-q28','1','fr-CA','4. Compter et raisonner','Q28 · 4. Compter et raisonner','Il y a 3 jetons. Tu les enlèves tous. Combien en reste-t-il ?

Réponse / démarche :','Il y a 3 jetons. Tu les enlèves tous. Combien en reste-t-il ?','FR — à lire : Il y a 3 jetons. Tu les enlèves tous. Combien en reste-t-il ?

EN — read aloud: There are 3 counters. You take all of them away. How many are left?

FR : 0 / aucun.

EN: 0 / none.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','0 / aucun.','0 / aucun.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q28-en-CA','g1-q28','1','en-CA','4. Counting and number sense','Q28 · 4. Counting and number sense','There are 3 counters. You take all of them away. How many are left?

Answer / working:','There are 3 counters. You take all of them away. How many are left?','FR — à lire : Il y a 3 jetons. Tu les enlèves tous. Combien en reste-t-il ?

EN — read aloud: There are 3 counters. You take all of them away. How many are left?

FR : 0 / aucun.

EN: 0 / none.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','0 / none.','0 / none.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q29-fr-CA','g1-q29','1','fr-CA','4. Compter et raisonner','Q29 · 4. Compter et raisonner','Il faut 8 jetons en tout. Tu en as déjà 5. Combien en manque-t-il ?

Réponse / démarche :','Il faut 8 jetons en tout. Tu en as déjà 5. Combien en manque-t-il ?','FR — à lire : Il faut 8 jetons en tout. Tu en as déjà 5. Combien en manque-t-il ?

EN — read aloud: You need 8 counters altogether. You already have 5. How many more do you need?

FR : 3 jetons.

EN: 3 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','3 jetons.','3 jetons.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q29-en-CA','g1-q29','1','en-CA','4. Counting and number sense','Q29 · 4. Counting and number sense','You need 8 counters altogether. You already have 5. How many more do you need?

Answer / working:','You need 8 counters altogether. You already have 5. How many more do you need?','FR — à lire : Il faut 8 jetons en tout. Tu en as déjà 5. Combien en manque-t-il ?

EN — read aloud: You need 8 counters altogether. You already have 5. How many more do you need?

FR : 3 jetons.

EN: 3 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','3 counters.','3 counters.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q30-fr-CA','g1-q30','1','fr-CA','4. Compter et raisonner','Q30 · 4. Compter et raisonner','Il y avait 6 jetons. Je les ai seulement écartés. Combien y en a-t-il maintenant ?

Réponse orale. L’adulte peut noter mes mots :','Il y avait 6 jetons. Je les ai seulement écartés. Combien y en a-t-il maintenant ?','教师操作（不朗读）： 在孩子看着时只拉开 6 个筹码的间距。

FR — à lire : Il y avait 6 jetons. Je les ai seulement écartés. Combien y en a-t-il maintenant ?

EN — read aloud: There were 6 counters. I only spread them apart. How many are there now?

### 模块 5：形状、空间与简单规律

从孩子面向纸张的视角确定左右。Q35 使用预先准备的三条纸带，排列顺序打乱；不向孩子读长度。

FR : Toujours 6 : rien n’a été ajouté ni retiré.

EN: Still 6: none were added or taken away.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 形状、空间与简单规律：答案','text','Toujours 6 : rien n’a été ajouté ni retiré.','Toujours 6 : rien n’a été ajouté ni retiré.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q30-en-CA','g1-q30','1','en-CA','4. Counting and number sense','Q30 · 4. Counting and number sense','There were 6 counters. I only spread them apart. How many are there now?

Oral answer. An adult may record my words:','There were 6 counters. I only spread them apart. How many are there now?

### 模块 5：形状、空间与简单规律

从孩子面向纸张的视角确定左右。Q35 使用预先准备的三条纸带，排列顺序打乱；不向孩子读长度。','教师操作（不朗读）： 在孩子看着时只拉开 6 个筹码的间距。

FR — à lire : Il y avait 6 jetons. Je les ai seulement écartés. Combien y en a-t-il maintenant ?

EN — read aloud: There were 6 counters. I only spread them apart. How many are there now?

### 模块 5：形状、空间与简单规律

从孩子面向纸张的视角确定左右。Q35 使用预先准备的三条纸带，排列顺序打乱；不向孩子读长度。

FR : Toujours 6 : rien n’a été ajouté ni retiré.

EN: Still 6: none were added or taken away.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 形状、空间与简单规律：答案','text','Still 6: none were added or taken away.','Still 6: none were added or taken away.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q31-fr-CA','g1-q31','1','fr-CA','5. Formes, espace et suites','Q31 · 5. Formes, espace et suites','Quelle forme a trois côtés : un cercle, un triangle ou un carré ?

Réponse orale. L’adulte peut noter mes mots :','Quelle forme a trois côtés : un cercle, un triangle ou un carré ?','FR — à lire : Quelle forme a trois côtés : un cercle, un triangle ou un carré ?

EN — read aloud: Which shape has three sides: a circle, a triangle or a square?

FR : Un triangle.

EN: A triangle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Un triangle.','Un triangle.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q31-en-CA','g1-q31','1','en-CA','5. Shapes, space and patterns','Q31 · 5. Shapes, space and patterns','Which shape has three sides: a circle, a triangle or a square?

Oral answer. An adult may record my words:','Which shape has three sides: a circle, a triangle or a square?','FR — à lire : Quelle forme a trois côtés : un cercle, un triangle ou un carré ?

EN — read aloud: Which shape has three sides: a circle, a triangle or a square?

FR : Un triangle.

EN: A triangle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','A triangle.','A triangle.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q32-fr-CA','g1-q32','1','fr-CA','5. Formes, espace et suites','Q32 · 5. Formes, espace et suites','Quel objet roule le plus facilement : une balle ou un cube ?

Réponse orale. L’adulte peut noter mes mots :','Quel objet roule le plus facilement : une balle ou un cube ?','FR — à lire : Quel objet roule le plus facilement : une balle ou un cube ?

EN — read aloud: Which object rolls more easily: a ball or a cube?

FR : Une balle.

EN: A ball.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Une balle.','Une balle.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q32-en-CA','g1-q32','1','en-CA','5. Shapes, space and patterns','Q32 · 5. Shapes, space and patterns','Which object rolls more easily: a ball or a cube?

Oral answer. An adult may record my words:','Which object rolls more easily: a ball or a cube?','FR — à lire : Quel objet roule le plus facilement : une balle ou un cube ?

EN — read aloud: Which object rolls more easily: a ball or a cube?

FR : Une balle.

EN: A ball.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','A ball.','A ball.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q33-fr-CA','g1-q33','1','fr-CA','5. Formes, espace et suites','Q33 · 5. Formes, espace et suites','Dessine un grand carré, puis un petit cercle à l’intérieur.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine un grand carré, puis un petit cercle à l’intérieur.','FR — à lire : Dessine un grand carré, puis un petit cercle à l’intérieur.

EN — read aloud: Draw a large square, then a small circle inside it.

FR : Un petit cercle à l’intérieur d’un grand carré.

EN: A small circle inside a large square.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','drawing','Un petit cercle à l’intérieur d’un grand carré.','Un petit cercle à l’intérieur d’un grand carré.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q33-en-CA','g1-q33','1','en-CA','5. Shapes, space and patterns','Q33 · 5. Shapes, space and patterns','Draw a large square, then a small circle inside it.

Drawing: use blank paper and write the question number.','Draw a large square, then a small circle inside it.','FR — à lire : Dessine un grand carré, puis un petit cercle à l’intérieur.

EN — read aloud: Draw a large square, then a small circle inside it.

FR : Un petit cercle à l’intérieur d’un grand carré.

EN: A small circle inside a large square.

评分： 2 分：按顺序独立完成所有动作；1 分：完成其中一项或顺序有误；0 分：未完成相关动作。','drawing','A small circle inside a large square.','A small circle inside a large square.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q34-fr-CA','g1-q34','1','fr-CA','5. Formes, espace et suites','Q34 · 5. Formes, espace et suites','Quel crayon est à gauche du crayon bleu ?

Réponse orale. L’adulte peut noter mes mots :','Quel crayon est à gauche du crayon bleu ?','教师操作（不朗读）： 从孩子视角看，红笔放左、蓝笔放右；其余笔收起。

FR — à lire : Quel crayon est à gauche du crayon bleu ?

EN — read aloud: Which pencil is to the left of the blue pencil?

FR : Le crayon rouge.

EN: The red pencil.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Le crayon rouge.','Le crayon rouge.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q34-en-CA','g1-q34','1','en-CA','5. Shapes, space and patterns','Q34 · 5. Shapes, space and patterns','Which pencil is to the left of the blue pencil?

Oral answer. An adult may record my words:','Which pencil is to the left of the blue pencil?','教师操作（不朗读）： 从孩子视角看，红笔放左、蓝笔放右；其余笔收起。

FR — à lire : Quel crayon est à gauche du crayon bleu ?

EN — read aloud: Which pencil is to the left of the blue pencil?

FR : Le crayon rouge.

EN: The red pencil.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','The red pencil.','The red pencil.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q35-fr-CA','g1-q35','1','fr-CA','5. Formes, espace et suites','Q35 · 5. Formes, espace et suites','Range les trois bandes de papier de la plus courte à la plus longue.

Je réalise l’action. Observation de l’adulte :','Range les trois bandes de papier de la plus courte à la plus longue.','教师操作（不朗读）： A=10 cm、B=4 cm、C=7 cm；三条纸带统一宽度。

FR — à lire : Range les trois bandes de papier de la plus courte à la plus longue.

EN — read aloud: Put the three paper strips in order from shortest to longest.

FR : B, puis C, puis A.

EN: B, then C, then A.

评分： 2 分：B–C–A 全部顺序正确；1 分：最短和最长能辨认但排列未完成；0 分：未能比较。','text','B, puis C, puis A.','B, puis C, puis A.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q35-en-CA','g1-q35','1','en-CA','5. Shapes, space and patterns','Q35 · 5. Shapes, space and patterns','Put the three paper strips in order from shortest to longest.

I carry out the action. Adult observation:','Put the three paper strips in order from shortest to longest.','教师操作（不朗读）： A=10 cm、B=4 cm、C=7 cm；三条纸带统一宽度。

FR — à lire : Range les trois bandes de papier de la plus courte à la plus longue.

EN — read aloud: Put the three paper strips in order from shortest to longest.

FR : B, puis C, puis A.

EN: B, then C, then A.

评分： 2 分：B–C–A 全部顺序正确；1 分：最短和最长能辨认但排列未完成；0 分：未能比较。','text','B, then C, then A.','B, then C, then A.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q36-fr-CA','g1-q36','1','fr-CA','5. Formes, espace et suites','Q36 · 5. Formes, espace et suites','Continue cette suite : cercle, carré, cercle, carré… Quelle forme vient ensuite ?

Dessin : utilise une feuille blanche et écris le numéro de la question.','Continue cette suite : cercle, carré, cercle, carré… Quelle forme vient ensuite ?','FR — à lire : Continue cette suite : cercle, carré, cercle, carré… Quelle forme vient ensuite ?

EN — read aloud: Continue this pattern: circle, square, circle, square… Which shape comes next?

FR : Un cercle.

EN: A circle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','drawing','Un cercle.','Un cercle.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q36-en-CA','g1-q36','1','en-CA','5. Shapes, space and patterns','Q36 · 5. Shapes, space and patterns','Continue this pattern: circle, square, circle, square… Which shape comes next?

Drawing: use blank paper and write the question number.','Continue this pattern: circle, square, circle, square… Which shape comes next?','FR — à lire : Continue cette suite : cercle, carré, cercle, carré… Quelle forme vient ensuite ?

EN — read aloud: Continue this pattern: circle, square, circle, square… Which shape comes next?

FR : Un cercle.

EN: A circle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','drawing','A circle.','A circle.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q37-fr-CA','g1-q37','1','fr-CA','5. Formes, espace et suites','Q37 · 5. Formes, espace et suites','Montre un objet dans la pièce qui ressemble à un rectangle.

Je réalise l’action. Observation de l’adulte :','Montre un objet dans la pièce qui ressemble à un rectangle.','教师操作（不朗读）： 接受从当前视角可合理看作长方形的物品。

FR — à lire : Montre un objet dans la pièce qui ressemble à un rectangle.

EN — read aloud: Point to something in the room that looks like a rectangle.

### 模块 6：听故事与理解事件

每篇短文读两遍后，再按题号问问题。学生卷只出现问题，不出现听力正文。可口答，不要求完整书写。

听力材料 L1：在 Q38 前朗读；适用于 Q38–Q41。所选语言完整读两遍。

Texte à écouter L1

> Mila va au parc avec son papa. Elle prend une balle rouge. Il commence à pleuvoir. Ils rentrent à la maison.

Listening passage L1

> Mila goes to the park with her dad. She takes a red ball. It starts to rain. They go home.

FR : Par exemple : une porte, un livre ou une feuille rectangulaire.

EN: For example: a door, a book or a rectangular sheet of paper.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 听故事与理解事件：答案','text','Par exemple : une porte, un livre ou une feuille rectangulaire.','Par exemple : une porte, un livre ou une feuille rectangulaire.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q37-en-CA','g1-q37','1','en-CA','5. Shapes, space and patterns','Q37 · 5. Shapes, space and patterns','Point to something in the room that looks like a rectangle.

I carry out the action. Adult observation:','Point to something in the room that looks like a rectangle.

### 模块 6：听故事与理解事件

每篇短文读两遍后，再按题号问问题。学生卷只出现问题，不出现听力正文。可口答，不要求完整书写。','教师操作（不朗读）： 接受从当前视角可合理看作长方形的物品。

FR — à lire : Montre un objet dans la pièce qui ressemble à un rectangle.

EN — read aloud: Point to something in the room that looks like a rectangle.

### 模块 6：听故事与理解事件

每篇短文读两遍后，再按题号问问题。学生卷只出现问题，不出现听力正文。可口答，不要求完整书写。

听力材料 L1：在 Q38 前朗读；适用于 Q38–Q41。所选语言完整读两遍。

Texte à écouter L1

> Mila va au parc avec son papa. Elle prend une balle rouge. Il commence à pleuvoir. Ils rentrent à la maison.

Listening passage L1

> Mila goes to the park with her dad. She takes a red ball. It starts to rain. They go home.

FR : Par exemple : une porte, un livre ou une feuille rectangulaire.

EN: For example: a door, a book or a rectangular sheet of paper.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 听故事与理解事件：答案','text','For example: a door, a book or a rectangular sheet of paper.','For example: a door, a book or a rectangular sheet of paper.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q38-fr-CA','g1-q38','1','fr-CA','6. Écouter des histoires','Q38 · 6. Écouter des histoires','Avec qui Mila va-t-elle au parc ?

Réponse orale. L’adulte peut noter mes mots :','Avec qui Mila va-t-elle au parc ?','FR — à lire : Avec qui Mila va-t-elle au parc ?

EN — read aloud: Who goes to the park with Mila?

FR : Avec son papa.

EN: Her dad.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Avec son papa.','Avec son papa.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q38-en-CA','g1-q38','1','en-CA','6. Listening to stories','Q38 · 6. Listening to stories','Who goes to the park with Mila?

Oral answer. An adult may record my words:','Who goes to the park with Mila?','FR — à lire : Avec qui Mila va-t-elle au parc ?

EN — read aloud: Who goes to the park with Mila?

FR : Avec son papa.

EN: Her dad.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Her dad.','Her dad.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q39-fr-CA','g1-q39','1','fr-CA','6. Écouter des histoires','Q39 · 6. Écouter des histoires','De quelle couleur est la balle ?

Réponse orale. L’adulte peut noter mes mots :','De quelle couleur est la balle ?','FR — à lire : De quelle couleur est la balle ?

EN — read aloud: What colour is the ball?

FR : Rouge.

EN: Red.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Rouge.','Rouge.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q39-en-CA','g1-q39','1','en-CA','6. Listening to stories','Q39 · 6. Listening to stories','What colour is the ball?

Oral answer. An adult may record my words:','What colour is the ball?','FR — à lire : De quelle couleur est la balle ?

EN — read aloud: What colour is the ball?

FR : Rouge.

EN: Red.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Red.','Red.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q40-fr-CA','g1-q40','1','fr-CA','6. Écouter des histoires','Q40 · 6. Écouter des histoires','Pourquoi Mila et son papa rentrent-ils à la maison ?

Réponse orale. L’adulte peut noter mes mots :','Pourquoi Mila et son papa rentrent-ils à la maison ?','FR — à lire : Pourquoi Mila et son papa rentrent-ils à la maison ?

EN — read aloud: Why do Mila and her dad go home?

FR : Parce qu’il commence à pleuvoir.

EN: Because it starts to rain.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Parce qu’il commence à pleuvoir.','Parce qu’il commence à pleuvoir.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q40-en-CA','g1-q40','1','en-CA','6. Listening to stories','Q40 · 6. Listening to stories','Why do Mila and her dad go home?

Oral answer. An adult may record my words:','Why do Mila and her dad go home?','FR — à lire : Pourquoi Mila et son papa rentrent-ils à la maison ?

EN — read aloud: Why do Mila and her dad go home?

FR : Parce qu’il commence à pleuvoir.

EN: Because it starts to rain.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Because it starts to rain.','Because it starts to rain.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q41-fr-CA','g1-q41','1','fr-CA','6. Écouter des histoires','Q41 · 6. Écouter des histoires','Que font-ils d’abord : aller au parc ou rentrer à la maison ?

Réponse orale. L’adulte peut noter mes mots :','Que font-ils d’abord : aller au parc ou rentrer à la maison ?','FR — à lire : Que font-ils d’abord : aller au parc ou rentrer à la maison ?

EN — read aloud: What do they do first: go to the park or go home?

听力材料 L2：在 Q42 前朗读；适用于 Q42–Q44。所选语言完整读两遍。

Texte à écouter L2

> Noé construit une tour. La tour tombe. Il essaie encore avec des blocs plus larges en bas. Cette fois, la tour tient.

Listening passage L2

> Noah builds a tower. The tower falls. He tries again with wider blocks at the bottom. This time, the tower stays up.

FR : Aller au parc.

EN: Go to the park.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Aller au parc.','Aller au parc.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q41-en-CA','g1-q41','1','en-CA','6. Listening to stories','Q41 · 6. Listening to stories','What do they do first: go to the park or go home?

Oral answer. An adult may record my words:','What do they do first: go to the park or go home?','FR — à lire : Que font-ils d’abord : aller au parc ou rentrer à la maison ?

EN — read aloud: What do they do first: go to the park or go home?

听力材料 L2：在 Q42 前朗读；适用于 Q42–Q44。所选语言完整读两遍。

Texte à écouter L2

> Noé construit une tour. La tour tombe. Il essaie encore avec des blocs plus larges en bas. Cette fois, la tour tient.

Listening passage L2

> Noah builds a tower. The tower falls. He tries again with wider blocks at the bottom. This time, the tower stays up.

FR : Aller au parc.

EN: Go to the park.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Go to the park.','Go to the park.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q42-fr-CA','g1-q42','1','fr-CA','6. Écouter des histoires','Q42 · 6. Écouter des histoires','Que construit Noé ?

Réponse orale. L’adulte peut noter mes mots :','Que construit Noé ?','FR — à lire : Que construit Noé ?

EN — read aloud: What does Noah build?

FR : Une tour.

EN: A tower.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Une tour.','Une tour.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q42-en-CA','g1-q42','1','en-CA','6. Listening to stories','Q42 · 6. Listening to stories','What does Noah build?

Oral answer. An adult may record my words:','What does Noah build?','FR — à lire : Que construit Noé ?

EN — read aloud: What does Noah build?

FR : Une tour.

EN: A tower.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','A tower.','A tower.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q43-fr-CA','g1-q43','1','fr-CA','6. Écouter des histoires','Q43 · 6. Écouter des histoires','Que se passe-t-il pendant son premier essai ?

Réponse orale. L’adulte peut noter mes mots :','Que se passe-t-il pendant son premier essai ?','FR — à lire : Que se passe-t-il pendant son premier essai ?

EN — read aloud: What happens on his first try?

FR : La tour tombe.

EN: The tower falls.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','La tour tombe.','La tour tombe.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q43-en-CA','g1-q43','1','en-CA','6. Listening to stories','Q43 · 6. Listening to stories','What happens on his first try?

Oral answer. An adult may record my words:','What happens on his first try?','FR — à lire : Que se passe-t-il pendant son premier essai ?

EN — read aloud: What happens on his first try?

FR : La tour tombe.

EN: The tower falls.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','The tower falls.','The tower falls.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q44-fr-CA','g1-q44','1','fr-CA','6. Écouter des histoires','Q44 · 6. Écouter des histoires','Qu’est-ce que Noé change pour que la tour tienne ?

Réponse orale. L’adulte peut noter mes mots :','Qu’est-ce que Noé change pour que la tour tienne ?','FR — à lire : Qu’est-ce que Noé change pour que la tour tienne ?

EN — read aloud: What does Noah change to help the tower stay up?

### 模块 7：表达、探究与合作

可以由成人担任合作伙伴。任务中的合作依据交流与协商观察，不依据外向性或是否快速说话。所有示例答案均可替换为合理的真实表达。

FR : Il met des blocs plus larges en bas.

EN: He puts wider blocks at the bottom.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 表达、探究与合作：答案','text','Il met des blocs plus larges en bas.','Il met des blocs plus larges en bas.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q44-en-CA','g1-q44','1','en-CA','6. Listening to stories','Q44 · 6. Listening to stories','What does Noah change to help the tower stay up?

Oral answer. An adult may record my words:','What does Noah change to help the tower stay up?

### 模块 7：表达、探究与合作

可以由成人担任合作伙伴。任务中的合作依据交流与协商观察，不依据外向性或是否快速说话。所有示例答案均可替换为合理的真实表达。','FR — à lire : Qu’est-ce que Noé change pour que la tour tienne ?

EN — read aloud: What does Noah change to help the tower stay up?

### 模块 7：表达、探究与合作

可以由成人担任合作伙伴。任务中的合作依据交流与协商观察，不依据外向性或是否快速说话。所有示例答案均可替换为合理的真实表达。

FR : Il met des blocs plus larges en bas.

EN: He puts wider blocks at the bottom.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 表达、探究与合作：答案','text','He puts wider blocks at the bottom.','He puts wider blocks at the bottom.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q45-fr-CA','g1-q45','1','fr-CA','7. Parler, chercher et coopérer','Q45 · 7. Parler, chercher et coopérer','Observe cette feuille d’arbre. Dis deux choses que tu remarques.

Réponse orale. L’adulte peut noter mes mots :','Observe cette feuille d’arbre. Dis deux choses que tu remarques.','教师操作（不朗读）： 提供一片真实树叶；正确特征随叶片而变。

FR — à lire : Observe cette feuille d’arbre. Dis deux choses que tu remarques.

EN — read aloud: Look at this leaf. Tell me two things you notice.

FR : Par exemple : elle est verte et son bord est dentelé. Adapter aux faits observés.

EN: For example: it is green and its edge is jagged. Answers must match the actual leaf.

评分： 2 分：说出两个真实、可观察特征；1 分：说出一个；0 分：没有相关观察。','text','Par exemple : elle est verte et son bord est dentelé. Adapter aux faits observés.','Par exemple : elle est verte et son bord est dentelé. Adapter aux faits observés.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q45-en-CA','g1-q45','1','en-CA','7. Speaking, exploring and cooperating','Q45 · 7. Speaking, exploring and cooperating','Look at this leaf. Tell me two things you notice.

Oral answer. An adult may record my words:','Look at this leaf. Tell me two things you notice.','教师操作（不朗读）： 提供一片真实树叶；正确特征随叶片而变。

FR — à lire : Observe cette feuille d’arbre. Dis deux choses que tu remarques.

EN — read aloud: Look at this leaf. Tell me two things you notice.

FR : Par exemple : elle est verte et son bord est dentelé. Adapter aux faits observés.

EN: For example: it is green and its edge is jagged. Answers must match the actual leaf.

评分： 2 分：说出两个真实、可观察特征；1 分：说出一个；0 分：没有相关观察。','text','For example: it is green and its edge is jagged. Answers must match the actual leaf.','For example: it is green and its edge is jagged. Answers must match the actual leaf.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q46-fr-CA','g1-q46','1','fr-CA','7. Parler, chercher et coopérer','Q46 · 7. Parler, chercher et coopérer','Pose une question pour apprendre quelque chose sur les plantes.

Réponse orale. L’adulte peut noter mes mots :','Pose une question pour apprendre quelque chose sur les plantes.','FR — à lire : Pose une question pour apprendre quelque chose sur les plantes.

EN — read aloud: Ask a question to learn something about plants.

FR : Par exemple : de quoi une plante a-t-elle besoin pour pousser ?

EN: For example: what does a plant need to grow?

评分： 2 分：提出清楚、与植物有关的问题；1 分：表达好奇但问题不完整；0 分：没有相关表达。','text','Par exemple : de quoi une plante a-t-elle besoin pour pousser ?','Par exemple : de quoi une plante a-t-elle besoin pour pousser ?','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q46-en-CA','g1-q46','1','en-CA','7. Speaking, exploring and cooperating','Q46 · 7. Speaking, exploring and cooperating','Ask a question to learn something about plants.

Oral answer. An adult may record my words:','Ask a question to learn something about plants.','FR — à lire : Pose une question pour apprendre quelque chose sur les plantes.

EN — read aloud: Ask a question to learn something about plants.

FR : Par exemple : de quoi une plante a-t-elle besoin pour pousser ?

EN: For example: what does a plant need to grow?

评分： 2 分：提出清楚、与植物有关的问题；1 分：表达好奇但问题不完整；0 分：没有相关表达。','text','For example: what does a plant need to grow?','For example: what does a plant need to grow?','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q47-fr-CA','g1-q47','1','fr-CA','7. Parler, chercher et coopérer','Q47 · 7. Parler, chercher et coopérer','Construisez un petit pont ensemble. Avant de commencer, propose une idée et écoute celle de ton partenaire.

Je réalise l’action. Observation de l’adulte :','Construisez un petit pont ensemble. Avant de commencer, propose une idée et écoute celle de ton partenaire.','教师操作（不朗读）： 用积木和成人或同伴合作；成人提供一个不同但可行的建议。

FR — à lire : Construisez un petit pont ensemble. Avant de commencer, propose une idée et écoute celle de ton partenaire.

EN — read aloud: Build a small bridge together. Before you start, suggest an idea and listen to your partner’s idea.

FR : Proposer une idée, écouter une autre idée et participer à une réalisation commune. Le pont n’a pas besoin d’être parfait.

EN: Suggest an idea, listen to another idea and take part in a shared construction. The bridge does not have to be perfect.

评分： 2 分：有表达／示意自己的想法，也有回应同伴；1 分：只表现一项；0 分：没有可观察的相关参与。','text','Proposer une idée, écouter une autre idée et participer à une réalisation commune. Le pont n’a pas besoin d’être parfait.','Proposer une idée, écouter une autre idée et participer à une réalisation commune. Le pont n’a pas besoin d’être parfait.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q47-en-CA','g1-q47','1','en-CA','7. Speaking, exploring and cooperating','Q47 · 7. Speaking, exploring and cooperating','Build a small bridge together. Before you start, suggest an idea and listen to your partner’s idea.

I carry out the action. Adult observation:','Build a small bridge together. Before you start, suggest an idea and listen to your partner’s idea.','教师操作（不朗读）： 用积木和成人或同伴合作；成人提供一个不同但可行的建议。

FR — à lire : Construisez un petit pont ensemble. Avant de commencer, propose une idée et écoute celle de ton partenaire.

EN — read aloud: Build a small bridge together. Before you start, suggest an idea and listen to your partner’s idea.

FR : Proposer une idée, écouter une autre idée et participer à une réalisation commune. Le pont n’a pas besoin d’être parfait.

EN: Suggest an idea, listen to another idea and take part in a shared construction. The bridge does not have to be perfect.

评分： 2 分：有表达／示意自己的想法，也有回应同伴；1 分：只表现一项；0 分：没有可观察的相关参与。','text','Suggest an idea, listen to another idea and take part in a shared construction. The bridge does not have to be perfect.','Suggest an idea, listen to another idea and take part in a shared construction. The bridge does not have to be perfect.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q48-fr-CA','g1-q48','1','fr-CA','7. Parler, chercher et coopérer','Q48 · 7. Parler, chercher et coopérer','Deux enfants veulent le même jouet. Que peuvent-ils faire ?

Réponse orale. L’adulte peut noter mes mots :','Deux enfants veulent le même jouet. Que peuvent-ils faire ?','FR — à lire : Deux enfants veulent le même jouet. Que peuvent-ils faire ?

EN — read aloud: Two children want the same toy. What could they do?

FR : Par exemple : jouer ensemble ou décider de jouer chacun leur tour.

EN: For example: play together or take turns.

评分： 2 分：回答切题，包含所需信息或合理理由；1 分：有关联但不完整；0 分：没有相关回答。','text','Par exemple : jouer ensemble ou décider de jouer chacun leur tour.','Par exemple : jouer ensemble ou décider de jouer chacun leur tour.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q48-en-CA','g1-q48','1','en-CA','7. Speaking, exploring and cooperating','Q48 · 7. Speaking, exploring and cooperating','Two children want the same toy. What could they do?

Oral answer. An adult may record my words:','Two children want the same toy. What could they do?','FR — à lire : Deux enfants veulent le même jouet. Que peuvent-ils faire ?

EN — read aloud: Two children want the same toy. What could they do?

FR : Par exemple : jouer ensemble ou décider de jouer chacun leur tour.

EN: For example: play together or take turns.

评分： 2 分：回答切题，包含所需信息或合理理由；1 分：有关联但不完整；0 分：没有相关回答。','text','For example: play together or take turns.','For example: play together or take turns.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q49-fr-CA','g1-q49','1','fr-CA','7. Parler, chercher et coopérer','Q49 · 7. Parler, chercher et coopérer','Ton puzzle est difficile. Que peux-tu essayer avant d’abandonner ?

Réponse orale. L’adulte peut noter mes mots :','Ton puzzle est difficile. Que peux-tu essayer avant d’abandonner ?','FR — à lire : Ton puzzle est difficile. Que peux-tu essayer avant d’abandonner ?

EN — read aloud: Your puzzle is difficult. What could you try before giving up?

FR : Par exemple : chercher les coins, tourner une pièce ou demander un petit indice.

EN: For example: look for corners, turn a piece or ask for a small hint.

评分： 2 分：回答切题，包含所需信息或合理理由；1 分：有关联但不完整；0 分：没有相关回答。','text','Par exemple : chercher les coins, tourner une pièce ou demander un petit indice.','Par exemple : chercher les coins, tourner une pièce ou demander un petit indice.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q49-en-CA','g1-q49','1','en-CA','7. Speaking, exploring and cooperating','Q49 · 7. Speaking, exploring and cooperating','Your puzzle is difficult. What could you try before giving up?

Oral answer. An adult may record my words:','Your puzzle is difficult. What could you try before giving up?','FR — à lire : Ton puzzle est difficile. Que peux-tu essayer avant d’abandonner ?

EN — read aloud: Your puzzle is difficult. What could you try before giving up?

FR : Par exemple : chercher les coins, tourner une pièce ou demander un petit indice.

EN: For example: look for corners, turn a piece or ask for a small hint.

评分： 2 分：回答切题，包含所需信息或合理理由；1 分：有关联但不完整；0 分：没有相关回答。','text','For example: look for corners, turn a piece or ask for a small hint.','For example: look for corners, turn a piece or ask for a small hint.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q50-fr-CA','g1-q50','1','fr-CA','7. Parler, chercher et coopérer','Q50 · 7. Parler, chercher et coopérer','Choisis une activité que tu viens de faire. Dis ce qui était facile ou difficile et une chose que tu pourrais essayer la prochaine fois.

Réponse orale. L’adulte peut noter mes mots :','Choisis une activité que tu viens de faire. Dis ce qui était facile ou difficile et une chose que tu pourrais essayer la prochaine fois.','FR — à lire : Choisis une activité que tu viens de faire. Dis ce qui était facile ou difficile et une chose que tu pourrais essayer la prochaine fois.

EN — read aloud: Choose an activity you just did. Say what was easy or difficult and one thing you could try next time.

FR : Une observation personnelle et une idée d’amélioration, par exemple : la tour tombait; je mettrai de gros blocs en bas.

EN: A personal observation and an improvement idea, such as: the tower fell; next time I will put big blocks at the bottom.

评分： 2 分：描述一个经历并提出下次做法；1 分：只描述经历或只提出做法；0 分：没有相关回答。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 听懂并执行指令 |  |  |  |  |
| 词汇、分类与日常概念 |  |  |  |  |
| 语音意识与声音辨别 |  |  |  |  |
| 数量、加减与数概念 |  |  |  |  |
| 形状、空间与简单规律 |  |  |  |  |
| 听故事与理解事件 |  |  |  |  |
| 表达、探究与合作 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','Une observation personnelle et une idée d’amélioration, par exemple : la tour tombait; je mettrai de gros blocs en bas.','Une observation personnelle et une idée d’amélioration, par exemple : la tour tombait; je mettrai de gros blocs en bas.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g1-q50-en-CA','g1-q50','1','en-CA','7. Speaking, exploring and cooperating','Q50 · 7. Speaking, exploring and cooperating','Choose an activity you just did. Say what was easy or difficult and one thing you could try next time.

Oral answer. An adult may record my words:','Choose an activity you just did. Say what was easy or difficult and one thing you could try next time.','FR — à lire : Choisis une activité que tu viens de faire. Dis ce qui était facile ou difficile et une chose que tu pourrais essayer la prochaine fois.

EN — read aloud: Choose an activity you just did. Say what was easy or difficult and one thing you could try next time.

FR : Une observation personnelle et une idée d’amélioration, par exemple : la tour tombait; je mettrai de gros blocs en bas.

EN: A personal observation and an improvement idea, such as: the tower fell; next time I will put big blocks at the bottom.

评分： 2 分：描述一个经历并提出下次做法；1 分：只描述经历或只提出做法；0 分：没有相关回答。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 听懂并执行指令 |  |  |  |  |
| 词汇、分类与日常概念 |  |  |  |  |
| 语音意识与声音辨别 |  |  |  |  |
| 数量、加减与数概念 |  |  |  |  |
| 形状、空间与简单规律 |  |  |  |  |
| 听故事与理解事件 |  |  |  |  |
| 表达、探究与合作 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','A personal observation and an improvement idea, such as: the tower fell; next time I will put big blocks at the bottom.','A personal observation and an improvement idea, such as: the tower fell; next time I will put big blocks at the bottom.','draft','full','小学一年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q01-fr-CA','g2-q01','2','fr-CA','1. Écouter et comprendre','Q01 · 1. Écouter et comprendre','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine un cercle, puis un triangle en dessous du cercle.','FR — à lire : Dessine un cercle, puis un triangle en dessous du cercle.

EN — read aloud: Draw a circle, then a triangle below the circle.

FR : Un cercle avec un triangle en dessous.

EN: A circle with a triangle below it.

评分： 2 分：所有要求均正确完成；1 分：完成部分要求；0 分：没有相关完成结果。','drawing','Un cercle avec un triangle en dessous.','Un cercle avec un triangle en dessous.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q01-en-CA','g2-q01','2','en-CA','1. Listening and following instructions','Q01 · 1. Listening and following instructions','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','Draw a circle, then a triangle below the circle.','FR — à lire : Dessine un cercle, puis un triangle en dessous du cercle.

EN — read aloud: Draw a circle, then a triangle below the circle.

FR : Un cercle avec un triangle en dessous.

EN: A circle with a triangle below it.

评分： 2 分：所有要求均正确完成；1 分：完成部分要求；0 分：没有相关完成结果。','drawing','A circle with a triangle below it.','A circle with a triangle below it.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q02-fr-CA','g2-q02','2','fr-CA','1. Écouter et comprendre','Q02 · 1. Écouter et comprendre','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Écris le nombre qui vient juste après dix-neuf.','FR — à lire : Écris le nombre qui vient juste après dix-neuf.

EN — read aloud: Write the number that comes immediately after nineteen.

FR : 20.

EN: 20.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','20.','20.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q02-en-CA','g2-q02','2','en-CA','1. Listening and following instructions','Q02 · 1. Listening and following instructions','Listen to the adult, then do the activity.

Answer / working:','Write the number that comes immediately after nineteen.','FR — à lire : Écris le nombre qui vient juste après dix-neuf.

EN — read aloud: Write the number that comes immediately after nineteen.

FR : 20.

EN: 20.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','20.','20.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q03-fr-CA','g2-q03','2','fr-CA','1. Écouter et comprendre','Q03 · 1. Écouter et comprendre','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Écris ton prénom, puis souligne-le.','FR — à lire : Écris ton prénom, puis souligne-le.

EN — read aloud: Write your first name, then underline it.

FR : Le prénom de l’élève, souligné.

EN: The student’s first name, underlined.

评分： 2 分：所有要求均正确完成；1 分：完成部分要求；0 分：没有相关完成结果。','text','Le prénom de l’élève, souligné.','Le prénom de l’élève, souligné.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q03-en-CA','g2-q03','2','en-CA','1. Listening and following instructions','Q03 · 1. Listening and following instructions','Listen to the adult, then do the activity.

Answer / working:','Write your first name, then underline it.','FR — à lire : Écris ton prénom, puis souligne-le.

EN — read aloud: Write your first name, then underline it.

FR : Le prénom de l’élève, souligné.

EN: The student’s first name, underlined.

评分： 2 分：所有要求均正确完成；1 分：完成部分要求；0 分：没有相关完成结果。','text','The student’s first name, underlined.','The student’s first name, underlined.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q04-fr-CA','g2-q04','2','fr-CA','1. Écouter et comprendre','Q04 · 1. Écouter et comprendre','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine deux cercles. Écris le chiffre 3 dans chacun.','FR — à lire : Dessine deux cercles. Écris le chiffre 3 dans chacun.

EN — read aloud: Draw two circles. Write the numeral 3 inside each one.

FR : Deux cercles contenant chacun le chiffre 3.

EN: Two circles, each containing the numeral 3.

评分： 2 分：所有要求均正确完成；1 分：完成部分要求；0 分：没有相关完成结果。','drawing','Deux cercles contenant chacun le chiffre 3.','Deux cercles contenant chacun le chiffre 3.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q04-en-CA','g2-q04','2','en-CA','1. Listening and following instructions','Q04 · 1. Listening and following instructions','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','Draw two circles. Write the numeral 3 inside each one.','FR — à lire : Dessine deux cercles. Écris le chiffre 3 dans chacun.

EN — read aloud: Draw two circles. Write the numeral 3 inside each one.

FR : Deux cercles contenant chacun le chiffre 3.

EN: Two circles, each containing the numeral 3.

评分： 2 分：所有要求均正确完成；1 分：完成部分要求；0 分：没有相关完成结果。','drawing','Two circles, each containing the numeral 3.','Two circles, each containing the numeral 3.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q05-fr-CA','g2-q05','2','fr-CA','1. Écouter et comprendre','Q05 · 1. Écouter et comprendre','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Écoute ces trois nombres : 3, 8, 2. Quel nombre as-tu entendu au milieu ?','FR — à lire : Écoute ces trois nombres : 3, 8, 2. Quel nombre as-tu entendu au milieu ?

EN — read aloud: Listen to these three numbers: 3, 8, 2. Which number did you hear in the middle?

听力材料 L1：在 Q06 前朗读；适用于 Q06–Q08。所选语言完整读两遍。

Texte à écouter L1

> Après l’école, Adam range ses bottes dans l’entrée. Il prend une pomme, puis il fait un dessin à la table. Il cherche son crayon bleu dans son sac.

Listening passage L1

> After school, Adam puts his boots in the entrance hall. He takes an apple, then draws a picture at the table. He looks in his bag for his blue pencil.

FR : 8.

EN: 8.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','8.','8.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q05-en-CA','g2-q05','2','en-CA','1. Listening and following instructions','Q05 · 1. Listening and following instructions','Listen to the adult, then do the activity.

Answer / working:','Listen to these three numbers: 3, 8, 2. Which number did you hear in the middle?','FR — à lire : Écoute ces trois nombres : 3, 8, 2. Quel nombre as-tu entendu au milieu ?

EN — read aloud: Listen to these three numbers: 3, 8, 2. Which number did you hear in the middle?

听力材料 L1：在 Q06 前朗读；适用于 Q06–Q08。所选语言完整读两遍。

Texte à écouter L1

> Après l’école, Adam range ses bottes dans l’entrée. Il prend une pomme, puis il fait un dessin à la table. Il cherche son crayon bleu dans son sac.

Listening passage L1

> After school, Adam puts his boots in the entrance hall. He takes an apple, then draws a picture at the table. He looks in his bag for his blue pencil.

FR : 8.

EN: 8.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','8.','8.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q06-fr-CA','g2-q06','2','fr-CA','1. Écouter et comprendre','Q06 · 1. Écouter et comprendre','Où Adam range-t-il ses bottes ?

Réponse / démarche :','Où Adam range-t-il ses bottes ?','FR — à lire : Où Adam range-t-il ses bottes ?

EN — read aloud: Where does Adam put his boots?

FR : Dans l’entrée.

EN: In the entrance hall.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Dans l’entrée.','Dans l’entrée.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q06-en-CA','g2-q06','2','en-CA','1. Listening and following instructions','Q06 · 1. Listening and following instructions','Where does Adam put his boots?

Answer / working:','Where does Adam put his boots?','FR — à lire : Où Adam range-t-il ses bottes ?

EN — read aloud: Where does Adam put his boots?

FR : Dans l’entrée.

EN: In the entrance hall.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','In the entrance hall.','In the entrance hall.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q07-fr-CA','g2-q07','2','fr-CA','1. Écouter et comprendre','Q07 · 1. Écouter et comprendre','Quel aliment Adam prend-il ?

Réponse / démarche :','Quel aliment Adam prend-il ?','FR — à lire : Quel aliment Adam prend-il ?

EN — read aloud: What food does Adam take?

FR : Une pomme.

EN: An apple.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Une pomme.','Une pomme.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q07-en-CA','g2-q07','2','en-CA','1. Listening and following instructions','Q07 · 1. Listening and following instructions','What food does Adam take?

Answer / working:','What food does Adam take?','FR — à lire : Quel aliment Adam prend-il ?

EN — read aloud: What food does Adam take?

FR : Une pomme.

EN: An apple.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','An apple.','An apple.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q08-fr-CA','g2-q08','2','fr-CA','1. Écouter et comprendre','Q08 · 1. Écouter et comprendre','Que fait Adam après avoir pris la pomme ?

Réponse / démarche :','Que fait Adam après avoir pris la pomme ?','FR — à lire : Que fait Adam après avoir pris la pomme ?

EN — read aloud: What does Adam do after taking the apple?

### 模块 2：独立阅读与短文理解

本模块由学生独立阅读。只读组织指令，不代读正文或问题。FR/EN 阅读内容分别放在相应学生卷。

FR : Il fait un dessin.

EN: He draws a picture.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 独立阅读与短文理解：答案','text','Il fait un dessin.','Il fait un dessin.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q08-en-CA','g2-q08','2','en-CA','1. Listening and following instructions','Q08 · 1. Listening and following instructions','What does Adam do after taking the apple?

Answer / working:','What does Adam do after taking the apple?

### 模块 2：独立阅读与短文理解

本模块由学生独立阅读。只读组织指令，不代读正文或问题。FR/EN 阅读内容分别放在相应学生卷。','FR — à lire : Que fait Adam après avoir pris la pomme ?

EN — read aloud: What does Adam do after taking the apple?

### 模块 2：独立阅读与短文理解

本模块由学生独立阅读。只读组织指令，不代读正文或问题。FR/EN 阅读内容分别放在相应学生卷。

FR : Il fait un dessin.

EN: He draws a picture.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 独立阅读与短文理解：答案','text','He draws a picture.','He draws a picture.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q09-fr-CA','g2-q09','2','fr-CA','2. Lire de courts textes','Q09 · 2. Lire de courts textes','Dans R1, où Lina va-t-elle ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q09.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : À la bibliothèque.

EN: To the library.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','À la bibliothèque.','À la bibliothèque.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q09-en-CA','g2-q09','2','en-CA','2. Reading short texts','Q09 · 2. Reading short texts','In R1, where does Lina go?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q09.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q09.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : À la bibliothèque.

EN: To the library.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','To the library.','To the library.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q10-fr-CA','g2-q10','2','fr-CA','2. Lire de courts textes','Q10 · 2. Lire de courts textes','Dans R1, combien de livres Lina choisit-elle ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q10.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Deux livres.

EN: Two books.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Deux livres.','Deux livres.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q10-en-CA','g2-q10','2','en-CA','2. Reading short texts','Q10 · 2. Reading short texts','In R1, how many books does Lina choose?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q10.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q10.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Deux livres.

EN: Two books.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Two books.','Two books.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q11-fr-CA','g2-q11','2','fr-CA','2. Lire de courts textes','Q11 · 2. Lire de courts textes','Dans R1, quel livre Lina lit-elle à son frère ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q11.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Le livre sur les chats.

EN: The book about cats.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Le livre sur les chats.','Le livre sur les chats.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q11-en-CA','g2-q11','2','en-CA','2. Reading short texts','Q11 · 2. Reading short texts','In R1, which book does Lina read to her brother?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q11.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q11.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Le livre sur les chats.

EN: The book about cats.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','The book about cats.','The book about cats.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q12-fr-CA','g2-q12','2','fr-CA','2. Lire de courts textes','Q12 · 2. Lire de courts textes','Dans R1, quel est le sujet de l’autre livre ?

Réponse / démarche : 

Texte à lire R2

> Dans la cour, Tom trouve un gant près du banc. Il le montre à l’adulte de surveillance. Ensemble, ils le déposent dans la boîte des objets perdus.','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q12.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Les arbres.

EN: Trees.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Les arbres.','Les arbres.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q12-en-CA','g2-q12','2','en-CA','2. Reading short texts','Q12 · 2. Reading short texts','In R1, what is the other book about?

Answer / working: 

Reading passage R2

> In the schoolyard, Tom finds a glove near the bench. He shows it to the supervising adult. Together, they put it in the lost-and-found box.','Read the passage or instruction on your sheet by yourself, then answer question Q12.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q12.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Les arbres.

EN: Trees.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Trees.','Trees.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q13-fr-CA','g2-q13','2','fr-CA','2. Lire de courts textes','Q13 · 2. Lire de courts textes','Dans R2, quel objet Tom trouve-t-il ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q13.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Un gant.

EN: A glove.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Un gant.','Un gant.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q13-en-CA','g2-q13','2','en-CA','2. Reading short texts','Q13 · 2. Reading short texts','In R2, what does Tom find?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q13.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q13.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Un gant.

EN: A glove.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','A glove.','A glove.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q14-fr-CA','g2-q14','2','fr-CA','2. Lire de courts textes','Q14 · 2. Lire de courts textes','Dans R2, où se trouve le gant au début ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q14.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Près du banc, dans la cour.

EN: Near the bench in the schoolyard.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Près du banc, dans la cour.','Près du banc, dans la cour.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q14-en-CA','g2-q14','2','en-CA','2. Reading short texts','Q14 · 2. Reading short texts','In R2, where is the glove at the beginning?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q14.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q14.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Près du banc, dans la cour.

EN: Near the bench in the schoolyard.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Near the bench in the schoolyard.','Near the bench in the schoolyard.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q15-fr-CA','g2-q15','2','fr-CA','2. Lire de courts textes','Q15 · 2. Lire de courts textes','Dans R2, pourquoi mettre le gant dans la boîte des objets perdus ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q15.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

### 模块 3：词汇、语音与基础句子

可以朗读一般指令，但不提示正确词形。Q16 法语考常见阴性冠词，英语考 a/an，按各自语法适配。Q22 词项需口读，学生卷只显示作答提示。

FR : Pour que son propriétaire puisse le retrouver. Une idée équivalente est acceptée.

EN: So its owner can find it. An equivalent idea is accepted.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 词汇、语音与基础句子：答案','text','Pour que son propriétaire puisse le retrouver. Une idée équivalente est acceptée.','Pour que son propriétaire puisse le retrouver. Une idée équivalente est acceptée.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q15-en-CA','g2-q15','2','en-CA','2. Reading short texts','Q15 · 2. Reading short texts','In R2, why put the glove in the lost-and-found box?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q15.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q15.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

### 模块 3：词汇、语音与基础句子

可以朗读一般指令，但不提示正确词形。Q16 法语考常见阴性冠词，英语考 a/an，按各自语法适配。Q22 词项需口读，学生卷只显示作答提示。

FR : Pour que son propriétaire puisse le retrouver. Une idée équivalente est acceptée.

EN: So its owner can find it. An equivalent idea is accepted.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 词汇、语音与基础句子：答案','text','So its owner can find it. An equivalent idea is accepted.','So its owner can find it. An equivalent idea is accepted.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q16-fr-CA','g2-q16','2','fr-CA','3. Mots, sons et phrases','Q16 · 3. Mots, sons et phrases','Complète avec « un » ou « une » :  pomme.

Réponse / démarche :','Complète avec « un » ou « une » :  pomme.','FR — à lire : Complète avec « un » ou « une » :  pomme.

EN — read aloud: Complete with “a” or “an”:  apple.

FR : Une pomme.

EN: An apple.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Une pomme.','Une pomme.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q16-en-CA','g2-q16','2','en-CA','3. Words, sounds and sentences','Q16 · 3. Words, sounds and sentences','Complete with “a” or “an”:  apple.

Answer / working:','Complete with “a” or “an”:  apple.','FR — à lire : Complète avec « un » ou « une » :  pomme.

EN — read aloud: Complete with “a” or “an”:  apple.

FR : Une pomme.

EN: An apple.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','An apple.','An apple.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q17-fr-CA','g2-q17','2','fr-CA','3. Mots, sons et phrases','Q17 · 3. Mots, sons et phrases','Réécris correctement en ajoutant la majuscule et le point : lina joue au parc

Réponse / démarche :','Réécris correctement en ajoutant la majuscule et le point : lina joue au parc','FR — à lire : Réécris correctement en ajoutant la majuscule et le point : lina joue au parc

EN — read aloud: Rewrite with a capital letter and a full stop: lina plays in the park

FR : Lina joue au parc.

EN: Lina plays in the park.

评分： 2 分：句首大写和句号均正确；1 分：只完成一项；0 分：两项均未完成。','text','Lina joue au parc.','Lina joue au parc.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q17-en-CA','g2-q17','2','en-CA','3. Words, sounds and sentences','Q17 · 3. Words, sounds and sentences','Rewrite with a capital letter and a full stop: lina plays in the park

Answer / working:','Rewrite with a capital letter and a full stop: lina plays in the park','FR — à lire : Réécris correctement en ajoutant la majuscule et le point : lina joue au parc

EN — read aloud: Rewrite with a capital letter and a full stop: lina plays in the park

FR : Lina joue au parc.

EN: Lina plays in the park.

评分： 2 分：句首大写和句号均正确；1 分：只完成一项；0 分：两项均未完成。','text','Lina plays in the park.','Lina plays in the park.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q18-fr-CA','g2-q18','2','fr-CA','3. Mots, sons et phrases','Q18 · 3. Mots, sons et phrases','Écris au pluriel : un chat.

Réponse / démarche :','Écris au pluriel : un chat.','FR — à lire : Écris au pluriel : un chat.

EN — read aloud: Write the plural of: a cat.

FR : Des chats. « Les chats » est aussi accepté.

EN: Cats. “Some cats” or “the cats” is also accepted.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Des chats. « Les chats » est aussi accepté.','Des chats. « Les chats » est aussi accepté.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q18-en-CA','g2-q18','2','en-CA','3. Words, sounds and sentences','Q18 · 3. Words, sounds and sentences','Write the plural of: a cat.

Answer / working:','Write the plural of: a cat.','FR — à lire : Écris au pluriel : un chat.

EN — read aloud: Write the plural of: a cat.

FR : Des chats. « Les chats » est aussi accepté.

EN: Cats. “Some cats” or “the cats” is also accepted.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Cats. “Some cats” or “the cats” is also accepted.','Cats. “Some cats” or “the cats” is also accepted.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q19-fr-CA','g2-q19','2','fr-CA','3. Mots, sons et phrases','Q19 · 3. Mots, sons et phrases','Choisis : Les oiseaux (vole / volent).

Réponse / démarche :','Choisis : Les oiseaux (vole / volent).','FR — à lire : Choisis : Les oiseaux (vole / volent).

EN — read aloud: Choose: The birds (flies / fly).

FR : Les oiseaux volent.

EN: The birds fly.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Les oiseaux volent.','Les oiseaux volent.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q19-en-CA','g2-q19','2','en-CA','3. Words, sounds and sentences','Q19 · 3. Words, sounds and sentences','Choose: The birds (flies / fly).

Answer / working:','Choose: The birds (flies / fly).','FR — à lire : Choisis : Les oiseaux (vole / volent).

EN — read aloud: Choose: The birds (flies / fly).

FR : Les oiseaux volent.

EN: The birds fly.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','The birds fly.','The birds fly.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q20-fr-CA','g2-q20','2','fr-CA','3. Mots, sons et phrases','Q20 · 3. Mots, sons et phrases','Quel est le contraire de « lent » : rapide, lourd ou doux ?

Réponse / démarche :','Quel est le contraire de « lent » : rapide, lourd ou doux ?','FR — à lire : Quel est le contraire de « lent » : rapide, lourd ou doux ?

EN — read aloud: What is the opposite of “slow”: fast, heavy or soft?

FR : Rapide.

EN: Fast.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Rapide.','Rapide.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q20-en-CA','g2-q20','2','en-CA','3. Words, sounds and sentences','Q20 · 3. Words, sounds and sentences','What is the opposite of “slow”: fast, heavy or soft?

Answer / working:','What is the opposite of “slow”: fast, heavy or soft?','FR — à lire : Quel est le contraire de « lent » : rapide, lourd ou doux ?

EN — read aloud: What is the opposite of “slow”: fast, heavy or soft?

FR : Rapide.

EN: Fast.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Fast.','Fast.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q21-fr-CA','g2-q21','2','fr-CA','3. Mots, sons et phrases','Q21 · 3. Mots, sons et phrases','Remets les mots en ordre : au / ballon / Sami / joue.

Réponse / démarche :','Remets les mots en ordre : au / ballon / Sami / joue.','FR — à lire : Remets les mots en ordre : au / ballon / Sami / joue.

EN — read aloud: Put the words in order: plays / ball / Sami / with / a.

FR : Sami joue au ballon.

EN: Sami plays with a ball.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Sami joue au ballon.','Sami joue au ballon.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q21-en-CA','g2-q21','2','en-CA','3. Words, sounds and sentences','Q21 · 3. Words, sounds and sentences','Put the words in order: plays / ball / Sami / with / a.

Answer / working:','Put the words in order: plays / ball / Sami / with / a.','FR — à lire : Remets les mots en ordre : au / ballon / Sami / joue.

EN — read aloud: Put the words in order: plays / ball / Sami / with / a.

FR : Sami joue au ballon.

EN: Sami plays with a ball.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Sami plays with a ball.','Sami plays with a ball.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q22-fr-CA','g2-q22','2','fr-CA','3. Mots, sons et phrases','Q22 · 3. Mots, sons et phrases','Écoute l’adulte, puis réalise l’activité.

Réponse orale. L’adulte peut noter mes mots :','Quel mot rime avec « poule » : boule ou cheval ?','FR — à lire : Quel mot rime avec « poule » : boule ou cheval ?

EN — read aloud: Which word rhymes with “cake”: lake or dog?

### 模块 4：数与计算

允许写算式或画图。没有学习过某种算法的孩子可以使用筹码或拆分数的方法；记录使用的方法。

FR : Boule.

EN: Lake.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 数与计算：答案','text','Boule.','Boule.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q22-en-CA','g2-q22','2','en-CA','3. Words, sounds and sentences','Q22 · 3. Words, sounds and sentences','Listen to the adult, then do the activity.

Oral answer. An adult may record my words:','Which word rhymes with “cake”: lake or dog?

### 模块 4：数与计算

允许写算式或画图。没有学习过某种算法的孩子可以使用筹码或拆分数的方法；记录使用的方法。','FR — à lire : Quel mot rime avec « poule » : boule ou cheval ?

EN — read aloud: Which word rhymes with “cake”: lake or dog?

### 模块 4：数与计算

允许写算式或画图。没有学习过某种算法的孩子可以使用筹码或拆分数的方法；记录使用的方法。

FR : Boule.

EN: Lake.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 数与计算：答案','text','Lake.','Lake.','draft','answer_area_only','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q23-fr-CA','g2-q23','2','fr-CA','4. Nombres et calculs','Q23 · 4. Nombres et calculs','Calcule : 23 + 14.

Réponse / démarche :','Calcule : 23 + 14.','FR — à lire : Calcule : 23 + 14.

EN — read aloud: Calculate: 23 + 14.

FR : 37.

EN: 37.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','37.','37.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q23-en-CA','g2-q23','2','en-CA','4. Numbers and calculations','Q23 · 4. Numbers and calculations','Calculate: 23 + 14.

Answer / working:','Calculate: 23 + 14.','FR — à lire : Calcule : 23 + 14.

EN — read aloud: Calculate: 23 + 14.

FR : 37.

EN: 37.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','37.','37.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q24-fr-CA','g2-q24','2','fr-CA','4. Nombres et calculs','Q24 · 4. Nombres et calculs','Calcule : 56 − 23.

Réponse / démarche :','Calcule : 56 − 23.','FR — à lire : Calcule : 56 − 23.

EN — read aloud: Calculate: 56 − 23.

FR : 33.

EN: 33.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','33.','33.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q24-en-CA','g2-q24','2','en-CA','4. Numbers and calculations','Q24 · 4. Numbers and calculations','Calculate: 56 − 23.

Answer / working:','Calculate: 56 − 23.','FR — à lire : Calcule : 56 − 23.

EN — read aloud: Calculate: 56 − 23.

FR : 33.

EN: 33.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','33.','33.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q25-fr-CA','g2-q25','2','fr-CA','4. Nombres et calculs','Q25 · 4. Nombres et calculs','Calcule : 9 + 8.

Réponse / démarche :','Calcule : 9 + 8.','FR — à lire : Calcule : 9 + 8.

EN — read aloud: Calculate: 9 + 8.

FR : 17.

EN: 17.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','17.','17.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q25-en-CA','g2-q25','2','en-CA','4. Numbers and calculations','Q25 · 4. Numbers and calculations','Calculate: 9 + 8.

Answer / working:','Calculate: 9 + 8.','FR — à lire : Calcule : 9 + 8.

EN — read aloud: Calculate: 9 + 8.

FR : 17.

EN: 17.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','17.','17.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q26-fr-CA','g2-q26','2','fr-CA','4. Nombres et calculs','Q26 · 4. Nombres et calculs','Calcule : 30 − 7.

Réponse / démarche :','Calcule : 30 − 7.','FR — à lire : Calcule : 30 − 7.

EN — read aloud: Calculate: 30 − 7.

FR : 23.

EN: 23.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','23.','23.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q26-en-CA','g2-q26','2','en-CA','4. Numbers and calculations','Q26 · 4. Numbers and calculations','Calculate: 30 − 7.

Answer / working:','Calculate: 30 − 7.','FR — à lire : Calcule : 30 − 7.

EN — read aloud: Calculate: 30 − 7.

FR : 23.

EN: 23.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','23.','23.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q27-fr-CA','g2-q27','2','fr-CA','4. Nombres et calculs','Q27 · 4. Nombres et calculs','Complète : 11 +  = 20.

Réponse / démarche :','Complète : 11 +  = 20.','FR — à lire : Complète : 11 +  = 20.

EN — read aloud: Complete: 11 +  = 20.

FR : 9.

EN: 9.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9.','9.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q27-en-CA','g2-q27','2','en-CA','4. Numbers and calculations','Q27 · 4. Numbers and calculations','Complete: 11 +  = 20.

Answer / working:','Complete: 11 +  = 20.','FR — à lire : Complète : 11 +  = 20.

EN — read aloud: Complete: 11 +  = 20.

FR : 9.

EN: 9.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9.','9.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q28-fr-CA','g2-q28','2','fr-CA','4. Nombres et calculs','Q28 · 4. Nombres et calculs','Range du plus petit au plus grand : 17, 9, 26.

Réponse / démarche :','Range du plus petit au plus grand : 17, 9, 26.','FR — à lire : Range du plus petit au plus grand : 17, 9, 26.

EN — read aloud: Order from least to greatest: 17, 9, 26.

FR : 9, 17, 26.

EN: 9, 17, 26.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9, 17, 26.','9, 17, 26.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q28-en-CA','g2-q28','2','en-CA','4. Numbers and calculations','Q28 · 4. Numbers and calculations','Order from least to greatest: 17, 9, 26.

Answer / working:','Order from least to greatest: 17, 9, 26.','FR — à lire : Range du plus petit au plus grand : 17, 9, 26.

EN — read aloud: Order from least to greatest: 17, 9, 26.

FR : 9, 17, 26.

EN: 9, 17, 26.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9, 17, 26.','9, 17, 26.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q29-fr-CA','g2-q29','2','fr-CA','4. Nombres et calculs','Q29 · 4. Nombres et calculs','Dans 47, combien y a-t-il de dizaines et combien d’unités ?

Réponse / démarche :','Dans 47, combien y a-t-il de dizaines et combien d’unités ?','FR — à lire : Dans 47, combien y a-t-il de dizaines et combien d’unités ?

EN — read aloud: In 47, how many tens and how many ones are there?

FR : 4 dizaines et 7 unités.

EN: 4 tens and 7 ones.

评分： 2 分：十位和个位均正确；1 分：其中一项正确；0 分：两项均错误。','text','4 dizaines et 7 unités.','4 dizaines et 7 unités.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q29-en-CA','g2-q29','2','en-CA','4. Numbers and calculations','Q29 · 4. Numbers and calculations','In 47, how many tens and how many ones are there?

Answer / working:','In 47, how many tens and how many ones are there?','FR — à lire : Dans 47, combien y a-t-il de dizaines et combien d’unités ?

EN — read aloud: In 47, how many tens and how many ones are there?

FR : 4 dizaines et 7 unités.

EN: 4 tens and 7 ones.

评分： 2 分：十位和个位均正确；1 分：其中一项正确；0 分：两项均错误。','text','4 tens and 7 ones.','4 tens and 7 ones.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q30-fr-CA','g2-q30','2','fr-CA','4. Nombres et calculs','Q30 · 4. Nombres et calculs','Complète : 20, 30, 40, , .

Réponse / démarche :','Complète : 20, 30, 40, , .','FR — à lire : Complète : 20, 30, 40, , .

EN — read aloud: Complete: 20, 30, 40, , .

### 模块 5：日常数学应用

可朗读题目以减少非目标阅读负担，需记录是否代读。Q33 不要求使用乘法符号，连加或画图均可。

FR : 50, 60.

EN: 50, 60.

评分： 2 分：两数均正确；1 分：一数正确；0 分：均错误。

### 日常数学应用：答案','text','50, 60.','50, 60.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q30-en-CA','g2-q30','2','en-CA','4. Numbers and calculations','Q30 · 4. Numbers and calculations','Complete: 20, 30, 40, , .

Answer / working:','Complete: 20, 30, 40, , .

### 模块 5：日常数学应用

可朗读题目以减少非目标阅读负担，需记录是否代读。Q33 不要求使用乘法符号，连加或画图均可。','FR — à lire : Complète : 20, 30, 40, , .

EN — read aloud: Complete: 20, 30, 40, , .

### 模块 5：日常数学应用

可朗读题目以减少非目标阅读负担，需记录是否代读。Q33 不要求使用乘法符号，连加或画图均可。

FR : 50, 60.

EN: 50, 60.

评分： 2 分：两数均正确；1 分：一数正确；0 分：均错误。

### 日常数学应用：答案','text','50, 60.','50, 60.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q31-fr-CA','g2-q31','2','fr-CA','5. Résoudre de petits problèmes','Q31 · 5. Résoudre de petits problèmes','Tu as 18 autocollants. Tu en donnes 5. Combien t’en reste-t-il ?

Réponse / démarche :','Tu as 18 autocollants. Tu en donnes 5. Combien t’en reste-t-il ?','FR — à lire : Tu as 18 autocollants. Tu en donnes 5. Combien t’en reste-t-il ?

EN — read aloud: You have 18 stickers. You give away 5. How many are left?

FR : 13 autocollants : 18 − 5 = 13.

EN: 13 stickers: 18 − 5 = 13.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','13 autocollants : 18 − 5 = 13.','13 autocollants : 18 − 5 = 13.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q31-en-CA','g2-q31','2','en-CA','5. Everyday maths problems','Q31 · 5. Everyday maths problems','You have 18 stickers. You give away 5. How many are left?

Answer / working:','You have 18 stickers. You give away 5. How many are left?','FR — à lire : Tu as 18 autocollants. Tu en donnes 5. Combien t’en reste-t-il ?

EN — read aloud: You have 18 stickers. You give away 5. How many are left?

FR : 13 autocollants : 18 − 5 = 13.

EN: 13 stickers: 18 − 5 = 13.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','13 stickers: 18 − 5 = 13.','13 stickers: 18 − 5 = 13.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q32-fr-CA','g2-q32','2','fr-CA','5. Résoudre de petits problèmes','Q32 · 5. Résoudre de petits problèmes','Lou a 12 billes et Nina en a 15. Combien Nina a-t-elle de billes de plus que Lou ?

Réponse / démarche :','Lou a 12 billes et Nina en a 15. Combien Nina a-t-elle de billes de plus que Lou ?','FR — à lire : Lou a 12 billes et Nina en a 15. Combien Nina a-t-elle de billes de plus que Lou ?

EN — read aloud: Lou has 12 marbles and Nina has 15. How many more marbles does Nina have than Lou?

FR : 3 billes de plus.

EN: 3 more marbles.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','3 billes de plus.','3 billes de plus.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q32-en-CA','g2-q32','2','en-CA','5. Everyday maths problems','Q32 · 5. Everyday maths problems','Lou has 12 marbles and Nina has 15. How many more marbles does Nina have than Lou?

Answer / working:','Lou has 12 marbles and Nina has 15. How many more marbles does Nina have than Lou?','FR — à lire : Lou a 12 billes et Nina en a 15. Combien Nina a-t-elle de billes de plus que Lou ?

EN — read aloud: Lou has 12 marbles and Nina has 15. How many more marbles does Nina have than Lou?

FR : 3 billes de plus.

EN: 3 more marbles.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','3 more marbles.','3 more marbles.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q33-fr-CA','g2-q33','2','fr-CA','5. Résoudre de petits problèmes','Q33 · 5. Résoudre de petits problèmes','Il y a 3 sacs de 4 jetons. Combien y a-t-il de jetons en tout ? Tu peux dessiner.

Réponse / démarche :','Il y a 3 sacs de 4 jetons. Combien y a-t-il de jetons en tout ? Tu peux dessiner.','FR — à lire : Il y a 3 sacs de 4 jetons. Combien y a-t-il de jetons en tout ? Tu peux dessiner.

EN — read aloud: There are 3 bags with 4 counters in each bag. How many counters are there altogether? You may draw.

FR : 12 : 4 + 4 + 4.

EN: 12: 4 + 4 + 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','drawing','12 : 4 + 4 + 4.','12 : 4 + 4 + 4.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q33-en-CA','g2-q33','2','en-CA','5. Everyday maths problems','Q33 · 5. Everyday maths problems','There are 3 bags with 4 counters in each bag. How many counters are there altogether? You may draw.

Answer / working:','There are 3 bags with 4 counters in each bag. How many counters are there altogether? You may draw.','FR — à lire : Il y a 3 sacs de 4 jetons. Combien y a-t-il de jetons en tout ? Tu peux dessiner.

EN — read aloud: There are 3 bags with 4 counters in each bag. How many counters are there altogether? You may draw.

FR : 12 : 4 + 4 + 4.

EN: 12: 4 + 4 + 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','12: 4 + 4 + 4.','12: 4 + 4 + 4.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q34-fr-CA','g2-q34','2','fr-CA','5. Résoudre de petits problèmes','Q34 · 5. Résoudre de petits problèmes','Tu as quatre pièces de 1 $. Tu achètes un crayon à 3 $. Combien d’argent te reste-t-il ?

Réponse / démarche :','Tu as quatre pièces de 1 $. Tu achètes un crayon à 3 $. Combien d’argent te reste-t-il ?','FR — à lire : Tu as quatre pièces de 1 $. Tu achètes un crayon à 3 $. Combien d’argent te reste-t-il ?

EN — read aloud: You have four $1 coins. You buy a pencil for $3. How much money is left?

FR : 1 $.

EN: $1.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','1 $.','1 $.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q34-en-CA','g2-q34','2','en-CA','5. Everyday maths problems','Q34 · 5. Everyday maths problems','You have four $1 coins. You buy a pencil for $3. How much money is left?

Answer / working:','You have four $1 coins. You buy a pencil for $3. How much money is left?','FR — à lire : Tu as quatre pièces de 1 $. Tu achètes un crayon à 3 $. Combien d’argent te reste-t-il ?

EN — read aloud: You have four $1 coins. You buy a pencil for $3. How much money is left?

FR : 1 $.

EN: $1.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','$1.','$1.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q35-fr-CA','g2-q35','2','fr-CA','5. Résoudre de petits problèmes','Q35 · 5. Résoudre de petits problèmes','Il est 3 h. Quelle heure sera-t-il une demi-heure plus tard ?

Réponse / démarche :','Il est 3 h. Quelle heure sera-t-il une demi-heure plus tard ?','FR — à lire : Il est 3 h. Quelle heure sera-t-il une demi-heure plus tard ?

EN — read aloud: It is 3:00. What time will it be half an hour later?

FR : 3 h 30.

EN: 3:30.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','3 h 30.','3 h 30.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q35-en-CA','g2-q35','2','en-CA','5. Everyday maths problems','Q35 · 5. Everyday maths problems','It is 3:00. What time will it be half an hour later?

Answer / working:','It is 3:00. What time will it be half an hour later?','FR — à lire : Il est 3 h. Quelle heure sera-t-il une demi-heure plus tard ?

EN — read aloud: It is 3:00. What time will it be half an hour later?

FR : 3 h 30.

EN: 3:30.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','3:30.','3:30.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q36-fr-CA','g2-q36','2','fr-CA','5. Résoudre de petits problèmes','Q36 · 5. Résoudre de petits problèmes','Un ruban rouge mesure 8 cm et un ruban bleu mesure 5 cm. Quelle est leur longueur totale ?

Réponse / démarche :','Un ruban rouge mesure 8 cm et un ruban bleu mesure 5 cm. Quelle est leur longueur totale ?','FR — à lire : Un ruban rouge mesure 8 cm et un ruban bleu mesure 5 cm. Quelle est leur longueur totale ?

EN — read aloud: A red ribbon is 8 cm long and a blue ribbon is 5 cm long. What is their total length?

FR : 13 cm.

EN: 13 cm.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','13 cm.','13 cm.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q36-en-CA','g2-q36','2','en-CA','5. Everyday maths problems','Q36 · 5. Everyday maths problems','A red ribbon is 8 cm long and a blue ribbon is 5 cm long. What is their total length?

Answer / working:','A red ribbon is 8 cm long and a blue ribbon is 5 cm long. What is their total length?','FR — à lire : Un ruban rouge mesure 8 cm et un ruban bleu mesure 5 cm. Quelle est leur longueur totale ?

EN — read aloud: A red ribbon is 8 cm long and a blue ribbon is 5 cm long. What is their total length?

FR : 13 cm.

EN: 13 cm.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','13 cm.','13 cm.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q37-fr-CA','g2-q37','2','fr-CA','5. Résoudre de petits problèmes','Q37 · 5. Résoudre de petits problèmes','Dans une boîte, il y a 12 crayons rouges et 8 crayons bleus. Combien y a-t-il de crayons en tout ?

Réponse / démarche :','Dans une boîte, il y a 12 crayons rouges et 8 crayons bleus. Combien y a-t-il de crayons en tout ?','FR — à lire : Dans une boîte, il y a 12 crayons rouges et 8 crayons bleus. Combien y a-t-il de crayons en tout ?

EN — read aloud: A box has 12 red pencils and 8 blue pencils. How many pencils are there altogether?

### 模块 6：规律、形状与逻辑

Q42 提供统一宽度、标签清楚的三条纸带。Q44 可以实际操作，必须有两个盒子且每盒至少一枚筹码。

FR : 20 crayons.

EN: 20 pencils.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 规律、形状与逻辑：答案','text','20 crayons.','20 crayons.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q37-en-CA','g2-q37','2','en-CA','5. Everyday maths problems','Q37 · 5. Everyday maths problems','A box has 12 red pencils and 8 blue pencils. How many pencils are there altogether?

Answer / working:','A box has 12 red pencils and 8 blue pencils. How many pencils are there altogether?

### 模块 6：规律、形状与逻辑

Q42 提供统一宽度、标签清楚的三条纸带。Q44 可以实际操作，必须有两个盒子且每盒至少一枚筹码。','FR — à lire : Dans une boîte, il y a 12 crayons rouges et 8 crayons bleus. Combien y a-t-il de crayons en tout ?

EN — read aloud: A box has 12 red pencils and 8 blue pencils. How many pencils are there altogether?

### 模块 6：规律、形状与逻辑

Q42 提供统一宽度、标签清楚的三条纸带。Q44 可以实际操作，必须有两个盒子且每盒至少一枚筹码。

FR : 20 crayons.

EN: 20 pencils.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 规律、形状与逻辑：答案','text','20 pencils.','20 pencils.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q38-fr-CA','g2-q38','2','fr-CA','6. Suites, formes et logique','Q38 · 6. Suites, formes et logique','Quel mot manque : rouge, rouge, bleu, rouge, rouge,  ?

Réponse / démarche :','Quel mot manque : rouge, rouge, bleu, rouge, rouge,  ?','FR — à lire : Quel mot manque : rouge, rouge, bleu, rouge, rouge,  ?

EN — read aloud: Which word is missing: red, red, blue, red, red, ?

FR : Bleu.

EN: Blue.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Bleu.','Bleu.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q38-en-CA','g2-q38','2','en-CA','6. Patterns, shapes and logic','Q38 · 6. Patterns, shapes and logic','Which word is missing: red, red, blue, red, red, ?

Answer / working:','Which word is missing: red, red, blue, red, red, ?','FR — à lire : Quel mot manque : rouge, rouge, bleu, rouge, rouge,  ?

EN — read aloud: Which word is missing: red, red, blue, red, red, ?

FR : Bleu.

EN: Blue.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Blue.','Blue.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q39-fr-CA','g2-q39','2','fr-CA','6. Suites, formes et logique','Q39 · 6. Suites, formes et logique','Continue : 5, 10, 15, 20, .

Réponse / démarche :','Continue : 5, 10, 15, 20, .','FR — à lire : Continue : 5, 10, 15, 20, .

EN — read aloud: Continue: 5, 10, 15, 20, .

FR : 25.

EN: 25.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','25.','25.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q39-en-CA','g2-q39','2','en-CA','6. Patterns, shapes and logic','Q39 · 6. Patterns, shapes and logic','Continue: 5, 10, 15, 20, .

Answer / working:','Continue: 5, 10, 15, 20, .','FR — à lire : Continue : 5, 10, 15, 20, .

EN — read aloud: Continue: 5, 10, 15, 20, .

FR : 25.

EN: 25.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','25.','25.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q40-fr-CA','g2-q40','2','fr-CA','6. Suites, formes et logique','Q40 · 6. Suites, formes et logique','Choisis la forme qui a quatre côtés égaux : triangle, cercle ou carré.

Réponse / démarche :','Choisis la forme qui a quatre côtés égaux : triangle, cercle ou carré.','FR — à lire : Choisis la forme qui a quatre côtés égaux : triangle, cercle ou carré.

EN — read aloud: Choose the shape with four equal sides: triangle, circle or square.

FR : Carré.

EN: Square.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Carré.','Carré.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q40-en-CA','g2-q40','2','en-CA','6. Patterns, shapes and logic','Q40 · 6. Patterns, shapes and logic','Choose the shape with four equal sides: triangle, circle or square.

Answer / working:','Choose the shape with four equal sides: triangle, circle or square.','FR — à lire : Choisis la forme qui a quatre côtés égaux : triangle, cercle ou carré.

EN — read aloud: Choose the shape with four equal sides: triangle, circle or square.

FR : Carré.

EN: Square.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Square.','Square.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q41-fr-CA','g2-q41','2','fr-CA','6. Suites, formes et logique','Q41 · 6. Suites, formes et logique','Combien de sommets a un rectangle ?

Réponse / démarche :','Combien de sommets a un rectangle ?','FR — à lire : Combien de sommets a un rectangle ?

EN — read aloud: How many corners does a rectangle have?

FR : 4.

EN: 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','4.','4.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q41-en-CA','g2-q41','2','en-CA','6. Patterns, shapes and logic','Q41 · 6. Patterns, shapes and logic','How many corners does a rectangle have?

Answer / working:','How many corners does a rectangle have?','FR — à lire : Combien de sommets a un rectangle ?

EN — read aloud: How many corners does a rectangle have?

FR : 4.

EN: 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','4.','4.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q42-fr-CA','g2-q42','2','fr-CA','6. Suites, formes et logique','Q42 · 6. Suites, formes et logique','Range les bandes A, B et C de la plus courte à la plus longue.

Je réalise l’action. Observation de l’adulte :','Range les bandes A, B et C de la plus courte à la plus longue.','教师操作（不朗读）： 纸带 A=6 cm、B=11 cm、C=4 cm。

FR — à lire : Range les bandes A, B et C de la plus courte à la plus longue.

EN — read aloud: Order strips A, B and C from shortest to longest.

FR : C, A, B.

EN: C, A, B.

评分： 2 分：C–A–B 全对；1 分：能找出最短与最长但未完成排序；0 分：不能比较。','text','C, A, B.','C, A, B.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q42-en-CA','g2-q42','2','en-CA','6. Patterns, shapes and logic','Q42 · 6. Patterns, shapes and logic','Order strips A, B and C from shortest to longest.

I carry out the action. Adult observation:','Order strips A, B and C from shortest to longest.','教师操作（不朗读）： 纸带 A=6 cm、B=11 cm、C=4 cm。

FR — à lire : Range les bandes A, B et C de la plus courte à la plus longue.

EN — read aloud: Order strips A, B and C from shortest to longest.

FR : C, A, B.

EN: C, A, B.

评分： 2 分：C–A–B 全对；1 分：能找出最短与最长但未完成排序；0 分：不能比较。','text','C, A, B.','C, A, B.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q43-fr-CA','g2-q43','2','fr-CA','6. Suites, formes et logique','Q43 · 6. Suites, formes et logique','Tom est plus grand que Léa. Max est plus grand que Tom. Qui est le plus grand des trois ?

Réponse / démarche :','Tom est plus grand que Léa. Max est plus grand que Tom. Qui est le plus grand des trois ?','FR — à lire : Tom est plus grand que Léa. Max est plus grand que Tom. Qui est le plus grand des trois ?

EN — read aloud: Tom is taller than Léa. Max is taller than Tom. Who is the tallest of the three?

FR : Max.

EN: Max.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Max.','Max.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q43-en-CA','g2-q43','2','en-CA','6. Patterns, shapes and logic','Q43 · 6. Patterns, shapes and logic','Tom is taller than Léa. Max is taller than Tom. Who is the tallest of the three?

Answer / working:','Tom is taller than Léa. Max is taller than Tom. Who is the tallest of the three?','FR — à lire : Tom est plus grand que Léa. Max est plus grand que Tom. Qui est le plus grand des trois ?

EN — read aloud: Tom is taller than Léa. Max is taller than Tom. Who is the tallest of the three?

FR : Max.

EN: Max.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Max.','Max.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q44-fr-CA','g2-q44','2','fr-CA','6. Suites, formes et logique','Q44 · 6. Suites, formes et logique','Partage 5 jetons entre deux boîtes. Mets au moins un jeton dans chaque boîte et plus de jetons à gauche qu’à droite. Donne une solution.

Réponse / démarche :','Partage 5 jetons entre deux boîtes. Mets au moins un jeton dans chaque boîte et plus de jetons à gauche qu’à droite. Donne une solution.','FR — à lire : Partage 5 jetons entre deux boîtes. Mets au moins un jeton dans chaque boîte et plus de jetons à gauche qu’à droite. Donne une solution.

EN — read aloud: Share 5 counters between two boxes. Put at least one counter in each box and more counters on the left than on the right. Give one solution.

### 模块 7：表达、写作与合作

开放题不要求复述答案。Q46 是两句书写练习；Q47 为口语顺序练习。Q48 可用成人扮演伙伴。

FR : 3 à gauche et 2 à droite, ou 4 à gauche et 1 à droite.

EN: 3 on the left and 2 on the right, or 4 on the left and 1 on the right.

评分： 2 分：总数 5、两盒非空且左多右少；1 分：满足其中两条；0 分：最多满足一条。

### 表达、写作与合作：答案','text','3 à gauche et 2 à droite, ou 4 à gauche et 1 à droite.','3 à gauche et 2 à droite, ou 4 à gauche et 1 à droite.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q44-en-CA','g2-q44','2','en-CA','6. Patterns, shapes and logic','Q44 · 6. Patterns, shapes and logic','Share 5 counters between two boxes. Put at least one counter in each box and more counters on the left than on the right. Give one solution.

Answer / working:','Share 5 counters between two boxes. Put at least one counter in each box and more counters on the left than on the right. Give one solution.

### 模块 7：表达、写作与合作

开放题不要求复述答案。Q46 是两句书写练习；Q47 为口语顺序练习。Q48 可用成人扮演伙伴。','FR — à lire : Partage 5 jetons entre deux boîtes. Mets au moins un jeton dans chaque boîte et plus de jetons à gauche qu’à droite. Donne une solution.

EN — read aloud: Share 5 counters between two boxes. Put at least one counter in each box and more counters on the left than on the right. Give one solution.

### 模块 7：表达、写作与合作

开放题不要求复述答案。Q46 是两句书写练习；Q47 为口语顺序练习。Q48 可用成人扮演伙伴。

FR : 3 à gauche et 2 à droite, ou 4 à gauche et 1 à droite.

EN: 3 on the left and 2 on the right, or 4 on the left and 1 on the right.

评分： 2 分：总数 5、两盒非空且左多右少；1 分：满足其中两条；0 分：最多满足一条。

### 表达、写作与合作：答案','text','3 on the left and 2 on the right, or 4 on the left and 1 on the right.','3 on the left and 2 on the right, or 4 on the left and 1 on the right.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q45-fr-CA','g2-q45','2','fr-CA','7. S’exprimer et coopérer','Q45 · 7. S’exprimer et coopérer','Présente-toi : dis ton prénom et une activité que tu aimes. Explique pourquoi tu l’aimes.

Réponse orale. L’adulte peut noter mes mots :','Présente-toi : dis ton prénom et une activité que tu aimes. Explique pourquoi tu l’aimes.','FR — à lire : Présente-toi : dis ton prénom et une activité que tu aimes. Explique pourquoi tu l’aimes.

EN — read aloud: Introduce yourself: say your first name and an activity you enjoy. Explain why you enjoy it.

FR : Par exemple : je m’appelle Lina. J’aime dessiner parce que je peux inventer des animaux.

EN: For example: my name is Lina. I like drawing because I can invent animals.

评分： 2 分：切题且信息完整或有合理理由；1 分：切题但较不完整；0 分：没有相关回答。','text','Par exemple : je m’appelle Lina. J’aime dessiner parce que je peux inventer des animaux.','Par exemple : je m’appelle Lina. J’aime dessiner parce que je peux inventer des animaux.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q45-en-CA','g2-q45','2','en-CA','7. Expressing ideas and cooperating','Q45 · 7. Expressing ideas and cooperating','Introduce yourself: say your first name and an activity you enjoy. Explain why you enjoy it.

Oral answer. An adult may record my words:','Introduce yourself: say your first name and an activity you enjoy. Explain why you enjoy it.','FR — à lire : Présente-toi : dis ton prénom et une activité que tu aimes. Explique pourquoi tu l’aimes.

EN — read aloud: Introduce yourself: say your first name and an activity you enjoy. Explain why you enjoy it.

FR : Par exemple : je m’appelle Lina. J’aime dessiner parce que je peux inventer des animaux.

EN: For example: my name is Lina. I like drawing because I can invent animals.

评分： 2 分：切题且信息完整或有合理理由；1 分：切题但较不完整；0 分：没有相关回答。','text','For example: my name is Lina. I like drawing because I can invent animals.','For example: my name is Lina. I like drawing because I can invent animals.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q46-fr-CA','g2-q46','2','fr-CA','7. S’exprimer et coopérer','Q46 · 7. S’exprimer et coopérer','Écris deux phrases sur un jeu que tu aimes. Dis quel est le jeu et ce qu’on y fait.','Écris deux phrases sur un jeu que tu aimes. Dis quel est le jeu et ce qu’on y fait.','FR — à lire : Écris deux phrases sur un jeu que tu aimes. Dis quel est le jeu et ce qu’on y fait.

EN — read aloud: Write two sentences about a game you enjoy. Name the game and say what players do.

FR : Exemple : j’aime le jeu de mémoire. Il faut retrouver deux cartes identiques.

EN: Example: I like the memory game. Players have to find two matching cards.

评分： 2 分：两句可理解的句子，包含游戏及玩法；1 分：只有一句或信息缺一；0 分：没有相关句子。轻微非目标拼写错误不直接归零。','text','Exemple : j’aime le jeu de mémoire. Il faut retrouver deux cartes identiques.','Exemple : j’aime le jeu de mémoire. Il faut retrouver deux cartes identiques.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q46-en-CA','g2-q46','2','en-CA','7. Expressing ideas and cooperating','Q46 · 7. Expressing ideas and cooperating','Write two sentences about a game you enjoy. Name the game and say what players do.','Write two sentences about a game you enjoy. Name the game and say what players do.','FR — à lire : Écris deux phrases sur un jeu que tu aimes. Dis quel est le jeu et ce qu’on y fait.

EN — read aloud: Write two sentences about a game you enjoy. Name the game and say what players do.

FR : Exemple : j’aime le jeu de mémoire. Il faut retrouver deux cartes identiques.

EN: Example: I like the memory game. Players have to find two matching cards.

评分： 2 分：两句可理解的句子，包含游戏及玩法；1 分：只有一句或信息缺一；0 分：没有相关句子。轻微非目标拼写错误不直接归零。','text','Example: I like the memory game. Players have to find two matching cards.','Example: I like the memory game. Players have to find two matching cards.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q47-fr-CA','g2-q47','2','fr-CA','7. S’exprimer et coopérer','Q47 · 7. S’exprimer et coopérer','Raconte comment tu te prépares pour l’école. Utilise « d’abord », « ensuite » et « enfin ».

Réponse orale. L’adulte peut noter mes mots :','Raconte comment tu te prépares pour l’école. Utilise « d’abord », « ensuite » et « enfin ».','FR — à lire : Raconte comment tu te prépares pour l’école. Utilise « d’abord », « ensuite » et « enfin ».

EN — read aloud: Explain how you get ready for school. Use “first”, “next” and “finally”.

FR : Une suite logique, par exemple : d’abord je m’habille, ensuite je déjeune, enfin je prends mon sac.

EN: A logical sequence, for example: first I get dressed, next I eat breakfast, finally I take my bag.

评分： 2 分：三步有逻辑并表达先后；1 分：只有两步或顺序不够清楚；0 分：没有相关顺序。','text','Une suite logique, par exemple : d’abord je m’habille, ensuite je déjeune, enfin je prends mon sac.','Une suite logique, par exemple : d’abord je m’habille, ensuite je déjeune, enfin je prends mon sac.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q47-en-CA','g2-q47','2','en-CA','7. Expressing ideas and cooperating','Q47 · 7. Expressing ideas and cooperating','Explain how you get ready for school. Use “first”, “next” and “finally”.

Oral answer. An adult may record my words:','Explain how you get ready for school. Use “first”, “next” and “finally”.','FR — à lire : Raconte comment tu te prépares pour l’école. Utilise « d’abord », « ensuite » et « enfin ».

EN — read aloud: Explain how you get ready for school. Use “first”, “next” and “finally”.

FR : Une suite logique, par exemple : d’abord je m’habille, ensuite je déjeune, enfin je prends mon sac.

EN: A logical sequence, for example: first I get dressed, next I eat breakfast, finally I take my bag.

评分： 2 分：三步有逻辑并表达先后；1 分：只有两步或顺序不够清楚；0 分：没有相关顺序。','text','A logical sequence, for example: first I get dressed, next I eat breakfast, finally I take my bag.','A logical sequence, for example: first I get dressed, next I eat breakfast, finally I take my bag.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q48-fr-CA','g2-q48','2','fr-CA','7. S’exprimer et coopérer','Q48 · 7. S’exprimer et coopérer','Tu construis une maison avec un partenaire. Propose une façon de partager le travail et demande son avis.

Réponse orale. L’adulte peut noter mes mots :','Tu construis une maison avec un partenaire. Propose une façon de partager le travail et demande son avis.','FR — à lire : Tu construis une maison avec un partenaire. Propose une façon de partager le travail et demande son avis.

EN — read aloud: You are building a house with a partner. Suggest a way to share the work and ask what they think.

FR : Par exemple : je peux faire les murs, tu peux faire le toit. Est-ce que cela te convient ?

EN: For example: I can build the walls and you can build the roof. Does that work for you?

评分： 2 分：提出可行分工并征求／回应伙伴意见；1 分：只表现一项；0 分：没有相关方案。','text','Par exemple : je peux faire les murs, tu peux faire le toit. Est-ce que cela te convient ?','Par exemple : je peux faire les murs, tu peux faire le toit. Est-ce que cela te convient ?','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q48-en-CA','g2-q48','2','en-CA','7. Expressing ideas and cooperating','Q48 · 7. Expressing ideas and cooperating','You are building a house with a partner. Suggest a way to share the work and ask what they think.

Oral answer. An adult may record my words:','You are building a house with a partner. Suggest a way to share the work and ask what they think.','FR — à lire : Tu construis une maison avec un partenaire. Propose une façon de partager le travail et demande son avis.

EN — read aloud: You are building a house with a partner. Suggest a way to share the work and ask what they think.

FR : Par exemple : je peux faire les murs, tu peux faire le toit. Est-ce que cela te convient ?

EN: For example: I can build the walls and you can build the roof. Does that work for you?

评分： 2 分：提出可行分工并征求／回应伙伴意见；1 分：只表现一项；0 分：没有相关方案。','text','For example: I can build the walls and you can build the roof. Does that work for you?','For example: I can build the walls and you can build the roof. Does that work for you?','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q49-fr-CA','g2-q49','2','fr-CA','7. S’exprimer et coopérer','Q49 · 7. S’exprimer et coopérer','Un nouvel élève est seul à la récréation. Que pourrais-tu lui proposer ?

Réponse orale. L’adulte peut noter mes mots :','Un nouvel élève est seul à la récréation. Que pourrais-tu lui proposer ?','FR — à lire : Un nouvel élève est seul à la récréation. Que pourrais-tu lui proposer ?

EN — read aloud: A new student is alone at recess. What could you offer to do?

FR : Par exemple : lui proposer de jouer et lui expliquer le jeu, en respectant son choix.

EN: For example: invite the student to play and explain the game, while respecting their choice.

评分： 2 分：切题且信息完整或有合理理由；1 分：切题但较不完整；0 分：没有相关回答。','text','Par exemple : lui proposer de jouer et lui expliquer le jeu, en respectant son choix.','Par exemple : lui proposer de jouer et lui expliquer le jeu, en respectant son choix.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q49-en-CA','g2-q49','2','en-CA','7. Expressing ideas and cooperating','Q49 · 7. Expressing ideas and cooperating','A new student is alone at recess. What could you offer to do?

Oral answer. An adult may record my words:','A new student is alone at recess. What could you offer to do?','FR — à lire : Un nouvel élève est seul à la récréation. Que pourrais-tu lui proposer ?

EN — read aloud: A new student is alone at recess. What could you offer to do?

FR : Par exemple : lui proposer de jouer et lui expliquer le jeu, en respectant son choix.

EN: For example: invite the student to play and explain the game, while respecting their choice.

评分： 2 分：切题且信息完整或有合理理由；1 分：切题但较不完整；0 分：没有相关回答。','text','For example: invite the student to play and explain the game, while respecting their choice.','For example: invite the student to play and explain the game, while respecting their choice.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q50-fr-CA','g2-q50','2','fr-CA','7. S’exprimer et coopérer','Q50 · 7. S’exprimer et coopérer','Choisis un problème de cette fiche. Explique comment tu as trouvé ta réponse et comment tu pourrais la vérifier.

Réponse orale. L’adulte peut noter mes mots :','Choisis un problème de cette fiche. Explique comment tu as trouvé ta réponse et comment tu pourrais la vérifier.','FR — à lire : Choisis un problème de cette fiche. Explique comment tu as trouvé ta réponse et comment tu pourrais la vérifier.

EN — read aloud: Choose a problem from this booklet. Explain how you found your answer and how you could check it.

FR : Par exemple : j’ai dessiné 3 groupes de 4 jetons. Je peux recompter tous les jetons pour vérifier 12.

EN: For example: I drew 3 groups of 4 counters. I can count all the counters to check that there are 12.

评分： 2 分：说出有效方法和检查方式；1 分：只说出其中一项；0 分：没有相关过程。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 听指令与听力理解 |  |  |  |  |
| 独立阅读与短文理解 |  |  |  |  |
| 词汇、语音与基础句子 |  |  |  |  |
| 数与计算 |  |  |  |  |
| 日常数学应用 |  |  |  |  |
| 规律、形状与逻辑 |  |  |  |  |
| 表达、写作与合作 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','Par exemple : j’ai dessiné 3 groupes de 4 jetons. Je peux recompter tous les jetons pour vérifier 12.','Par exemple : j’ai dessiné 3 groupes de 4 jetons. Je peux recompter tous les jetons pour vérifier 12.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g2-q50-en-CA','g2-q50','2','en-CA','7. Expressing ideas and cooperating','Q50 · 7. Expressing ideas and cooperating','Choose a problem from this booklet. Explain how you found your answer and how you could check it.

Oral answer. An adult may record my words:','Choose a problem from this booklet. Explain how you found your answer and how you could check it.','FR — à lire : Choisis un problème de cette fiche. Explique comment tu as trouvé ta réponse et comment tu pourrais la vérifier.

EN — read aloud: Choose a problem from this booklet. Explain how you found your answer and how you could check it.

FR : Par exemple : j’ai dessiné 3 groupes de 4 jetons. Je peux recompter tous les jetons pour vérifier 12.

EN: For example: I drew 3 groups of 4 counters. I can count all the counters to check that there are 12.

评分： 2 分：说出有效方法和检查方式；1 分：只说出其中一项；0 分：没有相关过程。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 听指令与听力理解 |  |  |  |  |
| 独立阅读与短文理解 |  |  |  |  |
| 词汇、语音与基础句子 |  |  |  |  |
| 数与计算 |  |  |  |  |
| 日常数学应用 |  |  |  |  |
| 规律、形状与逻辑 |  |  |  |  |
| 表达、写作与合作 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','For example: I drew 3 groups of 4 counters. I can count all the counters to check that there are 12.','For example: I drew 3 groups of 4 counters. I can count all the counters to check that there are 12.','draft','full','小学二年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q01-fr-CA','g3-q01','3','fr-CA','1. Écouter, retenir et comprendre','Q01 · 1. Écouter, retenir et comprendre','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Écris 24. Entoure le chiffre des dizaines et souligne le chiffre des unités.','FR — à lire : Écris 24. Entoure le chiffre des dizaines et souligne le chiffre des unités.

EN — read aloud: Write 24. Circle the tens digit and underline the ones digit.

FR : 24, avec le 2 entouré et le 4 souligné.

EN: 24, with 2 circled and 4 underlined.

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。','text','24, avec le 2 entouré et le 4 souligné.','24, avec le 2 entouré et le 4 souligné.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q01-en-CA','g3-q01','3','en-CA','1. Listening, remembering and understanding','Q01 · 1. Listening, remembering and understanding','Listen to the adult, then do the activity.

Answer / working:','Write 24. Circle the tens digit and underline the ones digit.','FR — à lire : Écris 24. Entoure le chiffre des dizaines et souligne le chiffre des unités.

EN — read aloud: Write 24. Circle the tens digit and underline the ones digit.

FR : 24, avec le 2 entouré et le 4 souligné.

EN: 24, with 2 circled and 4 underlined.

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。','text','24, with 2 circled and 4 underlined.','24, with 2 circled and 4 underlined.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q02-fr-CA','g3-q02','3','fr-CA','1. Écouter, retenir et comprendre','Q02 · 1. Écouter, retenir et comprendre','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine un rectangle. Fais un point au-dessus du rectangle et une croix à sa droite.','FR — à lire : Dessine un rectangle. Fais un point au-dessus du rectangle et une croix à sa droite.

EN — read aloud: Draw a rectangle. Put a dot above it and a cross to its right.

FR : Un rectangle, un point au-dessus et une croix à droite.

EN: A rectangle, a dot above it and a cross on its right.

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。','drawing','Un rectangle, un point au-dessus et une croix à droite.','Un rectangle, un point au-dessus et une croix à droite.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q02-en-CA','g3-q02','3','en-CA','1. Listening, remembering and understanding','Q02 · 1. Listening, remembering and understanding','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','Draw a rectangle. Put a dot above it and a cross to its right.','FR — à lire : Dessine un rectangle. Fais un point au-dessus du rectangle et une croix à sa droite.

EN — read aloud: Draw a rectangle. Put a dot above it and a cross to its right.

FR : Un rectangle, un point au-dessus et une croix à droite.

EN: A rectangle, a dot above it and a cross on its right.

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。','drawing','A rectangle, a dot above it and a cross on its right.','A rectangle, a dot above it and a cross on its right.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q03-fr-CA','g3-q03','3','fr-CA','1. Écouter, retenir et comprendre','Q03 · 1. Écouter, retenir et comprendre','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Écoute : 4, 9, 6. Écris ces trois nombres dans l’ordre inverse.','FR — à lire : Écoute : 4, 9, 6. Écris ces trois nombres dans l’ordre inverse.

EN — read aloud: Listen: 4, 9, 6. Write these three numbers in reverse order.

FR : 6, 9, 4.

EN: 6, 9, 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6, 9, 4.','6, 9, 4.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q03-en-CA','g3-q03','3','en-CA','1. Listening, remembering and understanding','Q03 · 1. Listening, remembering and understanding','Listen to the adult, then do the activity.

Answer / working:','Listen: 4, 9, 6. Write these three numbers in reverse order.','FR — à lire : Écoute : 4, 9, 6. Écris ces trois nombres dans l’ordre inverse.

EN — read aloud: Listen: 4, 9, 6. Write these three numbers in reverse order.

FR : 6, 9, 4.

EN: 6, 9, 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6, 9, 4.','6, 9, 4.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q04-fr-CA','g3-q04','3','fr-CA','1. Écouter, retenir et comprendre','Q04 · 1. Écouter, retenir et comprendre','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Commence à 12. Ajoute 5, puis enlève 2. Écris le résultat. Tu peux noter les étapes.','FR — à lire : Commence à 12. Ajoute 5, puis enlève 2. Écris le résultat. Tu peux noter les étapes.

EN — read aloud: Start with 12. Add 5, then subtract 2. Write the result. You may write the steps.

听力材料 L1：在 Q05 前朗读；适用于 Q05–Q08。所选语言完整读两遍。

Texte à écouter L1

> Samedi matin, Zoé et Léo préparent un pique-nique pour le parc. Ils mettent quatre pommes et six sandwichs dans un sac. En voyant la pluie, ils décident de manger à la maison.

Listening passage L1

> On Saturday morning, Zoé and Leo prepare a picnic for the park. They put four apples and six sandwiches in a bag. When they see the rain, they decide to eat at home.

FR : 15 : 12 + 5 − 2.

EN: 15: 12 + 5 − 2.

评分： 2 分：结果 15；1 分：写出正确步骤但有一处计算错误；0 分：未建立有效步骤。','text','15 : 12 + 5 − 2.','15 : 12 + 5 − 2.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q04-en-CA','g3-q04','3','en-CA','1. Listening, remembering and understanding','Q04 · 1. Listening, remembering and understanding','Listen to the adult, then do the activity.

Answer / working:','Start with 12. Add 5, then subtract 2. Write the result. You may write the steps.','FR — à lire : Commence à 12. Ajoute 5, puis enlève 2. Écris le résultat. Tu peux noter les étapes.

EN — read aloud: Start with 12. Add 5, then subtract 2. Write the result. You may write the steps.

听力材料 L1：在 Q05 前朗读；适用于 Q05–Q08。所选语言完整读两遍。

Texte à écouter L1

> Samedi matin, Zoé et Léo préparent un pique-nique pour le parc. Ils mettent quatre pommes et six sandwichs dans un sac. En voyant la pluie, ils décident de manger à la maison.

Listening passage L1

> On Saturday morning, Zoé and Leo prepare a picnic for the park. They put four apples and six sandwiches in a bag. When they see the rain, they decide to eat at home.

FR : 15 : 12 + 5 − 2.

EN: 15: 12 + 5 − 2.

评分： 2 分：结果 15；1 分：写出正确步骤但有一处计算错误；0 分：未建立有效步骤。','text','15: 12 + 5 − 2.','15: 12 + 5 − 2.','draft','answer_area_only','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q05-fr-CA','g3-q05','3','fr-CA','1. Écouter, retenir et comprendre','Q05 · 1. Écouter, retenir et comprendre','Où Zoé et Léo voulaient-ils faire leur pique-nique ?

Réponse / démarche :','Où Zoé et Léo voulaient-ils faire leur pique-nique ?','FR — à lire : Où Zoé et Léo voulaient-ils faire leur pique-nique ?

EN — read aloud: Where did Zoé and Leo originally want to have their picnic?

FR : Au parc.

EN: At the park.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Au parc.','Au parc.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q05-en-CA','g3-q05','3','en-CA','1. Listening, remembering and understanding','Q05 · 1. Listening, remembering and understanding','Where did Zoé and Leo originally want to have their picnic?

Answer / working:','Where did Zoé and Leo originally want to have their picnic?','FR — à lire : Où Zoé et Léo voulaient-ils faire leur pique-nique ?

EN — read aloud: Where did Zoé and Leo originally want to have their picnic?

FR : Au parc.

EN: At the park.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','At the park.','At the park.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q06-fr-CA','g3-q06','3','fr-CA','1. Écouter, retenir et comprendre','Q06 · 1. Écouter, retenir et comprendre','Combien de pommes mettent-ils dans le sac ?

Réponse / démarche :','Combien de pommes mettent-ils dans le sac ?','FR — à lire : Combien de pommes mettent-ils dans le sac ?

EN — read aloud: How many apples do they put in the bag?

FR : Quatre.

EN: Four.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Quatre.','Quatre.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q06-en-CA','g3-q06','3','en-CA','1. Listening, remembering and understanding','Q06 · 1. Listening, remembering and understanding','How many apples do they put in the bag?

Answer / working:','How many apples do they put in the bag?','FR — à lire : Combien de pommes mettent-ils dans le sac ?

EN — read aloud: How many apples do they put in the bag?

FR : Quatre.

EN: Four.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Four.','Four.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q07-fr-CA','g3-q07','3','fr-CA','1. Écouter, retenir et comprendre','Q07 · 1. Écouter, retenir et comprendre','Pourquoi changent-ils leur projet ?

Réponse / démarche :','Pourquoi changent-ils leur projet ?','FR — à lire : Pourquoi changent-ils leur projet ?

EN — read aloud: Why do they change their plan?

FR : Parce qu’il pleut.

EN: Because it is raining.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Parce qu’il pleut.','Parce qu’il pleut.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q07-en-CA','g3-q07','3','en-CA','1. Listening, remembering and understanding','Q07 · 1. Listening, remembering and understanding','Why do they change their plan?

Answer / working:','Why do they change their plan?','FR — à lire : Pourquoi changent-ils leur projet ?

EN — read aloud: Why do they change their plan?

FR : Parce qu’il pleut.

EN: Because it is raining.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Because it is raining.','Because it is raining.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q08-fr-CA','g3-q08','3','fr-CA','1. Écouter, retenir et comprendre','Q08 · 1. Écouter, retenir et comprendre','Où décident-ils finalement de manger ?

Réponse / démarche :','Où décident-ils finalement de manger ?','FR — à lire : Où décident-ils finalement de manger ?

EN — read aloud: Where do they finally decide to eat?

### 模块 2：独立阅读、信息提取与推断

学生独立阅读，教师仅读组织指令。本模块内有简单数量和时间信息；允许草稿计算，不允许代读后仍记为独立阅读。

FR : À la maison.

EN: At home.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 独立阅读、信息提取与推断：答案','text','À la maison.','À la maison.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q08-en-CA','g3-q08','3','en-CA','1. Listening, remembering and understanding','Q08 · 1. Listening, remembering and understanding','Where do they finally decide to eat?

Answer / working:','Where do they finally decide to eat?

### 模块 2：独立阅读、信息提取与推断

学生独立阅读，教师仅读组织指令。本模块内有简单数量和时间信息；允许草稿计算，不允许代读后仍记为独立阅读。','FR — à lire : Où décident-ils finalement de manger ?

EN — read aloud: Where do they finally decide to eat?

### 模块 2：独立阅读、信息提取与推断

学生独立阅读，教师仅读组织指令。本模块内有简单数量和时间信息；允许草稿计算，不允许代读后仍记为独立阅读。

FR : À la maison.

EN: At home.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 独立阅读、信息提取与推断：答案','text','At home.','At home.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q09-fr-CA','g3-q09','3','fr-CA','2. Lire et utiliser les informations','Q09 · 2. Lire et utiliser les informations','Dans R1, qu’ont planté les élèves ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q09.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Des haricots.

EN: Beans.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Des haricots.','Des haricots.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q09-en-CA','g3-q09','3','en-CA','2. Reading and using information','Q09 · 2. Reading and using information','In R1, what did the students plant?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q09.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q09.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Des haricots.

EN: Beans.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Beans.','Beans.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q10-fr-CA','g3-q10','3','fr-CA','2. Lire et utiliser les informations','Q10 · 2. Lire et utiliser les informations','Dans R1, quel jour Maya mesure-t-elle sa plante ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q10.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Chaque lundi.

EN: Every Monday.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Chaque lundi.','Chaque lundi.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q10-en-CA','g3-q10','3','en-CA','2. Reading and using information','Q10 · 2. Reading and using information','In R1, on which day does Maya measure her plant?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q10.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q10.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Chaque lundi.

EN: Every Monday.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Every Monday.','Every Monday.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q11-fr-CA','g3-q11','3','fr-CA','2. Lire et utiliser les informations','Q11 · 2. Lire et utiliser les informations','Dans R1, de combien de centimètres la plante a-t-elle grandi ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q11.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : 5 cm : 9 − 4.

EN: 5 cm: 9 − 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','5 cm : 9 − 4.','5 cm : 9 − 4.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q11-en-CA','g3-q11','3','en-CA','2. Reading and using information','Q11 · 2. Reading and using information','In R1, how many centimetres did the plant grow?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q11.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q11.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : 5 cm : 9 − 4.

EN: 5 cm: 9 − 4.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','5 cm: 9 − 4.','5 cm: 9 − 4.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q12-fr-CA','g3-q12','3','fr-CA','2. Lire et utiliser les informations','Q12 · 2. Lire et utiliser les informations','Dans R1, pourquoi Maya utilise-t-elle un carnet ?

Réponse / démarche : 

Texte à lire R2

> CLUB DE LECTURE — Mercredi, de 15 h 30 à 16 h, dans la salle 12. Apporte ton livre préféré. Pour participer, inscris ton nom auprès de la bibliothécaire.','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q12.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Pour garder ses observations et comparer les changements.

EN: To keep her observations and compare changes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Pour garder ses observations et comparer les changements.','Pour garder ses observations et comparer les changements.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q12-en-CA','g3-q12','3','en-CA','2. Reading and using information','Q12 · 2. Reading and using information','In R1, why does Maya use a notebook?

Answer / working: 

Reading passage R2

> READING CLUB — Wednesday, from 3:30 p.m. to 4:00 p.m., in Room 12. Bring your favourite book. To take part, sign up with the librarian.','Read the passage or instruction on your sheet by yourself, then answer question Q12.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q12.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Pour garder ses observations et comparer les changements.

EN: To keep her observations and compare changes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','To keep her observations and compare changes.','To keep her observations and compare changes.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q13-fr-CA','g3-q13','3','fr-CA','2. Lire et utiliser les informations','Q13 · 2. Lire et utiliser les informations','Dans R2, dans quelle salle le club se réunit-il ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q13.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : La salle 12.

EN: Room 12.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','La salle 12.','La salle 12.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q13-en-CA','g3-q13','3','en-CA','2. Reading and using information','Q13 · 2. Reading and using information','In R2, in which room does the club meet?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q13.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q13.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : La salle 12.

EN: Room 12.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Room 12.','Room 12.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q14-fr-CA','g3-q14','3','fr-CA','2. Lire et utiliser les informations','Q14 · 2. Lire et utiliser les informations','Dans R2, que faut-il apporter ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q14.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Leur livre préféré.

EN: Their favourite book.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Leur livre préféré.','Leur livre préféré.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q14-en-CA','g3-q14','3','en-CA','2. Reading and using information','Q14 · 2. Reading and using information','In R2, what must students bring?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q14.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q14.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Leur livre préféré.

EN: Their favourite book.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Their favourite book.','Their favourite book.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q15-fr-CA','g3-q15','3','fr-CA','2. Lire et utiliser les informations','Q15 · 2. Lire et utiliser les informations','Dans R2, combien de temps dure la rencontre ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q15.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

### 模块 3：词汇、语法与句子组织

两种语言按自身语法适配，例如法语形容词配合不机械移植为英语形容词复数。Q22 也按目标语言重新选词。

FR : 30 minutes.

EN: 30 minutes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 词汇、语法与句子组织：答案','text','30 minutes.','30 minutes.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q15-en-CA','g3-q15','3','en-CA','2. Reading and using information','Q15 · 2. Reading and using information','In R2, how long does the meeting last?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q15.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q15.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

### 模块 3：词汇、语法与句子组织

两种语言按自身语法适配，例如法语形容词配合不机械移植为英语形容词复数。Q22 也按目标语言重新选词。

FR : 30 minutes.

EN: 30 minutes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 词汇、语法与句子组织：答案','text','30 minutes.','30 minutes.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q16-fr-CA','g3-q16','3','fr-CA','3. Vocabulaire et phrases','Q16 · 3. Vocabulaire et phrases','Mets au pluriel : le petit chien blanc.

Réponse / démarche :','Mets au pluriel : le petit chien blanc.','FR — à lire : Mets au pluriel : le petit chien blanc.

EN — read aloud: Make this phrase plural: the small white dog.

FR : Les petits chiens blancs.

EN: The small white dogs.

评分： 2 分：目标语言的复数形式完整正确；1 分：主要复数变化正确但有一处遗漏；0 分：没有形成正确复数。英语形容词不加 s。','text','Les petits chiens blancs.','Les petits chiens blancs.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q16-en-CA','g3-q16','3','en-CA','3. Vocabulary and sentence skills','Q16 · 3. Vocabulary and sentence skills','Make this phrase plural: the small white dog.

Answer / working:','Make this phrase plural: the small white dog.','FR — à lire : Mets au pluriel : le petit chien blanc.

EN — read aloud: Make this phrase plural: the small white dog.

FR : Les petits chiens blancs.

EN: The small white dogs.

评分： 2 分：目标语言的复数形式完整正确；1 分：主要复数变化正确但有一处遗漏；0 分：没有形成正确复数。英语形容词不加 s。','text','The small white dogs.','The small white dogs.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q17-fr-CA','g3-q17','3','fr-CA','3. Vocabulaire et phrases','Q17 · 3. Vocabulaire et phrases','Choisis : Nous (sommes / êtes) prêts.

Réponse / démarche :','Choisis : Nous (sommes / êtes) prêts.','FR — à lire : Choisis : Nous (sommes / êtes) prêts.

EN — read aloud: Choose: We (is / are) ready.

FR : Nous sommes prêts.

EN: We are ready.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Nous sommes prêts.','Nous sommes prêts.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q17-en-CA','g3-q17','3','en-CA','3. Vocabulary and sentence skills','Q17 · 3. Vocabulary and sentence skills','Choose: We (is / are) ready.

Answer / working:','Choose: We (is / are) ready.','FR — à lire : Choisis : Nous (sommes / êtes) prêts.

EN — read aloud: Choose: We (is / are) ready.

FR : Nous sommes prêts.

EN: We are ready.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','We are ready.','We are ready.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q18-fr-CA','g3-q18','3','fr-CA','3. Vocabulaire et phrases','Q18 · 3. Vocabulaire et phrases','Remplace « Camille et Hugo » par un pronom : Camille et Hugo lisent.

Réponse / démarche :','Remplace « Camille et Hugo » par un pronom : Camille et Hugo lisent.','FR — à lire : Remplace « Camille et Hugo » par un pronom : Camille et Hugo lisent.

EN — read aloud: Replace “Camille and Hugo” with a pronoun: Camille and Hugo are reading.

FR : Ils lisent.

EN: They are reading.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Ils lisent.','Ils lisent.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q18-en-CA','g3-q18','3','en-CA','3. Vocabulary and sentence skills','Q18 · 3. Vocabulary and sentence skills','Replace “Camille and Hugo” with a pronoun: Camille and Hugo are reading.

Answer / working:','Replace “Camille and Hugo” with a pronoun: Camille and Hugo are reading.','FR — à lire : Remplace « Camille et Hugo » par un pronom : Camille et Hugo lisent.

EN — read aloud: Replace “Camille and Hugo” with a pronoun: Camille and Hugo are reading.

FR : Ils lisent.

EN: They are reading.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','They are reading.','They are reading.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q19-fr-CA','g3-q19','3','fr-CA','3. Vocabulaire et phrases','Q19 · 3. Vocabulaire et phrases','Quel mot est de la même famille que « jardin » : jardinier, journal ou chaise ?

Réponse / démarche :','Quel mot est de la même famille que « jardin » : jardinier, journal ou chaise ?','FR — à lire : Quel mot est de la même famille que « jardin » : jardinier, journal ou chaise ?

EN — read aloud: Which word is in the same word family as “paint”: painter, pencil or chair?

FR : Jardinier.

EN: Painter.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Jardinier.','Jardinier.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q19-en-CA','g3-q19','3','en-CA','3. Vocabulary and sentence skills','Q19 · 3. Vocabulary and sentence skills','Which word is in the same word family as “paint”: painter, pencil or chair?

Answer / working:','Which word is in the same word family as “paint”: painter, pencil or chair?','FR — à lire : Quel mot est de la même famille que « jardin » : jardinier, journal ou chaise ?

EN — read aloud: Which word is in the same word family as “paint”: painter, pencil or chair?

FR : Jardinier.

EN: Painter.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Painter.','Painter.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q20-fr-CA','g3-q20','3','fr-CA','3. Vocabulaire et phrases','Q20 · 3. Vocabulaire et phrases','Complète avec « parce que » ou « mais » : Je mets un manteau  il fait froid.

Réponse / démarche :','Complète avec « parce que » ou « mais » : Je mets un manteau  il fait froid.','FR — à lire : Complète avec « parce que » ou « mais » : Je mets un manteau  il fait froid.

EN — read aloud: Complete with “because” or “but”: I put on a coat  it is cold.

FR : Parce que.

EN: Because.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Parce que.','Parce que.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q20-en-CA','g3-q20','3','en-CA','3. Vocabulary and sentence skills','Q20 · 3. Vocabulary and sentence skills','Complete with “because” or “but”: I put on a coat  it is cold.

Answer / working:','Complete with “because” or “but”: I put on a coat  it is cold.','FR — à lire : Complète avec « parce que » ou « mais » : Je mets un manteau  il fait froid.

EN — read aloud: Complete with “because” or “but”: I put on a coat  it is cold.

FR : Parce que.

EN: Because.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Because.','Because.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q21-fr-CA','g3-q21','3','fr-CA','3. Vocabulaire et phrases','Q21 · 3. Vocabulaire et phrases','Réécris avec la majuscule et la bonne ponctuation : où est mon sac

Réponse / démarche :','Réécris avec la majuscule et la bonne ponctuation : où est mon sac','FR — à lire : Réécris avec la majuscule et la bonne ponctuation : où est mon sac

EN — read aloud: Rewrite with a capital letter and correct punctuation: where is my bag

FR : Où est mon sac ?

EN: Where is my bag?

评分： 2 分：大写与问号均正确；1 分：仅一项正确；0 分：两项均未完成。','text','Où est mon sac ?','Où est mon sac ?','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q21-en-CA','g3-q21','3','en-CA','3. Vocabulary and sentence skills','Q21 · 3. Vocabulary and sentence skills','Rewrite with a capital letter and correct punctuation: where is my bag

Answer / working:','Rewrite with a capital letter and correct punctuation: where is my bag','FR — à lire : Réécris avec la majuscule et la bonne ponctuation : où est mon sac

EN — read aloud: Rewrite with a capital letter and correct punctuation: where is my bag

FR : Où est mon sac ?

EN: Where is my bag?

评分： 2 分：大写与问号均正确；1 分：仅一项正确；0 分：两项均未完成。','text','Where is my bag?','Where is my bag?','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q22-fr-CA','g3-q22','3','fr-CA','3. Vocabulaire et phrases','Q22 · 3. Vocabulaire et phrases','Classe par ordre alphabétique : arbre, avion, ami.

Réponse / démarche :','Classe par ordre alphabétique : arbre, avion, ami.','FR — à lire : Classe par ordre alphabétique : arbre, avion, ami.

EN — read aloud: Put in alphabetical order: apple, ant, animal.

### 模块 4：数位与基本运算

允许分解数、画图或使用筹码。乘除题重在分组含义，不要求未经学习的竖式算法。

FR : Ami, arbre, avion.

EN: Animal, ant, apple.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 数位与基本运算：答案','text','Ami, arbre, avion.','Ami, arbre, avion.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q22-en-CA','g3-q22','3','en-CA','3. Vocabulary and sentence skills','Q22 · 3. Vocabulary and sentence skills','Put in alphabetical order: apple, ant, animal.

Answer / working:','Put in alphabetical order: apple, ant, animal.

### 模块 4：数位与基本运算

允许分解数、画图或使用筹码。乘除题重在分组含义，不要求未经学习的竖式算法。','FR — à lire : Classe par ordre alphabétique : arbre, avion, ami.

EN — read aloud: Put in alphabetical order: apple, ant, animal.

### 模块 4：数位与基本运算

允许分解数、画图或使用筹码。乘除题重在分组含义，不要求未经学习的竖式算法。

FR : Ami, arbre, avion.

EN: Animal, ant, apple.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 数位与基本运算：答案','text','Animal, ant, apple.','Animal, ant, apple.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q23-fr-CA','g3-q23','3','fr-CA','4. Nombres et opérations','Q23 · 4. Nombres et opérations','Décompose 608 en centaines, dizaines et unités.

Réponse / démarche :','Décompose 608 en centaines, dizaines et unités.','FR — à lire : Décompose 608 en centaines, dizaines et unités.

EN — read aloud: Split 608 into hundreds, tens and ones.

FR : 6 centaines, 0 dizaine, 8 unités.

EN: 6 hundreds, 0 tens, 8 ones.

评分： 2 分：三项全对；1 分：两项正确；0 分：最多一项正确。','text','6 centaines, 0 dizaine, 8 unités.','6 centaines, 0 dizaine, 8 unités.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q23-en-CA','g3-q23','3','en-CA','4. Place value and operations','Q23 · 4. Place value and operations','Split 608 into hundreds, tens and ones.

Answer / working:','Split 608 into hundreds, tens and ones.','FR — à lire : Décompose 608 en centaines, dizaines et unités.

EN — read aloud: Split 608 into hundreds, tens and ones.

FR : 6 centaines, 0 dizaine, 8 unités.

EN: 6 hundreds, 0 tens, 8 ones.

评分： 2 分：三项全对；1 分：两项正确；0 分：最多一项正确。','text','6 hundreds, 0 tens, 8 ones.','6 hundreds, 0 tens, 8 ones.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q24-fr-CA','g3-q24','3','fr-CA','4. Nombres et opérations','Q24 · 4. Nombres et opérations','Calcule : 248 + 137.

Réponse / démarche :','Calcule : 248 + 137.','FR — à lire : Calcule : 248 + 137.

EN — read aloud: Calculate: 248 + 137.

FR : 385.

EN: 385.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','385.','385.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q24-en-CA','g3-q24','3','en-CA','4. Place value and operations','Q24 · 4. Place value and operations','Calculate: 248 + 137.

Answer / working:','Calculate: 248 + 137.','FR — à lire : Calcule : 248 + 137.

EN — read aloud: Calculate: 248 + 137.

FR : 385.

EN: 385.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','385.','385.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q25-fr-CA','g3-q25','3','fr-CA','4. Nombres et opérations','Q25 · 4. Nombres et opérations','Calcule : 503 − 178.

Réponse / démarche :','Calcule : 503 − 178.','FR — à lire : Calcule : 503 − 178.

EN — read aloud: Calculate: 503 − 178.

FR : 325.

EN: 325.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','325.','325.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q25-en-CA','g3-q25','3','en-CA','4. Place value and operations','Q25 · 4. Place value and operations','Calculate: 503 − 178.

Answer / working:','Calculate: 503 − 178.','FR — à lire : Calcule : 503 − 178.

EN — read aloud: Calculate: 503 − 178.

FR : 325.

EN: 325.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','325.','325.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q26-fr-CA','g3-q26','3','fr-CA','4. Nombres et opérations','Q26 · 4. Nombres et opérations','Complète : 7 +  = 35.

Réponse / démarche :','Complète : 7 +  = 35.','FR — à lire : Complète : 7 +  = 35.

EN — read aloud: Complete: 7 +  = 35.

FR : 28.

EN: 28.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','28.','28.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q26-en-CA','g3-q26','3','en-CA','4. Place value and operations','Q26 · 4. Place value and operations','Complete: 7 +  = 35.

Answer / working:','Complete: 7 +  = 35.','FR — à lire : Complète : 7 +  = 35.

EN — read aloud: Complete: 7 +  = 35.

FR : 28.

EN: 28.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','28.','28.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q27-fr-CA','g3-q27','3','fr-CA','4. Nombres et opérations','Q27 · 4. Nombres et opérations','Dessine 3 groupes de 4 points et écris le total.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine 3 groupes de 4 points et écris le total.','FR — à lire : Dessine 3 groupes de 4 points et écris le total.

EN — read aloud: Draw 3 groups of 4 dots and write the total.

FR : 12 points : 4 + 4 + 4 ou 3 × 4.

EN: 12 dots: 4 + 4 + 4 or 3 × 4.

评分： 2 分：3 组各 4 点且总数 12；1 分：分组或总数正确一项；0 分：均错误。','drawing','12 points : 4 + 4 + 4 ou 3 × 4.','12 points : 4 + 4 + 4 ou 3 × 4.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q27-en-CA','g3-q27','3','en-CA','4. Place value and operations','Q27 · 4. Place value and operations','Draw 3 groups of 4 dots and write the total.

Drawing: use blank paper and write the question number.','Draw 3 groups of 4 dots and write the total.','FR — à lire : Dessine 3 groupes de 4 points et écris le total.

EN — read aloud: Draw 3 groups of 4 dots and write the total.

FR : 12 points : 4 + 4 + 4 ou 3 × 4.

EN: 12 dots: 4 + 4 + 4 or 3 × 4.

评分： 2 分：3 组各 4 点且总数 12；1 分：分组或总数正确一项；0 分：均错误。','drawing','12 dots: 4 + 4 + 4 or 3 × 4.','12 dots: 4 + 4 + 4 or 3 × 4.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q28-fr-CA','g3-q28','3','fr-CA','4. Nombres et opérations','Q28 · 4. Nombres et opérations','Partage 24 jetons également entre 6 enfants. Combien chacun en reçoit-il ?

Réponse / démarche :','Partage 24 jetons également entre 6 enfants. Combien chacun en reçoit-il ?','FR — à lire : Partage 24 jetons également entre 6 enfants. Combien chacun en reçoit-il ?

EN — read aloud: Share 24 counters equally among 6 children. How many does each child receive?

FR : 4 jetons.

EN: 4 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','4 jetons.','4 jetons.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q28-en-CA','g3-q28','3','en-CA','4. Place value and operations','Q28 · 4. Place value and operations','Share 24 counters equally among 6 children. How many does each child receive?

Answer / working:','Share 24 counters equally among 6 children. How many does each child receive?','FR — à lire : Partage 24 jetons également entre 6 enfants. Combien chacun en reçoit-il ?

EN — read aloud: Share 24 counters equally among 6 children. How many does each child receive?

FR : 4 jetons.

EN: 4 counters.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','4 counters.','4 counters.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q29-fr-CA','g3-q29','3','fr-CA','4. Nombres et opérations','Q29 · 4. Nombres et opérations','Complète avec <, > ou = : 391  319.

Réponse / démarche :','Complète avec <, > ou = : 391  319.','FR — à lire : Complète avec <, > ou = : 391  319.

EN — read aloud: Complete with <, > or =: 391  319.

FR : 391 > 319.

EN: 391 > 319.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','391 > 319.','391 > 319.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q29-en-CA','g3-q29','3','en-CA','4. Place value and operations','Q29 · 4. Place value and operations','Complete with <, > or =: 391  319.

Answer / working:','Complete with <, > or =: 391  319.','FR — à lire : Complète avec <, > ou = : 391  319.

EN — read aloud: Complete with <, > or =: 391  319.

FR : 391 > 319.

EN: 391 > 319.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','391 > 319.','391 > 319.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q30-fr-CA','g3-q30','3','fr-CA','4. Nombres et opérations','Q30 · 4. Nombres et opérations','Complète : 95, 100, 105, , .

Réponse / démarche :','Complète : 95, 100, 105, , .','FR — à lire : Complète : 95, 100, 105, , .

EN — read aloud: Complete: 95, 100, 105, , .

### 模块 5：应用题、测量与生活数量

Q34 单位转换、Q36 周长可作为提高练习。未知学科内容可以先标注“未学”，不要直接解释成语言或推理困难。

FR : 110, 115.

EN: 110, 115.

评分： 2 分：两项正确；1 分：一项正确；0 分：均错误。

### 应用题、测量与生活数量：答案','text','110, 115.','110, 115.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q30-en-CA','g3-q30','3','en-CA','4. Place value and operations','Q30 · 4. Place value and operations','Complete: 95, 100, 105, , .

Answer / working:','Complete: 95, 100, 105, , .

### 模块 5：应用题、测量与生活数量

Q34 单位转换、Q36 周长可作为提高练习。未知学科内容可以先标注“未学”，不要直接解释成语言或推理困难。','FR — à lire : Complète : 95, 100, 105, , .

EN — read aloud: Complete: 95, 100, 105, , .

### 模块 5：应用题、测量与生活数量

Q34 单位转换、Q36 周长可作为提高练习。未知学科内容可以先标注“未学”，不要直接解释成语言或推理困难。

FR : 110, 115.

EN: 110, 115.

评分： 2 分：两项正确；1 分：一项正确；0 分：均错误。

### 应用题、测量与生活数量：答案','text','110, 115.','110, 115.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q31-fr-CA','g3-q31','3','fr-CA','5. Problèmes et mesures','Q31 · 5. Problèmes et mesures','Il y a 48 livres. On en emprunte 17, puis on en rapporte 9. Combien y a-t-il de livres maintenant ? Montre ta démarche.

Réponse / démarche :','Il y a 48 livres. On en emprunte 17, puis on en rapporte 9. Combien y a-t-il de livres maintenant ? Montre ta démarche.','FR — à lire : Il y a 48 livres. On en emprunte 17, puis on en rapporte 9. Combien y a-t-il de livres maintenant ? Montre ta démarche.

EN — read aloud: There are 48 books. Students borrow 17, then return 9. How many books are there now? Show your working.

FR : 40 livres : 48 − 17 + 9.

EN: 40 books: 48 − 17 + 9.

评分： 2 分：步骤与结果均正确；1 分：步骤正确但一处计算错误，或只完成正确第一步；0 分：没有有效步骤。','text','40 livres : 48 − 17 + 9.','40 livres : 48 − 17 + 9.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q31-en-CA','g3-q31','3','en-CA','5. Word problems and measurement','Q31 · 5. Word problems and measurement','There are 48 books. Students borrow 17, then return 9. How many books are there now? Show your working.

Answer / working:','There are 48 books. Students borrow 17, then return 9. How many books are there now? Show your working.','FR — à lire : Il y a 48 livres. On en emprunte 17, puis on en rapporte 9. Combien y a-t-il de livres maintenant ? Montre ta démarche.

EN — read aloud: There are 48 books. Students borrow 17, then return 9. How many books are there now? Show your working.

FR : 40 livres : 48 − 17 + 9.

EN: 40 books: 48 − 17 + 9.

评分： 2 分：步骤与结果均正确；1 分：步骤正确但一处计算错误，或只完成正确第一步；0 分：没有有效步骤。','text','40 books: 48 − 17 + 9.','40 books: 48 − 17 + 9.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q32-fr-CA','g3-q32','3','fr-CA','5. Problèmes et mesures','Q32 · 5. Problèmes et mesures','Tu as 10 $. Tu achètes un cahier à 3 $ et une gomme à 2 $. Combien te reste-t-il ?

Réponse / démarche :','Tu as 10 $. Tu achètes un cahier à 3 $ et une gomme à 2 $. Combien te reste-t-il ?','FR — à lire : Tu as 10 $. Tu achètes un cahier à 3 $ et une gomme à 2 $. Combien te reste-t-il ?

EN — read aloud: You have $10. You buy a notebook for $3 and an eraser for $2. How much is left?

FR : 5 $ : 10 − (3 + 2).

EN: $5: 10 − (3 + 2).

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。','text','5 $ : 10 − (3 + 2).','5 $ : 10 − (3 + 2).','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q32-en-CA','g3-q32','3','en-CA','5. Word problems and measurement','Q32 · 5. Word problems and measurement','You have $10. You buy a notebook for $3 and an eraser for $2. How much is left?

Answer / working:','You have $10. You buy a notebook for $3 and an eraser for $2. How much is left?','FR — à lire : Tu as 10 $. Tu achètes un cahier à 3 $ et une gomme à 2 $. Combien te reste-t-il ?

EN — read aloud: You have $10. You buy a notebook for $3 and an eraser for $2. How much is left?

FR : 5 $ : 10 − (3 + 2).

EN: $5: 10 − (3 + 2).

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。','text','$5: 10 − (3 + 2).','$5: 10 − (3 + 2).','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q33-fr-CA','g3-q33','3','fr-CA','5. Problèmes et mesures','Q33 · 5. Problèmes et mesures','Une activité commence à 14 h 10 et dure 20 minutes. À quelle heure finit-elle ?

Réponse / démarche :','Une activité commence à 14 h 10 et dure 20 minutes. À quelle heure finit-elle ?','FR — à lire : Une activité commence à 14 h 10 et dure 20 minutes. À quelle heure finit-elle ?

EN — read aloud: An activity starts at 2:10 p.m. and lasts 20 minutes. What time does it finish?

FR : 14 h 30.

EN: 2:30 p.m.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','14 h 30.','14 h 30.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q33-en-CA','g3-q33','3','en-CA','5. Word problems and measurement','Q33 · 5. Word problems and measurement','An activity starts at 2:10 p.m. and lasts 20 minutes. What time does it finish?

Answer / working:','An activity starts at 2:10 p.m. and lasts 20 minutes. What time does it finish?','FR — à lire : Une activité commence à 14 h 10 et dure 20 minutes. À quelle heure finit-elle ?

EN — read aloud: An activity starts at 2:10 p.m. and lasts 20 minutes. What time does it finish?

FR : 14 h 30.

EN: 2:30 p.m.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','2:30 p.m.','2:30 p.m.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q34-fr-CA','g3-q34','3','fr-CA','5. Problèmes et mesures','Q34 · 5. Problèmes et mesures','Un ruban mesure 1 m 20 cm. Combien cela fait-il de centimètres ?

Réponse / démarche :','Un ruban mesure 1 m 20 cm. Combien cela fait-il de centimètres ?','FR — à lire : Un ruban mesure 1 m 20 cm. Combien cela fait-il de centimètres ?

EN — read aloud: A ribbon is 1 m 20 cm long. How many centimetres is that?

FR : 120 cm.

EN: 120 cm.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','120 cm.','120 cm.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q34-en-CA','g3-q34','3','en-CA','5. Word problems and measurement','Q34 · 5. Word problems and measurement','A ribbon is 1 m 20 cm long. How many centimetres is that?

Answer / working:','A ribbon is 1 m 20 cm long. How many centimetres is that?','FR — à lire : Un ruban mesure 1 m 20 cm. Combien cela fait-il de centimètres ?

EN — read aloud: A ribbon is 1 m 20 cm long. How many centimetres is that?

FR : 120 cm.

EN: 120 cm.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','120 cm.','120 cm.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q35-fr-CA','g3-q35','3','fr-CA','5. Problèmes et mesures','Q35 · 5. Problèmes et mesures','Tu prends la moitié de 12 cartes. Combien de cartes prends-tu ?

Réponse / démarche :','Tu prends la moitié de 12 cartes. Combien de cartes prends-tu ?','FR — à lire : Tu prends la moitié de 12 cartes. Combien de cartes prends-tu ?

EN — read aloud: You take half of 12 cards. How many cards do you take?

FR : 6 cartes.

EN: 6 cards.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6 cartes.','6 cartes.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q35-en-CA','g3-q35','3','en-CA','5. Word problems and measurement','Q35 · 5. Word problems and measurement','You take half of 12 cards. How many cards do you take?

Answer / working:','You take half of 12 cards. How many cards do you take?','FR — à lire : Tu prends la moitié de 12 cartes. Combien de cartes prends-tu ?

EN — read aloud: You take half of 12 cards. How many cards do you take?

FR : 6 cartes.

EN: 6 cards.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','6 cards.','6 cards.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q36-fr-CA','g3-q36','3','fr-CA','5. Problèmes et mesures','Q36 · 5. Problèmes et mesures','Un rectangle mesure 5 cm de long et 3 cm de large. Quelle est la longueur de tout son contour ?

Réponse / démarche :','Un rectangle mesure 5 cm de long et 3 cm de large. Quelle est la longueur de tout son contour ?','FR — à lire : Un rectangle mesure 5 cm de long et 3 cm de large. Quelle est la longueur de tout son contour ?

EN — read aloud: A rectangle is 5 cm long and 3 cm wide. What is the total distance around its edge?

FR : 16 cm : 5 + 3 + 5 + 3.

EN: 16 cm: 5 + 3 + 5 + 3.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','16 cm : 5 + 3 + 5 + 3.','16 cm : 5 + 3 + 5 + 3.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q36-en-CA','g3-q36','3','en-CA','5. Word problems and measurement','Q36 · 5. Word problems and measurement','A rectangle is 5 cm long and 3 cm wide. What is the total distance around its edge?

Answer / working:','A rectangle is 5 cm long and 3 cm wide. What is the total distance around its edge?','FR — à lire : Un rectangle mesure 5 cm de long et 3 cm de large. Quelle est la longueur de tout son contour ?

EN — read aloud: A rectangle is 5 cm long and 3 cm wide. What is the total distance around its edge?

FR : 16 cm : 5 + 3 + 5 + 3.

EN: 16 cm: 5 + 3 + 5 + 3.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','16 cm: 5 + 3 + 5 + 3.','16 cm: 5 + 3 + 5 + 3.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q37-fr-CA','g3-q37','3','fr-CA','5. Problèmes et mesures','Q37 · 5. Problèmes et mesures','Tu as 2 sacs de 5 oranges. Tu manges 3 oranges. Combien en reste-t-il ?

Réponse / démarche :','Tu as 2 sacs de 5 oranges. Tu manges 3 oranges. Combien en reste-t-il ?','FR — à lire : Tu as 2 sacs de 5 oranges. Tu manges 3 oranges. Combien en reste-t-il ?

EN — read aloud: You have 2 bags of 5 oranges. You eat 3 oranges. How many are left?

### 模块 6：规律、逻辑、数据与探究

Q43 的全部数据直接列在题目中。Q44 只要求解释一次改变一个条件的想法，不考科学术语。

FR : 7 oranges : 5 + 5 − 3.

EN: 7 oranges: 5 + 5 − 3.

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。

### 规律、逻辑、数据与探究：答案','text','7 oranges : 5 + 5 − 3.','7 oranges : 5 + 5 − 3.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q37-en-CA','g3-q37','3','en-CA','5. Word problems and measurement','Q37 · 5. Word problems and measurement','You have 2 bags of 5 oranges. You eat 3 oranges. How many are left?

Answer / working:','You have 2 bags of 5 oranges. You eat 3 oranges. How many are left?

### 模块 6：规律、逻辑、数据与探究

Q43 的全部数据直接列在题目中。Q44 只要求解释一次改变一个条件的想法，不考科学术语。','FR — à lire : Tu as 2 sacs de 5 oranges. Tu manges 3 oranges. Combien en reste-t-il ?

EN — read aloud: You have 2 bags of 5 oranges. You eat 3 oranges. How many are left?

### 模块 6：规律、逻辑、数据与探究

Q43 的全部数据直接列在题目中。Q44 只要求解释一次改变一个条件的想法，不考科学术语。

FR : 7 oranges : 5 + 5 − 3.

EN: 7 oranges: 5 + 5 − 3.

评分： 2 分：全部步骤或信息正确；1 分：部分正确、仅有一处步骤错误或遗漏；0 分：没有有效完成。

### 规律、逻辑、数据与探究：答案','text','7 oranges: 5 + 5 − 3.','7 oranges: 5 + 5 − 3.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q38-fr-CA','g3-q38','3','fr-CA','6. Logique, données et recherche','Q38 · 6. Logique, données et recherche','Continue : triangle, carré, cercle, triangle, carré, .

Réponse / démarche :','Continue : triangle, carré, cercle, triangle, carré, .','FR — à lire : Continue : triangle, carré, cercle, triangle, carré, .

EN — read aloud: Continue: triangle, square, circle, triangle, square, .

FR : Cercle.

EN: Circle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Cercle.','Cercle.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q38-en-CA','g3-q38','3','en-CA','6. Logic, data and inquiry','Q38 · 6. Logic, data and inquiry','Continue: triangle, square, circle, triangle, square, .

Answer / working:','Continue: triangle, square, circle, triangle, square, .','FR — à lire : Continue : triangle, carré, cercle, triangle, carré, .

EN — read aloud: Continue: triangle, square, circle, triangle, square, .

FR : Cercle.

EN: Circle.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Circle.','Circle.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q39-fr-CA','g3-q39','3','fr-CA','6. Logique, données et recherche','Q39 · 6. Logique, données et recherche','Chaque nombre est le double du précédent : 3, 6, 12, 24, .

Réponse / démarche :','Chaque nombre est le double du précédent : 3, 6, 12, 24, .','FR — à lire : Chaque nombre est le double du précédent : 3, 6, 12, 24, .

EN — read aloud: Each number is double the previous number: 3, 6, 12, 24, .

FR : 48.

EN: 48.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','48.','48.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q39-en-CA','g3-q39','3','en-CA','6. Logic, data and inquiry','Q39 · 6. Logic, data and inquiry','Each number is double the previous number: 3, 6, 12, 24, .

Answer / working:','Each number is double the previous number: 3, 6, 12, 24, .','FR — à lire : Chaque nombre est le double du précédent : 3, 6, 12, 24, .

EN — read aloud: Each number is double the previous number: 3, 6, 12, 24, .

FR : 48.

EN: 48.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','48.','48.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q40-fr-CA','g3-q40','3','fr-CA','6. Logique, données et recherche','Q40 · 6. Logique, données et recherche','Quel mot ne va pas avec les autres : moto, camion, bicyclette, poire ? Explique.

Réponse / démarche :','Quel mot ne va pas avec les autres : moto, camion, bicyclette, poire ? Explique.','FR — à lire : Quel mot ne va pas avec les autres : moto, camion, bicyclette, poire ? Explique.

EN — read aloud: Which word does not belong: motorbike, truck, bicycle, pear? Explain.

FR : Poire : les autres sont des moyens de transport.

EN: Pear: the others are means of transport.

评分： 2 分：选对并给出类别理由；1 分：只选对；0 分：没有有效分类。','text','Poire : les autres sont des moyens de transport.','Poire : les autres sont des moyens de transport.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q40-en-CA','g3-q40','3','en-CA','6. Logic, data and inquiry','Q40 · 6. Logic, data and inquiry','Which word does not belong: motorbike, truck, bicycle, pear? Explain.

Answer / working:','Which word does not belong: motorbike, truck, bicycle, pear? Explain.','FR — à lire : Quel mot ne va pas avec les autres : moto, camion, bicyclette, poire ? Explique.

EN — read aloud: Which word does not belong: motorbike, truck, bicycle, pear? Explain.

FR : Poire : les autres sont des moyens de transport.

EN: Pear: the others are means of transport.

评分： 2 分：选对并给出类别理由；1 分：只选对；0 分：没有有效分类。','text','Pear: the others are means of transport.','Pear: the others are means of transport.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q41-fr-CA','g3-q41','3','fr-CA','6. Logique, données et recherche','Q41 · 6. Logique, données et recherche','Dessine exactement 3 formes : 2 carrés et 1 triangle. Numérote les formes 1, 2 et 3.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine exactement 3 formes : 2 carrés et 1 triangle. Numérote les formes 1, 2 et 3.','FR — à lire : Dessine exactement 3 formes : 2 carrés et 1 triangle. Numérote les formes 1, 2 et 3.

EN — read aloud: Draw exactly 3 shapes: 2 squares and 1 triangle. Number them 1, 2 and 3.

FR : Deux carrés, un triangle, trois formes numérotées.

EN: Two squares, one triangle, three numbered shapes.

评分： 2 分：形状、总数和编号全对；1 分：满足其中两项；0 分：最多满足一项。','drawing','Deux carrés, un triangle, trois formes numérotées.','Deux carrés, un triangle, trois formes numérotées.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q41-en-CA','g3-q41','3','en-CA','6. Logic, data and inquiry','Q41 · 6. Logic, data and inquiry','Draw exactly 3 shapes: 2 squares and 1 triangle. Number them 1, 2 and 3.

Drawing: use blank paper and write the question number.','Draw exactly 3 shapes: 2 squares and 1 triangle. Number them 1, 2 and 3.','FR — à lire : Dessine exactement 3 formes : 2 carrés et 1 triangle. Numérote les formes 1, 2 et 3.

EN — read aloud: Draw exactly 3 shapes: 2 squares and 1 triangle. Number them 1, 2 and 3.

FR : Deux carrés, un triangle, trois formes numérotées.

EN: Two squares, one triangle, three numbered shapes.

评分： 2 分：形状、总数和编号全对；1 分：满足其中两项；0 分：最多满足一项。','drawing','Two squares, one triangle, three numbered shapes.','Two squares, one triangle, three numbered shapes.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q42-fr-CA','g3-q42','3','fr-CA','6. Logique, données et recherche','Q42 · 6. Logique, données et recherche','Dans une file, Ana est devant Benoît. Caro est devant Ana. Qui est au milieu des trois ?

Réponse / démarche :','Dans une file, Ana est devant Benoît. Caro est devant Ana. Qui est au milieu des trois ?','FR — à lire : Dans une file, Ana est devant Benoît. Caro est devant Ana. Qui est au milieu des trois ?

EN — read aloud: In a line, Ana is ahead of Benoît. Caro is ahead of Ana. Who is in the middle of the three?

FR : Ana : Caro, Ana, Benoît.

EN: Ana: Caro, Ana, Benoît.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Ana : Caro, Ana, Benoît.','Ana : Caro, Ana, Benoît.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q42-en-CA','g3-q42','3','en-CA','6. Logic, data and inquiry','Q42 · 6. Logic, data and inquiry','In a line, Ana is ahead of Benoît. Caro is ahead of Ana. Who is in the middle of the three?

Answer / working:','In a line, Ana is ahead of Benoît. Caro is ahead of Ana. Who is in the middle of the three?','FR — à lire : Dans une file, Ana est devant Benoît. Caro est devant Ana. Qui est au milieu des trois ?

EN — read aloud: In a line, Ana is ahead of Benoît. Caro is ahead of Ana. Who is in the middle of the three?

FR : Ana : Caro, Ana, Benoît.

EN: Ana: Caro, Ana, Benoît.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Ana: Caro, Ana, Benoît.','Ana: Caro, Ana, Benoît.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q43-fr-CA','g3-q43','3','fr-CA','6. Logique, données et recherche','Q43 · 6. Logique, données et recherche','Livres lus : Emma 5, Ali 8, Zoé 6. Qui en a lu le plus ? Combien de plus qu’Emma ?

Réponse / démarche :','Livres lus : Emma 5, Ali 8, Zoé 6. Qui en a lu le plus ? Combien de plus qu’Emma ?','FR — à lire : Livres lus : Emma 5, Ali 8, Zoé 6. Qui en a lu le plus ? Combien de plus qu’Emma ?

EN — read aloud: Books read: Emma 5, Ali 8, Zoé 6. Who read the most? How many more than Emma?

FR : Ali; 3 livres de plus.

EN: Ali; 3 more books.

评分： 2 分：Ali 和 3 都正确；1 分：其中一项正确；0 分：两项均错误。','text','Ali; 3 livres de plus.','Ali; 3 livres de plus.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q43-en-CA','g3-q43','3','en-CA','6. Logic, data and inquiry','Q43 · 6. Logic, data and inquiry','Books read: Emma 5, Ali 8, Zoé 6. Who read the most? How many more than Emma?

Answer / working:','Books read: Emma 5, Ali 8, Zoé 6. Who read the most? How many more than Emma?','FR — à lire : Livres lus : Emma 5, Ali 8, Zoé 6. Qui en a lu le plus ? Combien de plus qu’Emma ?

EN — read aloud: Books read: Emma 5, Ali 8, Zoé 6. Who read the most? How many more than Emma?

FR : Ali; 3 livres de plus.

EN: Ali; 3 more books.

评分： 2 分：Ali 和 3 都正确；1 分：其中一项正确；0 分：两项均错误。','text','Ali; 3 more books.','Ali; 3 more books.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q44-fr-CA','g3-q44','3','fr-CA','6. Logique, données et recherche','Q44 · 6. Logique, données et recherche','Tu veux savoir si la quantité d’eau change la germination. Tu as deux pots et des graines identiques. Faut-il changer seulement l’eau, ou aussi la taille des pots ? Pourquoi ?

Réponse orale. L’adulte peut noter mes mots :','Tu veux savoir si la quantité d’eau change la germination. Tu as deux pots et des graines identiques. Faut-il changer seulement l’eau, ou aussi la taille des pots ? Pourquoi ?','FR — à lire : Tu veux savoir si la quantité d’eau change la germination. Tu as deux pots et des graines identiques. Faut-il changer seulement l’eau, ou aussi la taille des pots ? Pourquoi ?

EN — read aloud: You want to know whether the amount of water changes germination. You have two pots and identical seeds. Should you change only the water, or also the pot size? Why?

### 模块 7：写作、表达、合作与反思

Q45 的 3–4 句是本册写作要求，非学校字数要求。语法模块以外，优先看表达是否可理解、信息是否完整。

FR : Changer seulement la quantité d’eau; garder les autres conditions semblables pour comparer l’effet de l’eau.

EN: Change only the amount of water; keep other conditions similar so you can compare the effect of water.

评分： 2 分：选只改水量并说明公平比较／识别水的作用；1 分：只选对；0 分：没有有效比较想法。

### 写作、表达、合作与反思：答案','text','Changer seulement la quantité d’eau; garder les autres conditions semblables pour comparer l’effet de l’eau.','Changer seulement la quantité d’eau; garder les autres conditions semblables pour comparer l’effet de l’eau.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q44-en-CA','g3-q44','3','en-CA','6. Logic, data and inquiry','Q44 · 6. Logic, data and inquiry','You want to know whether the amount of water changes germination. You have two pots and identical seeds. Should you change only the water, or also the pot size? Why?

Oral answer. An adult may record my words:','You want to know whether the amount of water changes germination. You have two pots and identical seeds. Should you change only the water, or also the pot size? Why?

### 模块 7：写作、表达、合作与反思

Q45 的 3–4 句是本册写作要求，非学校字数要求。语法模块以外，优先看表达是否可理解、信息是否完整。','FR — à lire : Tu veux savoir si la quantité d’eau change la germination. Tu as deux pots et des graines identiques. Faut-il changer seulement l’eau, ou aussi la taille des pots ? Pourquoi ?

EN — read aloud: You want to know whether the amount of water changes germination. You have two pots and identical seeds. Should you change only the water, or also the pot size? Why?

### 模块 7：写作、表达、合作与反思

Q45 的 3–4 句是本册写作要求，非学校字数要求。语法模块以外，优先看表达是否可理解、信息是否完整。

FR : Changer seulement la quantité d’eau; garder les autres conditions semblables pour comparer l’effet de l’eau.

EN: Change only the amount of water; keep other conditions similar so you can compare the effect of water.

评分： 2 分：选只改水量并说明公平比较／识别水的作用；1 分：只选对；0 分：没有有效比较想法。

### 写作、表达、合作与反思：答案','text','Change only the amount of water; keep other conditions similar so you can compare the effect of water.','Change only the amount of water; keep other conditions similar so you can compare the effect of water.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q45-fr-CA','g3-q45','3','fr-CA','7. Écrire, expliquer et coopérer','Q45 · 7. Écrire, expliquer et coopérer','Écris 3 ou 4 phrases racontant un petit problème et sa solution. Utilise un début, un événement et une fin.','Écris 3 ou 4 phrases racontant un petit problème et sa solution. Utilise un début, un événement et une fin.','FR — à lire : Écris 3 ou 4 phrases racontant un petit problème et sa solution. Utilise un début, un événement et une fin.

EN — read aloud: Write 3 or 4 sentences about a small problem and its solution. Include a beginning, an event and an ending.

FR : Exemple : Léa cherche son livre. Elle regarde sous son lit. Elle le trouve dans son sac. Elle peut enfin lire son histoire.

EN: Example: Léa looks for her book. She checks under her bed. She finds it in her bag. Now she can read her story.

评分： 2 分：3–4 句可理解，问题、事件和解决结果清楚；1 分：有相关故事但结构或信息不完整；0 分：没有形成相关叙述。','text','Exemple : Léa cherche son livre. Elle regarde sous son lit. Elle le trouve dans son sac. Elle peut enfin lire son histoire.','Exemple : Léa cherche son livre. Elle regarde sous son lit. Elle le trouve dans son sac. Elle peut enfin lire son histoire.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q45-en-CA','g3-q45','3','en-CA','7. Writing, explaining and cooperating','Q45 · 7. Writing, explaining and cooperating','Write 3 or 4 sentences about a small problem and its solution. Include a beginning, an event and an ending.','Write 3 or 4 sentences about a small problem and its solution. Include a beginning, an event and an ending.','FR — à lire : Écris 3 ou 4 phrases racontant un petit problème et sa solution. Utilise un début, un événement et une fin.

EN — read aloud: Write 3 or 4 sentences about a small problem and its solution. Include a beginning, an event and an ending.

FR : Exemple : Léa cherche son livre. Elle regarde sous son lit. Elle le trouve dans son sac. Elle peut enfin lire son histoire.

EN: Example: Léa looks for her book. She checks under her bed. She finds it in her bag. Now she can read her story.

评分： 2 分：3–4 句可理解，问题、事件和解决结果清楚；1 分：有相关故事但结构或信息不完整；0 分：没有形成相关叙述。','text','Example: Léa looks for her book. She checks under her bed. She finds it in her bag. Now she can read her story.','Example: Léa looks for her book. She checks under her bed. She finds it in her bag. Now she can read her story.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q46-fr-CA','g3-q46','3','fr-CA','7. Écrire, expliquer et coopérer','Q46 · 7. Écrire, expliquer et coopérer','Choisis un animal que tu connais. Donne deux faits à son sujet et pose une question pour en apprendre davantage.

Réponse orale. L’adulte peut noter mes mots :','Choisis un animal que tu connais. Donne deux faits à son sujet et pose une question pour en apprendre davantage.','FR — à lire : Choisis un animal que tu connais. Donne deux faits à son sujet et pose une question pour en apprendre davantage.

EN — read aloud: Choose an animal you know. Give two facts about it and ask one question to learn more.

FR : Exemple : le chat a des moustaches et des griffes. Pourquoi ronronne-t-il ?

EN: Example: a cat has whiskers and claws. Why does it purr?

评分： 2 分：两个合理事实和一个相关问题；1 分：只完成部分要求；0 分：没有相关信息。','text','Exemple : le chat a des moustaches et des griffes. Pourquoi ronronne-t-il ?','Exemple : le chat a des moustaches et des griffes. Pourquoi ronronne-t-il ?','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q46-en-CA','g3-q46','3','en-CA','7. Writing, explaining and cooperating','Q46 · 7. Writing, explaining and cooperating','Choose an animal you know. Give two facts about it and ask one question to learn more.

Oral answer. An adult may record my words:','Choose an animal you know. Give two facts about it and ask one question to learn more.','FR — à lire : Choisis un animal que tu connais. Donne deux faits à son sujet et pose une question pour en apprendre davantage.

EN — read aloud: Choose an animal you know. Give two facts about it and ask one question to learn more.

FR : Exemple : le chat a des moustaches et des griffes. Pourquoi ronronne-t-il ?

EN: Example: a cat has whiskers and claws. Why does it purr?

评分： 2 分：两个合理事实和一个相关问题；1 分：只完成部分要求；0 分：没有相关信息。','text','Example: a cat has whiskers and claws. Why does it purr?','Example: a cat has whiskers and claws. Why does it purr?','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q47-fr-CA','g3-q47','3','fr-CA','7. Écrire, expliquer et coopérer','Q47 · 7. Écrire, expliquer et coopérer','Préfères-tu lire un livre ou jouer à un jeu de société ? Donne ton choix et deux raisons.

Réponse orale. L’adulte peut noter mes mots :','Préfères-tu lire un livre ou jouer à un jeu de société ? Donne ton choix et deux raisons.','FR — à lire : Préfères-tu lire un livre ou jouer à un jeu de société ? Donne ton choix et deux raisons.

EN — read aloud: Would you rather read a book or play a board game? Give your choice and two reasons.

FR : Tout choix est accepté avec deux raisons pertinentes, par exemple : un jeu de société permet de jouer ensemble et de réfléchir à une stratégie.

EN: Either choice is accepted with two relevant reasons, such as: a board game lets us play together and think about a strategy.

评分： 2 分：选择明确且有两个理由；1 分：只有一个理由；0 分：没有相关理由。','text','Tout choix est accepté avec deux raisons pertinentes, par exemple : un jeu de société permet de jouer ensemble et de réfléchir à une stratégie.','Tout choix est accepté avec deux raisons pertinentes, par exemple : un jeu de société permet de jouer ensemble et de réfléchir à une stratégie.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q47-en-CA','g3-q47','3','en-CA','7. Writing, explaining and cooperating','Q47 · 7. Writing, explaining and cooperating','Would you rather read a book or play a board game? Give your choice and two reasons.

Oral answer. An adult may record my words:','Would you rather read a book or play a board game? Give your choice and two reasons.','FR — à lire : Préfères-tu lire un livre ou jouer à un jeu de société ? Donne ton choix et deux raisons.

EN — read aloud: Would you rather read a book or play a board game? Give your choice and two reasons.

FR : Tout choix est accepté avec deux raisons pertinentes, par exemple : un jeu de société permet de jouer ensemble et de réfléchir à une stratégie.

EN: Either choice is accepted with two relevant reasons, such as: a board game lets us play together and think about a strategy.

评分： 2 分：选择明确且有两个理由；1 分：只有一个理由；0 分：没有相关理由。','text','Either choice is accepted with two relevant reasons, such as: a board game lets us play together and think about a strategy.','Either choice is accepted with two relevant reasons, such as: a board game lets us play together and think about a strategy.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q48-fr-CA','g3-q48','3','fr-CA','7. Écrire, expliquer et coopérer','Q48 · 7. Écrire, expliquer et coopérer','Ton partenaire et toi avez deux idées différentes pour construire un pont. Propose une manière de choisir ensemble.

Réponse orale. L’adulte peut noter mes mots :','Ton partenaire et toi avez deux idées différentes pour construire un pont. Propose une manière de choisir ensemble.','FR — à lire : Ton partenaire et toi avez deux idées différentes pour construire un pont. Propose une manière de choisir ensemble.

EN — read aloud: You and your partner have different ideas for building a bridge. Suggest a way to choose together.

FR : Par exemple : écouter les deux idées, essayer chacune et comparer la solidité.

EN: For example: listen to both ideas, try each one and compare how strong they are.

评分： 2 分：回答切题并有具体信息或理由；1 分：切题但信息不足；0 分：没有相关回答。','text','Par exemple : écouter les deux idées, essayer chacune et comparer la solidité.','Par exemple : écouter les deux idées, essayer chacune et comparer la solidité.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q48-en-CA','g3-q48','3','en-CA','7. Writing, explaining and cooperating','Q48 · 7. Writing, explaining and cooperating','You and your partner have different ideas for building a bridge. Suggest a way to choose together.

Oral answer. An adult may record my words:','You and your partner have different ideas for building a bridge. Suggest a way to choose together.','FR — à lire : Ton partenaire et toi avez deux idées différentes pour construire un pont. Propose une manière de choisir ensemble.

EN — read aloud: You and your partner have different ideas for building a bridge. Suggest a way to choose together.

FR : Par exemple : écouter les deux idées, essayer chacune et comparer la solidité.

EN: For example: listen to both ideas, try each one and compare how strong they are.

评分： 2 分：回答切题并有具体信息或理由；1 分：切题但信息不足；0 分：没有相关回答。','text','For example: listen to both ideas, try each one and compare how strong they are.','For example: listen to both ideas, try each one and compare how strong they are.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q49-fr-CA','g3-q49','3','fr-CA','7. Écrire, expliquer et coopérer','Q49 · 7. Écrire, expliquer et coopérer','Tu renverses de l’eau sur le dessin d’un camarade. Que peux-tu dire et faire ?

Réponse orale. L’adulte peut noter mes mots :','Tu renverses de l’eau sur le dessin d’un camarade. Que peux-tu dire et faire ?','FR — à lire : Tu renverses de l’eau sur le dessin d’un camarade. Que peux-tu dire et faire ?

EN — read aloud: You spill water on a classmate’s drawing. What could you say and do?

FR : Par exemple : expliquer ce qui s’est passé, présenter ses excuses et proposer d’aider à réparer ou refaire le dessin.

EN: For example: explain what happened, apologise and offer to help fix or redo the drawing.

评分： 2 分：有合适沟通和可行补救；1 分：只有沟通或补救一项；0 分：没有相关办法。','drawing','Par exemple : expliquer ce qui s’est passé, présenter ses excuses et proposer d’aider à réparer ou refaire le dessin.','Par exemple : expliquer ce qui s’est passé, présenter ses excuses et proposer d’aider à réparer ou refaire le dessin.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q49-en-CA','g3-q49','3','en-CA','7. Writing, explaining and cooperating','Q49 · 7. Writing, explaining and cooperating','You spill water on a classmate’s drawing. What could you say and do?

Oral answer. An adult may record my words:','You spill water on a classmate’s drawing. What could you say and do?','FR — à lire : Tu renverses de l’eau sur le dessin d’un camarade. Que peux-tu dire et faire ?

EN — read aloud: You spill water on a classmate’s drawing. What could you say and do?

FR : Par exemple : expliquer ce qui s’est passé, présenter ses excuses et proposer d’aider à réparer ou refaire le dessin.

EN: For example: explain what happened, apologise and offer to help fix or redo the drawing.

评分： 2 分：有合适沟通和可行补救；1 分：只有沟通或补救一项；0 分：没有相关办法。','drawing','For example: explain what happened, apologise and offer to help fix or redo the drawing.','For example: explain what happened, apologise and offer to help fix or redo the drawing.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q50-fr-CA','g3-q50','3','fr-CA','7. Écrire, expliquer et coopérer','Q50 · 7. Écrire, expliquer et coopérer','Choisis une réponse de cette fiche. Explique comment tu pourrais la vérifier et ce que tu changerais si tu trouvais une erreur.

Réponse orale. L’adulte peut noter mes mots :','Choisis une réponse de cette fiche. Explique comment tu pourrais la vérifier et ce que tu changerais si tu trouvais une erreur.','FR — à lire : Choisis une réponse de cette fiche. Explique comment tu pourrais la vérifier et ce que tu changerais si tu trouvais une erreur.

EN — read aloud: Choose an answer from this booklet. Explain how you could check it and what you would change if you found a mistake.

FR : Par exemple : refaire un calcul avec un dessin, comparer les résultats, puis corriger l’étape où l’erreur apparaît.

EN: For example: redo a calculation using a drawing, compare the results, then correct the step where the mistake appears.

评分： 2 分：提出有效检查方法并说明如何修正；1 分：只完成一项；0 分：没有可行方法。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 听指令与听力推理 |  |  |  |  |
| 独立阅读、信息提取与推断 |  |  |  |  |
| 词汇、语法与句子组织 |  |  |  |  |
| 数位与基本运算 |  |  |  |  |
| 应用题、测量与生活数量 |  |  |  |  |
| 规律、逻辑、数据与探究 |  |  |  |  |
| 写作、表达、合作与反思 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','Par exemple : refaire un calcul avec un dessin, comparer les résultats, puis corriger l’étape où l’erreur apparaît.','Par exemple : refaire un calcul avec un dessin, comparer les résultats, puis corriger l’étape où l’erreur apparaît.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g3-q50-en-CA','g3-q50','3','en-CA','7. Writing, explaining and cooperating','Q50 · 7. Writing, explaining and cooperating','Choose an answer from this booklet. Explain how you could check it and what you would change if you found a mistake.

Oral answer. An adult may record my words:','Choose an answer from this booklet. Explain how you could check it and what you would change if you found a mistake.','FR — à lire : Choisis une réponse de cette fiche. Explique comment tu pourrais la vérifier et ce que tu changerais si tu trouvais une erreur.

EN — read aloud: Choose an answer from this booklet. Explain how you could check it and what you would change if you found a mistake.

FR : Par exemple : refaire un calcul avec un dessin, comparer les résultats, puis corriger l’étape où l’erreur apparaît.

EN: For example: redo a calculation using a drawing, compare the results, then correct the step where the mistake appears.

评分： 2 分：提出有效检查方法并说明如何修正；1 分：只完成一项；0 分：没有可行方法。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 听指令与听力推理 |  |  |  |  |
| 独立阅读、信息提取与推断 |  |  |  |  |
| 词汇、语法与句子组织 |  |  |  |  |
| 数位与基本运算 |  |  |  |  |
| 应用题、测量与生活数量 |  |  |  |  |
| 规律、逻辑、数据与探究 |  |  |  |  |
| 写作、表达、合作与反思 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','For example: redo a calculation using a drawing, compare the results, then correct the step where the mistake appears.','For example: redo a calculation using a drawing, compare the results, then correct the step where the mistake appears.','draft','full','小学三年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q01-fr-CA','g4-q01','4','fr-CA','1. Écouter et organiser les informations','Q01 · 1. Écouter et organiser les informations','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Écris 403. Entoure le chiffre des centaines et souligne celui des unités.','FR — à lire : Écris 403. Entoure le chiffre des centaines et souligne celui des unités.

EN — read aloud: Write 403. Circle the hundreds digit and underline the ones digit.

FR : 403, avec le 4 entouré et le 3 souligné.

EN: 403, with 4 circled and 3 underlined.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','403, avec le 4 entouré et le 3 souligné.','403, avec le 4 entouré et le 3 souligné.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q01-en-CA','g4-q01','4','en-CA','1. Listening and organising information','Q01 · 1. Listening and organising information','Listen to the adult, then do the activity.

Answer / working:','Write 403. Circle the hundreds digit and underline the ones digit.','FR — à lire : Écris 403. Entoure le chiffre des centaines et souligne celui des unités.

EN — read aloud: Write 403. Circle the hundreds digit and underline the ones digit.

FR : 403, avec le 4 entouré et le 3 souligné.

EN: 403, with 4 circled and 3 underlined.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','403, with 4 circled and 3 underlined.','403, with 4 circled and 3 underlined.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q02-fr-CA','g4-q02','4','fr-CA','1. Écouter et organiser les informations','Q02 · 1. Écouter et organiser les informations','Écoute l’adulte, puis réalise l’activité.

Dessin : utilise une feuille blanche et écris le numéro de la question.','Dessine un rectangle. Écris 7 à l’intérieur, fais un point à gauche et une étoile au-dessus.','FR — à lire : Dessine un rectangle. Écris 7 à l’intérieur, fais un point à gauche et une étoile au-dessus.

EN — read aloud: Draw a rectangle. Write 7 inside it, put a dot on its left and a star above it.

FR : Un rectangle contenant 7, un point à gauche et une étoile au-dessus.

EN: A rectangle containing 7, a dot on the left and a star above it.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','drawing','Un rectangle contenant 7, un point à gauche et une étoile au-dessus.','Un rectangle contenant 7, un point à gauche et une étoile au-dessus.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q02-en-CA','g4-q02','4','en-CA','1. Listening and organising information','Q02 · 1. Listening and organising information','Listen to the adult, then do the activity.

Drawing: use blank paper and write the question number.','Draw a rectangle. Write 7 inside it, put a dot on its left and a star above it.','FR — à lire : Dessine un rectangle. Écris 7 à l’intérieur, fais un point à gauche et une étoile au-dessus.

EN — read aloud: Draw a rectangle. Write 7 inside it, put a dot on its left and a star above it.

FR : Un rectangle contenant 7, un point à gauche et une étoile au-dessus.

EN: A rectangle containing 7, a dot on the left and a star above it.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','drawing','A rectangle containing 7, a dot on the left and a star above it.','A rectangle containing 7, a dot on the left and a star above it.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q03-fr-CA','g4-q03','4','fr-CA','1. Écouter et organiser les informations','Q03 · 1. Écouter et organiser les informations','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Écoute : 5, 2, 9, 4. Écris ces quatre nombres dans l’ordre inverse.','FR — à lire : Écoute : 5, 2, 9, 4. Écris ces quatre nombres dans l’ordre inverse.

EN — read aloud: Listen: 5, 2, 9, 4. Write these four numbers in reverse order.

FR : 4, 9, 2, 5.

EN: 4, 9, 2, 5.

评分： 2 分：逆序全部正确；1 分：逆序思路正确但一项遗漏或错位；0 分：没有正确逆序结果。','text','4, 9, 2, 5.','4, 9, 2, 5.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q03-en-CA','g4-q03','4','en-CA','1. Listening and organising information','Q03 · 1. Listening and organising information','Listen to the adult, then do the activity.

Answer / working:','Listen: 5, 2, 9, 4. Write these four numbers in reverse order.','FR — à lire : Écoute : 5, 2, 9, 4. Écris ces quatre nombres dans l’ordre inverse.

EN — read aloud: Listen: 5, 2, 9, 4. Write these four numbers in reverse order.

FR : 4, 9, 2, 5.

EN: 4, 9, 2, 5.

评分： 2 分：逆序全部正确；1 分：逆序思路正确但一项遗漏或错位；0 分：没有正确逆序结果。','text','4, 9, 2, 5.','4, 9, 2, 5.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q04-fr-CA','g4-q04','4','fr-CA','1. Écouter et organiser les informations','Q04 · 1. Écouter et organiser les informations','Écoute l’adulte, puis réalise l’activité.

Réponse / démarche :','Prends 6. Multiplie par 3, puis ajoute 4. Écris le résultat et tes étapes.','FR — à lire : Prends 6. Multiplie par 3, puis ajoute 4. Écris le résultat et tes étapes.

EN — read aloud: Start with 6. Multiply by 3, then add 4. Write the result and your steps.

听力材料 L1：在 Q05 前朗读；适用于 Q05–Q08。所选语言完整读两遍。

Texte à écouter L1

> Lundi, la classe de Sami visite un jardin. Le bus devait arriver à 9 h 15, mais il arrive avec dix minutes de retard. Avant de monter, les élèves vérifient leur bouteille d’eau et leur carnet. Comme il pleut, le guide commence la visite dans une serre plutôt que dehors.

Listening passage L1

> On Monday, Sami’s class visits a garden. The bus was due to arrive at 9:15 a.m., but it arrives ten minutes late. Before getting on, the students check their water bottles and notebooks. Because it is raining, the guide starts the visit in a greenhouse rather than outdoors.

FR : 22 : 6 × 3 + 4.

EN: 22: 6 × 3 + 4.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','22 : 6 × 3 + 4.','22 : 6 × 3 + 4.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q04-en-CA','g4-q04','4','en-CA','1. Listening and organising information','Q04 · 1. Listening and organising information','Listen to the adult, then do the activity.

Answer / working:','Start with 6. Multiply by 3, then add 4. Write the result and your steps.','FR — à lire : Prends 6. Multiplie par 3, puis ajoute 4. Écris le résultat et tes étapes.

EN — read aloud: Start with 6. Multiply by 3, then add 4. Write the result and your steps.

听力材料 L1：在 Q05 前朗读；适用于 Q05–Q08。所选语言完整读两遍。

Texte à écouter L1

> Lundi, la classe de Sami visite un jardin. Le bus devait arriver à 9 h 15, mais il arrive avec dix minutes de retard. Avant de monter, les élèves vérifient leur bouteille d’eau et leur carnet. Comme il pleut, le guide commence la visite dans une serre plutôt que dehors.

Listening passage L1

> On Monday, Sami’s class visits a garden. The bus was due to arrive at 9:15 a.m., but it arrives ten minutes late. Before getting on, the students check their water bottles and notebooks. Because it is raining, the guide starts the visit in a greenhouse rather than outdoors.

FR : 22 : 6 × 3 + 4.

EN: 22: 6 × 3 + 4.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','22: 6 × 3 + 4.','22: 6 × 3 + 4.','draft','answer_area_only','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q05-fr-CA','g4-q05','4','fr-CA','1. Écouter et organiser les informations','Q05 · 1. Écouter et organiser les informations','À quelle heure le bus arrive-t-il ?

Réponse / démarche :','À quelle heure le bus arrive-t-il ?','FR — à lire : À quelle heure le bus arrive-t-il ?

EN — read aloud: At what time does the bus arrive?

FR : 9 h 25.

EN: 9:25 a.m.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9 h 25.','9 h 25.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q05-en-CA','g4-q05','4','en-CA','1. Listening and organising information','Q05 · 1. Listening and organising information','At what time does the bus arrive?

Answer / working:','At what time does the bus arrive?','FR — à lire : À quelle heure le bus arrive-t-il ?

EN — read aloud: At what time does the bus arrive?

FR : 9 h 25.

EN: 9:25 a.m.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','9:25 a.m.','9:25 a.m.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q06-fr-CA','g4-q06','4','fr-CA','1. Écouter et organiser les informations','Q06 · 1. Écouter et organiser les informations','Quels sont les deux objets que les élèves vérifient ?

Réponse / démarche :','Quels sont les deux objets que les élèves vérifient ?','FR — à lire : Quels sont les deux objets que les élèves vérifient ?

EN — read aloud: Which two things do the students check?

FR : Leur bouteille d’eau et leur carnet.

EN: Their water bottles and notebooks.

评分： 2 分：两项都对；1 分：一项正确；0 分：没有正确物品。','text','Leur bouteille d’eau et leur carnet.','Leur bouteille d’eau et leur carnet.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q06-en-CA','g4-q06','4','en-CA','1. Listening and organising information','Q06 · 1. Listening and organising information','Which two things do the students check?

Answer / working:','Which two things do the students check?','FR — à lire : Quels sont les deux objets que les élèves vérifient ?

EN — read aloud: Which two things do the students check?

FR : Leur bouteille d’eau et leur carnet.

EN: Their water bottles and notebooks.

评分： 2 分：两项都对；1 分：一项正确；0 分：没有正确物品。','text','Their water bottles and notebooks.','Their water bottles and notebooks.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q07-fr-CA','g4-q07','4','fr-CA','1. Écouter et organiser les informations','Q07 · 1. Écouter et organiser les informations','Dans quel lieu le guide commence-t-il la visite ?

Réponse / démarche :','Dans quel lieu le guide commence-t-il la visite ?','FR — à lire : Dans quel lieu le guide commence-t-il la visite ?

EN — read aloud: Where does the guide start the visit?

FR : Dans une serre.

EN: In a greenhouse.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Dans une serre.','Dans une serre.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q07-en-CA','g4-q07','4','en-CA','1. Listening and organising information','Q07 · 1. Listening and organising information','Where does the guide start the visit?

Answer / working:','Where does the guide start the visit?','FR — à lire : Dans quel lieu le guide commence-t-il la visite ?

EN — read aloud: Where does the guide start the visit?

FR : Dans une serre.

EN: In a greenhouse.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','In a greenhouse.','In a greenhouse.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q08-fr-CA','g4-q08','4','fr-CA','1. Écouter et organiser les informations','Q08 · 1. Écouter et organiser les informations','Pourquoi le guide commence-t-il à cet endroit ?

Réponse / démarche :','Pourquoi le guide commence-t-il à cet endroit ?','FR — à lire : Pourquoi le guide commence-t-il à cet endroit ?

EN — read aloud: Why does the guide start in that place?

### 模块 2：独立阅读、证据与实用信息

本模块只读组织指令，由学生独立阅读。R1 中降雨与鸟数的关系只是人物假设，不是题册给出的科学定论。

FR : Parce qu’il pleut; la serre permet de commencer à l’abri.

EN: Because it is raining; the greenhouse allows them to start under shelter.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 独立阅读、证据与实用信息：答案','text','Parce qu’il pleut; la serre permet de commencer à l’abri.','Parce qu’il pleut; la serre permet de commencer à l’abri.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q08-en-CA','g4-q08','4','en-CA','1. Listening and organising information','Q08 · 1. Listening and organising information','Why does the guide start in that place?

Answer / working:','Why does the guide start in that place?

### 模块 2：独立阅读、证据与实用信息

本模块只读组织指令，由学生独立阅读。R1 中降雨与鸟数的关系只是人物假设，不是题册给出的科学定论。','FR — à lire : Pourquoi le guide commence-t-il à cet endroit ?

EN — read aloud: Why does the guide start in that place?

### 模块 2：独立阅读、证据与实用信息

本模块只读组织指令，由学生独立阅读。R1 中降雨与鸟数的关系只是人物假设，不是题册给出的科学定论。

FR : Parce qu’il pleut; la serre permet de commencer à l’abri.

EN: Because it is raining; the greenhouse allows them to start under shelter.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 独立阅读、证据与实用信息：答案','text','Because it is raining; the greenhouse allows them to start under shelter.','Because it is raining; the greenhouse allows them to start under shelter.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q09-fr-CA','g4-q09','4','fr-CA','2. Lire, déduire et justifier','Q09 · 2. Lire, déduire et justifier','Dans R1, qui compte les oiseaux et à quel rythme le fait-elle ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q09.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Inès, chaque matin à la même heure pendant quatre jours.

EN: Inès, each morning at the same time for four days.

评分： 2 分：人物与频率均正确；1 分：只答对一项；0 分：均错误。','text','Inès, chaque matin à la même heure pendant quatre jours.','Inès, chaque matin à la même heure pendant quatre jours.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q09-en-CA','g4-q09','4','en-CA','2. Reading, evidence and practical information','Q09 · 2. Reading, evidence and practical information','In R1, who counts the birds and how often does she do it?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q09.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q09.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q09.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Inès, chaque matin à la même heure pendant quatre jours.

EN: Inès, each morning at the same time for four days.

评分： 2 分：人物与频率均正确；1 分：只答对一项；0 分：均错误。','text','Inès, each morning at the same time for four days.','Inès, each morning at the same time for four days.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q10-fr-CA','g4-q10','4','fr-CA','2. Lire, déduire et justifier','Q10 · 2. Lire, déduire et justifier','Dans R1, quel jour Inès voit-elle le plus d’oiseaux ? Combien en voit-elle ce jour-là ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q10.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Jeudi, 6 oiseaux.

EN: Thursday, 6 birds.

评分： 2 分：日期和数量均正确；1 分：只正确一项；0 分：均错误。','text','Jeudi, 6 oiseaux.','Jeudi, 6 oiseaux.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q10-en-CA','g4-q10','4','en-CA','2. Reading, evidence and practical information','Q10 · 2. Reading, evidence and practical information','In R1, on which day does Inès see the most birds? How many does she see that day?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q10.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q10.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q10.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Jeudi, 6 oiseaux.

EN: Thursday, 6 birds.

评分： 2 分：日期和数量均正确；1 分：只正确一项；0 分：均错误。','text','Thursday, 6 birds.','Thursday, 6 birds.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q11-fr-CA','g4-q11','4','fr-CA','2. Lire, déduire et justifier','Q11 · 2. Lire, déduire et justifier','Dans R1, pourquoi Inès écrit-elle « peut-être » ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q11.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Elle propose une explication possible, mais n’a pas encore assez d’observations pour en être certaine.

EN: She is suggesting a possible explanation, but does not yet have enough observations to be certain.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Elle propose une explication possible, mais n’a pas encore assez d’observations pour en être certaine.','Elle propose une explication possible, mais n’a pas encore assez d’observations pour en être certaine.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q11-en-CA','g4-q11','4','en-CA','2. Reading, evidence and practical information','Q11 · 2. Reading, evidence and practical information','In R1, why does Inès write “might”?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q11.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q11.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q11.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Elle propose une explication possible, mais n’a pas encore assez d’observations pour en être certaine.

EN: She is suggesting a possible explanation, but does not yet have enough observations to be certain.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','She is suggesting a possible explanation, but does not yet have enough observations to be certain.','She is suggesting a possible explanation, but does not yet have enough observations to be certain.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q12-fr-CA','g4-q12','4','fr-CA','2. Lire, déduire et justifier','Q12 · 2. Lire, déduire et justifier','Dans R1, quelles observations supplémentaires aideraient à vérifier l’idée d’Inès ?

Réponse / démarche : 

Texte à lire R2

> ATELIER DE CONSTRUCTION — Samedi, de 14 h 15 à 15 h 30, salle B. Maximum : 8 élèves. Apporte une boîte en carton propre. Inscription avant vendredi, 16 h. Sept élèves sont déjà inscrits.','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q12.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Comparer les nombres d’oiseaux pendant plusieurs jours de pluie et sans pluie, à la même heure et au même endroit.

EN: Compare bird counts on several rainy and dry days, at the same time and in the same place.

评分： 2 分：提出多次比较雨天与非雨天的有效观察；1 分：仅说继续观察但无比较条件；0 分：建议与问题无关。','text','Comparer les nombres d’oiseaux pendant plusieurs jours de pluie et sans pluie, à la même heure et au même endroit.','Comparer les nombres d’oiseaux pendant plusieurs jours de pluie et sans pluie, à la même heure et au même endroit.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q12-en-CA','g4-q12','4','en-CA','2. Reading, evidence and practical information','Q12 · 2. Reading, evidence and practical information','In R1, what further observations would help check Inès’s idea?

Answer / working: 

Reading passage R2

> BUILDING WORKSHOP — Saturday, from 2:15 p.m. to 3:30 p.m., Room B. Maximum: 8 students. Bring a clean cardboard box. Register before Friday at 4:00 p.m. Seven students have already registered.','Read the passage or instruction on your sheet by yourself, then answer question Q12.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q12.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q12.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Comparer les nombres d’oiseaux pendant plusieurs jours de pluie et sans pluie, à la même heure et au même endroit.

EN: Compare bird counts on several rainy and dry days, at the same time and in the same place.

评分： 2 分：提出多次比较雨天与非雨天的有效观察；1 分：仅说继续观察但无比较条件；0 分：建议与问题无关。','text','Compare bird counts on several rainy and dry days, at the same time and in the same place.','Compare bird counts on several rainy and dry days, at the same time and in the same place.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q13-fr-CA','g4-q13','4','fr-CA','2. Lire, déduire et justifier','Q13 · 2. Lire, déduire et justifier','Dans R2, avant quel moment faut-il s’inscrire ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q13.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Avant vendredi à 16 h.

EN: Before Friday at 4:00 p.m.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Avant vendredi à 16 h.','Avant vendredi à 16 h.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q13-en-CA','g4-q13','4','en-CA','2. Reading, evidence and practical information','Q13 · 2. Reading, evidence and practical information','In R2, before what time must students register?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q13.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q13.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q13.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : Avant vendredi à 16 h.

EN: Before Friday at 4:00 p.m.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Before Friday at 4:00 p.m.','Before Friday at 4:00 p.m.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q14-fr-CA','g4-q14','4','fr-CA','2. Lire, déduire et justifier','Q14 · 2. Lire, déduire et justifier','Dans R2, combien de temps dure l’atelier ?

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q14.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : 1 h 15 / 75 minutes.

EN: 1 hour 15 minutes / 75 minutes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','1 h 15 / 75 minutes.','1 h 15 / 75 minutes.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q14-en-CA','g4-q14','4','en-CA','2. Reading, evidence and practical information','Q14 · 2. Reading, evidence and practical information','In R2, how long does the workshop last?

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q14.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q14.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q14.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

FR : 1 h 15 / 75 minutes.

EN: 1 hour 15 minutes / 75 minutes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','1 hour 15 minutes / 75 minutes.','1 hour 15 minutes / 75 minutes.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q15-fr-CA','g4-q15','4','fr-CA','2. Lire, déduire et justifier','Q15 · 2. Lire, déduire et justifier','Dans R2, peut-on inscrire encore deux élèves sans dépasser le maximum ? Explique.

Réponse / démarche :','Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q15.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

### 模块 3：语法、词义与修改句子

Q16 法语需要形容词与名词配合，英语形容词不变。Q18 分别使用该语言常见同音词；两版不是逐字互译。过去时等未学内容可作为教学任务。

FR : Non. Il reste une place; 7 + 2 = 9, ce qui dépasse 8.

EN: No. One place is left; 7 + 2 = 9, which exceeds 8.

评分： 2 分：回答不能并用剩余一位或总数 9 超过 8 解释；1 分：只答不能；0 分：没有正确判断。

### 语法、词义与修改句子：答案','text','Non. Il reste une place; 7 + 2 = 9, ce qui dépasse 8.','Non. Il reste une place; 7 + 2 = 9, ce qui dépasse 8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q15-en-CA','g4-q15','4','en-CA','2. Reading, evidence and practical information','Q15 · 2. Reading, evidence and practical information','In R2, can two more students register without exceeding the limit? Explain.

Answer / working:','Read the passage or instruction on your sheet by yourself, then answer question Q15.','FR — organisation seulement : Lis seul le texte ou la consigne sur ta feuille, puis réponds à la question Q15.

EN — organisation only: Read the passage or instruction on your sheet by yourself, then answer question Q15.

教师提示： 正文、题目和选项由学生独立阅读；如改为成人代读，另作记录。

### 模块 3：语法、词义与修改句子

Q16 法语需要形容词与名词配合，英语形容词不变。Q18 分别使用该语言常见同音词；两版不是逐字互译。过去时等未学内容可作为教学任务。

FR : Non. Il reste une place; 7 + 2 = 9, ce qui dépasse 8.

EN: No. One place is left; 7 + 2 = 9, which exceeds 8.

评分： 2 分：回答不能并用剩余一位或总数 9 超过 8 解释；1 分：只答不能；0 分：没有正确判断。

### 语法、词义与修改句子：答案','text','No. One place is left; 7 + 2 = 9, which exceeds 8.','No. One place is left; 7 + 2 = 9, which exceeds 8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q16-fr-CA','g4-q16','4','fr-CA','3. Grammaire, sens et révision','Q16 · 3. Grammaire, sens et révision','Réécris en mettant au pluriel « la petite fille » et « un sac rouge ». Fais les accords : La petite fille porte un sac rouge.

Réponse / démarche :','Réécris en mettant au pluriel « la petite fille » et « un sac rouge ». Fais les accords : La petite fille porte un sac rouge.','FR — à lire : Réécris en mettant au pluriel « la petite fille » et « un sac rouge ». Fais les accords : La petite fille porte un sac rouge.

EN — read aloud: Rewrite with both “the little girl” and “a red bag” made plural. Make the verb agree: The little girl carries a red bag.

FR : Les petites filles portent des sacs rouges.

EN: The little girls carry red bags.

评分： 2 分：主语、动词及宾语按目标语言规则全部正确；1 分：有正确变化但仍有遗漏；0 分：没有形成正确的复数关系。','text','Les petites filles portent des sacs rouges.','Les petites filles portent des sacs rouges.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q16-en-CA','g4-q16','4','en-CA','3. Grammar, meaning and editing','Q16 · 3. Grammar, meaning and editing','Rewrite with both “the little girl” and “a red bag” made plural. Make the verb agree: The little girl carries a red bag.

Answer / working:','Rewrite with both “the little girl” and “a red bag” made plural. Make the verb agree: The little girl carries a red bag.','FR — à lire : Réécris en mettant au pluriel « la petite fille » et « un sac rouge ». Fais les accords : La petite fille porte un sac rouge.

EN — read aloud: Rewrite with both “the little girl” and “a red bag” made plural. Make the verb agree: The little girl carries a red bag.

FR : Les petites filles portent des sacs rouges.

EN: The little girls carry red bags.

评分： 2 分：主语、动词及宾语按目标语言规则全部正确；1 分：有正确变化但仍有遗漏；0 分：没有形成正确的复数关系。','text','The little girls carry red bags.','The little girls carry red bags.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q17-fr-CA','g4-q17','4','fr-CA','3. Grammaire, sens et révision','Q17 · 3. Grammaire, sens et révision','Choisis : Hier, les enfants (jouent / ont joué) dehors.

Réponse / démarche :','Choisis : Hier, les enfants (jouent / ont joué) dehors.','FR — à lire : Choisis : Hier, les enfants (jouent / ont joué) dehors.

EN — read aloud: Choose: Yesterday, the children (play / played) outside.

FR : Hier, les enfants ont joué dehors.

EN: Yesterday, the children played outside.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Hier, les enfants ont joué dehors.','Hier, les enfants ont joué dehors.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q17-en-CA','g4-q17','4','en-CA','3. Grammar, meaning and editing','Q17 · 3. Grammar, meaning and editing','Choose: Yesterday, the children (play / played) outside.

Answer / working:','Choose: Yesterday, the children (play / played) outside.','FR — à lire : Choisis : Hier, les enfants (jouent / ont joué) dehors.

EN — read aloud: Choose: Yesterday, the children (play / played) outside.

FR : Hier, les enfants ont joué dehors.

EN: Yesterday, the children played outside.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Yesterday, the children played outside.','Yesterday, the children played outside.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q18-fr-CA','g4-q18','4','fr-CA','3. Grammaire, sens et révision','Q18 · 3. Grammaire, sens et révision','Complète avec « a » ou « à » : Emma  un livre. Elle va  la bibliothèque.

Réponse / démarche :','Complète avec « a » ou « à » : Emma  un livre. Elle va  la bibliothèque.','FR — à lire : Complète avec « a » ou « à » : Emma  un livre. Elle va  la bibliothèque.

EN — read aloud: Complete with “their” or “there”: The children carry  bags. They put them over .

FR : Emma a un livre. Elle va à la bibliothèque.

EN: The children carry their bags. They put them over there.

评分： 2 分：两空正确；1 分：一空正确；0 分：两空均错误。','text','Emma a un livre. Elle va à la bibliothèque.','Emma a un livre. Elle va à la bibliothèque.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q18-en-CA','g4-q18','4','en-CA','3. Grammar, meaning and editing','Q18 · 3. Grammar, meaning and editing','Complete with “their” or “there”: The children carry  bags. They put them over .

Answer / working:','Complete with “their” or “there”: The children carry  bags. They put them over .','FR — à lire : Complète avec « a » ou « à » : Emma  un livre. Elle va  la bibliothèque.

EN — read aloud: Complete with “their” or “there”: The children carry  bags. They put them over .

FR : Emma a un livre. Elle va à la bibliothèque.

EN: The children carry their bags. They put them over there.

评分： 2 分：两空正确；1 分：一空正确；0 分：两空均错误。','text','The children carry their bags. They put them over there.','The children carry their bags. They put them over there.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q19-fr-CA','g4-q19','4','fr-CA','3. Grammaire, sens et révision','Q19 · 3. Grammaire, sens et révision','Lina prête un crayon à Zoé. Celle-ci la remercie. Qui désigne « celle-ci » ? Qui désigne « la » ?

Réponse / démarche :','Lina prête un crayon à Zoé. Celle-ci la remercie. Qui désigne « celle-ci » ? Qui désigne « la » ?','FR — à lire : Lina prête un crayon à Zoé. Celle-ci la remercie. Qui désigne « celle-ci » ? Qui désigne « la » ?

EN — read aloud: Lina lends Zoé a pencil. Zoé thanks her. Who says thank you? Who does “her” refer to?

FR : « Celle-ci » désigne Zoé; « la » désigne Lina.

EN: Zoé says thank you; “her” refers to Lina.

评分： 2 分：两项正确；1 分：一项正确；0 分：均错误。','text','« Celle-ci » désigne Zoé; « la » désigne Lina.','« Celle-ci » désigne Zoé; « la » désigne Lina.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q19-en-CA','g4-q19','4','en-CA','3. Grammar, meaning and editing','Q19 · 3. Grammar, meaning and editing','Lina lends Zoé a pencil. Zoé thanks her. Who says thank you? Who does “her” refer to?

Answer / working:','Lina lends Zoé a pencil. Zoé thanks her. Who says thank you? Who does “her” refer to?','FR — à lire : Lina prête un crayon à Zoé. Celle-ci la remercie. Qui désigne « celle-ci » ? Qui désigne « la » ?

EN — read aloud: Lina lends Zoé a pencil. Zoé thanks her. Who says thank you? Who does “her” refer to?

FR : « Celle-ci » désigne Zoé; « la » désigne Lina.

EN: Zoé says thank you; “her” refers to Lina.

评分： 2 分：两项正确；1 分：一项正确；0 分：均错误。','text','Zoé says thank you; “her” refers to Lina.','Zoé says thank you; “her” refers to Lina.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q20-fr-CA','g4-q20','4','fr-CA','3. Grammaire, sens et révision','Q20 · 3. Grammaire, sens et révision','Quel mot a un sens proche de « énorme » : immense, minuscule ou fragile ?

Réponse / démarche :','Quel mot a un sens proche de « énorme » : immense, minuscule ou fragile ?','FR — à lire : Quel mot a un sens proche de « énorme » : immense, minuscule ou fragile ?

EN — read aloud: Which word is closest in meaning to “enormous”: huge, tiny or fragile?

FR : Immense.

EN: Huge.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Immense.','Immense.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q20-en-CA','g4-q20','4','en-CA','3. Grammar, meaning and editing','Q20 · 3. Grammar, meaning and editing','Which word is closest in meaning to “enormous”: huge, tiny or fragile?

Answer / working:','Which word is closest in meaning to “enormous”: huge, tiny or fragile?','FR — à lire : Quel mot a un sens proche de « énorme » : immense, minuscule ou fragile ?

EN — read aloud: Which word is closest in meaning to “enormous”: huge, tiny or fragile?

FR : Immense.

EN: Huge.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Huge.','Huge.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q21-fr-CA','g4-q21','4','fr-CA','3. Grammaire, sens et révision','Q21 · 3. Grammaire, sens et révision','Réunis les idées en une phrase avec « parce que » : Il pleut. Nous restons à l’intérieur.

Réponse / démarche :','Réunis les idées en une phrase avec « parce que » : Il pleut. Nous restons à l’intérieur.','FR — à lire : Réunis les idées en une phrase avec « parce que » : Il pleut. Nous restons à l’intérieur.

EN — read aloud: Join these ideas into one sentence using “because”: It is raining. We stay indoors.

FR : Nous restons à l’intérieur parce qu’il pleut.

EN: We stay indoors because it is raining.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Nous restons à l’intérieur parce qu’il pleut.','Nous restons à l’intérieur parce qu’il pleut.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q21-en-CA','g4-q21','4','en-CA','3. Grammar, meaning and editing','Q21 · 3. Grammar, meaning and editing','Join these ideas into one sentence using “because”: It is raining. We stay indoors.

Answer / working:','Join these ideas into one sentence using “because”: It is raining. We stay indoors.','FR — à lire : Réunis les idées en une phrase avec « parce que » : Il pleut. Nous restons à l’intérieur.

EN — read aloud: Join these ideas into one sentence using “because”: It is raining. We stay indoors.

FR : Nous restons à l’intérieur parce qu’il pleut.

EN: We stay indoors because it is raining.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','We stay indoors because it is raining.','We stay indoors because it is raining.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q22-fr-CA','g4-q22','4','fr-CA','3. Grammaire, sens et révision','Q22 · 3. Grammaire, sens et révision','La phrase parle de plusieurs élèves. Corrige les accords : Les élève préparent une affiche et il la présente.

Réponse / démarche :','La phrase parle de plusieurs élèves. Corrige les accords : Les élève préparent une affiche et il la présente.','FR — à lire : La phrase parle de plusieurs élèves. Corrige les accords : Les élève préparent une affiche et il la présente.

EN — read aloud: The sentence describes several students. Correct the errors: The student are making a poster and they shows it.

### 模块 4：数位、四则与数的关系

允许书写过程。Q29 比较的是同一个整体的分数。Q30 为提高任务，不要求未学过的孩子靠猜测完成。

FR : Les élèves préparent une affiche et ils la présentent.

EN: The students are making a poster and they show it.

评分： 2 分：所有目标错误均改正；1 分：改正部分且未改变句意；0 分：没有有效修改。

### 数位、四则与数的关系：答案','text','Les élèves préparent une affiche et ils la présentent.','Les élèves préparent une affiche et ils la présentent.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q22-en-CA','g4-q22','4','en-CA','3. Grammar, meaning and editing','Q22 · 3. Grammar, meaning and editing','The sentence describes several students. Correct the errors: The student are making a poster and they shows it.

Answer / working:','The sentence describes several students. Correct the errors: The student are making a poster and they shows it.

### 模块 4：数位、四则与数的关系

允许书写过程。Q29 比较的是同一个整体的分数。Q30 为提高任务，不要求未学过的孩子靠猜测完成。','FR — à lire : La phrase parle de plusieurs élèves. Corrige les accords : Les élève préparent une affiche et il la présente.

EN — read aloud: The sentence describes several students. Correct the errors: The student are making a poster and they shows it.

### 模块 4：数位、四则与数的关系

允许书写过程。Q29 比较的是同一个整体的分数。Q30 为提高任务，不要求未学过的孩子靠猜测完成。

FR : Les élèves préparent une affiche et ils la présentent.

EN: The students are making a poster and they show it.

评分： 2 分：所有目标错误均改正；1 分：改正部分且未改变句意；0 分：没有有效修改。

### 数位、四则与数的关系：答案','text','The students are making a poster and they show it.','The students are making a poster and they show it.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q23-fr-CA','g4-q23','4','fr-CA','4. Nombres, calculs et relations','Q23 · 4. Nombres, calculs et relations','Décompose 3 076 en milliers, centaines, dizaines et unités.

Réponse / démarche :','Décompose 3 076 en milliers, centaines, dizaines et unités.','FR — à lire : Décompose 3 076 en milliers, centaines, dizaines et unités.

EN — read aloud: Split 3,076 into thousands, hundreds, tens and ones.

FR : 3 milliers, 0 centaine, 7 dizaines, 6 unités.

EN: 3 thousands, 0 hundreds, 7 tens, 6 ones.

评分： 2 分：四项全对；1 分：三项正确；0 分：最多两项正确。','text','3 milliers, 0 centaine, 7 dizaines, 6 unités.','3 milliers, 0 centaine, 7 dizaines, 6 unités.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q23-en-CA','g4-q23','4','en-CA','4. Numbers, operations and relationships','Q23 · 4. Numbers, operations and relationships','Split 3,076 into thousands, hundreds, tens and ones.

Answer / working:','Split 3,076 into thousands, hundreds, tens and ones.','FR — à lire : Décompose 3 076 en milliers, centaines, dizaines et unités.

EN — read aloud: Split 3,076 into thousands, hundreds, tens and ones.

FR : 3 milliers, 0 centaine, 7 dizaines, 6 unités.

EN: 3 thousands, 0 hundreds, 7 tens, 6 ones.

评分： 2 分：四项全对；1 分：三项正确；0 分：最多两项正确。','text','3 thousands, 0 hundreds, 7 tens, 6 ones.','3 thousands, 0 hundreds, 7 tens, 6 ones.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q24-fr-CA','g4-q24','4','fr-CA','4. Nombres, calculs et relations','Q24 · 4. Nombres, calculs et relations','Calcule : 1 748 + 2 365.

Réponse / démarche :','Calcule : 1 748 + 2 365.','FR — à lire : Calcule : 1 748 + 2 365.

EN — read aloud: Calculate: 1,748 + 2,365.

FR : 4 113.

EN: 4,113.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','4 113.','4 113.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q24-en-CA','g4-q24','4','en-CA','4. Numbers, operations and relationships','Q24 · 4. Numbers, operations and relationships','Calculate: 1,748 + 2,365.

Answer / working:','Calculate: 1,748 + 2,365.','FR — à lire : Calcule : 1 748 + 2 365.

EN — read aloud: Calculate: 1,748 + 2,365.

FR : 4 113.

EN: 4,113.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','4,113.','4,113.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q25-fr-CA','g4-q25','4','fr-CA','4. Nombres, calculs et relations','Q25 · 4. Nombres, calculs et relations','Calcule : 4 000 − 1 768.

Réponse / démarche :','Calcule : 4 000 − 1 768.','FR — à lire : Calcule : 4 000 − 1 768.

EN — read aloud: Calculate: 4,000 − 1,768.

FR : 2 232.

EN: 2,232.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','2 232.','2 232.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q25-en-CA','g4-q25','4','en-CA','4. Numbers, operations and relationships','Q25 · 4. Numbers, operations and relationships','Calculate: 4,000 − 1,768.

Answer / working:','Calculate: 4,000 − 1,768.','FR — à lire : Calcule : 4 000 − 1 768.

EN — read aloud: Calculate: 4,000 − 1,768.

FR : 2 232.

EN: 2,232.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','2,232.','2,232.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q26-fr-CA','g4-q26','4','fr-CA','4. Nombres, calculs et relations','Q26 · 4. Nombres, calculs et relations','Calcule : 24 × 3.

Réponse / démarche :','Calcule : 24 × 3.','FR — à lire : Calcule : 24 × 3.

EN — read aloud: Calculate: 24 × 3.

FR : 72.

EN: 72.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','72.','72.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q26-en-CA','g4-q26','4','en-CA','4. Numbers, operations and relationships','Q26 · 4. Numbers, operations and relationships','Calculate: 24 × 3.

Answer / working:','Calculate: 24 × 3.','FR — à lire : Calcule : 24 × 3.

EN — read aloud: Calculate: 24 × 3.

FR : 72.

EN: 72.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','72.','72.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q27-fr-CA','g4-q27','4','fr-CA','4. Nombres, calculs et relations','Q27 · 4. Nombres, calculs et relations','Calcule : 56 ÷ 7.

Réponse / démarche :','Calcule : 56 ÷ 7.','FR — à lire : Calcule : 56 ÷ 7.

EN — read aloud: Calculate: 56 ÷ 7.

FR : 8.

EN: 8.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','8.','8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q27-en-CA','g4-q27','4','en-CA','4. Numbers, operations and relationships','Q27 · 4. Numbers, operations and relationships','Calculate: 56 ÷ 7.

Answer / working:','Calculate: 56 ÷ 7.','FR — à lire : Calcule : 56 ÷ 7.

EN — read aloud: Calculate: 56 ÷ 7.

FR : 8.

EN: 8.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','8.','8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q28-fr-CA','g4-q28','4','fr-CA','4. Nombres, calculs et relations','Q28 · 4. Nombres, calculs et relations','Complète : 6 ×  = 42.

Réponse / démarche :','Complète : 6 ×  = 42.','FR — à lire : Complète : 6 ×  = 42.

EN — read aloud: Complete: 6 ×  = 42.

FR : 7.

EN: 7.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','7.','7.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q28-en-CA','g4-q28','4','en-CA','4. Numbers, operations and relationships','Q28 · 4. Numbers, operations and relationships','Complete: 6 ×  = 42.

Answer / working:','Complete: 6 ×  = 42.','FR — à lire : Complète : 6 ×  = 42.

EN — read aloud: Complete: 6 ×  = 42.

FR : 7.

EN: 7.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','7.','7.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q29-fr-CA','g4-q29','4','fr-CA','4. Nombres, calculs et relations','Q29 · 4. Nombres, calculs et relations','Pour un même gâteau, quelle part est la plus grande : 1/2 ou 1/4 ? Explique avec des mots ou un dessin.

Réponse / démarche :','Pour un même gâteau, quelle part est la plus grande : 1/2 ou 1/4 ? Explique avec des mots ou un dessin.','FR — à lire : Pour un même gâteau, quelle part est la plus grande : 1/2 ou 1/4 ? Explique avec des mots ou un dessin.

EN — read aloud: For the same cake, which share is larger: 1/2 or 1/4? Explain with words or a drawing.

FR : 1/2 est plus grand; une moitié correspond à deux quarts.

EN: 1/2 is larger; one half equals two quarters.

评分： 2 分：选 1/2 并给出有效解释／图示；1 分：只选对；0 分：没有正确比较。','drawing','1/2 est plus grand; une moitié correspond à deux quarts.','1/2 est plus grand; une moitié correspond à deux quarts.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q29-en-CA','g4-q29','4','en-CA','4. Numbers, operations and relationships','Q29 · 4. Numbers, operations and relationships','For the same cake, which share is larger: 1/2 or 1/4? Explain with words or a drawing.

Answer / working:','For the same cake, which share is larger: 1/2 or 1/4? Explain with words or a drawing.','FR — à lire : Pour un même gâteau, quelle part est la plus grande : 1/2 ou 1/4 ? Explique avec des mots ou un dessin.

EN — read aloud: For the same cake, which share is larger: 1/2 or 1/4? Explain with words or a drawing.

FR : 1/2 est plus grand; une moitié correspond à deux quarts.

EN: 1/2 is larger; one half equals two quarters.

评分： 2 分：选 1/2 并给出有效解释／图示；1 分：只选对；0 分：没有正确比较。','drawing','1/2 is larger; one half equals two quarters.','1/2 is larger; one half equals two quarters.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q30-fr-CA','g4-q30','4','fr-CA','4. Nombres, calculs et relations','Q30 · 4. Nombres, calculs et relations','Arrondis 276 à la dizaine la plus proche.

Réponse / démarche :','Arrondis 276 à la dizaine la plus proche.','FR — à lire : Arrondis 276 à la dizaine la plus proche.

EN — read aloud: Round 276 to the nearest ten.

### 模块 5：多步骤应用、钱币与测量

金额均为加元。Q32 题目已约定含税，无需计算税率；法语使用小数逗号，英语使用小数点。

FR : 280.

EN: 280.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 多步骤应用、钱币与测量：答案','text','280.','280.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q30-en-CA','g4-q30','4','en-CA','4. Numbers, operations and relationships','Q30 · 4. Numbers, operations and relationships','Round 276 to the nearest ten.

Answer / working:','Round 276 to the nearest ten.

### 模块 5：多步骤应用、钱币与测量

金额均为加元。Q32 题目已约定含税，无需计算税率；法语使用小数逗号，英语使用小数点。','FR — à lire : Arrondis 276 à la dizaine la plus proche.

EN — read aloud: Round 276 to the nearest ten.

### 模块 5：多步骤应用、钱币与测量

金额均为加元。Q32 题目已约定含税，无需计算税率；法语使用小数逗号，英语使用小数点。

FR : 280.

EN: 280.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。

### 多步骤应用、钱币与测量：答案','text','280.','280.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q31-fr-CA','g4-q31','4','fr-CA','5. Problèmes à plusieurs étapes','Q31 · 5. Problèmes à plusieurs étapes','On a 5 boîtes de 6 crayons. On distribue 8 crayons. Combien en reste-t-il ? Montre les étapes.

Réponse / démarche :','On a 5 boîtes de 6 crayons. On distribue 8 crayons. Combien en reste-t-il ? Montre les étapes.','FR — à lire : On a 5 boîtes de 6 crayons. On distribue 8 crayons. Combien en reste-t-il ? Montre les étapes.

EN — read aloud: There are 5 boxes of 6 pencils. We give out 8 pencils. How many are left? Show the steps.

FR : 22 crayons : 5 × 6 − 8.

EN: 22 pencils: 5 × 6 − 8.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','22 crayons : 5 × 6 − 8.','22 crayons : 5 × 6 − 8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q31-en-CA','g4-q31','4','en-CA','5. Multi-step problems and measurement','Q31 · 5. Multi-step problems and measurement','There are 5 boxes of 6 pencils. We give out 8 pencils. How many are left? Show the steps.

Answer / working:','There are 5 boxes of 6 pencils. We give out 8 pencils. How many are left? Show the steps.','FR — à lire : On a 5 boîtes de 6 crayons. On distribue 8 crayons. Combien en reste-t-il ? Montre les étapes.

EN — read aloud: There are 5 boxes of 6 pencils. We give out 8 pencils. How many are left? Show the steps.

FR : 22 crayons : 5 × 6 − 8.

EN: 22 pencils: 5 × 6 − 8.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','22 pencils: 5 × 6 − 8.','22 pencils: 5 × 6 − 8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q32-fr-CA','g4-q32','4','fr-CA','5. Problèmes à plusieurs étapes','Q32 · 5. Problèmes à plusieurs étapes','Tu paies avec 20 $. Tu achètes 3 cahiers à 2,50 $ chacun et un livre à 4,25 $. Tous les prix incluent les taxes. Combien reçois-tu en monnaie ?

Réponse / démarche :','Tu paies avec 20 $. Tu achètes 3 cahiers à 2,50 $ chacun et un livre à 4,25 $. Tous les prix incluent les taxes. Combien reçois-tu en monnaie ?','FR — à lire : Tu paies avec 20 $. Tu achètes 3 cahiers à 2,50 $ chacun et un livre à 4,25 $. Tous les prix incluent les taxes. Combien reçois-tu en monnaie ?

EN — read aloud: You pay with $20. You buy 3 notebooks at $2.50 each and a book for $4.25. All prices include tax. How much change do you receive?

FR : 8,25 $ : 3 × 2,50 = 7,50; 7,50 + 4,25 = 11,75; 20 − 11,75 = 8,25.

EN: $8.25: 3 × 2.50 = 7.50; 7.50 + 4.25 = 11.75; 20 − 11.75 = 8.25.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','8,25 $ : 3 × 2,50 = 7,50; 7,50 + 4,25 = 11,75; 20 − 11,75 = 8,25.','8,25 $ : 3 × 2,50 = 7,50; 7,50 + 4,25 = 11,75; 20 − 11,75 = 8,25.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q32-en-CA','g4-q32','4','en-CA','5. Multi-step problems and measurement','Q32 · 5. Multi-step problems and measurement','You pay with $20. You buy 3 notebooks at $2.50 each and a book for $4.25. All prices include tax. How much change do you receive?

Answer / working:','You pay with $20. You buy 3 notebooks at $2.50 each and a book for $4.25. All prices include tax. How much change do you receive?','FR — à lire : Tu paies avec 20 $. Tu achètes 3 cahiers à 2,50 $ chacun et un livre à 4,25 $. Tous les prix incluent les taxes. Combien reçois-tu en monnaie ?

EN — read aloud: You pay with $20. You buy 3 notebooks at $2.50 each and a book for $4.25. All prices include tax. How much change do you receive?

FR : 8,25 $ : 3 × 2,50 = 7,50; 7,50 + 4,25 = 11,75; 20 − 11,75 = 8,25.

EN: $8.25: 3 × 2.50 = 7.50; 7.50 + 4.25 = 11.75; 20 − 11.75 = 8.25.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','$8.25: 3 × 2.50 = 7.50; 7.50 + 4.25 = 11.75; 20 − 11.75 = 8.25.','$8.25: 3 × 2.50 = 7.50; 7.50 + 4.25 = 11.75; 20 − 11.75 = 8.25.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q33-fr-CA','g4-q33','4','fr-CA','5. Problèmes à plusieurs étapes','Q33 · 5. Problèmes à plusieurs étapes','Une activité commence à 8 h 35 et finit à 9 h 10. Combien de minutes dure-t-elle ?

Réponse / démarche :','Une activité commence à 8 h 35 et finit à 9 h 10. Combien de minutes dure-t-elle ?','FR — à lire : Une activité commence à 8 h 35 et finit à 9 h 10. Combien de minutes dure-t-elle ?

EN — read aloud: An activity starts at 8:35 a.m. and ends at 9:10 a.m. How many minutes does it last?

FR : 35 minutes : 25 minutes jusqu’à 9 h, puis 10 minutes.

EN: 35 minutes: 25 minutes to 9:00, then 10 more minutes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','35 minutes : 25 minutes jusqu’à 9 h, puis 10 minutes.','35 minutes : 25 minutes jusqu’à 9 h, puis 10 minutes.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q33-en-CA','g4-q33','4','en-CA','5. Multi-step problems and measurement','Q33 · 5. Multi-step problems and measurement','An activity starts at 8:35 a.m. and ends at 9:10 a.m. How many minutes does it last?

Answer / working:','An activity starts at 8:35 a.m. and ends at 9:10 a.m. How many minutes does it last?','FR — à lire : Une activité commence à 8 h 35 et finit à 9 h 10. Combien de minutes dure-t-elle ?

EN — read aloud: An activity starts at 8:35 a.m. and ends at 9:10 a.m. How many minutes does it last?

FR : 35 minutes : 25 minutes jusqu’à 9 h, puis 10 minutes.

EN: 35 minutes: 25 minutes to 9:00, then 10 more minutes.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','35 minutes: 25 minutes to 9:00, then 10 more minutes.','35 minutes: 25 minutes to 9:00, then 10 more minutes.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q34-fr-CA','g4-q34','4','fr-CA','5. Problèmes à plusieurs étapes','Q34 · 5. Problèmes à plusieurs étapes','Un rectangle mesure 9 cm de long et 4 cm de large. Calcule son périmètre.

Réponse / démarche :','Un rectangle mesure 9 cm de long et 4 cm de large. Calcule son périmètre.','FR — à lire : Un rectangle mesure 9 cm de long et 4 cm de large. Calcule son périmètre.

EN — read aloud: A rectangle is 9 cm long and 4 cm wide. Find its perimeter.

FR : 26 cm : 2 × (9 + 4).

EN: 26 cm: 2 × (9 + 4).

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','26 cm : 2 × (9 + 4).','26 cm : 2 × (9 + 4).','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q34-en-CA','g4-q34','4','en-CA','5. Multi-step problems and measurement','Q34 · 5. Multi-step problems and measurement','A rectangle is 9 cm long and 4 cm wide. Find its perimeter.

Answer / working:','A rectangle is 9 cm long and 4 cm wide. Find its perimeter.','FR — à lire : Un rectangle mesure 9 cm de long et 4 cm de large. Calcule son périmètre.

EN — read aloud: A rectangle is 9 cm long and 4 cm wide. Find its perimeter.

FR : 26 cm : 2 × (9 + 4).

EN: 26 cm: 2 × (9 + 4).

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','26 cm: 2 × (9 + 4).','26 cm: 2 × (9 + 4).','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q35-fr-CA','g4-q35','4','fr-CA','5. Problèmes à plusieurs étapes','Q35 · 5. Problèmes à plusieurs étapes','Une pizza est partagée en 8 parts égales. On mange 3 parts. Quelle fraction de la pizza reste-t-il ?

Réponse / démarche :','Une pizza est partagée en 8 parts égales. On mange 3 parts. Quelle fraction de la pizza reste-t-il ?','FR — à lire : Une pizza est partagée en 8 parts égales. On mange 3 parts. Quelle fraction de la pizza reste-t-il ?

EN — read aloud: A pizza is divided into 8 equal slices. Three slices are eaten. What fraction of the pizza remains?

FR : 5/8.

EN: 5/8.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','5/8.','5/8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q35-en-CA','g4-q35','4','en-CA','5. Multi-step problems and measurement','Q35 · 5. Multi-step problems and measurement','A pizza is divided into 8 equal slices. Three slices are eaten. What fraction of the pizza remains?

Answer / working:','A pizza is divided into 8 equal slices. Three slices are eaten. What fraction of the pizza remains?','FR — à lire : Une pizza est partagée en 8 parts égales. On mange 3 parts. Quelle fraction de la pizza reste-t-il ?

EN — read aloud: A pizza is divided into 8 equal slices. Three slices are eaten. What fraction of the pizza remains?

FR : 5/8.

EN: 5/8.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','5/8.','5/8.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q36-fr-CA','g4-q36','4','fr-CA','5. Problèmes à plusieurs étapes','Q36 · 5. Problèmes à plusieurs étapes','On attache un ruban de 2 m 35 cm à un ruban de 85 cm, sans chevauchement. Quelle est la longueur totale en centimètres ?

Réponse / démarche :','On attache un ruban de 2 m 35 cm à un ruban de 85 cm, sans chevauchement. Quelle est la longueur totale en centimètres ?','FR — à lire : On attache un ruban de 2 m 35 cm à un ruban de 85 cm, sans chevauchement. Quelle est la longueur totale en centimètres ?

EN — read aloud: A 2 m 35 cm ribbon is joined to an 85 cm ribbon with no overlap. What is the total length in centimetres?

FR : 320 cm, soit 3 m 20 cm.

EN: 320 cm, or 3 m 20 cm.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','320 cm, soit 3 m 20 cm.','320 cm, soit 3 m 20 cm.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q36-en-CA','g4-q36','4','en-CA','5. Multi-step problems and measurement','Q36 · 5. Multi-step problems and measurement','A 2 m 35 cm ribbon is joined to an 85 cm ribbon with no overlap. What is the total length in centimetres?

Answer / working:','A 2 m 35 cm ribbon is joined to an 85 cm ribbon with no overlap. What is the total length in centimetres?','FR — à lire : On attache un ruban de 2 m 35 cm à un ruban de 85 cm, sans chevauchement. Quelle est la longueur totale en centimètres ?

EN — read aloud: A 2 m 35 cm ribbon is joined to an 85 cm ribbon with no overlap. What is the total length in centimetres?

FR : 320 cm, soit 3 m 20 cm.

EN: 320 cm, or 3 m 20 cm.

评分： 2 分：所需步骤、信息与结果均正确；1 分：方法有效但有一处错误或遗漏；0 分：没有建立有效方法。','text','320 cm, or 3 m 20 cm.','320 cm, or 3 m 20 cm.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q37-fr-CA','g4-q37','4','fr-CA','5. Problèmes à plusieurs étapes','Q37 · 5. Problèmes à plusieurs étapes','Il faut transporter 28 élèves. Chaque minibus a 8 places pour les élèves. Quel est le nombre minimum de minibus nécessaires ? Explique.

Réponse / démarche :','Il faut transporter 28 élèves. Chaque minibus a 8 places pour les élèves. Quel est le nombre minimum de minibus nécessaires ? Explique.','FR — à lire : Il faut transporter 28 élèves. Chaque minibus a 8 places pour les élèves. Quel est le nombre minimum de minibus nécessaires ? Explique.

EN — read aloud: We need to transport 28 students. Each minibus has 8 student seats. What is the minimum number of minibuses needed? Explain.

### 模块 6：规律、组合、数据与证据

组合题可以列清单而不使用乘法；实验和证据题用儿童能理解的话解释即可。

FR : 4 minibus. Trois ne donnent que 24 places; quatre donnent 32 places.

EN: 4 minibuses. Three provide only 24 seats; four provide 32 seats.

评分： 2 分：4 辆并解释 3 辆不足；1 分：只答 4 辆或算出 3 余 4 尚未完成判断；0 分：没有有效方法。

### 规律、组合、数据与证据：答案','text','4 minibus. Trois ne donnent que 24 places; quatre donnent 32 places.','4 minibus. Trois ne donnent que 24 places; quatre donnent 32 places.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q37-en-CA','g4-q37','4','en-CA','5. Multi-step problems and measurement','Q37 · 5. Multi-step problems and measurement','We need to transport 28 students. Each minibus has 8 student seats. What is the minimum number of minibuses needed? Explain.

Answer / working:','We need to transport 28 students. Each minibus has 8 student seats. What is the minimum number of minibuses needed? Explain.

### 模块 6：规律、组合、数据与证据

组合题可以列清单而不使用乘法；实验和证据题用儿童能理解的话解释即可。','FR — à lire : Il faut transporter 28 élèves. Chaque minibus a 8 places pour les élèves. Quel est le nombre minimum de minibus nécessaires ? Explique.

EN — read aloud: We need to transport 28 students. Each minibus has 8 student seats. What is the minimum number of minibuses needed? Explain.

### 模块 6：规律、组合、数据与证据

组合题可以列清单而不使用乘法；实验和证据题用儿童能理解的话解释即可。

FR : 4 minibus. Trois ne donnent que 24 places; quatre donnent 32 places.

EN: 4 minibuses. Three provide only 24 seats; four provide 32 seats.

评分： 2 分：4 辆并解释 3 辆不足；1 分：只答 4 辆或算出 3 余 4 尚未完成判断；0 分：没有有效方法。

### 规律、组合、数据与证据：答案','text','4 minibuses. Three provide only 24 seats; four provide 32 seats.','4 minibuses. Three provide only 24 seats; four provide 32 seats.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q38-fr-CA','g4-q38','4','fr-CA','6. Logique, combinaisons et preuves','Q38 · 6. Logique, combinaisons et preuves','Continue : 2, 5, 8, 11, . Explique la règle.

Réponse / démarche :','Continue : 2, 5, 8, 11, . Explique la règle.','FR — à lire : Continue : 2, 5, 8, 11, . Explique la règle.

EN — read aloud: Continue: 2, 5, 8, 11, . Explain the rule.

FR : 14; on ajoute 3 chaque fois.

EN: 14; add 3 each time.

评分： 2 分：14 和每次加 3 均正确；1 分：只答对其中一项；0 分：没有有效规律。','text','14; on ajoute 3 chaque fois.','14; on ajoute 3 chaque fois.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q38-en-CA','g4-q38','4','en-CA','6. Logic, combinations, data and evidence','Q38 · 6. Logic, combinations, data and evidence','Continue: 2, 5, 8, 11, . Explain the rule.

Answer / working:','Continue: 2, 5, 8, 11, . Explain the rule.','FR — à lire : Continue : 2, 5, 8, 11, . Explique la règle.

EN — read aloud: Continue: 2, 5, 8, 11, . Explain the rule.

FR : 14; on ajoute 3 chaque fois.

EN: 14; add 3 each time.

评分： 2 分：14 和每次加 3 均正确；1 分：只答对其中一项；0 分：没有有效规律。','text','14; add 3 each time.','14; add 3 each time.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q39-fr-CA','g4-q39','4','fr-CA','6. Logique, combinaisons et preuves','Q39 · 6. Logique, combinaisons et preuves','Complète : triangle, cercle, cercle, carré, triangle, cercle, cercle, .

Réponse / démarche :','Complète : triangle, cercle, cercle, carré, triangle, cercle, cercle, .','FR — à lire : Complète : triangle, cercle, cercle, carré, triangle, cercle, cercle, .

EN — read aloud: Complete: triangle, circle, circle, square, triangle, circle, circle, .

FR : Carré.

EN: Square.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Carré.','Carré.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q39-en-CA','g4-q39','4','en-CA','6. Logic, combinations, data and evidence','Q39 · 6. Logic, combinations, data and evidence','Complete: triangle, circle, circle, square, triangle, circle, circle, .

Answer / working:','Complete: triangle, circle, circle, square, triangle, circle, circle, .','FR — à lire : Complète : triangle, cercle, cercle, carré, triangle, cercle, cercle, .

EN — read aloud: Complete: triangle, circle, circle, square, triangle, circle, circle, .

FR : Carré.

EN: Square.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Square.','Square.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q40-fr-CA','g4-q40','4','fr-CA','6. Logique, combinaisons et preuves','Q40 · 6. Logique, combinaisons et preuves','Mia est plus grande que Lou, mais plus petite que Nora. Range les trois du plus petit au plus grand.

Réponse / démarche :','Mia est plus grande que Lou, mais plus petite que Nora. Range les trois du plus petit au plus grand.','FR — à lire : Mia est plus grande que Lou, mais plus petite que Nora. Range les trois du plus petit au plus grand.

EN — read aloud: Mia is taller than Lou but shorter than Nora. Order the three from shortest to tallest.

FR : Lou, Mia, Nora.

EN: Lou, Mia, Nora.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Lou, Mia, Nora.','Lou, Mia, Nora.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q40-en-CA','g4-q40','4','en-CA','6. Logic, combinations, data and evidence','Q40 · 6. Logic, combinations, data and evidence','Mia is taller than Lou but shorter than Nora. Order the three from shortest to tallest.

Answer / working:','Mia is taller than Lou but shorter than Nora. Order the three from shortest to tallest.','FR — à lire : Mia est plus grande que Lou, mais plus petite que Nora. Range les trois du plus petit au plus grand.

EN — read aloud: Mia is taller than Lou but shorter than Nora. Order the three from shortest to tallest.

FR : Lou, Mia, Nora.

EN: Lou, Mia, Nora.

评分： 答案正确或完成指定任务得 2 分；错误、未完成或未答得 0 分。','text','Lou, Mia, Nora.','Lou, Mia, Nora.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q41-fr-CA','g4-q41','4','fr-CA','6. Logique, combinaisons et preuves','Q41 · 6. Logique, combinaisons et preuves','Tu choisis un chandail rouge ou bleu, puis un pantalon noir, gris ou blanc. Combien de tenues différentes peux-tu faire ? Donne la liste ou une méthode.

Réponse / démarche :','Tu choisis un chandail rouge ou bleu, puis un pantalon noir, gris ou blanc. Combien de tenues différentes peux-tu faire ? Donne la liste ou une méthode.','FR — à lire : Tu choisis un chandail rouge ou bleu, puis un pantalon noir, gris ou blanc. Combien de tenues différentes peux-tu faire ? Donne la liste ou une méthode.

EN — read aloud: Choose a red or blue shirt, then black, grey or white pants. How many different outfits can you make? List them or show a method.

FR : 6 : rouge-noir, rouge-gris, rouge-blanc, bleu-noir, bleu-gris, bleu-blanc; ou 2 × 3.

EN: 6: red-black, red-grey, red-white, blue-black, blue-grey, blue-white; or 2 × 3.

评分： 2 分：6 种且列表／方法有效；1 分：只答 6 或列表只有一处遗漏；0 分：没有有效枚举。','text','6 : rouge-noir, rouge-gris, rouge-blanc, bleu-noir, bleu-gris, bleu-blanc; ou 2 × 3.','6 : rouge-noir, rouge-gris, rouge-blanc, bleu-noir, bleu-gris, bleu-blanc; ou 2 × 3.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q41-en-CA','g4-q41','4','en-CA','6. Logic, combinations, data and evidence','Q41 · 6. Logic, combinations, data and evidence','Choose a red or blue shirt, then black, grey or white pants. How many different outfits can you make? List them or show a method.

Answer / working:','Choose a red or blue shirt, then black, grey or white pants. How many different outfits can you make? List them or show a method.','FR — à lire : Tu choisis un chandail rouge ou bleu, puis un pantalon noir, gris ou blanc. Combien de tenues différentes peux-tu faire ? Donne la liste ou une méthode.

EN — read aloud: Choose a red or blue shirt, then black, grey or white pants. How many different outfits can you make? List them or show a method.

FR : 6 : rouge-noir, rouge-gris, rouge-blanc, bleu-noir, bleu-gris, bleu-blanc; ou 2 × 3.

EN: 6: red-black, red-grey, red-white, blue-black, blue-grey, blue-white; or 2 × 3.

评分： 2 分：6 种且列表／方法有效；1 分：只答 6 或列表只有一处遗漏；0 分：没有有效枚举。','text','6: red-black, red-grey, red-white, blue-black, blue-grey, blue-white; or 2 × 3.','6: red-black, red-grey, red-white, blue-black, blue-grey, blue-white; or 2 × 3.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q42-fr-CA','g4-q42','4','fr-CA','6. Logique, combinaisons et preuves','Q42 · 6. Logique, combinaisons et preuves','Objets collectés : classe A 12, classe B 18, classe C 15, classe D 9. Quelle classe en a le plus ? Combien d’objets ont été collectés en tout ?

Réponse / démarche :','Objets collectés : classe A 12, classe B 18, classe C 15, classe D 9. Quelle classe en a le plus ? Combien d’objets ont été collectés en tout ?','FR — à lire : Objets collectés : classe A 12, classe B 18, classe C 15, classe D 9. Quelle classe en a le plus ? Combien d’objets ont été collectés en tout ?

EN — read aloud: Objects collected: Class A 12, Class B 18, Class C 15, Class D 9. Which class collected the most? How many objects were collected altogether?

FR : Classe B; 54 objets.

EN: Class B; 54 objects.

评分： 2 分：B 和 54 均正确；1 分：其中一项正确；0 分：均错误。','text','Classe B; 54 objets.','Classe B; 54 objets.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q42-en-CA','g4-q42','4','en-CA','6. Logic, combinations, data and evidence','Q42 · 6. Logic, combinations, data and evidence','Objects collected: Class A 12, Class B 18, Class C 15, Class D 9. Which class collected the most? How many objects were collected altogether?

Answer / working:','Objects collected: Class A 12, Class B 18, Class C 15, Class D 9. Which class collected the most? How many objects were collected altogether?','FR — à lire : Objets collectés : classe A 12, classe B 18, classe C 15, classe D 9. Quelle classe en a le plus ? Combien d’objets ont été collectés en tout ?

EN — read aloud: Objects collected: Class A 12, Class B 18, Class C 15, Class D 9. Which class collected the most? How many objects were collected altogether?

FR : Classe B; 54 objets.

EN: Class B; 54 objects.

评分： 2 分：B 和 54 均正确；1 分：其中一项正确；0 分：均错误。','text','Class B; 54 objects.','Class B; 54 objects.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q43-fr-CA','g4-q43','4','fr-CA','6. Logique, combinaisons et preuves','Q43 · 6. Logique, combinaisons et preuves','Tu compares deux pliages d’avion en papier pour voir lequel vole le plus loin. Faut-il garder la même taille de papier et une façon de lancer semblable ? Pourquoi ?

Réponse orale. L’adulte peut noter mes mots :','Tu compares deux pliages d’avion en papier pour voir lequel vole le plus loin. Faut-il garder la même taille de papier et une façon de lancer semblable ? Pourquoi ?','FR — à lire : Tu compares deux pliages d’avion en papier pour voir lequel vole le plus loin. Faut-il garder la même taille de papier et une façon de lancer semblable ? Pourquoi ?

EN — read aloud: You are comparing two paper-plane folds to see which flies farther. Should you keep the paper size and throwing method similar? Why?

FR : Oui, pour que le pliage soit la principale différence et rendre la comparaison plus juste.

EN: Yes, so that the fold is the main difference and the comparison is fairer.

评分： 2 分：肯定并解释减少其他条件影响；1 分：只肯定或只提到一种应相同条件；0 分：没有有效比较想法。','text','Oui, pour que le pliage soit la principale différence et rendre la comparaison plus juste.','Oui, pour que le pliage soit la principale différence et rendre la comparaison plus juste.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q43-en-CA','g4-q43','4','en-CA','6. Logic, combinations, data and evidence','Q43 · 6. Logic, combinations, data and evidence','You are comparing two paper-plane folds to see which flies farther. Should you keep the paper size and throwing method similar? Why?

Oral answer. An adult may record my words:','You are comparing two paper-plane folds to see which flies farther. Should you keep the paper size and throwing method similar? Why?','FR — à lire : Tu compares deux pliages d’avion en papier pour voir lequel vole le plus loin. Faut-il garder la même taille de papier et une façon de lancer semblable ? Pourquoi ?

EN — read aloud: You are comparing two paper-plane folds to see which flies farther. Should you keep the paper size and throwing method similar? Why?

FR : Oui, pour que le pliage soit la principale différence et rendre la comparaison plus juste.

EN: Yes, so that the fold is the main difference and the comparison is fairer.

评分： 2 分：肯定并解释减少其他条件影响；1 分：只肯定或只提到一种应相同条件；0 分：没有有效比较想法。','text','Yes, so that the fold is the main difference and the comparison is fairer.','Yes, so that the fold is the main difference and the comparison is fairer.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q44-fr-CA','g4-q44','4','fr-CA','6. Logique, combinaisons et preuves','Q44 · 6. Logique, combinaisons et preuves','Quelqu’un dit : « Toutes les graines germent en trois jours », après avoir observé une seule graine. Est-ce une preuve suffisante ? Que proposerais-tu ?

Réponse orale. L’adulte peut noter mes mots :','Quelqu’un dit : « Toutes les graines germent en trois jours », après avoir observé une seule graine. Est-ce une preuve suffisante ? Que proposerais-tu ?','FR — à lire : Quelqu’un dit : « Toutes les graines germent en trois jours », après avoir observé une seule graine. Est-ce une preuve suffisante ? Que proposerais-tu ?

EN — read aloud: Someone says, “All seeds germinate in three days,” after observing only one seed. Is that enough evidence? What would you suggest?

### 模块 7：短文写作、解释、合作与反思

Q45 为本册设置的 5–7 句短文练习，并非学校作文要求。其余可口答，成人记录。

FR : Non. Observer plusieurs graines, éventuellement de différents types, pendant plusieurs jours et comparer les résultats.

EN: No. Observe several seeds, possibly of different types, over several days and compare the results.

评分： 2 分：指出证据不足并提出相关追加观察；1 分：只指出不足或只提出观察；0 分：没有相关判断。

### 短文写作、解释、合作与反思：答案','text','Non. Observer plusieurs graines, éventuellement de différents types, pendant plusieurs jours et comparer les résultats.','Non. Observer plusieurs graines, éventuellement de différents types, pendant plusieurs jours et comparer les résultats.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q44-en-CA','g4-q44','4','en-CA','6. Logic, combinations, data and evidence','Q44 · 6. Logic, combinations, data and evidence','Someone says, “All seeds germinate in three days,” after observing only one seed. Is that enough evidence? What would you suggest?

Oral answer. An adult may record my words:','Someone says, “All seeds germinate in three days,” after observing only one seed. Is that enough evidence? What would you suggest?

### 模块 7：短文写作、解释、合作与反思

Q45 为本册设置的 5–7 句短文练习，并非学校作文要求。其余可口答，成人记录。','FR — à lire : Quelqu’un dit : « Toutes les graines germent en trois jours », après avoir observé une seule graine. Est-ce une preuve suffisante ? Que proposerais-tu ?

EN — read aloud: Someone says, “All seeds germinate in three days,” after observing only one seed. Is that enough evidence? What would you suggest?

### 模块 7：短文写作、解释、合作与反思

Q45 为本册设置的 5–7 句短文练习，并非学校作文要求。其余可口答，成人记录。

FR : Non. Observer plusieurs graines, éventuellement de différents types, pendant plusieurs jours et comparer les résultats.

EN: No. Observe several seeds, possibly of different types, over several days and compare the results.

评分： 2 分：指出证据不足并提出相关追加观察；1 分：只指出不足或只提出观察；0 分：没有相关判断。

### 短文写作、解释、合作与反思：答案','text','No. Observe several seeds, possibly of different types, over several days and compare the results.','No. Observe several seeds, possibly of different types, over several days and compare the results.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q45-fr-CA','g4-q45','4','fr-CA','7. Rédiger, expliquer et réfléchir','Q45 · 7. Rédiger, expliquer et réfléchir','Écris 5 à 7 phrases pour proposer une activité d’accueil pour un nouvel élève. Précise l’activité, le matériel, deux étapes et pourquoi elle aiderait le nouvel élève.','Écris 5 à 7 phrases pour proposer une activité d’accueil pour un nouvel élève. Précise l’activité, le matériel, deux étapes et pourquoi elle aiderait le nouvel élève.','FR — à lire : Écris 5 à 7 phrases pour proposer une activité d’accueil pour un nouvel élève. Précise l’activité, le matériel, deux étapes et pourquoi elle aiderait le nouvel élève.

EN — read aloud: Write 5 to 7 sentences proposing a welcome activity for a new student. Include the activity, materials, two steps and why it would help the new student.

FR : Exemple : je propose un jeu pour découvrir l’école. Il faut un plan et des cartes. D’abord, nous formons de petites équipes. Ensuite, chaque équipe cherche trois endroits. Nous expliquons à quoi servent ces lieux. Le nouvel élève peut ainsi connaître l’école et parler avec ses camarades.

EN: Example: I suggest a game to explore the school. We need a map and cards. First, we make small teams. Next, each team finds three places. We explain what those places are used for. The new student can learn about the school and talk with classmates.

评分： 2 分：文字连贯，包含活动、材料、步骤和帮助理由；1 分：有可理解提案但遗漏一至两类信息；0 分：没有形成相关提案。句数供组织练习，不以机械凑句替代内容。','text','Exemple : je propose un jeu pour découvrir l’école. Il faut un plan et des cartes. D’abord, nous formons de petites équipes. Ensuite, chaque équipe cherche trois endroits. Nous expliquons à quoi servent ces lieux. Le nouvel élève peut ainsi connaître l’école et parler avec ses camarades.','Exemple : je propose un jeu pour découvrir l’école. Il faut un plan et des cartes. D’abord, nous formons de petites équipes. Ensuite, chaque équipe cherche trois endroits. Nous expliquons à quoi servent ces lieux. Le nouvel élève peut ainsi connaître l’école et parler avec ses camarades.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q45-en-CA','g4-q45','4','en-CA','7. Writing, explaining, cooperating and reflecting','Q45 · 7. Writing, explaining, cooperating and reflecting','Write 5 to 7 sentences proposing a welcome activity for a new student. Include the activity, materials, two steps and why it would help the new student.','Write 5 to 7 sentences proposing a welcome activity for a new student. Include the activity, materials, two steps and why it would help the new student.','FR — à lire : Écris 5 à 7 phrases pour proposer une activité d’accueil pour un nouvel élève. Précise l’activité, le matériel, deux étapes et pourquoi elle aiderait le nouvel élève.

EN — read aloud: Write 5 to 7 sentences proposing a welcome activity for a new student. Include the activity, materials, two steps and why it would help the new student.

FR : Exemple : je propose un jeu pour découvrir l’école. Il faut un plan et des cartes. D’abord, nous formons de petites équipes. Ensuite, chaque équipe cherche trois endroits. Nous expliquons à quoi servent ces lieux. Le nouvel élève peut ainsi connaître l’école et parler avec ses camarades.

EN: Example: I suggest a game to explore the school. We need a map and cards. First, we make small teams. Next, each team finds three places. We explain what those places are used for. The new student can learn about the school and talk with classmates.

评分： 2 分：文字连贯，包含活动、材料、步骤和帮助理由；1 分：有可理解提案但遗漏一至两类信息；0 分：没有形成相关提案。句数供组织练习，不以机械凑句替代内容。','text','Example: I suggest a game to explore the school. We need a map and cards. First, we make small teams. Next, each team finds three places. We explain what those places are used for. The new student can learn about the school and talk with classmates.','Example: I suggest a game to explore the school. We need a map and cards. First, we make small teams. Next, each team finds three places. We explain what those places are used for. The new student can learn about the school and talk with classmates.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q46-fr-CA','g4-q46','4','fr-CA','7. Rédiger, expliquer et réfléchir','Q46 · 7. Rédiger, expliquer et réfléchir','Explique deux façons de vérifier que 17 + 8 = 25.

Réponse orale. L’adulte peut noter mes mots :','Explique deux façons de vérifier que 17 + 8 = 25.','FR — à lire : Explique deux façons de vérifier que 17 + 8 = 25.

EN — read aloud: Explain two ways to check that 17 + 8 = 25.

FR : Par exemple : décomposer 8 en 3 + 5 pour faire 17 + 3 + 5 = 25; puis vérifier par 25 − 8 = 17. Un comptage ou dessin correct est aussi accepté.

EN: For example: split 8 into 3 + 5 to make 17 + 3 + 5 = 25; then check with 25 − 8 = 17. Correct counting or drawings are also accepted.

评分： 2 分：给出两种有效验证；1 分：给出一种；0 分：没有有效验证。','text','Par exemple : décomposer 8 en 3 + 5 pour faire 17 + 3 + 5 = 25; puis vérifier par 25 − 8 = 17. Un comptage ou dessin correct est aussi accepté.','Par exemple : décomposer 8 en 3 + 5 pour faire 17 + 3 + 5 = 25; puis vérifier par 25 − 8 = 17. Un comptage ou dessin correct est aussi accepté.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q46-en-CA','g4-q46','4','en-CA','7. Writing, explaining, cooperating and reflecting','Q46 · 7. Writing, explaining, cooperating and reflecting','Explain two ways to check that 17 + 8 = 25.

Oral answer. An adult may record my words:','Explain two ways to check that 17 + 8 = 25.','FR — à lire : Explique deux façons de vérifier que 17 + 8 = 25.

EN — read aloud: Explain two ways to check that 17 + 8 = 25.

FR : Par exemple : décomposer 8 en 3 + 5 pour faire 17 + 3 + 5 = 25; puis vérifier par 25 − 8 = 17. Un comptage ou dessin correct est aussi accepté.

EN: For example: split 8 into 3 + 5 to make 17 + 3 + 5 = 25; then check with 25 − 8 = 17. Correct counting or drawings are also accepted.

评分： 2 分：给出两种有效验证；1 分：给出一种；0 分：没有有效验证。','text','For example: split 8 into 3 + 5 to make 17 + 3 + 5 = 25; then check with 25 − 8 = 17. Correct counting or drawings are also accepted.','For example: split 8 into 3 + 5 to make 17 + 3 + 5 = 25; then check with 25 − 8 = 17. Correct counting or drawings are also accepted.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q47-fr-CA','g4-q47','4','fr-CA','7. Rédiger, expliquer et réfléchir','Q47 · 7. Rédiger, expliquer et réfléchir','Pendant une discussion, un camarade t’interrompt souvent. Comment peux-tu lui parler et proposer une règle utile au groupe ?

Réponse orale. L’adulte peut noter mes mots :','Pendant une discussion, un camarade t’interrompt souvent. Comment peux-tu lui parler et proposer une règle utile au groupe ?','FR — à lire : Pendant une discussion, un camarade t’interrompt souvent. Comment peux-tu lui parler et proposer une règle utile au groupe ?

EN — read aloud: During a discussion, a classmate often interrupts you. How could you speak to them and suggest a helpful group rule?

FR : Par exemple : j’aimerais terminer mon idée, puis je t’écouterai. Nous pourrions parler chacun notre tour.

EN: For example: I would like to finish my idea, then I will listen to you. We could take turns speaking.

评分： 2 分：回答切题并给出具体、合理的理由或做法；1 分：相关但不完整；0 分：没有相关回答。','text','Par exemple : j’aimerais terminer mon idée, puis je t’écouterai. Nous pourrions parler chacun notre tour.','Par exemple : j’aimerais terminer mon idée, puis je t’écouterai. Nous pourrions parler chacun notre tour.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q47-en-CA','g4-q47','4','en-CA','7. Writing, explaining, cooperating and reflecting','Q47 · 7. Writing, explaining, cooperating and reflecting','During a discussion, a classmate often interrupts you. How could you speak to them and suggest a helpful group rule?

Oral answer. An adult may record my words:','During a discussion, a classmate often interrupts you. How could you speak to them and suggest a helpful group rule?','FR — à lire : Pendant une discussion, un camarade t’interrompt souvent. Comment peux-tu lui parler et proposer une règle utile au groupe ?

EN — read aloud: During a discussion, a classmate often interrupts you. How could you speak to them and suggest a helpful group rule?

FR : Par exemple : j’aimerais terminer mon idée, puis je t’écouterai. Nous pourrions parler chacun notre tour.

EN: For example: I would like to finish my idea, then I will listen to you. We could take turns speaking.

评分： 2 分：回答切题并给出具体、合理的理由或做法；1 分：相关但不完整；0 分：没有相关回答。','text','For example: I would like to finish my idea, then I will listen to you. We could take turns speaking.','For example: I would like to finish my idea, then I will listen to you. We could take turns speaking.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q48-fr-CA','g4-q48','4','fr-CA','7. Rédiger, expliquer et réfléchir','Q48 · 7. Rédiger, expliquer et réfléchir','Trois élèves doivent créer une affiche ensemble. Propose trois rôles utiles et une façon de vérifier que chacun est d’accord.

Réponse orale. L’adulte peut noter mes mots :','Trois élèves doivent créer une affiche ensemble. Propose trois rôles utiles et une façon de vérifier que chacun est d’accord.','FR — à lire : Trois élèves doivent créer une affiche ensemble. Propose trois rôles utiles et une façon de vérifier que chacun est d’accord.

EN — read aloud: Three students must make a poster together. Suggest three useful roles and a way to check that everyone agrees.

FR : Par exemple : une personne rédige, une dessine, une vérifie les informations. On présente la répartition et chacun peut proposer un changement.

EN: For example: one person writes, one draws and one checks the information. Present the plan and let everyone suggest a change.

评分： 2 分：三个有用角色和确认同意的方法；1 分：只有角色或确认方法，或分工不完整；0 分：没有相关安排。','text','Par exemple : une personne rédige, une dessine, une vérifie les informations. On présente la répartition et chacun peut proposer un changement.','Par exemple : une personne rédige, une dessine, une vérifie les informations. On présente la répartition et chacun peut proposer un changement.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q48-en-CA','g4-q48','4','en-CA','7. Writing, explaining, cooperating and reflecting','Q48 · 7. Writing, explaining, cooperating and reflecting','Three students must make a poster together. Suggest three useful roles and a way to check that everyone agrees.

Oral answer. An adult may record my words:','Three students must make a poster together. Suggest three useful roles and a way to check that everyone agrees.','FR — à lire : Trois élèves doivent créer une affiche ensemble. Propose trois rôles utiles et une façon de vérifier que chacun est d’accord.

EN — read aloud: Three students must make a poster together. Suggest three useful roles and a way to check that everyone agrees.

FR : Par exemple : une personne rédige, une dessine, une vérifie les informations. On présente la répartition et chacun peut proposer un changement.

EN: For example: one person writes, one draws and one checks the information. Present the plan and let everyone suggest a change.

评分： 2 分：三个有用角色和确认同意的方法；1 分：只有角色或确认方法，或分工不完整；0 分：没有相关安排。','text','For example: one person writes, one draws and one checks the information. Present the plan and let everyone suggest a change.','For example: one person writes, one draws and one checks the information. Present the plan and let everyone suggest a change.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q49-fr-CA','g4-q49','4','fr-CA','7. Rédiger, expliquer et réfléchir','Q49 · 7. Rédiger, expliquer et réfléchir','Tu cherches l’heure d’un atelier. Une affiche récente de l’école indique 14 h; tu te souviens vaguement d’une conversation disant 16 h. Que fais-tu pour vérifier ?

Réponse orale. L’adulte peut noter mes mots :','Tu cherches l’heure d’un atelier. Une affiche récente de l’école indique 14 h; tu te souviens vaguement d’une conversation disant 16 h. Que fais-tu pour vérifier ?','FR — à lire : Tu cherches l’heure d’un atelier. Une affiche récente de l’école indique 14 h; tu te souviens vaguement d’une conversation disant 16 h. Que fais-tu pour vérifier ?

EN — read aloud: You are checking a workshop time. A recent school notice says 2:00 p.m.; you vaguely remember a conversation mentioning 4:00 p.m. What do you do to verify it?

FR : Consulter l’affiche récente et, si nécessaire, confirmer auprès de l’organisateur; ne pas traiter un souvenir vague comme une preuve plus solide.

EN: Check the recent notice and, if needed, confirm with the organiser; do not treat a vague memory as stronger evidence.

评分： 2 分：使用近期直接来源并提出合理确认；1 分：只选择较可靠来源；0 分：没有有效核实方法。','text','Consulter l’affiche récente et, si nécessaire, confirmer auprès de l’organisateur; ne pas traiter un souvenir vague comme une preuve plus solide.','Consulter l’affiche récente et, si nécessaire, confirmer auprès de l’organisateur; ne pas traiter un souvenir vague comme une preuve plus solide.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q49-en-CA','g4-q49','4','en-CA','7. Writing, explaining, cooperating and reflecting','Q49 · 7. Writing, explaining, cooperating and reflecting','You are checking a workshop time. A recent school notice says 2:00 p.m.; you vaguely remember a conversation mentioning 4:00 p.m. What do you do to verify it?

Oral answer. An adult may record my words:','You are checking a workshop time. A recent school notice says 2:00 p.m.; you vaguely remember a conversation mentioning 4:00 p.m. What do you do to verify it?','FR — à lire : Tu cherches l’heure d’un atelier. Une affiche récente de l’école indique 14 h; tu te souviens vaguement d’une conversation disant 16 h. Que fais-tu pour vérifier ?

EN — read aloud: You are checking a workshop time. A recent school notice says 2:00 p.m.; you vaguely remember a conversation mentioning 4:00 p.m. What do you do to verify it?

FR : Consulter l’affiche récente et, si nécessaire, confirmer auprès de l’organisateur; ne pas traiter un souvenir vague comme une preuve plus solide.

EN: Check the recent notice and, if needed, confirm with the organiser; do not treat a vague memory as stronger evidence.

评分： 2 分：使用近期直接来源并提出合理确认；1 分：只选择较可靠来源；0 分：没有有效核实方法。','text','Check the recent notice and, if needed, confirm with the organiser; do not treat a vague memory as stronger evidence.','Check the recent notice and, if needed, confirm with the organiser; do not treat a vague memory as stronger evidence.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q50-fr-CA','g4-q50','4','fr-CA','7. Rédiger, expliquer et réfléchir','Q50 · 7. Rédiger, expliquer et réfléchir','Choisis une erreur réelle ou possible dans tes réponses. Explique pourquoi elle peut arriver et une stratégie pour l’éviter la prochaine fois.

Réponse orale. L’adulte peut noter mes mots :','Choisis une erreur réelle ou possible dans tes réponses. Explique pourquoi elle peut arriver et une stratégie pour l’éviter la prochaine fois.','FR — à lire : Choisis une erreur réelle ou possible dans tes réponses. Explique pourquoi elle peut arriver et une stratégie pour l’éviter la prochaine fois.

EN — read aloud: Choose a real or possible mistake in your answers. Explain why it could happen and a strategy to avoid it next time.

FR : Par exemple : oublier un côté dans un périmètre. La prochaine fois, je marquerai les quatre côtés avant d’additionner.

EN: For example: forgetting one side when finding a perimeter. Next time, I will mark all four sides before adding.

评分： 2 分：指出具体错误／原因并给出匹配的改进策略；1 分：只指出错误或笼统说更认真；0 分：没有相关反思。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 多步听力与信息整合 |  |  |  |  |
| 独立阅读、证据与实用信息 |  |  |  |  |
| 语法、词义与修改句子 |  |  |  |  |
| 数位、四则与数的关系 |  |  |  |  |
| 多步骤应用、钱币与测量 |  |  |  |  |
| 规律、组合、数据与证据 |  |  |  |  |
| 短文写作、解释、合作与反思 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','Par exemple : oublier un côté dans un périmètre. La prochaine fois, je marquerai les quatre côtés avant d’additionner.','Par exemple : oublier un côté dans un périmètre. La prochaine fois, je marquerai les quatre côtés avant d’additionner.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,answer,explanation,status,text_policy,source) VALUES('g4-q50-en-CA','g4-q50','4','en-CA','7. Writing, explaining, cooperating and reflecting','Q50 · 7. Writing, explaining, cooperating and reflecting','Choose a real or possible mistake in your answers. Explain why it could happen and a strategy to avoid it next time.

Oral answer. An adult may record my words:','Choose a real or possible mistake in your answers. Explain why it could happen and a strategy to avoid it next time.','FR — à lire : Choisis une erreur réelle ou possible dans tes réponses. Explique pourquoi elle peut arriver et une stratégie pour l’éviter la prochaine fois.

EN — read aloud: Choose a real or possible mistake in your answers. Explain why it could happen and a strategy to avoid it next time.

FR : Par exemple : oublier un côté dans un périmètre. La prochaine fois, je marquerai les quatre côtés avant d’additionner.

EN: For example: forgetting one side when finding a perimeter. Next time, I will mark all four sides before adding.

评分： 2 分：指出具体错误／原因并给出匹配的改进策略；1 分：只指出错误或笼统说更认真；0 分：没有相关反思。

## 练习后反馈记录（不计入 50 题）

| 模块 | 独立完成题数 | 需原句重复／语言支持 | 需学科或操作支持 | 下次练习重点 |
|---|---:|---|---|---|
| 多步听力与信息整合 |  |  |  |  |
| 独立阅读、证据与实用信息 |  |  |  |  |
| 语法、词义与修改句子 |  |  |  |  |
| 数位、四则与数的关系 |  |  |  |  |
| 多步骤应用、钱币与测量 |  |  |  |  |
| 规律、组合、数据与证据 |  |  |  |  |
| 短文写作、解释、合作与反思 |  |  |  |  |

建议反馈：先指出孩子已经做到的一件具体事情，再选一项可练习的方法。保留解题过程及原话，避免只用总分描述孩子。

## 编制依据与适用范围

本册依据前述学校招生方式的调研及魁北克基础课程方向自主编写。它用于熟悉任务、练习语言和观察学习过程，不是学校、教育局、IB 或外部测评公司的材料，也不复刻或声称预测其保密试题。学校的名额、评估项目和录取规则应以当年度通知为准。本册不设置录取合格线。

- [Greenfield Park 官方招生页面](https://igfp.cssmv.gouv.qc.ca/espace-parents/admission-et-inscription/)
- [École internationale de Montréal 小学招生页面](https://ecole-internationale.cssdm.gouv.qc.ca/sinscrire-primaire/)
- [魁北克学前课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/education-prescolaire)
- [魁北克小学法语课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement)
- [魁北克小学数学课程](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/mathematique)
- [IB 学习者素养](https://www.ibo.org/fr/benefits-of-the-ib/the-ib-learner-profile/)

英语版是同一能力目标的练习适配版，不是英语教育局或英语学校的官方试卷。语音题按各语言的音韵重新设计；英法两版难度未经标准化校准，不用于比较语言能力分数。','text','For example: forgetting one side when finding a perimeter. Next time, I will mark all four sides before adding.','For example: forgetting one side when finding a perimeter. Next time, I will mark all four sides before adding.','draft','full','小学四年级_入学模拟题_英法双语_50题.md');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-1-fr-CA','practice-1','1','fr-CA','Compter et raisonner','Les petits oiseaux','Il y a 4 oiseaux. 3 autres arrivent. Combien y en a-t-il en tout ?','Il y a 4 oiseaux. 3 autres arrivent. Combien y en a-t-il en tout ?','numeric','7','4 + 3 = 7.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-1-en-CA','practice-1','1','en-CA','Compter et raisonner','Les petits oiseaux','There are 4 birds. 3 more arrive. How many birds are there in all?','There are 4 birds. 3 more arrive. How many birds are there in all?','numeric','7','4 + 3 = 7.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-2-fr-CA','practice-2','1','fr-CA','Formes et espace','Les côtés du triangle','Combien de côtés a un triangle ?','Combien de côtés a un triangle ?','numeric','3','Un triangle a 3 côtés. / A triangle has 3 sides.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-2-en-CA','practice-2','1','en-CA','Formes et espace','Les côtés du triangle','How many sides does a triangle have?','How many sides does a triangle have?','numeric','3','Un triangle a 3 côtés. / A triangle has 3 sides.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-3-fr-CA','practice-3','2','fr-CA','Compter et raisonner','Le partage des jetons','Tu as 12 jetons. Tu en donnes 5. Combien t’en reste-t-il ?','Tu as 12 jetons. Tu en donnes 5. Combien t’en reste-t-il ?','numeric','7','12 − 5 = 7.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-3-en-CA','practice-3','2','en-CA','Compter et raisonner','Le partage des jetons','You have 12 counters. You give away 5. How many are left?','You have 12 counters. You give away 5. How many are left?','numeric','7','12 − 5 = 7.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-4-fr-CA','practice-4','2','fr-CA','Calcul mental','Le saut de grenouille','Une grenouille part de la case 8 et avance de 6 cases. Sur quelle case arrive-t-elle ?','Une grenouille part de la case 8 et avance de 6 cases. Sur quelle case arrive-t-elle ?','numeric','14','8 + 6 = 14.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-4-en-CA','practice-4','2','en-CA','Calcul mental','Le saut de grenouille','A frog starts on square 8 and jumps forward 6 squares. Which square does it land on?','A frog starts on square 8 and jumps forward 6 squares. Which square does it land on?','numeric','14','8 + 6 = 14.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-5-fr-CA','practice-5','3','fr-CA','Calcul et logique','Deux opérations','Commence à 12. Ajoute 5, puis enlève 2. Quel est le résultat ?','Commence à 12. Ajoute 5, puis enlève 2. Quel est le résultat ?','numeric','15','12 + 5 − 2 = 15.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-5-en-CA','practice-5','3','en-CA','Calcul et logique','Deux opérations','Start with 12. Add 5, then subtract 2. What is the result?','Start with 12. Add 5, then subtract 2. What is the result?','numeric','15','12 + 5 − 2 = 15.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-6-fr-CA','practice-6','4','fr-CA','Calcul et logique','Les groupes égaux','Il y a 6 boîtes avec 8 crayons chacune. Combien de crayons en tout ?','Il y a 6 boîtes avec 8 crayons chacune. Combien de crayons en tout ?','numeric','48','6 × 8 = 48.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-6-en-CA','practice-6','4','en-CA','Calcul et logique','Les groupes égaux','There are 6 boxes with 8 pencils in each. How many pencils in total?','There are 6 boxes with 8 pencils in each. How many pencils in total?','numeric','48','6 × 8 = 48.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-7-fr-CA','practice-7','2','fr-CA','Formes et espace','Dessiner un triangle','Dessine un triangle fermé. Tu peux utiliser le tableau ci-dessous.','Dessine un triangle fermé. Tu peux utiliser le tableau ci-dessous.','drawing','Trois côtés et trois sommets. / Three sides and three corners.','Validation par un adulte. / An adult will review this drawing.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-7-en-CA','practice-7','2','en-CA','Formes et espace','Dessiner un triangle','Draw a closed triangle. You can use the drawing board below.','Draw a closed triangle. You can use the drawing board below.','drawing','Trois côtés et trois sommets. / Three sides and three corners.','Validation par un adulte. / An adult will review this drawing.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-8-fr-CA','practice-8','2','fr-CA','Mots et idées','Une réponse personnelle','Décris une activité que tu aimes et explique pourquoi.','Décris une activité que tu aimes et explique pourquoi.','text','Une idée pertinente avec une raison. / A relevant idea and a reason.','Réponse ouverte : validation par un adulte. / Open response: adult review.','published','Exercices de démarrage · révision écrite','[]');
INSERT OR IGNORE INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,explanation,status,source,options) VALUES('practice-8-en-CA','practice-8','2','en-CA','Mots et idées','Une réponse personnelle','Describe an activity you enjoy and explain why.','Describe an activity you enjoy and explain why.','text','Une idée pertinente avec une raison. / A relevant idea and a reason.','Réponse ouverte : validation par un adulte. / Open response: adult review.','published','Exercices de démarrage · révision écrite','[]');