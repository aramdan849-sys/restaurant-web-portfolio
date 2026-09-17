/* ===== RIPPLE on buttons ===== */
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const r=document.createElement('span');
    r.classList.add('ripple');
    const rect=btn.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height)*2;
    r.style.cssText=`width:${size}px;height:${size}px;
      left:${e.clientX-rect.left-size/2}px;
      top:${e.clientY-rect.top-size/2}px`;
    btn.appendChild(r);
    r.addEventListener('animationend',()=>r.remove());
  });
});

/* ===== PAGE LOADER ===== */
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('done'),1600);
});

/* ===== THREE.JS BACKGROUND ===== */
(function initThree(){
  if(window.innerWidth < 768) return; // skip on mobile for performance
  const canvas=document.getElementById('three-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth,innerHeight);

  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
  cam.position.z=5;

  // Geometry — floating icosahedra
  const shapes=[];
  const geos=[
    new THREE.IcosahedronGeometry(.4,0),
    new THREE.OctahedronGeometry(.35,0),
    new THREE.TetrahedronGeometry(.4,0),
    new THREE.TorusGeometry(.3,.1,8,16),
  ];
  const mats=[
    new THREE.MeshBasicMaterial({color:0x7c3aed,wireframe:true,transparent:true,opacity:.35}),
    new THREE.MeshBasicMaterial({color:0x06b6d4,wireframe:true,transparent:true,opacity:.3}),
    new THREE.MeshBasicMaterial({color:0xa855f7,wireframe:true,transparent:true,opacity:.28}),
    new THREE.MeshBasicMaterial({color:0xec4899,wireframe:true,transparent:true,opacity:.22}),
  ];

  for(let i=0;i<28;i++){
    const g=geos[i%geos.length];
    const m=mats[i%mats.length];
    const mesh=new THREE.Mesh(g,m);
    mesh.position.set((Math.random()-0.5)*16,(Math.random()-0.5)*10,(Math.random()-0.5)*8);
    mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,0);
    mesh.userData={rx:Math.random()*.008-.004,ry:Math.random()*.008-.004,vy:(Math.random()-.5)*.004};
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Mouse parallax
  let mouseX=0,mouseY=0;
  document.addEventListener('mousemove',e=>{
    mouseX=(e.clientX/innerWidth-.5)*.6;
    mouseY=(e.clientY/innerHeight-.5)*.6;
  });

  window.addEventListener('resize',()=>{
    renderer.setSize(innerWidth,innerHeight);
    cam.aspect=innerWidth/innerHeight;
    cam.updateProjectionMatrix();
  });

  (function animate(){
    requestAnimationFrame(animate);
    shapes.forEach(s=>{
      s.rotation.x+=s.userData.rx;
      s.rotation.y+=s.userData.ry;
      s.position.y+=s.userData.vy;
      if(s.position.y>6)s.position.y=-6;
      if(s.position.y<-6)s.position.y=6;
    });
    cam.position.x+=(mouseX-cam.position.x)*.04;
    cam.position.y+=(-mouseY-cam.position.y)*.04;
    renderer.render(scene,cam);
  })();
})();

/* ===== AOS INIT ===== */
AOS.init({duration:800,easing:'cubic-bezier(0.23,1,0.32,1)',once:true,offset:80});

/* ===== GSAP + ScrollTrigger ===== */
gsap.registerPlugin(ScrollTrigger,TextPlugin);

/* ===== TYPED.JS hero ===== */
new Typed('#typed-hero',{
  strings:['سعد وائل | مطور تطبيقات'],
  typeSpeed:80,
  backSpeed:0,
  loop:false,
  showCursor:true,
  cursorChar:'|',
});

/* ===== NAVBAR ===== */
const nav=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',scrollY>60);
  const btt=document.getElementById('btt');
  btt.classList.toggle('show',scrollY>400);

  // active nav link
  const sections=['about','skills','projects','reviews','contact'];
  sections.forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    const link=document.querySelector(`.nav-link[href="#${id}"]`);
    if(!link)return;
    const rect=el.getBoundingClientRect();
    if(rect.top<=120&&rect.bottom>120){link.classList.add('active')}
    else{link.classList.remove('active')}
  });
});

/* ===== MOBILE MENU ===== */
const menuBtn=document.getElementById('menu-btn');
const mobileMenu=document.getElementById('mobile-menu');
menuBtn.addEventListener('click',()=>{
  mobileMenu.classList.toggle('open');
  menuBtn.querySelector('i').className=mobileMenu.classList.contains('open')?'fas fa-times':'fas fa-bars';
});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mobileMenu.classList.remove('open');
  menuBtn.querySelector('i').className='fas fa-bars';
}));

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    e.preventDefault();
    const t=document.querySelector(this.getAttribute('href'));
    if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

/* ===== BACK TO TOP ===== */
document.getElementById('btt').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ===== PROGRESS BARS via GSAP ScrollTrigger ===== */
document.querySelectorAll('.progress-fill').forEach(bar=>{
  const w=bar.dataset.width;
  ScrollTrigger.create({
    trigger:bar,start:'top 92%',
    onEnter:()=>gsap.to(bar,{width:w+'%',duration:1.6,ease:'power3.out'})
  });
});

/* ===== COUNTUP via ScrollTrigger ===== */
const counters=[
  {id:'count-projects',end:30},
  {id:'count-years',end:3},
  {id:'count-clients',end:20},
  {id:'count-commit',end:100},
];
counters.forEach(c=>{
  ScrollTrigger.create({
    trigger:'#'+c.id,start:'top 90%',
    onEnter:()=>{
      const cu=new countUp.CountUp(c.id,c.end,{duration:2.2,useEasing:true});
      cu.start();
    }
  });
});

