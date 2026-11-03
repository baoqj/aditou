import {test} from 'node:test';import assert from 'node:assert/strict';import {build} from 'esbuild';
const bundle=await build({entryPoints:['worker/support.ts'],bundle:true,write:false,format:'esm',platform:'browser'});const {supportCheckout}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
test('Shared checkout validates amounts and locale, avoids credentials and rejects unsafe redirects',async()=>{
 const original=globalThis.fetch;let calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return Response.json({url:'https://checkout.stripe.com/c/pay/fixture'})};
 const req=(amount,language='zh')=>new Request('https://aditou.studyai.now/api/support/checkout',{method:'POST',body:JSON.stringify({amount,language})});
 try{assert.equal((await supportCheckout(req(3))).status,400);assert.equal(calls.length,0);
 for(const [locale,upstream] of [['zh','zh-CN'],['en','en'],['es','es'],['fr','fr']]){const r=await supportCheckout(req(2,locale));assert.equal(r.status,200);assert.equal(calls.at(-1).url,'https://studyai.now/api/donations/checkout');assert.equal(JSON.parse(calls.at(-1).options.body).language,upstream);assert.equal(calls.at(-1).options.headers.Authorization,undefined);assert.equal(r.headers.get('cache-control'),'no-store');}
 globalThis.fetch=async()=>Response.json({url:'https://evil.example.com'});assert.equal((await supportCheckout(req(5))).status,502);
 globalThis.fetch=async()=>Response.json({error:'not configured'},{status:503});assert.equal((await supportCheckout(req(10))).status,503);
 globalThis.fetch=async()=>{throw Error('network')};assert.equal((await supportCheckout(req(2))).status,502);
 }finally{globalThis.fetch=original}
});
test('Cloudflare service binding handles shared checkout without a public same-zone request',async()=>{let used=false;const service={fetch:async(url,options)=>{used=true;assert.equal(url,'https://studyai.now/api/donations/checkout');assert.equal(options.headers.Origin,'https://studyai.now');return Response.json({url:'https://checkout.stripe.com/c/pay/service-fixture'})}};const r=await supportCheckout(new Request('https://aditou.studyai.now/api/support/checkout',{method:'POST',body:JSON.stringify({amount:5,language:'es'})}),service);assert.equal(r.status,200);assert.equal(used,true)});
