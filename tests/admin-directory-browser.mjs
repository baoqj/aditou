import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],calls=[];
page.on('pageerror',e=>errors.push(e.message));
const user={id:'admin',name:'Admin',email:'admin@gmail.com',role:'admin'};
await page.route('**/api/**',async route=>{const req=route.request(),url=new URL(req.url()),p=url.pathname;let body={};calls.push({path:p,query:url.search,method:req.method()});
 if(p==='/api/auth/me')body={user};else if(p==='/api/bootstrap')body={user,classes:[],assignments:[],classrooms:[],children:[],staff:true};else if(p==='/api/questions')body={questions:[]};else if(p==='/api/audio')body={assets:[]};else if(p==='/api/attempts')body={attempts:[]};else if(p.startsWith('/api/admin/'))body=req.method()==='POST'?{ok:true}:{total:1,page:1,owners:[{id:'teacher',name:'Teacher',email:'teacher@example.com'}],items:p.endsWith('/users')?[{id:'teacher',name:'Teacher',email:'teacher@example.com',role:'teacher',disabled:0,created_at:'2026-11-03 12:00:00'}]:[{id:'org',name:'Academy',owner_name:'Teacher',owner_email:'teacher@example.com',disabled:0,created_at:'2026-11-03 12:00:00'}]};
 await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
});
const base=process.env.BASE_URL||'http://localhost:8796';
for(const lang of ['en','fr','es','zh']){
 const t=JSON.parse(readFileSync('src/locales/'+lang+'.json','utf8'));
 await page.goto(base+'/org/main/manage/users?lang='+lang);await page.getByRole('heading',{name:t['admin.users'],exact:true}).waitFor();await page.getByRole('cell',{name:'teacher@example.com',exact:true}).waitFor();
 await page.getByRole('searchbox').fill('Teacher');await page.waitForTimeout(350);
 await page.getByRole('combobox',{name:t['admin.role'],exact:true}).selectOption('teacher');await page.waitForTimeout(350);
 assert.ok(calls.some(c=>c.query.includes('q=Teacher')&&c.query.includes('filter=teacher')));
 await page.getByRole('button',{name:t['admin.edit'],exact:true}).click();await page.getByRole('dialog').getByRole('textbox').fill('New Teacher');await page.getByRole('button',{name:t['admin.save'],exact:true}).click();await page.getByRole('dialog').waitFor({state:'hidden'});
 await page.getByRole('button',{name:t['admin.disable'],exact:true}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:t['admin.cancel'],exact:true}).click();
 await page.locator('.sidebar').getByRole('button',{name:t['admin.organizations'],exact:true}).click();await page.getByRole('cell',{name:'Academy',exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1440,height:1000});
}
await page.screenshot({path:'artifacts/admin-directory-desktop.png',fullPage:true});assert.deepEqual(errors,[]);writeFileSync('artifacts/admin-directory-browser-validation.json',JSON.stringify({languages:['en','fr','es','zh'],search:true,filters:true,edit:true,confirmation:true,mobile:true,api:'mocked',errors},null,2));await browser.close();console.log('Admin directory browser checks passed (mocked API).');
