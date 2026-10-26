export class InputError extends Error{constructor(code,detail=''){super(code);this.code=code;this.detail=detail;}}
const DAY=86400000;
export function dateValue(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||Number(s.slice(0,4))<1900||Number(s.slice(0,4))>2100)throw new InputError('date');const d=new Date(s+'T00:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==s)throw new InputError('date');return +d;}
export function timeValue(s){if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s))throw new InputError('time');return Number(s.slice(0,2))*60+Number(s.slice(3));}
export function weekStart(date){const d=new Date(dateValue(date)),day=d.getUTCDay();return new Date(+d-((day+6)%7)*DAY).toISOString().slice(0,10);}
export function calculate(records){
 if(!records.length)throw new InputError('empty');if(records.length>200)throw new InputError('limit');const rows=[];
 records.forEach((r,i)=>{try{const base=dateValue(r.date),start=timeValue(r.start),end=timeValue(r.end);if(!/^\d+$/.test(String(r.break)))throw new InputError('break');const pause=Number(r.break);if(!Number.isSafeInteger(pause)||pause>1440)throw new InputError('break');if(typeof r.nextDay!=='boolean')throw new InputError('next');const elapsed=end-start+(r.nextDay?1440:0);if(elapsed<=0||elapsed>1440)throw new InputError('duration');if(pause>=elapsed)throw new InputError('pause');rows.push({...r,break:pause,elapsed,net:elapsed-pause,startStamp:base+start*60000,endStamp:base+(start+elapsed)*60000,index:i+1,week:weekStart(r.date)});}catch(e){e.detail=String(i+1);throw e;}});
 const ordered=[...rows].sort((a,b)=>a.startStamp-b.startStamp);for(let i=1;i<ordered.length;i++)if(ordered[i].startStamp<ordered[i-1].endStamp)throw new InputError('overlap',`${ordered[i-1].index}, ${ordered[i].index}`);
 const daily=new Map(),weekly=new Map();let net=0,pause=0,elapsed=0;
 for(const r of rows){net+=r.net;pause+=r.break;elapsed+=r.elapsed;daily.set(r.date,(daily.get(r.date)||0)+r.net);weekly.set(r.week,(weekly.get(r.week)||0)+r.net);}
 return {rows,net,pause,elapsed,daily:[...daily].sort(([a],[b])=>a.localeCompare(b)),weekly:[...weekly].sort(([a],[b])=>a.localeCompare(b))};
}
export function cellCSV(s){return '"'+String(s).replaceAll('"','""')+'"';}
export function exportCSV(result,headers,yes,no){return '\uFEFF'+[headers,...result.rows.map(r=>[r.date,r.start,r.end,r.nextDay?yes:no,r.break,r.elapsed,r.net,(r.net/60).toFixed(2),r.week])].map(r=>r.map(cellCSV).join(',')).join('\r\n');}
export function summaryCSV(result,headers,daily,weekly){return '\uFEFF'+[headers,...result.daily.map(([d,m])=>[daily,d,m,(m/60).toFixed(2)]),...result.weekly.map(([d,m])=>[weekly,d,m,(m/60).toFixed(2)])].map(r=>r.map(cellCSV).join(',')).join('\r\n');}
