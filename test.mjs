import assert from 'node:assert/strict';import fs from 'node:fs';import {dateValue,timeValue,weekStart,calculate,exportCSV,summaryCSV} from './dist/core.js';import {catalogs} from './dist/locales.js';
const r=(date,start,end,pause='0',nextDay=false)=>({date,start,end,break:pause,nextDay});
assert.equal(calculate([r('2026-10-26','09:00','18:00','60')]).net,480);
assert.equal(calculate([r('2026-10-26','22:00','06:30','30',true)]).net,480);
assert.equal(calculate([r('2026-10-26','09:00','16:01')]).net,421);
assert.equal(calculate([r('2026-10-26','08:00','08:00','0',true)]).net,1440);
for(const date of ['2026-02-29','2026-13-01','2026-04-31','1899-01-01','2101-01-01'])assert.throws(()=>dateValue(date),e=>e.code==='date');assert.ok(dateValue('2024-02-29'));
for(const time of ['24:00','12:60','9:00','10:00:00'])assert.throws(()=>timeValue(time),e=>e.code==='time');
assert.equal(weekStart('2027-01-01'),'2026-12-28');assert.equal(weekStart('2026-10-25'),'2026-10-19');assert.equal(weekStart('2026-10-26'),'2026-10-26');
assert.throws(()=>calculate([r('2026-10-26','22:00','06:00')]),e=>e.code==='duration');assert.throws(()=>calculate([r('2026-10-26','09:00','10:00','60')]),e=>e.code==='pause');assert.throws(()=>calculate([r('2026-10-26','09:00','10:00','1.5')]),e=>e.code==='break');
assert.throws(()=>calculate([r('2026-10-26','22:00','06:00','0',true),r('2026-10-27','05:30','09:00')]),e=>e.code==='overlap');assert.throws(()=>calculate([r('2026-10-26','09:00','10:00'),r('2026-10-26','09:00','10:00')]),e=>e.code==='overlap');
const x=calculate([r('2026-10-25','22:00','02:00','30',true),r('2026-10-26','02:00','03:00'),r('2026-10-26','04:00','05:30')]);assert.equal(x.net,360);assert.deepEqual(x.daily,[['2026-10-25',210],['2026-10-26',150]]);assert.deepEqual(x.weekly,[['2026-10-19',210],['2026-10-26',150]]);
assert.ok(exportCSV(x,['a','b','c','d','e','f','g','h','i'],'yes','no').includes('"3.50"'));assert.ok(summaryCSV(x,['kind','date','min','hours'],'day','week').includes('"day","2026-10-25","210","3.50"'));
for(const [lang,c] of Object.entries(catalogs)){assert.deepEqual(Object.keys(c).sort(),Object.keys(catalogs.ko).sort());assert.deepEqual(Object.keys(c.errors).sort(),Object.keys(catalogs.ko.errors).sort());assert.ok(fs.readFileSync(lang==='ko'?'dist/index.html':`dist/${lang}/index.html`,'utf8').includes(`lang="${lang}"`));}
console.log('PASS: fixed minutes, overnight, 24h, malformed dates/times, break errors, duplicate/cross-day overlap, adjacent intervals, daily/Monday-week attribution, decimal CSV, six locale catalogs/routes');

for(const [locale,catalog] of Object.entries(catalogs)){const page=fs.readFileSync(locale==='ko'?'dist/index.html':'dist/'+locale+'/index.html','utf8');assert.equal(page.match(/<title>([^<]*)<\/title>/)[1],catalog.title);assert.deepEqual([...page.matchAll(/data-lang="([^"]+)"/g)].map(m=>m[1]),['ko','en','es','zh','ja','de']);assert.ok(page.includes('<html lang="'+locale+'">'));}console.log('PASS: all static localized titles and unique language-menu identities');