/* ===== SKILL CARD MOUSE GLOW ===== */
document.querySelectorAll('.skill-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ===== VANILLA TILT ===== */
if(window.innerWidth >= 768) {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'),{
    max:8,speed:400,glare:true,'max-glare':.12,
  });
}

/* ===== SWIPER ===== */
new Swiper('.projects-swiper',{
  slidesPerView:1,
  spaceBetween:24,
  pagination:{el:'.swiper-pagination',clickable:true},
  breakpoints:{640:{slidesPerView:2},1024:{slidesPerView:3}},
  grabCursor:true,
  autoplay:{delay:4000,disableOnInteraction:false,pauseOnMouseEnter:true},
});

/* ===== GSAP PARALLAX hero ===== */
gsap.to('.avatar-wrap',{
  yPercent:-15,ease:'none',
  scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}
});

/* ===== REVIEW FORM ===== */
let selectedStars=0;
window._selectedStars=0;
const starBtns=document.querySelectorAll('.star-btn');
starBtns.forEach(btn=>{
  btn.addEventListener('mouseover',()=>{
    const v=+btn.dataset.val;
    starBtns.forEach(s=>{
      const sv=+s.dataset.val;
      s.textContent=sv<=v?'★':'☆';
      s.style.color=sv<=v?'#facc15':'#334155';
      s.style.transform=sv<=v?'scale(1.2)':'scale(1)';
    });
  });
  btn.addEventListener('mouseleave',()=>{
    starBtns.forEach(s=>{
      const sv=+s.dataset.val;
      s.textContent=sv<=selectedStars?'★':'☆';
      s.style.color=sv<=selectedStars?'#facc15':'#334155';
      s.style.transform='scale(1)';
    });
  });
  btn.addEventListener('click',()=>{
    selectedStars=+btn.dataset.val;
    window._selectedStars=selectedStars;
    starBtns.forEach(s=>{
      const sv=+s.dataset.val;
      s.textContent=sv<=selectedStars?'★':'☆';
      s.style.color=sv<=selectedStars?'#facc15':'#334155';
    });
  });
});

const avatarGrads=[
  'linear-gradient(135deg,#7c3aed,#06b6d4)',
  'linear-gradient(135deg,#06b6d4,#a855f7)',
  'linear-gradient(135deg,#a855f7,#ec4899)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
];
let revCount=0;

window.renderReview = function renderReview(data,animate){
  const container=document.getElementById('new-reviews-container');
  const card=document.createElement('div');
  card.className='review-card glass-strong p-7';
  card.style.cssText='border-radius:20px;opacity:0;transform:translateY(30px) scale(.96);transition:all .55s cubic-bezier(.23,1,.32,1)';
  const starsHtml=Array.from({length:5},(_,i)=>
    `<i class="fas fa-star" style="color:${i<data.stars?'#facc15':'#334155'};font-size:.85rem"></i>`
  ).join('');

  const color=avatarGrads[revCount%avatarGrads.length];
  revCount++;

  card.innerHTML=`
    <div style="display:flex;gap:4px;margin-bottom:16px">${starsHtml}</div>
    <p class="text-slate-300" style="font-size:.88rem;line-height:1.7;margin-bottom:18px">"${data.text}"</p>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;flex-shrink:0">
        ${data.name.trim().charAt(0).toUpperCase()}
      </div>
      <div>
        <div style="color:#fff;font-weight:800;font-size:.9rem">${data.name}</div>
        ${data.job?`<div style="color:#a855f7;font-size:.78rem">${data.job}</div>`:''}
      </div>
      <span style="margin-right:auto;font-size:.75rem;padding:4px 10px;border-radius:50px;background:rgba(6,182,212,.12);color:#67e8f9;border:1px solid rgba(6,182,212,.25)">✓ زائر</span>
    </div>`;

  container.insertBefore(card,container.firstChild);
  if(animate){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      card.style.opacity='1';
      card.style.transform='translateY(0) scale(1)';
    }));
    // init tilt on new card
    VanillaTilt.init([card],{max:6,speed:400,glare:true,'max-glare':.1});
  } else {
    card.style.opacity='1';card.style.transform='translateY(0) scale(1)';
  }
}

document.getElementById('review-form').addEventListener('submit',function(e){
  // الـ submit بيتعمله handle في Firebase module في index.html
  e.preventDefault();
});

/* ===== GSAP hero entrance ===== */
gsap.fromTo('.hero-section > div > *',
  {opacity:0,y:35},
  {opacity:1,y:0,duration:.9,stagger:.14,ease:'power3.out',delay:.1}
);

/* ===== GSAP section title pin effect ===== */
gsap.utils.toArray('.section-title').forEach(el=>{
  gsap.fromTo(el,
    {opacity:0,y:40,skewY:2},
    {opacity:1,y:0,skewY:0,duration:.9,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}}
  );
});

/* ===== page scroll progress bar ===== */
const progEl=document.createElement('div');
progEl.style.cssText='position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#a855f7);z-index:9999;width:0%;transition:width .1s;pointer-events:none';
document.body.appendChild(progEl);
window.addEventListener('scroll',()=>{
  const pct=(scrollY/(document.body.scrollHeight-innerHeight))*100;
  progEl.style.width=pct+'%';
});
