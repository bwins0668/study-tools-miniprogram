'use strict';
var fs=require('fs');var path=require('path');
var ROOT=path.resolve(__dirname,'..');
var PKGS=['quiz-itpass-1','quiz-itpass-2','quiz-itpass-3','quiz-itpass-4','quiz-itpass-5','quiz-sg-1','quiz-sg-2'];

function isAllowedLiteral(t){
  if(!t||typeof t!=='string')return false;
  t=t.trim();if(!t)return false;
  if(/^[\d\s.,%+\-—\/()]+$/.test(t))return true;
  if(/^[a-d]([、,][a-d])*$/.test(t))return true;
  if(/^\(\d+\)$/.test(t))return true;
  if(/^[A-Z][A-Z0-9]{1,8}([.\-/][A-Z0-9]{1,4})*$/.test(t))return true;
  if(/^(FinTech|IoT|SDGs|UNESCO|WHO|COP21|RFID|ISP|EDI|FA|KPI|ROA|CSR|BPO|SCM|ERP|CRM|ASP)$/.test(t))return true;
  return false;
}
function loadJs(fp){var c=fs.readFileSync(fp,'utf8').replace(/^\s*\/\/.*$/gm,'');var m=c.match(/module\.exports\s*=\s*([\s\S]+)$/);if(m){var e=m[1].trim();while(e.endsWith(';'))e=e.slice(0,-1);try{return JSON.parse(e)}catch(_){try{var s={};new Function('s','with(s){return ('+e+')}')(s);return s}catch(_2){return null}}}return null}
function strip(v){if(!v||typeof v!=='string')return'';return v.replace(/<[^>]+>/g,'').trim()}

var total=0,jaExpl=0,zhExpl=0,missing=0,bind=0,fallback=0;
for(var i=0;i<PKGS.length;i++){
  var pkg=PKGS[i];
  var qp=path.join(ROOT,'packages',pkg,'data','questions.js');
  if(!fs.existsSync(qp))continue;
  var d=loadJs(qp);if(!d)continue;
  
  var ep=path.join(ROOT,'packages',pkg,'data','explanations_zh.js');
  var explById={};
  if(fs.existsSync(ep)){var ed=loadJs(ep);if(ed&&typeof ed==='object'){for(var ek in ed)explById[ek]=ed[ek]}}
  
  var years=Object.keys(d.questionsByYear||{});
  for(var j=0;j<years.length;j++){
    var qs=d.questionsByYear[years[j]];
    for(var k=0;k<qs.length;k++){
      var q=qs[k];total++;
      if(q.explanationJa&&strip(q.explanationJa).length>10)jaExpl++;
      
      var genExpl=explById[q.id]||'';
      var hasRealZh=genExpl&&genExpl.length>20&&genExpl!==strip(q.explanationJa||'');
      var inlineZh=q.explanationZh&&strip(q.explanationZh).length>10&&strip(q.explanationZh)!==strip(q.explanationJa||'');
      if(hasRealZh||inlineZh)zhExpl++;else missing++;
      
      var answer=q.answer,opts=q.options||[];
      if(answer){for(var m=0;m<opts.length;m++){if(opts[m].key===answer){
        var optZh=strip(opts[m].textZh||''),optJa=strip(opts[m].textJa||'');
        if(optZh===optJa&&optZh.length>0&&!isAllowedLiteral(optZh))bind++;
      }}}
    }
  }
}

var passed=missing===0&&bind===0;
console.log('=== Exam Explanation Chinese Audit ===');
console.log('Total questions:        '+total);
console.log('Japanese explanations:  '+jaExpl);
console.log('Chinese explanations:   '+zhExpl);
console.log('Missing Chinese expl:   '+missing);
console.log('Binding errors:         '+bind);
console.log('');
console.log(passed?'RESULT: PASS':'RESULT: FAIL — '+missing+' missing,'+bind+' binding');
process.exit(passed?0:1);
