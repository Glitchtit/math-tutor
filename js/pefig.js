// Figures and the buck/boost explorer ported from the PE1 Mini Exam 1 study page
// (docs/superpowers/pe1-artifact.html). The drawing code is kept as in the original; only element
// lookups are scoped to the widget. Colours come from the artifact's variable names, which
// css/style.css maps onto the app theme inside .pefig.

// figure id -> SVG viewBox
export const PE_FIGURES = { "expToolkit": "0 0 520 230", "rcPlot": "0 0 520 230", "rlPlot": "0 0 520 230", "vsBuck": "0 0 520 230", "vsBoost": "0 0 520 230", "buckOn": "0 0 430 160", "buckOff": "0 0 430 160", "boostOn": "0 0 430 160", "boostOff": "0 0 430 160", "drBuck": "0 0 430 160", "drBuckOn": "0 0 430 160", "drBuckOff": "0 0 430 160", "drBoost": "0 0 430 160", "drBoostOn": "0 0 430 160", "drBoostOff": "0 0 430 160", "drRC": "0 0 520 230", "drRL": "0 0 520 230", "wfBuck": "0 0 520 430", "wfBoost": "0 0 520 440", "wfRect": "0 0 520 260", "wfInv": "0 0 520 300" };

export function drawPeFigure(svg, id) {
  const byId = (x) => (x === id ? svg : null);
(function(){
  const NS='http://www.w3.org/2000/svg';
  function add(svg,tag,attrs,txt){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;svg.appendChild(e);return e;}
  function lanes(id,spec){
    const svg=byId(id); if(!svg)return;
    const x0=80,W=410,span=spec.span||2,X=t=>x0+t/span*W;
    let y=12; const top=y;
    spec.lanes.forEach(L=>{L.y=y;y+=L.h+22;});
    const bottom=y-18;
    spec.marks.forEach(m=>{add(svg,'path',{class:'grid',d:`M${X(m.t)} ${top} V${bottom}`});add(svg,'text',{class:'svgtxt',x:X(m.t),y:bottom+14,'text-anchor':'middle'},m.label);});
    spec.lanes.forEach(L=>{
      const Y=v=>L.y+L.h-(v-L.lo)/(L.hi-L.lo)*L.h;
      add(svg,'text',{class:'svgtxt-i',x:8,y:L.y+L.h/2+4},L.name);
      add(svg,'path',{class:'ax',d:`M${x0} ${L.y} V${L.y+L.h}`});
      const zy=(L.lo<=0&&L.hi>=0)?Y(0):L.y+L.h;
      add(svg,'path',{class:'ax',d:`M${x0} ${zy} H${X(span)+10}`});
      if(L.lo<0)add(svg,'text',{class:'svgtxt',x:x0-6,y:zy+4,'text-anchor':'end'},'0');
      if(L.avg!=null){add(svg,'path',{class:'sc',style:'fill:none;stroke-width:1.5;stroke-dasharray:5 4',d:`M${x0} ${Y(L.avg)} H${X(span)}`});}
      if(L.fill){const p=L.pts();let d=`M${X(p[0][0])} ${zy} `;p.forEach(([t,v])=>d+=`L${X(t).toFixed(1)} ${Y(v).toFixed(1)} `);d+=`L${X(p[p.length-1][0])} ${zy} Z`;add(svg,'path',{d,class:L.fill,'fill-opacity':0.15,stroke:'none'});}
      (L.extra||[]).forEach(E=>{const p=E.pts();add(svg,'path',{d:p.map(([t,v],i)=>(i?'L':'M')+X(t).toFixed(1)+' '+Y(v).toFixed(1)).join(' '),class:E.cls,style:'fill:none;stroke-width:1.8;'+(E.dash?'stroke-dasharray:5 4':'')});});
      const p=L.pts();
      add(svg,'path',{d:p.map(([t,v],i)=>(i?'L':'M')+X(t).toFixed(1)+' '+Y(v).toFixed(1)).join(' '),class:L.cls||'sch',style:'fill:none;stroke-width:2.4'});
      (L.labels||[]).forEach(([t,v,txt,cls,dy])=>add(svg,'text',{x:X(t),y:Y(v)+(dy||-6),class:cls||'svgtxt-i',style:'font-family:var(--f-mono);font-size:12px'},txt));
    });
  }
  const D=0.4, per=f=>{let a=[];for(let k=0;k<2;k++)a=a.concat(f(k));return a;};
  const mk=[{t:0,label:'0'},{t:D,label:'DTs'},{t:1,label:'Ts'},{t:1+D,label:''},{t:2,label:'2Ts'}];
  const SW={name:'SW',lo:-0.2,hi:1.3,h:40,cls:'sc',pts:()=>per(k=>[[k,1],[k+D,1],[k+D,0],[k+1,0]]),labels:[[0.12,1,'ON','svgtxt'],[0.6,0,'OFF','svgtxt']]};
  const IL={name:'iL',lo:0,hi:1.3,h:80,cls:'sa',avg:0.8,pts:()=>per(k=>[[k,0.6],[k+D,1.0],[k+1,0.6]]),labels:[[1.72,0.8,'IL','cc',-4],[D+0.03,1.0,'peak at DTs','svgtxt',-4]]};
  lanes('wfBuck',{marks:mk,lanes:[SW,
    {name:'vL',lo:-0.6,hi:0.85,h:110,cls:'sch',fill:'fa',pts:()=>per(k=>[[k,0.6],[k+D,0.6],[k+D,-0.4],[k+1,-0.4]]),labels:[[0.03,0.6,'Vs − Vo','ca'],[D+0.05,-0.4,'−Vo','cb',16]]},
    IL,
    {name:'iC',lo:-0.35,hi:0.35,h:80,cls:'sb',pts:()=>per(k=>[[k,-0.2],[k+D,0.2],[k+1,-0.2]]),labels:[[D+0.03,0.2,'iC = iL − Io (average 0)','svgtxt',-4]]}
  ]});
  lanes('wfBoost',{marks:mk,lanes:[SW,
    {name:'vL',lo:-0.9,hi:1.25,h:110,cls:'sch',fill:'fa',pts:()=>per(k=>[[k,1],[k+D,1],[k+D,-0.667],[k+1,-0.667]]),labels:[[0.05,1,'Vs','ca'],[D+0.05,-0.667,'Vs − Vo  (negative)','cb',16]]},
    IL,
    {name:'iC',lo:-0.8,hi:0.8,h:90,cls:'sb',pts:()=>per(k=>[[k,-0.6],[k+D,-0.6],[k+D,0.55],[k+1,0.25]]),labels:[[0.03,-0.6,'−Io','cb',16],[D+0.05,0.55,'IL − Io, ramps down with iL','svgtxt',-4]]}
  ]});
  // half-wave rectifier: one sine period per unit
  const S=n=>{const a=[];for(let i=0;i<=n;i++)a.push(i/n*2);return a;};
  lanes('wfRect',{span:2,marks:[{t:0,label:'0'},{t:0.5,label:'T/2'},{t:1,label:'T'},{t:1.5,label:'3T/2'},{t:2,label:'2T'}],lanes:[
    {name:'vin',lo:-1.2,hi:1.2,h:90,cls:'sch',pts:()=>S(160).map(t=>[t,Math.sin(2*Math.PI*t)]),labels:[[0.2,1,'Vm','svgtxt-i',-4]]},
    {name:'vout',lo:-0.2,hi:1.2,h:90,cls:'sa',fill:'fa',pts:()=>S(160).map(t=>[t,Math.max(0,Math.sin(2*Math.PI*t))]),
      extra:[{cls:'sb',dash:true,pts:()=>S(160).map(t=>[t,Math.max(0,Math.sin(2*Math.PI*t)-0.15)])}],
      labels:[[0.28,1,'ideal: Vm','ca',-4],[0.58,0.15,'practical: Vm − 0.7 V (dashed)','cb',-30],[0.62,0,'diode blocks → 0','svgtxt',-6]]}
  ]});
  lanes('wfInv',{span:2,marks:[{t:0,label:'0'},{t:0.5,label:'T/2'},{t:1,label:'T'},{t:1.5,label:'3T/2'},{t:2,label:'2T'}],lanes:[
    {name:'S1',lo:-0.2,hi:1.3,h:40,cls:'sc',pts:()=>per(k=>[[k,1],[k+0.5,1],[k+0.5,0],[k+1,0]]),labels:[[0.15,1,'on','svgtxt']]},
    {name:'S2',lo:-0.2,hi:1.3,h:40,cls:'sc',pts:()=>per(k=>[[k,0],[k+0.5,0],[k+0.5,1],[k+1,1]]),labels:[[0.65,1,'on','svgtxt']]},
    {name:'vo',lo:-1.3,hi:1.3,h:110,cls:'sa',fill:'fa',pts:()=>per(k=>[[k,1],[k+0.5,1],[k+0.5,-1],[k+1,-1]]),labels:[[0.05,1,'+Vdc/2 (S1 on)','ca'],[0.55,-1,'−Vdc/2 (S2 on)','cb',16]]}
  ]});
})();
(function(){
  const NS='http://www.w3.org/2000/svg';
  function add(svg,tag,attrs,txt){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;svg.appendChild(e);return e;}

  /* exponential rise / fall plot, x in time constants */
  function expPlot(id,rise,fall,xl){
    const svg=byId(id); if(!svg)return;
    const x0=50,y0=190,W=440,H=160,X=x=>x0+x/5*W,Y=y=>y0-y*H;
    for(let k=1;k<=5;k++){add(svg,'path',{class:'grid',d:`M${X(k)} ${y0} V${Y(1)}`});add(svg,'text',{class:'svgtxt',x:X(k)-8,y:y0+16},k+xl);}
    [0.368,0.632,1].forEach(v=>add(svg,'path',{class:'grid',d:`M${x0} ${Y(v)} H${X(5)}`}));
    add(svg,'path',{class:'ax',d:`M${x0} ${y0} H${X(5)+8} M${x0} ${y0} V${Y(1)-10}`});
    add(svg,'text',{class:'svgtxt',x:x0-30,y:Y(1)+4},'1.0');
    add(svg,'text',{class:'svgtxt',x:x0-42,y:Y(0.632)+4},'0.632');
    add(svg,'text',{class:'svgtxt',x:x0-42,y:Y(0.368)+4},'0.368');
    add(svg,'text',{class:'svgtxt',x:x0-14,y:y0+4},'0');
    let a='',b='';
    for(let i=0;i<=100;i++){const x=i/20;a+=(i?'L':'M')+X(x).toFixed(1)+' '+Y(1-Math.exp(-x)).toFixed(1)+' ';b+=(i?'L':'M')+X(x).toFixed(1)+' '+Y(Math.exp(-x)).toFixed(1)+' ';}
    add(svg,'path',{d:a,class:'sa',style:'fill:none;stroke-width:2.5'});
    add(svg,'path',{d:b,class:'sb',style:'fill:none;stroke-width:2.5'});
    add(svg,'circle',{cx:X(1),cy:Y(0.632),r:4,class:'fa'});
    add(svg,'circle',{cx:X(1),cy:Y(0.368),r:4,class:'fb'});
    add(svg,'text',{class:'ca',x:X(2.4),y:Y(0.74),style:'font-family:var(--f-mono);font-size:13px'},rise);
    add(svg,'text',{class:'cb',x:X(2.2),y:Y(0.3),style:'font-family:var(--f-mono);font-size:13px'},fall);
  }
  expPlot('expToolkit','1 − e^(−x)  rises','e^(−x)  falls','');
  expPlot('rcPlot','vC / Vs   (rises)','i·R / Vs   (falls)','τ');
  expPlot('rlPlot','i·R / Vs   (rises)','vL / Vs   (falls)','τ');

  /* volt-second area figure */
  function vsFig(id,o){
    const svg=byId(id); if(!svg)return;
    const x0=60,W=420,mid=110,sc=80/Math.max(Math.abs(o.von),Math.abs(o.voff));
    const X=t=>x0+t*W,Y=v=>mid-v*sc;
    add(svg,'rect',{x:X(0),y:Math.min(Y(o.von),mid),width:X(o.D)-X(0),height:Math.abs(Y(o.von)-mid),class:'fa','fill-opacity':0.22});
    add(svg,'rect',{x:X(o.D),y:Math.min(Y(o.voff),mid),width:X(1)-X(o.D),height:Math.abs(Y(o.voff)-mid),class:'fb','fill-opacity':0.22});
    add(svg,'path',{class:'ax',d:`M${x0} ${mid} H${X(1)+14} M${x0} 15 V215`});
    add(svg,'path',{class:'sch',d:`M${X(0)} ${Y(o.von)} H${X(o.D)} V${Y(o.voff)} H${X(1)}`});
    add(svg,'path',{class:'grid',d:`M${X(o.D)} 15 V215 M${X(1)} 15 V215`});
    add(svg,'text',{class:'svgtxt',x:x0-8,y:226},'0');add(svg,'text',{class:'svgtxt',x:X(o.D)-12,y:226},'DTs');add(svg,'text',{class:'svgtxt',x:X(1)-8,y:226},'Ts');
    add(svg,'text',{class:'svgtxt',x:6,y:mid+4},'vL = 0');
    const A=o.von*o.D, B=o.voff*(1-o.D);
    add(svg,'text',{class:'ca',x:X(0)+8,y:Y(o.von)-6,style:'font-family:var(--f-mono);font-size:12px'},o.vonL+' = '+o.von.toFixed(1)+' V');
    add(svg,'text',{class:'ca',x:X(0)+8,y:(Y(o.von)+mid)/2+5,style:'font-family:var(--f-mono);font-size:13px'},'+'+A.toFixed(2));
    add(svg,'text',{class:'cb',x:X(o.D)+8,y:Y(o.voff)+16,style:'font-family:var(--f-mono);font-size:12px'},o.voffL+' = '+o.voff.toFixed(1)+' V');
    add(svg,'text',{class:'cb',x:X(o.D)+8,y:(Y(o.voff)+mid)/2+5,style:'font-family:var(--f-mono);font-size:13px'},B.toFixed(2));
    add(svg,'text',{class:'svgtxt-i',x:X(1)+14,y:22,'text-anchor':'end'},'sum of areas = '+(Math.abs(A+B)<1e-9?0:A+B).toFixed(2)+' → balance');
  }
  vsFig('vsBuck',{D:0.4,von:24-9.6,voff:-9.6,vonL:'Vs − Vo',voffL:'−Vo'});
  vsFig('vsBoost',{D:0.6,von:24,voff:24-60,vonL:'Vs',voffL:'Vs − Vo'});

  /* converter state schematics: flag per state, 0 = idle, 1 = main current loop, 2 = second loop */
  const coil=(x,y)=>`M${x} ${y} a7.5 7.5 0 0 1 15 0 a7.5 7.5 0 0 1 15 0 a7.5 7.5 0 0 1 15 0 a7.5 7.5 0 0 1 15 0`;
  const res=x=>`M${x} 30 V50 l-7 4 l14 7 l-14 7 l14 7 l-14 7 l7 4 V120`;
  const cap=x=>`M${x} 30 V70 M${x} 80 V120 M${x-14} 70 H${x+14} M${x-14} 80 H${x+14}`;
  const T={
    buck:[
      ['M40 30 V64 M40 96 V120',1,0],['C40,80,16',1,0],['M40 30 H90',1,0],
      ['M90 30 H130',1,null],['M90 30 L126 16',null,0],
      ['M130 30 H180',1,0],['M180 30 H200',1,1],[coil(200,30),1,1],['M260 30 H380',1,1],
      [cap(310),1,1],[res(380),1,1],['M180 120 H380',1,1],['M40 120 H180',1,0],
      ['M180 30 V64 M180 82 V120 M169 63 H191',0,1],['P170,82 190,82 180,64',0,1]
    ],
    boost:[
      ['M40 30 V64 M40 96 V120',1,1],['C40,80,16',1,1],['M40 30 H80',1,1],[coil(80,30),1,1],['M140 30 H165',1,1],
      ['M165 30 V120',1,null],['M165 30 V60 M165 96 V120 M165 96 L152 64',null,0],
      ['M40 120 H165',1,1],['M165 30 H196',0,1],['P196,20 196,40 214,30',0,1],['M215 19 V41 M215 30 H300',0,1],
      ['M300 30 H380',2,1],[cap(300),2,1],[res(380),2,1],['M300 120 H380',2,1],['M165 120 H300',0,1]
    ]
  };
  const LBL={
    buck:[[6,84,'Vs'],[100,12,'S'],[150,78,'D'],[222,12,'L'],[282,104,'C'],[392,80,'Vo']],
    boost:[[6,84,'Vs'],[102,12,'L'],[134,84,'S'],[198,12,'D'],[272,104,'C'],[392,80,'Vo']]
  };
  function conv(id,topo,state){
    const svg=byId(id); if(!svg)return;
    T[topo].forEach(([d,fOn,fOff])=>{
      const f=state==='on'?fOn:fOff; if(f===null)return;
      const cls=state==='plain'?'sch':f===1?'hot':f===2?'hot2':'dim';
      if(d[0]==='C'){const [x,y,r]=d.slice(1).split(',');add(svg,'circle',{cx:x,cy:y,r,class:cls});}
      else if(d[0]==='P'){add(svg,'polygon',{points:d.slice(1),class:cls});}
      else add(svg,'path',{d,class:cls});
    });
    LBL[topo].forEach(([x,y,t])=>add(svg,'text',{x,y,class:'sch-t'},t));
    const lx=topo==='buck'?212:92;
    add(svg,'text',{x:lx,y:54,class:'ca',style:'font-family:var(--f-mono);font-size:12px'},'+ vL −');
    if(state!=='plain'){const msg={on:'ON: S closed, D off',off:'OFF: S open, D conducts'}[state];
    add(svg,'text',{x:40,y:150,class:'sch-m'},msg);}
  }
  conv('buckOn','buck','on');conv('buckOff','buck','off');
  conv('boostOn','boost','on');conv('boostOff','boost','off');
  conv('drBuck','buck','plain');conv('drBuckOn','buck','on');conv('drBuckOff','buck','off');
  conv('drBoost','boost','plain');conv('drBoostOn','boost','on');conv('drBoostOff','boost','off');
  expPlot('drRC','vC / Vs','i·R / Vs','τ');expPlot('drRL','i·R / Vs','vL / Vs','τ');
})();
}

