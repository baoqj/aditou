import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>console.log('PAGE ERROR',e.message));const base=process.env.BASE_URL||'https://aditou.studyai.now';
try{
 console.log('guest');await page.goto(base+'/contact');await page.locator('textarea[name=message]').waitFor();await page.evaluate(()=>localStorage.setItem('entryexam.ui-language','en'));await page.reload();await page.getByRole('heading',{name:'Contact us',exact:true}).waitFor();assert.equal(await page.locator('input[name=email]').getAttribute('readonly'),null);
 await page.route('**/api/feedback',async route=>{const b=route.request().postDataJSON();assert.equal(b.message,'Plain <b>text</b>');await route.fulfill({json:{ok:true}})});
 await page.locator('input[name=email]').fill('guest@example.com');await page.locator('textarea').fill('Plain <b>text</b>');await page.getByRole('button',{name:'Send',exact:true}).click();await page.getByRole('heading',{name:'Your message has been sent.'}).waitFor();
 for(const width of [390,768,1440]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`)}
 console.log('login');await page.goto(base+'/login');await page.locator('input[name=email]').fill('student@gmail.com');await page.locator('input[name=password]').fill('Student1234');await page.locator('form button.btn.full').click();await page.waitForURL('**/learn');
 await page.goto(base+'/learn/settings/contact');await page.locator('textarea').waitFor();assert.equal(await page.locator('input[name=email]').inputValue(),'student@gmail.com');assert.notEqual(await page.locator('input[name=email]').getAttribute('readonly'),null);
 await page.goto(base+'/');await page.locator('.account-menu-trigger').waitFor();await page.locator('.account-menu-trigger').click();await page.getByRole('menuitem',{name:'Contact us',exact:true}).click();await page.waitForURL('**/learn/settings/contact');
 await page.evaluate(()=>localStorage.setItem('entryexam.ui-language','fr'));await page.reload();await page.getByRole('heading',{name:'Contactez-nous',exact:true}).waitFor();
 console.log('PASS: guest form, mocked delivery UI, responsive widths, logged-in locked email, account menu route, EN/FR');
}finally{await page.request.post(base+'/api/auth/logout',{data:{}});await browser.close()}