// cfg: { topology?: 'buck' | 'boost', D?: number, Vs?: number }
export function mountConverter(container, cfg = {}) {
  const root = document.createElement('div');
  root.className = 'pefig explorer';
  const D0 = cfg.D ?? 0.4, V0 = cfg.Vs ?? 24;
  root.innerHTML = `<div class="controls">
    <div class="seg" role="group" aria-label="Topology"><button type="button" data-id="mBuck" aria-pressed="true">Buck</button><button type="button" data-id="mBoost" aria-pressed="false">Boost</button></div>
    <label>D <input type="range" data-id="dS" min="0.05" max="0.9" step="0.01" value="${D0}" aria-label="Duty cycle D"> <span class="num" data-id="dV"></span></label>
    <label>V<sub>s</sub> <input type="range" data-id="vS" min="5" max="48" step="1" value="${V0}" aria-label="Source voltage Vs"> <span class="num" data-id="vV"></span></label>
  </div>
  <div class="tw"><svg data-id="wave" viewBox="0 0 680 330" role="img" aria-label="Switch state, inductor voltage and inductor current over two switching periods"></svg></div>
  <div class="readout">
    <div>Output V<sub>o</sub><b data-id="rVo">–</b></div>
    <div>v<sub>L,on</sub> × D<b data-id="rA">–</b></div>
    <div>v<sub>L,off</sub> × (1−D)<b data-id="rB">–</b></div>
    <div>Sum (must be 0)<b data-id="rS">–</b></div>
  </div>`;
  container.appendChild(root);
  const $ = (id) => root.querySelector(`[data-id="${id}"]`);
(function(){
  const svg=$('wave');
  const dS=$('dS'),vS=$('vS');
  const bBuck=$('mBuck'),bBoost=$('mBoost');
  let mode=cfg.topology==='boost'?'boost':'buck';
  const NS='http://www.w3.org/2000/svg';
  function el(tag,attrs,txt){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;svg.appendChild(e);return e;}
  const css=v=>getComputedStyle(root).getPropertyValue(v).trim();
  function fmt(x){return (Math.abs(x)<0.005?0:x).toFixed(2);}
  function draw(){
    const D=+dS.value,Vs=+vS.value;
    $('dV').textContent=D.toFixed(2);
    $('vV').textContent=Vs+' V';
    let Vo,von,voff;
    if(mode==='buck'){Vo=D*Vs;von=Vs-Vo;voff=-Vo;}
    else{Vo=Vs/(1-D);von=Vs;voff=Vs-Vo;}
    const A=von*D,B=voff*(1-D);
    $('rVo').textContent=Vo.toFixed(1)+' V';
    $('rA').textContent=fmt(A)+' V·Ts';
    $('rB').textContent=fmt(B)+' V·Ts';
    $('rS').textContent=fmt(A+B)+' V·Ts';
    while(svg.firstChild)svg.removeChild(svg.firstChild);
    const ink=css('--ink'),mut=css('--muted'),rule=css('--rule'),acc=css('--accent'),tr=css('--trace'),amb=css('--amber');
    const x0=60,W=600,P=W/2; // two periods
    const X=t=>x0+t*P;       // t in periods
    // lanes
    const lanes=[{y:20,h:50,name:'SW'},{y:100,h:110,name:'vL'},{y:240,h:70,name:'iL'}];
    lanes.forEach(l=>{el('text',{x:4,y:l.y+l.h/2+4},l.name);});
    // period markers
    [0,D,1,1+D,2].forEach(t=>el('line',{x1:X(t),x2:X(t),y1:14,y2:316,stroke:rule,'stroke-dasharray':'3 4'}));
    el('text',{x:X(D)-8,y:328},'DTs');el('text',{x:X(1)-6,y:328},'Ts');el('text',{x:X(2)-12,y:328},'2Ts');
    // switch
    const sy=lanes[0].y,sh=lanes[0].h;
    let d='';
    for(let k=0;k<2;k++){d+=(k?'L':'M')+X(k)+' '+(sy+sh)+' V'+sy+' H'+X(k+D)+' V'+(sy+sh)+' H'+X(k+1);}
    el('path',{d,fill:'none',stroke:amb,'stroke-width':2});
    el('text',{x:X(D/2)-8,y:sy+14},'ON');el('text',{x:X(D+(1-D)/2)-10,y:sy+14},'OFF');
    // vL
    const vy=lanes[1].y,vh=lanes[1].h,mid=vy+vh/2;
    const vmax=Math.max(Math.abs(von),Math.abs(voff),1);
    const Y=v=>mid-v/vmax*(vh/2-4);
    el('line',{x1:x0,x2:x0+W,y1:mid,y2:mid,stroke:mut});
    for(let k=0;k<2;k++){
      el('rect',{x:X(k),y:Math.min(Y(von),mid),width:X(k+D)-X(k),height:Math.abs(Y(von)-mid),fill:acc,'fill-opacity':0.18});
      el('rect',{x:X(k+D),y:Math.min(Y(voff),mid),width:X(k+1)-X(k+D),height:Math.abs(Y(voff)-mid),fill:tr,'fill-opacity':0.18});
    }
    d='';
    for(let k=0;k<2;k++){d+=(k?'L':'M')+X(k)+' '+Y(von)+' H'+X(k+D)+' V'+Y(voff)+' H'+X(k+1)+(k<1?' V'+Y(von):'');}
    el('path',{d,fill:'none',stroke:ink,'stroke-width':2});
    el('text',{x:X(D)+4,y:Y(von)+(von>=0?-4:12)},(mode==='buck'?'Vs−Vo = ':'Vs = ')+von.toFixed(1)+' V');
    el('text',{x:X(D)+6,y:Y(voff)+(voff<0?14:-4)},(mode==='buck'?'−Vo = ':'Vs−Vo = ')+voff.toFixed(1)+' V');
    el('text',{x:x0+W-14,y:mid-4},'0');
    // iL triangle: slope proportional to vL; ripple scaled for display
    const iy=lanes[2].y,ih=lanes[2].h,imid=iy+ih/2;
    const rip=(von*D)/ (mode==='buck'?Math.max(Vs*0.25,1):Math.max(Vs*0.9,1)); // relative ripple
    const amp=Math.min(ih/2-4,Math.max(6,rip*(ih/2)));
    el('line',{x1:x0,x2:x0+W,y1:imid,y2:imid,stroke:rule,'stroke-dasharray':'2 3'});
    el('text',{x:x0+W-20,y:imid-4},'IL');
    d='';
    for(let k=0;k<2;k++){d+=(k?'L':'M')+X(k)+' '+(imid+amp)+' L'+X(k+D)+' '+(imid-amp)+' L'+X(k+1)+' '+(imid+amp);}
    el('path',{d,fill:'none',stroke:acc,'stroke-width':2});
    el('text',{x:X(D)+4,y:imid-amp-4},'rises while vL > 0');
  }
  function setMode(m){mode=m;bBuck.setAttribute('aria-pressed',m==='buck');bBoost.setAttribute('aria-pressed',m==='boost');draw();}
  bBuck.addEventListener('click',()=>setMode('buck'));
  bBoost.addEventListener('click',()=>setMode('boost'));
  dS.addEventListener('input',draw);vS.addEventListener('input',draw);
  const mo=new MutationObserver(()=>{if(!root.isConnected){mo.disconnect();return;}draw();});mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  setMode(mode);
})();
  return root;
}
