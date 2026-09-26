/* Basctdelm is built in the coordinate system of its complete illustrated map.
 * All plan points below are percentages of basctdelm.png, which keeps streets,
 * walls, shorelines, bridges and gazetteer pins aligned with the source artwork.
 */
(function () {
  'use strict';
  const navigation = window.BasctdelmNavigation;
  const MAP_WIDTH = navigation.WIDTH;
  const MAP_DEPTH = navigation.DEPTH;
  const EYE_HEIGHT = 2.35;
  const map = (x, y, h = 0) => {
    const v=navigation.mapToWorld(x,y,h);
    return new BABYLON.Vector3(v.x,v.y,v.z);
  };
  const pct = v => navigation.worldToMap(v.x,v.z);
  const points = a => a.map(q => map(q[0], q[1]));
  const roads = [
    { name: 'North Loop', width: 4.9, path: [[26.6,39.8],[32.5,32.1],[41,27.3],[52,25.5],[62.9,27.7],[70.4,34.1],[71.3,39.2]] },
    { name: 'Talward Way', width: 5.3, path: [[27.3,42.3],[35,49],[48,50.8],[59.2,49.2],[67.4,50.4]] },
    { name: 'South Loop', width: 5.1, path: [[14.3,43.8],[14,56.8],[19.6,69.3],[29.6,73.8],[42.4,72.5],[55.1,70.5],[66.2,67.9]] },
    { name: 'Northern Trade Pass', width: 5.2, path: [[77.6,20.7],[71.9,27.3],[68.5,35],[67.6,45],[67.8,52.1]] },
    { name: 'Southern Trade Pass', width: 5.3, path: [[67.4,49.2],[68.8,57.3],[70.7,66.8],[75.7,73],[84.9,77.2]] },
    { name: 'High District approach', width: 4.2, path: [[27.3,42.3],[22.5,35.9],[15.4,33.6],[12.2,26.4]] },
    { name: 'Griffonloch Walk', width: 3.2, path: [[14.8,57.4],[21,54.9],[25.8,52.5],[30.5,49.1]] },
    { name: 'Market Way', width: 3.7, path: [[60.1,49.8],[65.5,43.9],[68.9,35.5],[75.2,34.1]] },
    { name: 'Lower District Lane', width: 3.3, path: [[70.6,67.6],[77.3,70.6],[84.8,76.9],[91,85.4]] },
    { name: 'Star Reach Bridge', width: 4.1, path: [[73.9,24.3],[81.5,18.1],[87,13.9]] },
    { name: 'Historic Crossway', width: 4.1, path: [[86,76.9],[93.3,83.5],[100,89.1]] }
  ];
  const districts = [
    { name:'High District', poly:[[5,9],[20,8],[31,17],[33,40],[26,46],[10,44],[6,31]], style:'high' },
    { name:'North District', poly:[[30,13],[70,9],[77,20],[72,30],[64,34],[37,32]], style:'north' },
    { name:'Central District', poly:[[31,31],[66,28],[68,48],[58,53],[35,51]], style:'central' },
    { name:'Trade District', poly:[[70,27],[82,27],[82,65],[72,68],[67,53]], style:'trade' },
    { name:'South District', poly:[[20,51],[66,52],[70,73],[58,82],[24,81],[13,70]], style:'south' },
    { name:'Lower District', poly:[[69,69],[91,70],[99,87],[84,94],[65,84]], style:'lower' },
    { name:'The Bellows', poly:[[11,45],[25,45],[24,72],[11,70]], style:'bellows' }
  ];
  const outerWalls = [
    [[14.2,8.4],[21.2,11],[29.9,14.9],[37.5,14.5],[45.5,12.3],[58.7,9.5],[66,10.4],[71.7,15.2],[73.8,23.8]],
    [[76.3,28.7],[80.2,34.5]],
    [[80.3,52.8],[78.5,59.3],[75.8,65.9],[71.2,68.7]],
    [[68.8,73.5],[65,79.3],[55.3,82.3],[43.2,85.7],[31.6,85.1],[20.4,81.7],[12.1,77.6],[9.2,67.6],[9.1,50.2],[8.4,34.3],[9.8,20.2],[14.2,8.4]]
  ];
  const islandOutline=[[13,6],[20,6],[31,12],[38,11],[49,8],[60,7],[69,10],[74,17],[78,28],[81,38],[81,59],[76,68],[84,67],[93,76],[96,88],[86,93],[69,89],[62,84],[48,88],[31,86],[18,81],[10,77],[7,61],[7,40],[9,22]];
  const innerWalls = [
    [[31.1,18.8],[32.4,29.7],[32,39.6],[26.3,44.3]],
    [[9.5,42.2],[17,44.7],[25.7,44.3]]
  ];
  const docks = [
    [[77.5,32.5],[81,34]],[[77.6,35.8],[82.1,36.5]],[[78.3,39],[83,40.3]],
    [[78.7,43],[83.5,43.8]],[[79.5,46.8],[83.5,48.5]],[[78.7,51.9],[83.6,53.3]],
    [[78.2,55.9],[83,57.6]],[[77.7,59.5],[82.1,61.5]]
  ];
  const majorNames = new Set([1,4,5,7,8,9,11,13,22,25]);
  const city = window.CITY_MAPS_REGISTRY && window.CITY_MAPS_REGISTRY.basctdelm;
  const canvas = document.getElementById('world');
  const error = document.getElementById('error');
  if (!city || !window.BABYLON) {
    document.getElementById('loading').classList.add('done');
    error.textContent = 'The city map or 3D engine could not be loaded.';
    error.style.display = 'block';
    return;
  }

  const inside = (x, y, poly) => {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
    }
    return hit;
  };
  function segmentDistance(x, y, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy || 1)));
    return { distance: Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t), x:a[0]+dx*t, y:a[1]+dy*t };
  }
  function nearestRoad(x, y) {
    let best = { distance: Infinity, x, y };
    roads.forEach(r => r.path.slice(1).forEach((b,i) => {
      const near = segmentDistance(x,y,r.path[i],b);
      if (near.distance < best.distance) best = { ...near, road:r.name };
    }));
    return best;
  }
  function hash(n) { const v = Math.sin(n * 127.1 + 91.7) * 43758.5453; return v - Math.floor(v); }
  const rgb = hex => BABYLON.Color3.FromHexString(hex);
  const engine = new BABYLON.Engine(canvas, true, { antialias:true, stencil:true, preserveDrawingBuffer:true });
  engine.setHardwareScalingLevel(Math.max(1, Math.min(1.5, window.devicePixelRatio / 1.5)));
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(.53,.65,.7,1);
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  scene.fogDensity = .0027;
  scene.fogColor = rgb('#9aa5a0');
  scene.ambientColor = rgb('#8a9087');
  function material(name, color, opts = {}) {
    const m = new BABYLON.StandardMaterial(name, scene);
    m.diffuseColor = rgb(color);
    m.specularColor = rgb(opts.specular || '#161c22');
    if (opts.emissive) m.emissiveColor = rgb(opts.emissive);
    if (opts.alpha !== undefined) m.alpha = opts.alpha;
    return m;
  }
  const mats = {
    stone:material('warm limestone','#837f71'), stoneDark:material('aged wall stone','#625d54'),
    paving:material('paved roads','#686b63',{specular:'#272b29',emissive:'#33342f'}),
    bridge:material('bridge paving','#858177',{emissive:'#393630'}), parapet:material('parapets','#817e70'),
    timber:material('dark timber','#42362e'), plaster:material('plaster','#b6a18a'),
    plasterLight:material('pale plaster','#d0bc9d'), brick:material('trade brick','#886b58'),
    slate:material('blue slate','#283c49'), tile:material('terracotta','#653f3a'),
    copper:material('old copper','#2f5a4f'), gold:material('imperial gold','#cfa75c',{emissive:'#5a3516'}),
    wood:material('pier wood','#675444'), park:material('garden green','#557550'),
    water:material('pond water','#477987',{specular:'#597780'}),
    lantern:material('lantern glass','#b88b52',{emissive:'#694a25'}),
    glass:material('window glass','#1f2a31',{specular:'#c5d2d8',emissive:'#0b1013'}),
    market:material('market canvas','#6e5236'), marketBlue:material('merchant blue','#2f4a5c'),
    marketRed:material('merchant crimson','#6f2c29'), tree:material('leaf canopy','#426a49'),
    treeLight:material('sunlit leaves','#63885a'), treeDark:material('shadowed leaves','#304f3a'),
    grassBlade:material('three dimensional grass','#3b5530'),
    trunk:material('tree trunks','#59483b'), rock:material('cliff stone','#797f79')
  };
  function patternedTexture(name, base, kind) {
    const texture=new BABYLON.DynamicTexture(name,{width:512,height:512},scene,true);
    const ctx=texture.getContext();ctx.fillStyle=base;ctx.fillRect(0,0,512,512);
    if(kind==='stone'||kind==='brick') {
      const height=kind==='brick'?29:53,width=kind==='brick'?72:105;
      for(let row=0,y=0;y<512;row++,y+=height) for(let x=-width;x<512;x+=width) {
        const offset=row%2?width/2:0;
        const shade=Math.floor(hash(row*91+x)*24);
        ctx.fillStyle=kind==='brick'?`rgb(${122+shade},${91+shade},${73+shade})`:`rgb(${139+shade},${133+shade},${116+shade})`;
        ctx.fillRect(x+offset+2,y+2,width-4,height-4);
        ctx.strokeStyle='#34333366';ctx.strokeRect(x+offset+2,y+2,width-4,height-4);
      }
    } else if(kind==='cobble') {
      for(let y=0;y<512;y+=32)for(let x=0;x<512;x+=46) {
        const dx=(hash(x+y)*8)-4,dy=(hash(y*17+x)*6)-3;
        const value=93+Math.floor(hash(x*19+y)*36);
        ctx.fillStyle=`rgb(${value},${value-2},${value-6})`;
        ctx.beginPath();ctx.roundRect(x+dx,y+dy,38,25,5);ctx.fill();
        ctx.strokeStyle='#2b292852';ctx.stroke();
      }
    } else if(kind==='roof') {
      for(let y=0;y<512;y+=22)for(let x=(y/22%2)*19;x<512;x+=38) {
        const v=48+Math.floor(hash(x*13+y)*27);
        ctx.fillStyle=`rgb(${v},${v+12},${v+20})`;
        ctx.fillRect(x+1,y+1,34,19);ctx.strokeStyle='#141c2580';ctx.strokeRect(x+1,y+1,34,19);
      }
    } else if(kind==='timber') {
      for(let y=0;y<512;y+=52) {
        ctx.fillStyle=y%104?'#624733':'#4b3428';ctx.fillRect(0,y,512,48);
        for(let x=0;x<512;x+=9){ctx.strokeStyle='#291e1855';ctx.beginPath();ctx.moveTo(x,y+3);ctx.lineTo(x+3,y+44);ctx.stroke();}
      }
    } else if(kind==='earth') {
      for(let i=0;i<14000;i++) {
        const x=hash(i*3)*512,y=hash(i*7)*512;
        ctx.fillStyle=i%3===0?'#d9c39b39':i%3===1?'#293d2e25':'#433d3229';
        ctx.fillRect(x,y,1+hash(i*5)*4,1+hash(i*11)*4);
      }
    } else if(kind==='plaster') {
      for(let i=0;i<2200;i++) {
        const x=hash(i*3)*512,y=hash(i*7)*512;
        ctx.fillStyle=i%2?'#654d3320':'#ffffff20';ctx.fillRect(x,y,2+hash(i*5)*5,2+hash(i*11)*5);
      }
    }
    texture.update();texture.wrapU=texture.wrapV=BABYLON.Texture.WRAP_ADDRESSMODE;
    texture.uScale=kind==='cobble'?2.7:1.5;texture.vScale=kind==='cobble'?4:1.5;
    return texture;
  }
  function textureMat(mat,base,kind) {
    mat.diffuseTexture=patternedTexture(mat.name+' pattern',base,kind);
    mat.diffuseColor=BABYLON.Color3.White();
  }
  mats.grassBlade.backFaceCulling=false;
  mats.grassBlade.emissiveColor=rgb('#0e170a');mats.grassBlade.specularColor=BABYLON.Color3.Black();
  mats.earth=material('weathered city ground','#898477');
  textureMat(mats.earth,'#8f8978','earth');
  // Diamond-leaded window glass: dark, faintly green panes with a sky sheen
  // toward the top, framed by lead cames. Tiles every ~0.42 m of window.
  function leadedGlass() {
    const t=new BABYLON.DynamicTexture('leaded glass panes',{width:256,height:256},scene,true);
    const g=t.getContext(),grad=g.createLinearGradient(0,0,0,256);
    grad.addColorStop(0,'#4a5a63');grad.addColorStop(.5,'#222b30');grad.addColorStop(1,'#14191c');
    g.fillStyle=grad;g.fillRect(0,0,256,256);
    g.strokeStyle='#2a2826';g.lineWidth=3.5;
    for(let k=-256;k<=512;k+=64){g.beginPath();g.moveTo(k,0);g.lineTo(k+256,256);g.stroke();g.beginPath();g.moveTo(k,256);g.lineTo(k+256,0);g.stroke();}
    t.update();t.wrapU=t.wrapV=BABYLON.Texture.WRAP_ADDRESSMODE;
    const m=new BABYLON.StandardMaterial('leaded window glass',scene);
    m.diffuseTexture=t;m.emissiveTexture=t;m.emissiveColor=rgb('#3a3a3a');
    m.specularColor=rgb('#8c9aa3');m.specularPower=90;
    return m;
  }
  function scannedMaterial(name,asset,repeatU,repeatV,tint='#ffffff') {
    const dir='images/city-scenes/basctdelm/materials/';
    const pbr=new BABYLON.PBRMaterial(name,scene);
    pbr.albedoTexture=new BABYLON.Texture(dir+asset+'-diff.jpg',scene);
    pbr.bumpTexture=new BABYLON.Texture(dir+asset+'-normal.jpg',scene);
    for(const texture of [pbr.albedoTexture,pbr.bumpTexture]) {
      texture.wrapU=texture.wrapV=BABYLON.Texture.WRAP_ADDRESSMODE;
      texture.uScale=repeatU;texture.vScale=repeatV;
      texture.anisotropicFilteringLevel=8;
    }
    pbr.albedoColor=rgb(tint);
    pbr.emissiveColor=rgb('#0d0c0a');
    pbr.metallic=0;pbr.roughness=.96;pbr.bumpTexture.level=.55;
    return pbr;
  }
  const tileSizes = new Map();
  // Masonry, plaster and timber use UVs in metres (see projectUV), so their
  // texture repeat is 1 and tileSizes says how many metres one texture covers.
  mats.stone=scannedMaterial('scanned medieval wall','medieval_wall_02',1,1);
  mats.stoneDark=scannedMaterial('weathered wall stone','medieval_wall_02',1,1,'#b0a99b');
  // House walls are lime render: rough white plaster tinted as limewash, plus a worn render.
  mats.plaster=scannedMaterial('aged lime render','white_plaster_rough_01',1,1,'#e6d8c0');
  mats.plasterLight=scannedMaterial('white limewash','white_plaster_rough_01',1,1,'#f6f0e4');
  mats.plasterOchre=scannedMaterial('ochre limewash','white_plaster_rough_01',1,1,'#f0d49c');
  mats.plasterRose=scannedMaterial('rose limewash','white_plaster_rough_01',1,1,'#f0cbbb');
  mats.plasterGrey=scannedMaterial('weathered lime render','worn_plaster_wall',1,1,'#fbf5ea');
  mats.paving=scannedMaterial('medieval street setts','medieval_blocks_05',1.6,1);
  mats.bridge=scannedMaterial('worn bridge setts','medieval_blocks_05',1.6,1,'#d7cfbf');
  mats.parapet=scannedMaterial('bridge dressed masonry','medieval_blocks_05',1,1,'#c9c0af');
  mats.gutter=scannedMaterial('stone gutter','medieval_blocks_05',1,1,'#6f6a61');
  mats.flagstone=scannedMaterial('flagstone pavement','monastery_stone_floor',1,1,'#d9d2c4');
  mats.tile=scannedMaterial('weathered clay roof','roof_tiles',1,1,'#e39479');
  mats.tileDark=scannedMaterial('old clay roof','roof_tiles',1,1,'#9c6454');
  mats.tileBrown=scannedMaterial('sun-bleached clay roof','roof_tiles',1,1,'#c8a28a');
  mats.tileMoss=scannedMaterial('lichened clay roof','roof_tiles',1,1,'#9a8c70');
  mats.slate=scannedMaterial('weathered slate roof','roof_slates_02',1,1,'#d4e1e9');
  mats.wood=scannedMaterial('aged timber','old_planks_02',1,1);
  mats.brick=scannedMaterial('medieval red brick','medieval_red_brick',1,1,'#e8d6cc');
  // Beams, doors and shutters: dark oak planks rather than flat brown paint.
  mats.timber=scannedMaterial('dark oak timber','dark_wooden_planks',1,1,'#9a8574');
  mats.glass=leadedGlass();
  [[mats.stone,2.6],[mats.stoneDark,2.4],[mats.plaster,2.2],[mats.plasterLight,2.2],[mats.plasterOchre,2.2],
    [mats.plasterRose,2.2],[mats.plasterGrey,2.2],[mats.parapet,2.2],[mats.wood,2.2],[mats.brick,1.8],
    [mats.timber,1.4],[mats.flagstone,2.6],[mats.gutter,1.2],[mats.glass,.42]]
    .forEach(([mat,metres])=>tileSizes.set(mat,metres));
  mats.park=scannedMaterial('Greenscape grass','leafy_grass',1.5,1.5);
  const leafDir='images/city-scenes/basctdelm/materials/';
  mats.leaves=new BABYLON.StandardMaterial('textured three dimensional leaves',scene);
  mats.leaves.diffuseTexture=new BABYLON.Texture(leafDir+'tree_small_02-diff.jpg',scene);
  mats.leaves.opacityTexture=new BABYLON.Texture(leafDir+'tree_small_02-alpha.jpg',scene);
  mats.leaves.opacityTexture.getAlphaFromRGB=true;
  mats.leaves.backFaceCulling=false;
  mats.leaves.transparencyMode=BABYLON.Material.MATERIAL_ALPHATEST;
  mats.leaves.alphaCutOff=.32;
  mats.leaves.specularColor=rgb('#242e1c');
  mats.leaves.emissiveColor=rgb('#1d2b15');
  // The start point is on the arched Star Reach Bridge, so stand on its deck.
  const start = map(84,18,EYE_HEIGHT+bridgeRiseAt(84,18));
  const camera = new BABYLON.FreeCamera('player',start.clone(),scene);
  camera.minZ = .08; camera.maxZ = 1300;
  camera.fov = 1.11;
  camera.rotation.x = -.03;
  camera.setTarget(map(70,29,2));
  let walkingPosition = start.clone();
  let walkingRotation = camera.rotation.clone();
  let aerial = false, mapOpen = false;
  // A strong warm sun over a cool, weaker sky fill: the contrast between lit
  // and shaded faces is what makes the cast shadows read.
  const hemi = new BABYLON.HemisphericLight('open sky',new BABYLON.Vector3(.15,1,.1),scene);
  hemi.intensity = .5; hemi.diffuse = rgb('#cfe0ee'); hemi.groundColor = rgb('#6d6254');
  const sun = new BABYLON.DirectionalLight('late afternoon',new BABYLON.Vector3(-.6,-.78,.46),scene);
  sun.position = map(25,10,160); sun.intensity = 2.5; sun.diffuse = rgb('#ffecd2');
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
  scene.imageProcessingConfiguration.exposure = .94;
  scene.imageProcessingConfiguration.contrast = 1.08;
  const glow = new BABYLON.GlowLayer('lantern glow',scene,{blurKernelSize:16}); glow.intensity = .18;
  const sky = BABYLON.MeshBuilder.CreateBox('sky',{size:1400},scene);
  const skyMat = new BABYLON.SkyMaterial('clear sky',scene);
  skyMat.backFaceCulling = false; skyMat.luminance = .9; skyMat.inclination = .15; skyMat.azimuth = .18;
  sky.material = skyMat; sky.infiniteDistance = true; sky.isPickable = false; sky.applyFog = false;
  if(BABYLON.WaterMaterial) {
    const waves=new BABYLON.DynamicTexture('seamless water normal',{width:256,height:256},scene,false);
    const context=waves.getContext(),pixels=context.createImageData(256,256);
    const wavelets=[[3,1,.24,.2],[-2,5,.19,1.8],[7,3,.12,2.4],[-5,8,.10,.7],[11,-4,.07,4.3],[4,13,.06,3.5],[-13,-7,.04,5.2],[17,2,.035,1.1]];
    for(let y=0;y<256;y++) for(let x=0;x<256;x++) {
      const a=x*Math.PI*2/256,b=y*Math.PI*2/256;
      let dx=0,dz=0;
      for(const [kx,ky,amplitude,phase] of wavelets) {
        const slope=amplitude*Math.cos(kx*a+ky*b+phase);
        dx+=slope*kx;dz+=slope*ky;
      }
      dx*=.12;dz*=.12;
      const length=Math.hypot(dx,dz,1),index=(y*256+x)*4;
      pixels.data[index]=Math.round((-.6*dx/length*.5+.5)*255);
      pixels.data[index+1]=Math.round((-.6*dz/length*.5+.5)*255);
      pixels.data[index+2]=Math.round((1/length*.5+.5)*255);
      pixels.data[index+3]=255;
    }
    context.putImageData(pixels,0,0);waves.update();
    waves.wrapU=waves.wrapV=BABYLON.Texture.WRAP_ADDRESSMODE;
    waves.uScale=8;waves.vScale=8;
    const water=new BABYLON.WaterMaterial('moving reflective Dibaryn water',scene,new BABYLON.Vector2(512,512));
    water.bumpTexture=waves;water.windForce=2;water.windDirection=new BABYLON.Vector2(1,.45);
    water.waveHeight=.018;water.waveLength=.22;water.waveSpeed=.55;water.waveCount=12;
    water.bumpHeight=.58;water.waterColor=rgb('#103344');water.waterColor2=rgb('#246479');
    water.colorBlendFactor=.65;water.colorBlendFactor2=.2;water.specularPower=96;
    water.addToRenderList(sky);
    mats.water=water;
  }
  const ground = BABYLON.MeshBuilder.CreateGround('complete Basctdelm illustrated plan',{width:MAP_WIDTH,height:MAP_DEPTH},scene);
  ground.position.y = -.22;
  const groundMat = new BABYLON.StandardMaterial('original map artwork',scene);
  groundMat.diffuseTexture = new BABYLON.Texture('images/cities/basctdelm/basctdelm.png',scene);
  groundMat.diffuseTexture.anisotropicFilteringLevel = 16;
  groundMat.emissiveTexture = groundMat.diffuseTexture;
  groundMat.emissiveColor = BABYLON.Color3.White();
  groundMat.diffuseColor = BABYLON.Color3.Black();
  groundMat.disableLighting = true;
  groundMat.specularColor = BABYLON.Color3.Black();
  ground.material = groundMat;
  ground.isPickable = true;
  const waterPlane=BABYLON.MeshBuilder.CreateGround('Dibaryn River and Lake Tribathe',{width:1800,height:1800,subdivisions:96},scene);
  waterPlane.position.y=-.95;waterPlane.material=mats.water;waterPlane.isPickable=false;
  function planarRegion(name,outline,y,mat) {
    const polygon=outline.map(v=>map(v[0],v[1],y));
    const area=polygon.reduce((sum,p,i)=>{
      const next=polygon[(i+1)%polygon.length];return sum+p.x*next.z-next.x*p.z;
    },0);
    const remaining=polygon.map((_,i)=>i),indices=[];
    const sign=area>=0?1:-1;
    const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
    const inTriangle=(p,a,b,c)=>{
      const s1=cross(a,b,p)*sign,s2=cross(b,c,p)*sign,s3=cross(c,a,p)*sign;
      return s1>=-1e-6&&s2>=-1e-6&&s3>=-1e-6;
    };
    while(remaining.length>3) {
      let clipped=false;
      for(let i=0;i<remaining.length;i++) {
        const a=remaining[(i+remaining.length-1)%remaining.length],b=remaining[i],c=remaining[(i+1)%remaining.length];
        if(cross(polygon[a],polygon[b],polygon[c])*sign<=0)continue;
        if(remaining.some(idx=>idx!==a&&idx!==b&&idx!==c&&inTriangle(polygon[idx],polygon[a],polygon[b],polygon[c])))continue;
        indices.push(a,b,c);remaining.splice(i,1);clipped=true;break;
      }
      if(!clipped)break;
    }
    if(remaining.length===3)indices.push(...remaining);
    const positions=polygon.flatMap(v=>[v.x,v.y,v.z]);
    const uvs=polygon.flatMap(v=>[v.x/20,v.z/20]);
    const normals=polygon.flatMap(()=>[0,1,0]);
    const region=new BABYLON.Mesh(name,scene);
    const data=new BABYLON.VertexData();
    data.positions=positions;data.indices=indices;data.uvs=uvs;data.normals=normals;data.applyToMesh(region);
    region.material=mat;region.isPickable=false;
    mat.backFaceCulling=false;
    return region;
  }
  // Open ground inside the city is worn paving (yards, squares, lanes); the
  // region UVs span 20 m, so the flagstone texture repeats ~8 times across that.
  mats.courtyard=scannedMaterial('worn courtyard paving','monastery_stone_floor',20/2.6,20/2.6,'#aaa296');
  planarRegion('stone island beneath Basctdelm',islandOutline,-.17,mats.courtyard);
  planarRegion('Greenscape garden',[[16,47],[25,44],[32,48],[34,59],[29,67],[20,69],[15,62]],-.14,mats.park);
  const griffonloch=BABYLON.MeshBuilder.CreateDisc('Griffonloch',{radius:12,tessellation:48},scene);
  griffonloch.rotation.x=-Math.PI/2;griffonloch.scaling.y=.7;
  griffonloch.position=map(23.5,56.4,-.12);griffonloch.material=mats.water;

  // Colliders are oriented boxes: hw/hd are the true half extents and yaw is
  // read from the mesh until finishCity() bakes it (rotation is set after box()).
  const collisions = [];
  function box(name, width, height, depth, at, mat, collide = false) {
    const mesh = BABYLON.MeshBuilder.CreateBox(name,{width,height,depth},scene);
    mesh.position.copyFrom(at); mesh.material = mat;
    mesh.isPickable = false;
    if (collide) collisions.push({x:at.x,z:at.z,hw:width/2,hd:depth/2,mesh});
    return mesh;
  }
  function hitsCollider(c,x,z,margin) {
    const yaw=c.yaw!==undefined?c.yaw:(c.mesh?c.mesh.rotation.y:0);
    const dx=x-c.x,dz=z-c.z,cos=Math.cos(yaw),sin=Math.sin(yaw);
    return Math.abs(dx*cos-dz*sin)<c.hw+margin&&Math.abs(dx*sin+dz*cos)<c.hd+margin;
  }

  // Houses are written straight into one vertex buffer per material instead of
  // thousands of individual meshes; wall UVs are projected in metres so masonry
  // keeps a constant, real-world scale on every face.
  const batches = new Map();
  function projectUV(v,n,tile) {
    const ax=Math.abs(n.x),ay=Math.abs(n.y),az=Math.abs(n.z);
    if(ay>=ax&&ay>=az) return [v.x/tile,v.z/tile];
    return ax>=az?[v.z/tile,v.y/tile]:[v.x/tile,v.y/tile];
  }
  function batchFor(mat) {
    if(!batches.has(mat)) batches.set(mat,{p:[],n:[],uv:[],i:[]});
    return batches.get(mat);
  }
  // Babylon's front face winds so cross(b-a,c-a) points inward; flip to match `outward`.
  function addPolygon(mat,verts,outward,uvs) {
    const B=batchFor(mat),base=B.p.length/3;
    let normal=BABYLON.Vector3.Cross(verts[1].subtract(verts[0]),verts[2].subtract(verts[0])).normalize();
    let order=verts.map((_,k)=>k);
    if(BABYLON.Vector3.Dot(normal,outward)>0) order=[0,...order.slice(1).reverse()];
    else normal=normal.scale(-1);
    const tile=tileSizes.get(mat)||2.5;
    order.forEach(k=>{
      const v=verts[k];B.p.push(v.x,v.y,v.z);B.n.push(normal.x,normal.y,normal.z);
      if(uvs) B.uv.push(uvs[k*2],uvs[k*2+1]); else B.uv.push(...projectUV(v,normal,tile));
    });
    for(let k=1;k<verts.length-1;k++) B.i.push(base,base+k,base+k+1);
  }
  function addBox(mat,w,h,d,center,yaw) {
    const cos=Math.cos(yaw),sin=Math.sin(yaw);
    const at=(x,y,z)=>new BABYLON.Vector3(center.x+x*cos+z*sin,center.y+y,center.z-x*sin+z*cos);
    const dir=(x,y,z)=>new BABYLON.Vector3(x*cos+z*sin,y,-x*sin+z*cos);
    const X=w/2,Y=h/2,Z=d/2;
    addPolygon(mat,[at(-X,-Y,Z),at(X,-Y,Z),at(X,Y,Z),at(-X,Y,Z)],dir(0,0,1));
    addPolygon(mat,[at(X,-Y,-Z),at(-X,-Y,-Z),at(-X,Y,-Z),at(X,Y,-Z)],dir(0,0,-1));
    addPolygon(mat,[at(X,-Y,Z),at(X,-Y,-Z),at(X,Y,-Z),at(X,Y,Z)],dir(1,0,0));
    addPolygon(mat,[at(-X,-Y,-Z),at(-X,-Y,Z),at(-X,Y,Z),at(-X,Y,-Z)],dir(-1,0,0));
    addPolygon(mat,[at(-X,Y,Z),at(X,Y,Z),at(X,Y,-Z),at(-X,Y,-Z)],dir(0,1,0));
    addPolygon(mat,[at(-X,-Y,-Z),at(X,-Y,-Z),at(X,-Y,Z),at(-X,-Y,Z)],dir(0,-1,0));
  }
  // Gabled roof whose ridge runs along local x. s = half span at the wall top,
  // e = eave overhang, r = ridge height, ox = overhang past the gable walls.
  function gableRoof(base,yaw,length,s,e,r,roofMat,gableMat,ox=.08) {
    const cos=Math.cos(yaw),sin=Math.sin(yaw);
    const at=(x,y,z)=>new BABYLON.Vector3(base.x+x*cos+z*sin,base.y+y,base.z-x*sin+z*cos);
    const dir=(x,y,z)=>new BABYLON.Vector3(x*cos+z*sin,y,-x*sin+z*cos);
    const l=length/2,L=l+ox,drop=r*e/s,T=2.1,slope=Math.hypot(s+e,r+drop);
    for(const side of [1,-1]) {
      addPolygon(roofMat,[at(-L,-drop,side*(s+e)),at(L,-drop,side*(s+e)),at(L,r,0),at(-L,r,0)],dir(0,1,side),
        [-L/T,0,L/T,0,L/T,slope/T,-L/T,slope/T]);
      addPolygon(mats.timber,[at(-L,-drop-.07,side*(s+e)),at(L,-drop-.07,side*(s+e)),at(L,-.07,side*s),at(-L,-.07,side*s)],dir(0,-1,side*.3));
      addPolygon(gableMat,[at(side*l,0,s),at(side*l,0,-s),at(side*l,r,0)],dir(side,0,0));
    }
    const T2=.2;
    for(const side of [1,-1]) {
      const eave=side*(s+e);
      addPolygon(mats.timber,[at(-L,-drop,eave),at(L,-drop,eave),at(L,-drop-T2,eave),at(-L,-drop-T2,eave)],dir(0,0,side));
      for(const end of [1,-1])
        addPolygon(mats.timber,[at(end*L,-drop,eave),at(end*L,r,0),at(end*L,r-T2,0),at(end*L,-drop-T2,eave)],dir(end,0,0));
    }
    addBox(mats.stoneDark,2*L,.16,.26,at(0,r+.02,0),yaw);
  }
  function pathSegments(name, path, width, height, mat, elevation = 0, battlements = false) {
    const ps = points(path);
    for (let i=1;i<ps.length;i++) {
      const a=ps[i-1], b=ps[i], len=BABYLON.Vector3.Distance(a,b);
      const segment=box(name+' '+i,width,height,len+width*.12,new BABYLON.Vector3((a.x+b.x)/2,elevation,(a.z+b.z)/2),mat);
      segment.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);
      if(battlements) {
        // A battered (thickened) base and a corbel table under the parapet walk.
        const yaw=segment.rotation.y,cos=Math.cos(yaw),sin=Math.sin(yaw);
        addBox(mats.stoneDark,width+1.1,1.6,len+width*.12,new BABYLON.Vector3((a.x+b.x)/2,.8,(a.z+b.z)/2),yaw);
        const corbels=Math.max(1,Math.floor(len/1.15));
        for(let k=0;k<corbels;k++) {
          const p=BABYLON.Vector3.Lerp(a,b,(k+.5)/corbels);
          for(const side of [-1,1])
            addBox(mats.stone,.34,.42,.3,new BABYLON.Vector3(p.x+cos*side*(width/2+.15),elevation+height/2-.55,p.z-sin*side*(width/2+.15)),yaw);
        }
        for(const side of [-1,1])
          addBox(mats.stone,.2,.22,len+width*.12,new BABYLON.Vector3((a.x+b.x)/2+cos*side*(width/2+.2),elevation+height/2-.24,(a.z+b.z)/2-sin*side*(width/2+.2)),yaw);
        const count=Math.max(1,Math.floor(len/2.3));
        for(let merlon=0;merlon<count;merlon++) {
          const p=BABYLON.Vector3.Lerp(a,b,(merlon+.5)/count);
          const stone=box(name+' crenellation '+i+' '+merlon,width+.12,.86,.95,new BABYLON.Vector3(p.x,elevation+height/2+.43,p.z),mats.stone);
          stone.rotation.y=segment.rotation.y;
        }
      }
    }
  }
  const isBridge = road => road.name.includes('Bridge')||road.name==='Historic Crossway';
  // Catmull-Rom centreline shared by the paving and the street-frontage houses.
  function roadCenterline(road) {
    const anchors=points(road.path),centerline=[];
    for(let i=0;i<anchors.length-1;i++) for(let step=0;step<10;step++) {
      const p0=anchors[Math.max(0,i-1)],p1=anchors[i],p2=anchors[i+1],p3=anchors[Math.min(anchors.length-1,i+2)],t=step/10;
      const component=k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t);
      centerline.push(new BABYLON.Vector3(component('x'),0,component('z')));
    }
    centerline.push(anchors[anchors.length-1].clone());
    return centerline;
  }
  function shapedRoad(road) {
    const bridge=isBridge(road);
    const centerline=roadCenterline(road);
    const positions=[],uvs=[],indices=[],edges=[[],[]];let distance=0;
    centerline.forEach((point,i)=>{
      const before=centerline[Math.max(0,i-1)],after=centerline[Math.min(centerline.length-1,i+1)];
      const tangent=after.subtract(before).normalize(),across=new BABYLON.Vector3(tangent.z,0,-tangent.x);
      if(i) distance+=BABYLON.Vector3.Distance(point,centerline[i-1]);
      const rise=bridge?2.45*Math.sin(Math.PI*i/(centerline.length-1)):0;
      for(const side of [-1,1]) {
        const edge=point.add(across.scale(side*road.width*.5));
        const y=.04+rise;
        positions.push(edge.x,y,edge.z);uvs.push(side<0?0:1,distance/3.2);
        edges[side<0?0:1].push(new BABYLON.Vector3(edge.x,y,edge.z));
      }
      if(i<centerline.length-1){const base=i*2;indices.push(base,base+1,base+2,base+1,base+3,base+2);}
    });
    const mesh=new BABYLON.Mesh(road.name+' continuous curved paving',scene),data=new BABYLON.VertexData();
    data.positions=positions;data.indices=indices;data.uvs=uvs;data.normals=new Array(positions.length).fill(0);
    BABYLON.VertexData.ComputeNormals(positions,indices,data.normals);data.applyToMesh(mesh);
    mesh.material=bridge?mats.bridge:mats.paving;mesh.isPickable=false;
    if(!bridge) {
      // Flagstone pavements run from the kerb right up to the house fronts.
      const reach=road.width/2+2.05,up=new BABYLON.Vector3(0,1,0);
      const side=(i,k)=>{
        const p=centerline[i],a=centerline[Math.max(0,i-1)],b=centerline[Math.min(centerline.length-1,i+1)];
        const t=b.subtract(a).normalize();
        return new BABYLON.Vector3(p.x+t.z*k,.015,p.z-t.x*k);
      };
      for(let i=1;i<centerline.length;i++)
        addPolygon(mats.flagstone,[side(i-1,-reach),side(i,-reach),side(i,reach),side(i-1,reach)],up);
      // A dark stone drainage gutter just outside each kerb.
      const inner=road.width/2+.14,outer=road.width/2+.52,lift=v=>new BABYLON.Vector3(v.x,.028,v.z);
      for(let i=1;i<centerline.length;i++) for(const k of [-1,1])
        addPolygon(mats.gutter,[lift(side(i-1,k*inner)),lift(side(i,k*inner)),lift(side(i,k*outer)),lift(side(i-1,k*outer))],up);
    }
    for(const [side,edge] of edges.entries()) {
      if(!bridge) {
        const curb=BABYLON.MeshBuilder.CreateTube(road.name+' shaped stone curb '+side,{path:edge.map(p=>p.add(new BABYLON.Vector3(0,.13,0))),radius:.12,tessellation:6},scene);
        curb.material=mats.stoneDark;
        continue;
      }
      const wallPositions=[],wallUvs=[],wallIndices=[];let along=0;
      edge.forEach((point,i)=>{
        const before=edge[Math.max(0,i-1)],after=edge[Math.min(edge.length-1,i+1)];
        const tangent=after.subtract(before).normalize(),outward=new BABYLON.Vector3(tangent.z,0,-tangent.x).scale(side===0?-1:1);
        const outside=point.add(outward.scale(.54));
        if(i)along+=BABYLON.Vector3.Distance(point,edge[i-1]);
        wallPositions.push(point.x,point.y,point.z,point.x,point.y+1.15,point.z,
          outside.x,point.y,outside.z,outside.x,point.y+1.15,outside.z);
        wallUvs.push(along/3,0,along/3,1,along/3+.18,0,along/3+.18,1);
        if(i<edge.length-1){const base=i*4;
          wallIndices.push(base,base+1,base+4,base+1,base+5,base+4,
            base+2,base+6,base+3,base+3,base+6,base+7,
            base+1,base+3,base+5,base+3,base+7,base+5);
        }
        if(i>0&&i<edge.length-1&&i%10===0) {
          const stonePost=box(road.name+' dressed stone pier cap '+side+' '+i,.78,1.5,.78,new BABYLON.Vector3(outside.x,point.y+.75,outside.z),mats.parapet);
          stonePost.rotation.y=Math.atan2(tangent.x,tangent.z);
          const coping=box(road.name+' pier coping '+side+' '+i,.94,.18,.94,new BABYLON.Vector3(outside.x,point.y+1.5,outside.z),mats.stone);
          coping.rotation.y=stonePost.rotation.y;
        }
      });
      const wall=new BABYLON.Mesh(road.name+' carved stone parapet '+side,scene),wallData=new BABYLON.VertexData();
      wallData.positions=wallPositions;wallData.indices=wallIndices;wallData.uvs=wallUvs;
      wallData.normals=new Array(wallPositions.length).fill(0);BABYLON.VertexData.ComputeNormals(wallPositions,wallIndices,wallData.normals);
      wallData.applyToMesh(wall);wall.material=mats.parapet;wall.isPickable=false;
    }
    if(bridge) archedBridge(road,centerline);
  }
  // Solid masonry beneath each bridge deck: spandrel walls drop to the river
  // except where round arches open between piers, a vault closes each arch,
  // and pointed cutwaters stand upstream and downstream of every pier.
  function archedBridge(road,centerline) {
    const WATER=-1.3,SPRING=-.5,face=road.width/2+.54;
    const samples=[];
    for(let i=0;i<centerline.length-1;i++) for(let k=0;k<8;k++) {
      const u=(i+k/8)/(centerline.length-1);
      samples.push({p:BABYLON.Vector3.Lerp(centerline[i],centerline[i+1],k/8),u});
    }
    samples.push({p:centerline[centerline.length-1],u:1});
    let length=0;for(let i=1;i<samples.length;i++)length+=BABYLON.Vector3.Distance(samples[i-1].p,samples[i].p);
    const arches=Math.max(3,Math.round(length/10)),pier=.1;
    const deckAt=u=>.04+2.45*Math.sin(Math.PI*u);
    const bottomAt=u=>{
      const cell=u*arches,t=cell-Math.floor(cell);
      if(u<=0||u>=1||t<pier||t>1-pier)return WATER;
      const crown=Math.min(deckAt(u)-.8,SPRING+2.6);
      if(crown<=SPRING)return WATER;
      const tt=(t-pier)/(1-2*pier);
      return SPRING+(crown-SPRING)*Math.sqrt(Math.max(0,1-(2*tt-1)**2));
    };
    const frames=samples.map((s,i)=>{
      const a=samples[Math.max(0,i-1)].p,b=samples[Math.min(samples.length-1,i+1)].p;
      const t=b.subtract(a).normalize();
      return {p:s.p,t,across:new BABYLON.Vector3(t.z,0,-t.x),top:deckAt(s.u),bottom:bottomAt(s.u)};
    });
    const up=new BABYLON.Vector3(0,1,0),down=new BABYLON.Vector3(0,-1,0);
    const at=(fr,side,off,y)=>new BABYLON.Vector3(fr.p.x+fr.across.x*side*off,y,fr.p.z+fr.across.z*side*off);
    for(let i=1;i<frames.length;i++) {
      const a=frames[i-1],b=frames[i];
      for(const side of [-1,1]) {
        const out=a.across.scale(side);
        addPolygon(mats.stoneDark,[at(a,side,face,a.bottom),at(b,side,face,b.bottom),at(b,side,face,b.top-.05),at(a,side,face,a.top-.05)],out);
        // A projecting string course marks the deck line along each face.
        addPolygon(mats.stone,[at(a,side,face+.16,a.top-.38),at(b,side,face+.16,b.top-.38),at(b,side,face+.16,a.top-.14+(b.top-a.top)),at(a,side,face+.16,a.top-.14)],out);
        addPolygon(mats.stone,[at(a,side,face,a.top-.14),at(b,side,face,b.top-.14),at(b,side,face+.16,b.top-.14),at(a,side,face+.16,a.top-.14)],up);
        addPolygon(mats.stone,[at(a,side,face,a.top-.38),at(b,side,face,b.top-.38),at(b,side,face+.16,b.top-.38),at(a,side,face+.16,a.top-.38)],down);
      }
      if(a.bottom>WATER||b.bottom>WATER)
        addPolygon(mats.stoneDark,[at(a,-1,face,a.bottom),at(b,-1,face,b.bottom),at(b,1,face,b.bottom),at(a,1,face,a.bottom)],down);
    }
    for(let k=1;k<arches;k++) {
      const fr=frames[Math.round(k/arches*(frames.length-1))],capY=SPRING+.55;
      for(const side of [-1,1]) {
        const out=fr.across.scale(side),half=fr.t.scale(pier*length/arches*.95);
        const base=at(fr,side,face,0),nose=at(fr,side,face+1.5,0);
        const l=base.subtract(half),r=base.add(half);
        const pts=y=>[new BABYLON.Vector3(l.x,y,l.z),new BABYLON.Vector3(nose.x,y,nose.z),new BABYLON.Vector3(r.x,y,r.z)];
        const lo=pts(WATER),hi=pts(capY),cap=[new BABYLON.Vector3(l.x,capY+.02,l.z),new BABYLON.Vector3(nose.x,capY-.35,nose.z),new BABYLON.Vector3(r.x,capY+.02,r.z)];
        addPolygon(mats.stoneDark,[lo[0],lo[1],hi[1],hi[0]],out.subtract(fr.t));
        addPolygon(mats.stoneDark,[lo[1],lo[2],hi[2],hi[1]],out.add(fr.t));
        addPolygon(mats.stone,[hi[0],hi[1],cap[1],cap[0]],out.subtract(fr.t).add(up));
        addPolygon(mats.stone,[hi[1],hi[2],cap[2],cap[1]],out.add(fr.t).add(up));
      }
    }
  }
  roads.forEach(shapedRoad);

  function tower(name,x,y,radius=1.75,height=10) {
    const foot=map(x,y);
    const body=BABYLON.MeshBuilder.CreateCylinder(name+' stone',{diameter:radius*2,height,tessellation:8},scene);
    body.position=foot.add(new BABYLON.Vector3(0,height/2,0)); body.material=mats.stoneDark;body.isPickable=false;
    const batt=BABYLON.MeshBuilder.CreateCylinder(name+' battlements',{diameter:radius*2.35,height:1.1,tessellation:8},scene);
    batt.position=foot.add(new BABYLON.Vector3(0,height+.2,0));batt.material=mats.stone;
    for(const level of [height*.27,height*.57,height*.85]) {
      const course=BABYLON.MeshBuilder.CreateCylinder(name+' projecting masonry course '+level,{diameter:radius*2.13,height:.18,tessellation:8},scene);
      course.position=foot.add(new BABYLON.Vector3(0,level,0));course.material=mats.stone;
    }
    for(let side=0;side<4;side++) {
      const angle=side*Math.PI/2,offset=radius+.035;
      const slit=box(name+' recessed arrow slit '+side,.18,1.2,.045,
        foot.add(new BABYLON.Vector3(Math.sin(angle)*offset,height*.69,Math.cos(angle)*offset)),mats.glass);
      slit.rotation.y=angle;
      const lintel=box(name+' slit lintel '+side,.39,.12,.15,
        foot.add(new BABYLON.Vector3(Math.sin(angle)*(offset+.02),height*.69+.65,Math.cos(angle)*(offset+.02))),mats.stone);
      lintel.rotation.y=angle;
    }
    const roof=BABYLON.MeshBuilder.CreateCylinder(name+' roof',{diameterTop:0,diameterBottom:radius*2.1,height:2.8,tessellation:8},scene);
    roof.position=foot.add(new BABYLON.Vector3(0,height+2.1,0));roof.material=mats.slate;
  }
  outerWalls.forEach((wall, wi) => {
    pathSegments('outer battlement '+wi,wall,1.15,6.8,mats.stoneDark,3.25,true);
    wall.forEach((pt,i) => {
      if(Math.hypot(pt[0]-73.9,pt[1]-24.3)<1.2)return;
      if (i===0 || i===wall.length-1 || i%2===0) tower('wall tower '+wi+' '+i,...pt,1.55,8.5);
    });
  });
  innerWalls.forEach((wall,wi)=>pathSegments('inner High District wall '+wi,wall,.95,5.4,mats.stone,2.6));
  [[27.2,42.4,35,49],[73.9,24.3,81.5,18.1],[86.2,76.7,93.3,83.5]].forEach((p,i)=>{
    const a=map(p[0],p[1]),forward=map(p[2],p[3]).subtract(a).normalize();
    const across=new BABYLON.Vector3(forward.z,0,-forward.x),yaw=Math.atan2(forward.x,forward.z);
    for(const side of [-1,1]) {
      const at=a.add(across.scale(side*4.55)),q=pct(at);
      tower('gate flanking tower '+i+' '+side,q.x,q.y,2.1,11);
    }
    const lintel=box('gate arch lintel '+i,9.4,1.3,1.5,a.add(new BABYLON.Vector3(0,8.8,0)),mats.stone);
    lintel.rotation.y=yaw;
    for(let merlon=-2;merlon<=2;merlon++) {
      const p=a.add(across.scale(merlon*1.75));
      const crown=box('gate crown battlement '+i+' '+merlon,1.05,.75,1.5,p.add(new BABYLON.Vector3(0,9.85,0)),mats.stone);
      crown.rotation.y=yaw;
    }
  });
  docks.forEach((d,i)=>{
    const a=points(d),start=a[0],end=a[1],len=BABYLON.Vector3.Distance(start,end);
    const pier=box('Trade District pier '+i,2.25,.8,len,new BABYLON.Vector3((start.x+end.x)/2,.25,(start.z+end.z)/2),mats.wood);
    pier.rotation.y=Math.atan2(end.x-start.x,end.z-start.z);
    for (const t of [0,.55,1]) {
      const q=BABYLON.Vector3.Lerp(start,end,t);
      const post=BABYLON.MeshBuilder.CreateCylinder('pier piling',{diameter:.35,height:2},scene);
      post.position=q.add(new BABYLON.Vector3(0,-.6,0));post.material=mats.wood;
    }
  });

  // Houses. Streets are lined first with continuous terraced frontage (the way
  // a walled capital actually packs its streets); the roof sites traced from
  // the illustrated map then fill the back lots wherever they still fit.
  const plasterMats=[mats.plaster,mats.plasterLight,mats.plasterOchre,mats.plasterRose,mats.plasterGrey];
  mats.flowers=material('window-box geraniums','#9e2a2f');
  mats.flowersPale=material('window-box marigolds','#b87a24');
  const signMats=[mats.marketRed,mats.marketBlue,mats.gold,mats.wood];
  const roadLines=roads.map(road=>({road,line:roadCenterline(road),bridge:isBridge(road)}));
  const wallLines=[...outerWalls,...innerWalls].map(points);
  const pinPoints=city.pins.map(p=>map(p.x,p.y));
  const greenscape=[[16,47],[25,44],[32,48],[34,59],[29,67],[20,69],[15,62]];
  function lineDistance(x,z,line) {
    let best=Infinity;
    for(let i=1;i<line.length;i++) {
      const a=line[i-1],b=line[i],dx=b.x-a.x,dz=b.z-a.z;
      const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz||1)));
      best=Math.min(best,Math.hypot(x-a.x-dx*t,z-a.z-dz*t));
    }
    return best;
  }
  const roadClearance=(x,z)=>Math.min(...roadLines.map(r=>lineDistance(x,z,r.line)-r.road.width/2));
  const wallClearance=(x,z)=>Math.min(...wallLines.map(line=>lineDistance(x,z,line)));
  function footprintClear(center,yaw,f,D,roadGap) {
    const cos=Math.cos(yaw),sin=Math.sin(yaw);
    for(const [u,v] of [[-1,-1],[1,-1],[1,1],[-1,1],[0,1],[0,-1],[1,0],[-1,0],[0,0]]) {
      const lx=u*(f/2-.12),lz=v*(D/2-.12);
      const x=center.x+lx*cos+lz*sin,z=center.z-lx*sin+lz*cos,q=pct({x,z});
      if(!inside(q.x,q.y,islandOutline)||inside(q.x,q.y,greenscape)) return false;
      if(((q.x-24)/5.2)**2+((q.y-58)/6)**2<1) return false;
      if(roadClearance(x,z)<roadGap||wallClearance(x,z)<2.6) return false;
      if(collisions.some(c=>hitsCollider(c,x,z,.02))) return false;
    }
    if(collisions.some(c=>{const dx=c.x-center.x,dz=c.z-center.z;return Math.abs(dx*cos-dz*sin)<f/2&&Math.abs(dx*sin+dz*cos)<D/2;})) return false;
    return !pinPoints.some(p=>Math.hypot(p.x-center.x,p.z-center.z)<4.4);
  }
  const floorsFor=(zone,seed)=>{
    const base={high:3,north:3,central:3,trade:2,south:2,lower:2,bellows:2}[zone]||2;
    return base+Math.floor(hash(seed*3.1)*2);
  };
  function house(center,yaw,f,D,zone,seed,floors) {
    const R=k=>hash(seed*7.13+k*1.7);
    const cos=Math.cos(yaw),sin=Math.sin(yaw);
    const at=(x,y,z)=>new BABYLON.Vector3(center.x+x*cos+z*sin,y,center.z-x*sin+z*cos);
    const part=(mat,w,h,d,x,y,z)=>addBox(mat,w,h,d,at(x,y,z),yaw);
    const groundH=3.3,floorH=2.85,H=groundH+(floors-1)*floorH;
    const plaster=plasterMats[Math.floor(R(1)*plasterMats.length)];
    const wallMat=zone==='trade'?(R(2)<.55?mats.brick:plaster):zone==='high'?(R(2)<.4?mats.stone:plaster):R(2)<.14?mats.brick:plaster;
    const isPlaster=plasterMats.includes(wallMat);
    const jetty=isPlaster&&floors>=2&&R(3)>.35?.45:0;
    const front=D/2,upperFront=D/2+jetty;
    if(jetty) {
      part(mats.stone,f,groundH,D,0,groundH/2,0);
      part(wallMat,f,H-groundH,D+jetty,0,groundH+(H-groundH)/2,jetty/2);
      part(mats.timber,f+.03,.3,D+jetty+.06,0,groundH,jetty/2);
    } else part(wallMat,f,H,D,0,H/2,0);
    part(mats.stoneDark,f+.05,.55,D+.16,0,.275,0);
    const span=(D+jetty)/2;
    const rise=span*(zone==='high'||zone==='north'?1.05:.82)*(.85+R(4)*.4);
    const roofMat=zone==='high'||zone==='north'?(R(5)<.8?mats.slate:mats.tileDark):R(5)<.36?mats.tile:R(5)<.54?mats.tileBrown:R(5)<.7?mats.tileDark:R(5)<.82?mats.tileMoss:mats.slate;
    // About a third of houses turn their gable to the street, which breaks the
    // eave line into the saw-tooth skyline of a real medieval street.
    const gableFront=f>=4.6&&R(13)<.34;
    const gableRise=f/2*(1.05+R(14)*.3);
    if(gableFront) gableRoof(at(0,H,jetty/2),yaw+Math.PI/2,D+jetty,f/2,.32,gableRise,roofMat,wallMat,.3);
    else gableRoof(at(0,H,jetty/2),yaw,f,span,.5,rise,roofMat,wallMat,.06);
    const timbered=isPlaster&&R(6)>.4,shuttered=R(7)>.45,shop=(zone==='trade'||zone==='central'||zone==='lower')&&R(8)>.4;
    const bays=Math.max(1,Math.round(f/1.9)),bw=f/bays,door=Math.floor(R(9)*bays);
    const frameMat=wallMat===mats.brick||wallMat===mats.stone?mats.stoneDark:mats.timber;
    function windowAt(x,y,fz,face,wide=1) {
      part(mats.glass,.74*wide,1.15,.08,x,y,fz+face*.02);
      part(mats.timber,.06,1.15,.05,x,y,fz+face*.07);
      part(mats.timber,.74*wide,.06,.05,x,y+.12,fz+face*.07);
      part(mats.stoneDark,.98*wide,.12,.22,x,y-.64,fz+face*.09);
      part(frameMat,.98*wide,.16,.16,x,y+.66,fz+face*.07);
      // Jambs stand proud of the glass so every window reads as set into a thick wall.
      for(const s of [-1,1]) part(frameMat,.12,1.32,.22,x+s*(.37*wide+.06),y,fz+face*.11);
      if(shuttered&&wide===1) for(const s of [-1,1]) part(mats.wood,.36,1.15,.07,x+s*.69,y,fz+face*.05);
    }
    for(const face of [1,-1]) {
      const fz=face*(face>0?upperFront:D/2),gz=face*front;
      for(let k=1;k<floors;k++) for(let b=0;b<bays;b++) windowAt(-f/2+bw*(b+.5),groundH+(k-1)*floorH+1.45,fz,face);
      for(let b=0;b<bays;b++) {
        const x=-f/2+bw*(b+.5);
        if(face>0&&b===door) {
          part(mats.timber,1.1,2.3,.1,x,1.15,gz+.03);
          part(mats.stoneDark,1.5,.3,.22,x,2.45,gz+.09);
          for(const s of [-1,1]) part(mats.stoneDark,.2,2.3,.18,x+s*.65,1.15,gz+.07);
          part(mats.stoneDark,1.7,.16,.55,x,.08,gz+.27);
          if(R(21)>.55) for(const s of [-1,1]) {
            part(mats.tileDark,.32,.34,.32,x+s*1.0,.17,gz+.3);
            part(mats.tree,.4,.26,.4,x+s*1.0,.44,gz+.3);
            part(R(22)>.5?mats.flowers:mats.flowersPale,.24,.07,.24,x+s*1.0,.6,gz+.3);
          }
        } else if(face>0&&shop) {
          part(mats.glass,bw*.72,1.35,.08,x,1.6,gz+.02);
          part(mats.timber,bw*.8,.18,.18,x,2.35,gz+.08);
          const awning=[mats.marketRed,mats.marketBlue,mats.market][Math.floor(R(10+b)*3)];
          const hw=bw*.44;
          addPolygon(awning,[at(x-hw,3.05,gz),at(x+hw,3.05,gz),at(x+hw,2.6,gz+1.25),at(x-hw,2.6,gz+1.25)],at(0,1,0).subtract(at(0,0,0)));
          addPolygon(awning,[at(x-hw,3.0,gz),at(x+hw,3.0,gz),at(x+hw,2.55,gz+1.25),at(x-hw,2.55,gz+1.25)],at(0,-1,0).subtract(at(0,0,0)));
        } else windowAt(x,1.75,gz,face);
      }
    }
    for(const side of [-1,1]) for(let k=1;k<floors;k++) {
      const y=groundH+(k-1)*floorH+1.45,x=side*(f/2);
      part(mats.glass,.08,1.15,.74,x+side*.02,y,0);
      part(mats.stoneDark,.22,.12,.98,x+side*.09,y-.64,0);
      part(frameMat,.16,.16,.98,x+side*.07,y+.66,0);
    }
    if(timbered) {
      const top=H-groundH;
      for(let b=0;b<=bays;b++) part(mats.timber,.2,top,.08,-f/2+bw*b+(b===0?.1:b===bays?-.1:0),groundH+top/2,upperFront+.04);
      for(let k=1;k<floors;k++) part(mats.timber,f,.2,.08,0,groundH+k*floorH-.05,upperFront+.04);
    }
    if(gableFront) {
      // Attic window high in the street gable, with a timber collar beam.
      windowAt(0,H+gableRise*.34,upperFront,1,.8);
      part(mats.timber,f*.7,.18,.1,0,H+gableRise*.1,upperFront+.04);
    } else if(f>=5&&R(15)>.5) {
      // A small pitched dormer on the street slope.
      const dz=span*.42,dw=1.35;
      part(wallMat,dw,1.3,1.4,0,H+.55,jetty/2+dz);
      gableRoof(at(0,H+1.2,jetty/2+dz),yaw+Math.PI/2,1.5,dw/2,.12,.62,roofMat,wallMat,.06);
      part(mats.glass,.7,.75,.08,0,H+.62,jetty/2+dz+.71);
      part(mats.timber,.95,.1,.12,0,H+1.03,jetty/2+dz+.74);
    }
    if(isPlaster&&!timbered&&R(16)>.35) {
      // Dressed stone quoins at the front corners of rendered houses.
      for(let y=.7,k=0;y<H-.3;y+=.34,k++) for(const s of [-1,1]) {
        const w=k%2?.28:.46,z=y<groundH?front:upperFront;
        part(mats.stone,w,.3,.08,s*(f/2-w/2+.02),y,z+.03);
      }
    }
    if(shop) {
      // Hanging trade sign on an iron-dark bracket.
      const sx=(R(17)>.5?1:-1)*(f/2-.35);
      part(mats.timber,.07,.07,1.1,sx,3.95,upperFront+.55);
      part(signMats[Math.floor(R(18)*signMats.length)],.06,.62,.78,sx,3.5,upperFront+.72);
    }
    if(R(19)>.62) for(let b=0;b<bays;b++) {
      // Window boxes of geraniums on the first floor.
      if(floors<2)break;
      const x=-f/2+bw*(b+.5),y=groundH+.8;
      part(mats.wood,.92,.2,.26,x,y,upperFront+.17);
      part(R(20+b)>.5?mats.flowers:mats.flowersPale,.84,.16,.2,x,y+.16,upperFront+.17);
    }
    if(R(11)>.5) {
      const cx=(R(12)>.5?1:-1)*(f/2-.55),ch=(gableFront?gableRise*.5:rise)+1.5;
      part(mats.stoneDark,.75,ch,.95,cx,H+ch/2-.2,-span*.3);
      part(mats.stone,.95,.16,1.15,cx,H+ch-.12,-span*.3);
    }
    collisions.push({x:center.x,z:center.z,hw:f/2+.03,hd:D/2+.08,yaw,kind:'house'});
    buildingCount++;
  }
  let buildingCount=0;
  function streetFrontage() {
    roadLines.forEach(({road,line,bridge},ri)=>{
      if(bridge) return;
      const lengths=[0];
      for(let i=1;i<line.length;i++) lengths.push(lengths[i-1]+BABYLON.Vector3.Distance(line[i-1],line[i]));
      const total=lengths[lengths.length-1];
      const sample=d=>{
        let i=1;while(i<line.length-1&&lengths[i]<d)i++;
        const t=(d-lengths[i-1])/(lengths[i]-lengths[i-1]||1);
        return {p:BABYLON.Vector3.Lerp(line[i-1],line[i],t),t:line[i].subtract(line[i-1]).normalize()};
      };
      for(const side of [-1,1]) {
        let s=3,seed=ri*977+(side>0?500:0),row=0;
        while(s<total-3) {
          seed++;
          const f=4.3+hash(seed)*2.6,D=6.8+hash(seed+.5)*2.6;
          const {p,t}=sample(s+f/2),across=new BABYLON.Vector3(t.z,0,-t.x).scale(side);
          const center=p.add(across.scale(road.width/2+1.7+D/2));
          const facing=across.scale(-1),yaw=Math.atan2(facing.x,facing.z);
          const zone=(districts.find(d=>inside(pct(center).x,pct(center).y,d.poly))||{style:'south'}).style;
          if(footprintClear(center,yaw,f,D,1.5)) {
            house(center,yaw,f,D,zone,seed,floorsFor(zone,seed));
            // An occasional narrow alley breaks up longer terraces.
            const alley=++row>4&&hash(seed+.9)<.16;
            if(alley)row=0;
            s+=f+(alley?1.9:.04);
          } else s+=1.3;
        }
      }
    });
  }
  // Close up the blocks: any sizeable open plot inside the city gets a house
  // turned toward its nearest street, leaving only small yards and lanes.
  function infill() {
    for(let gy=8;gy<92;gy+=2.7) for(let gx=8;gx<95;gx+=2.2) {
      const seed=Math.round(gx*131+gy*977);
      if(hash(seed)<.14) continue;
      const x=gx+(hash(seed+1)-.5)*1.4,y=gy+(hash(seed+2)-.5)*1.4;
      if(!inside(x,y,islandOutline)) continue;
      const center=map(x,y),road=nearestRoad(x,y),toward=map(road.x,road.y).subtract(center);
      const yaw=Math.atan2(toward.x,toward.z)+(hash(seed+3)-.5)*.2;
      const f=5+hash(seed+4)*3,D=6+hash(seed+5)*3;
      const zone=(districts.find(d=>inside(x,y,d.poly))||{style:'south'}).style;
      if(footprintClear(center,yaw,f,D,2.2)) house(center,yaw,f,D,zone,seed+9000,Math.max(1,floorsFor(zone,seed)-(hash(seed+6)<.5?1:0)));
    }
  }
  // Stone well-heads with a timber winding frame in the more open squares.
  function wells() {
    let placed=0;
    for(let i=0;i<400&&placed<7;i++) {
      const x=12+hash(i*7.3)*70,y=12+hash(i*3.9)*72;
      if(!inside(x,y,islandOutline)) continue;
      const c=map(x,y);
      if(roadClearance(c.x,c.z)<2.2||wallClearance(c.x,c.z)<5) continue;
      if(collisions.some(k=>hitsCollider(k,c.x,c.z,3.2))) continue;
      if(placed&&collisions.some(k=>k.kind==='well'&&Math.hypot(k.x-c.x,k.z-c.z)<35)) continue;
      const ring=BABYLON.MeshBuilder.CreateCylinder('well head',{diameter:1.7,height:.9,tessellation:18},scene);
      ring.position=c.add(new BABYLON.Vector3(0,.45,0));ring.material=mats.stone;
      const water=BABYLON.MeshBuilder.CreateCylinder('well shaft',{diameter:1.3,height:.02,tessellation:18},scene);
      water.position=c.add(new BABYLON.Vector3(0,.88,0));water.material=mats.glass;
      for(const s of [-1,1]) addBox(mats.timber,.14,2.2,.14,c.add(new BABYLON.Vector3(s*.72,1.1,0)),0);
      addBox(mats.timber,1.7,.12,.12,c.add(new BABYLON.Vector3(0,1.95,0)),0);
      gableRoof(c.add(new BABYLON.Vector3(0,2.15,0)),0,1.9,.55,.2,.55,mats.tileDark,mats.timber,.05);
      collisions.push({x:c.x,z:c.z,hw:.9,hd:.9,yaw:0,kind:'well'});
      placed++;
    }
  }
  function backLots() {
    (window.BASCTDELM_ROOFS || []).forEach(([bx,by,zone],seed)=>{
      if(nearestRoad(bx,by).distance<2.55) return;
      const center=map(bx,by),large=zone==='high'||zone==='north';
      const f=(large?6.4:4.8)+hash(seed+1)*2.4,D=(large?6.2:5.4)+hash(seed+2)*2.2;
      const road=nearestRoad(bx,by),toward=map(road.x,road.y).subtract(center);
      const yaw=Math.atan2(toward.x,toward.z)+(hash(seed+5)-.5)*.14;
      if(footprintClear(center,yaw,f,D,1.2)) house(center,yaw,f,D,zone,seed+4000,Math.max(1,floorsFor(zone,seed)-1));
    });
  }

  function landmarkInn(pin) {
    const center=map(pin.x,pin.y);
    const street=nearestRoad(pin.x,pin.y);
    const toward=map(street.x,street.y).subtract(center);
    const yaw=Math.atan2(toward.x,toward.z);
    const at=(x,y,z)=>center.add(new BABYLON.Vector3(x*Math.cos(yaw)+z*Math.sin(yaw),y,-x*Math.sin(yaw)+z*Math.cos(yaw)));
    const dark=pin.n%2===0;
    const frontage=8.8,depth=6.6,height=7.6;
    const groundFloor=box(pin.name+' stone ground floor',frontage,3.3,depth,at(0,1.65,0),mats.stone,true);
    groundFloor.rotation.y=yaw;
    const upper=box(pin.name+' jettied timber upper floor',frontage+1.1,4.3,depth+1.1,at(0,5.45,0),dark?mats.plaster:mats.plasterLight,true);
    upper.rotation.y=yaw;
    gableRoof(at(0,height,0),yaw+Math.PI/2,depth+1.1,(frontage+1.1)/2,.35,3.45,dark?mats.slate:mats.tile,dark?mats.plaster:mats.plasterLight,.2);
    for(const level of [3.38,7.39]) {
      const beam=box(pin.name+' carved facade beam '+level,frontage+1.2,.22,.28,at(0,level,3.92),mats.timber);
      beam.rotation.y=yaw;
    }
    for(const side of [-1,1]) {
      const post=box(pin.name+' exposed timber post '+side,.23,4.15,.25,at(side*4.34,5.4,3.92),mats.timber);
      post.rotation.y=yaw;
      const brace=BABYLON.MeshBuilder.CreateTube(pin.name+' diagonal half-timber brace '+side,{
        path:[at(side*4.18,3.66,3.97),at(side*3.04,5.08,3.97)],radius:.095,tessellation:6
      },scene);brace.material=mats.timber;
      for(const floor of [2.1,5.4]) {
        const front=floor<3?depth/2+.12:(depth+1.1)/2+.12;
        const window=box(pin.name+' mullioned window '+side+' '+floor,1.05,1.1,.12,at(side*2.2,floor,front),mats.glass);
        window.rotation.y=yaw;
        const lintel=box(pin.name+' window lintel '+side+' '+floor,1.4,.18,.25,at(side*2.2,floor+.66,front+.08),mats.timber);
        lintel.rotation.y=yaw;
        for(const shutterSide of [-1,1]) {
          const shutter=box(pin.name+' carved shutter '+side+' '+floor+' '+shutterSide,.24,1.12,.17,at(side*2.2+shutterSide*.72,floor,front+.07),mats.wood);
          shutter.rotation.y=yaw;
        }
      }
    }
    const door=box(pin.name+' recessed door',1.6,2.5,.16,at(0,1.25,depth/2+.14),mats.wood);
    door.rotation.y=yaw;
    const handle=box(pin.name+' brass door handle',.16,.16,.16,at(.53,1.17,depth/2+.3),mats.gold);
    handle.rotation.y=yaw;
    const awning=box(pin.name+' entrance canopy',3.8,.25,1.35,at(0,3.25,depth/2+.73),dark?mats.marketBlue:mats.marketRed);
    awning.rotation.y=yaw;
    const bracket=box(pin.name+' hanging sign bracket',1.65,.15,.16,at(3.4,4.9,depth/2+.6),mats.timber);
    bracket.rotation.y=yaw;
    const plaque=box(pin.name+' hanging tavern plaque',1.55,1.15,.18,at(4.0,4.15,depth/2+.65),mats.gold);
    plaque.rotation.y=yaw;
    const painted=new BABYLON.DynamicTexture(pin.name+' hand-painted sign',{width:512,height:384},scene,true);
    const brush=painted.getContext();
    brush.fillStyle='#4b281d';brush.fillRect(0,0,512,384);
    brush.strokeStyle='#e5c17d';brush.lineWidth=19;brush.strokeRect(14,14,484,356);
    brush.fillStyle='#f5e3b0';brush.textAlign='center';brush.textBaseline='middle';brush.font='bold 43px Georgia';
    const words=pin.name.replace(/^The /,'').split(' '),split=Math.ceil(words.length/2);
    brush.fillText(words.slice(0,split).join(' '),256,157,450);
    brush.fillText(words.slice(split).join(' '),256,230,450);painted.update();
    const signMat=new BABYLON.StandardMaterial(pin.name+' painted sign material',scene);
    signMat.diffuseTexture=painted;signMat.emissiveTexture=painted;signMat.disableLighting=true;signMat.backFaceCulling=false;
    const sign=BABYLON.MeshBuilder.CreatePlane(pin.name+' readable hanging sign',{width:1.48,height:1.06},scene);
    sign.position=at(4.0,4.15,depth/2+.756);sign.rotation.y=yaw+Math.PI;sign.material=signMat;
    const chimney=box(pin.name+' stone chimney',1.1,3.3,1.1,at(-2.7,height+1.15,-1.6),mats.stoneDark);
    chimney.rotation.y=yaw;
  }
  city.pins.filter(pin=>[10,11,12,13,14,15].includes(pin.n)).forEach(landmarkInn);

  function cylinder(name,x,y,radius,height,mat,tess=12) {
    const mesh=BABYLON.MeshBuilder.CreateCylinder(name,{diameter:radius*2,height,tessellation:tess},scene);
    mesh.position=map(x,y,height/2);mesh.material=mat;mesh.isPickable=false;return mesh;
  }
  function tree(x,y,scale=1) {
    const origin=map(x,y);
    const trunk=BABYLON.MeshBuilder.CreateCylinder('tapered tree trunk',{diameterTop:.3*scale,diameterBottom:.8*scale,height:4.5*scale,tessellation:9},scene);
    trunk.position=origin.add(new BABYLON.Vector3(0,2.25*scale,0));trunk.material=mats.trunk;
    const positions=[],uvs=[],indices=[];
    const leafRects=[[.02,.22,.03,.20],[.24,.44,.40,.54],[.52,.69,.40,.56],[.03,.22,.56,.72]];
    let leafNumber=0;
    for(let b=0;b<5;b++) {
      const angle=b*Math.PI*2/5+hash(x*31+y*17)*.4;
      const reach=(1.6+hash(b+x)*1.2)*scale;
      const branchTip=origin.add(new BABYLON.Vector3(Math.cos(angle)*reach, (4.6+hash(y+b)*1.1)*scale, Math.sin(angle)*reach));
      const branch=BABYLON.MeshBuilder.CreateTube('tree branch',{path:[origin.add(new BABYLON.Vector3(0,3.15*scale,0)),branchTip],radius:.13*scale,tessellation:6},scene);
      branch.material=mats.trunk;
      const branchLocal=branchTip.subtract(origin);
      for(let leaf=0;leaf<95;leaf++,leafNumber++) {
        const seed=Math.floor(x*37+y*53+b*101+leaf*13);
        const r=1.28*Math.cbrt(hash(seed+1))*scale,theta=hash(seed+2)*Math.PI*2;
        const center=branchLocal.add(new BABYLON.Vector3(Math.cos(theta)*r,(hash(seed+3)-.5)*2.8*scale,Math.sin(theta)*r));
        const rot=hash(seed+4)*Math.PI*2,tilt=(hash(seed+5)-.5)*1.2;
        const width=(.68+hash(seed+6)*.32)*scale,height=(.48+hash(seed+7)*.28)*scale;
        const right=new BABYLON.Vector3(Math.cos(rot)*width/2,0,-Math.sin(rot)*width/2);
        const up=new BABYLON.Vector3(Math.sin(rot)*Math.sin(tilt)*height/2,Math.cos(tilt)*height/2,Math.cos(rot)*Math.sin(tilt)*height/2);
        const corners=[center.subtract(right).subtract(up),center.add(right).subtract(up),center.add(right).add(up),center.subtract(right).add(up)];
        const base=positions.length/3;
        corners.forEach(p=>positions.push(p.x,p.y,p.z));
        const rect=leafRects[leafNumber%leafRects.length];
        uvs.push(rect[0],rect[3],rect[1],rect[3],rect[1],rect[2],rect[0],rect[2]);
        indices.push(base,base+1,base+2,base,base+2,base+3);
      }
    }
    const foliage=new BABYLON.Mesh('individual leaf geometry',scene);
    const vertex=new BABYLON.VertexData();vertex.positions=positions;vertex.indices=indices;vertex.uvs=uvs;
    // Light the leaves as one rounded, sky-facing canopy rather than per random quad.
    vertex.normals=[];
    for(let i=0;i<positions.length;i+=3) {
      const n=new BABYLON.Vector3(positions[i],positions[i+1]-4.8*scale,positions[i+2]).normalize().add(new BABYLON.Vector3(0,1.1,0)).normalize();
      vertex.normals.push(n.x,n.y,n.z);
    }
    vertex.applyToMesh(foliage);foliage.position=origin;foliage.material=mats.leaves;foliage.isPickable=false;
  }
  const grassPositions=[],grassIndices=[];
  function grassClump(x,y,seed) {
    const origin=map(x,y);
    for(let blade=0;blade<8;blade++) {
      const angle=(blade/8)*Math.PI*2+hash(seed)*.3;
      const radius=.1+hash(seed+blade)*.38;
      const bx=Math.cos(angle)*radius,bz=Math.sin(angle)*radius;
      const height=.35+hash(seed+blade*2)*.65;
      const lean=.18+hash(seed+blade*5)*.25;
      const base=grassPositions.length/3;
      grassPositions.push(origin.x+bx-.09,-.02,origin.z+bz,origin.x+bx+Math.cos(angle)*lean,height,origin.z+bz+Math.sin(angle)*lean,origin.x+bx+.09,-.02,origin.z+bz);
      grassIndices.push(base,base+1,base+2);
    }
  }
  // Griffonloch and Greenscape remain legible as open ground in the full map.
  for(let i=0;i<44;i++) {
    const x=18+hash(i*9+7)*17,y=48+hash(i*13+4)*21;
    const lake=((x-24)/5.2)**2+((y-58)/6)**2<1;
    if(!lake && nearestRoad(x,y).distance>2 && hash(i*16)>.17) tree(x,y,.65+hash(i+10)*.52);
  }
  for(let i=0;i<760;i++) {
    const x=16+hash(i*19+8)*18,y=47+hash(i*23+3)*22;
    const lake=((x-24)/5.2)**2+((y-58)/6)**2<1;
    if(!lake&&nearestRoad(x,y).distance>1.1)grassClump(x,y,i);
  }
  const grassMesh=new BABYLON.Mesh('Greenscape individual grass blades',scene);
  const grassData=new BABYLON.VertexData();grassData.positions=grassPositions;grassData.indices=grassIndices;
  // Thin two-sided blades are lit like the lawn beneath them, not by their own faces.
  grassData.normals=grassPositions.map((_,i)=>i%3===1?1:0);
  grassData.applyToMesh(grassMesh);grassMesh.material=mats.grassBlade;grassMesh.isPickable=false;
  // The island's named seat of government uses its surveyed map position.
  const keep=map(10.8,18.5);
  const keepBase=box('Talward Keep fortified main hall',14,14,11,keep.add(new BABYLON.Vector3(0,7,0)),mats.stone,true);
  dressFacades(keep,14,11,0,14);
  gableRoof(keep.add(new BABYLON.Vector3(0,14,0)),0,14,5.5,.4,4.2,mats.slate,mats.stone,.3);
  [[-7,-6],[-7,6],[7,-6],[7,6]].forEach((offset,i)=>{
    const p=keep.add(new BABYLON.Vector3(offset[0],0,offset[1]));
    const q=pct(p);tower('Talward Keep tower '+i,q.x,q.y,2.3,17);
  });
  // Civic and fortified halls get real facades instead of blank walls: a
  // moulded plinth, buttresses, tall leaded windows between them and a cornice.
  function dressFacades(origin,width,depth,baseY,height,skipFront=false) {
    const put=(mat,w,h,d,x,y,z)=>addBox(mat,w,h,d,origin.add(new BABYLON.Vector3(x,y,z)),0);
    put(mats.stoneDark,width+.34,.8,depth+.34,0,baseY+.4,0);
    put(mats.stone,width+.5,.42,depth+.5,0,baseY+height-.21,0);
    const winH=Math.min(3.4,height*.38),winY=baseY+height*.56;
    for(const [len,across,axis] of [[depth,width,'x'],[width,depth,'z']]) {
      const bays=Math.max(2,Math.round(len/3.2)),step=len/bays;
      for(const side of [-1,1]) {
        if(axis==='z'&&side>0&&skipFront)continue;
        const face=side*(across/2);
        for(let b=0;b<=bays;b++) {
          const u=-len/2+b*step;
          const [bx,bz]=axis==='x'?[face+side*.33,u]:[u,face+side*.33];
          put(mats.stoneDark,axis==='x'?.66:.8,height*.82,axis==='x'?.8:.66,bx,baseY+height*.41,bz);
          if(b===bays)continue;
          const m=u+step/2;
          const at=(o)=>axis==='x'?[face+side*o,m]:[m,face+side*o];
          const [gx,gz]=at(.03),[lx,lz]=at(.1);
          put(mats.glass,axis==='x'?.08:1.05,winH,axis==='x'?1.05:.08,gx,winY,gz);
          put(mats.stone,axis==='x'?.22:1.4,.3,axis==='x'?1.4:.22,lx,winY+winH/2+.15,lz);
          put(mats.stone,axis==='x'?.26:1.35,.16,axis==='x'?1.35:.26,lx,winY-winH/2-.08,lz);
        }
      }
    }
  }
  function monument(name,x,y,width,depth,height,roofMaterial) {
    const origin=map(x,y);
    box(name+' raised terrace',width+3,1.1,depth+3,origin.add(new BABYLON.Vector3(0,.55,0)),mats.stoneDark);
    box(name+' masonry hall',width,height,depth,origin.add(new BABYLON.Vector3(0,1.1+height/2,0)),mats.stone,true);
    dressFacades(origin,width,depth,1.1,height);
    gableRoof(origin.add(new BABYLON.Vector3(0,height+1.1,0)),Math.PI/2,depth,width/2,width*.05,width*.25,roofMaterial,mats.stone,.4);
    for(let i=-2;i<=2;i++) {
      const column=box(name+' colonnade '+i,.56,5,.56,origin.add(new BABYLON.Vector3(i*width*.16,3.5,depth/2+1.2)),mats.stone);
      box(name+' column capital '+i,1.1,.4,1.1,column.position.add(new BABYLON.Vector3(0,2.35,0)),mats.gold);
    }
    for(const side of [-1,1]) {
      box(name+' royal banner '+side,1.1,4,.12,origin.add(new BABYLON.Vector3(side*width*.34,height*.6,depth/2+.22)),mats.marketBlue);
      box(name+' banner gold trim '+side,1.2,.19,.15,origin.add(new BABYLON.Vector3(side*width*.34,height*.6-2,depth/2+.3)),mats.gold);
    }
  }
  monument('House of Myr',14.5,35.7,11,9,10,mats.slate);
  monument('Talward Garrison',26,19.9,14,11,11,mats.slate);
  monument("Braethyn's Archives",32.7,43.4,13,10,12,mats.copper);
  monument('Vault of Basctdelm',31.1,48.1,10,9,9,mats.slate);
  const beacon=map(86,38.7);
  cylinder('The Beacon lighthouse',86,38.7,3.7,23,mats.stone,12);
  const beaconTop=BABYLON.MeshBuilder.CreateCylinder('Beacon lantern room',{diameter:8,height:3,tessellation:12},scene);
  beaconTop.position=beacon.add(new BABYLON.Vector3(0,24,0));beaconTop.material=mats.gold;
  const beaconLight=new BABYLON.PointLight('Beacon flame',beacon.add(new BABYLON.Vector3(0,25,0)),scene);
  beaconLight.diffuse=rgb('#ffd186');beaconLight.intensity=90;beaconLight.range=45;
  // The Dripping Dagger marks the mapped way down into the Bellows.
  const bellows=map(12.9,45.9);
  box('Bellows entrance stone portal',5.8,5.3,1.5,bellows.add(new BABYLON.Vector3(0,2.65,0)),mats.stoneDark);
  box('Bellows portal dark opening',2.9,3.5,.12,bellows.add(new BABYLON.Vector3(0,1.75,.84)),mats.timber);
  box('Dripping Dagger hanging sign',2.3,.8,.16,bellows.add(new BABYLON.Vector3(3.4,4.1,.92)),mats.gold);
  // Ships sit alongside the piers actually drawn along the Dibaryn shoreline.
  for(let i=0;i<8;i++) {
    const x=84.4+hash(i*19)*3.2,y=34+i*3.2;
    const q=map(x,y);
    const hull=box('harbor vessel '+i,2.4,1.25,6.4,q.add(new BABYLON.Vector3(0,.1,0)),mats.wood);
    hull.rotation.y=.45+hash(i*3)*.3;
    const mast=box('ship mast '+i,.18,6,.18,q.add(new BABYLON.Vector3(0,3.5,0)),mats.timber);
    const sail=box('furled sail '+i,2.1,2.6,.08,q.add(new BABYLON.Vector3(0,4.1,0)),i%2?mats.plaster:mats.marketBlue);
    sail.rotation.y=hull.rotation.y;
  }

  // Landmarks are all placed, so houses can now fill in around them.
  streetFrontage();
  backLots();
  wells();
  infill();

  // Scaled fabric stalls and hanging lamps give the commercial waterfront its life.
  const stalls=[];
  for(let i=0;i<30;i++) {
    const x=69+hash(i*11)*8,y=37+hash(i*13)*27;
    if(nearestRoad(x,y).distance<1.55)continue;
    const q=map(x,y);
    if(collisions.some(c=>hitsCollider(c,q.x,q.z,1.9)))continue;
    stalls.push(q);
    collisions.push({x:q.x,z:q.z,hw:1.45,hd:1.3,yaw:0,kind:'stall'});
    const fabric=i%3===0?mats.marketBlue:i%3===1?mats.marketRed:mats.market;
    box('merchant counter '+i,2.5,.18,1.45,q.add(new BABYLON.Vector3(0,1.13,0)),mats.wood);
    for(const sx of [-1,1]) for(const sz of [-1,1]) {
      box('merchant canopy post '+i,.12,2.75,.12,q.add(new BABYLON.Vector3(sx*1.32,1.38,sz*1.18)),mats.wood);
    }
    const canopy=BABYLON.MeshBuilder.ExtrudeShape('pitched fabric canopy '+i,{
      shape:[new BABYLON.Vector3(-1.72,0,0),new BABYLON.Vector3(0,.73,0),new BABYLON.Vector3(1.72,0,0)],
      path:[new BABYLON.Vector3(0,0,-1.48),new BABYLON.Vector3(0,0,1.48)],cap:BABYLON.Mesh.CAP_ALL
    },scene);
    canopy.position=q.add(new BABYLON.Vector3(0,2.76,0));canopy.material=fabric;
    for(let goods=0;goods<3;goods++) {
      const crate=box('merchant goods '+i+' '+goods,.45,.38,.4,q.add(new BABYLON.Vector3((goods-1)*.71,1.4,-.1)),goods===1?mats.marketRed:mats.wood);
      crate.rotation.y=hash(i*7+goods)*.25;
    }
  }
  for(let i=0;i<56;i++) {
    const road=roads[i%roads.length],segment=i%Math.max(1,road.path.length-1);
    const a=road.path[segment],b=road.path[segment+1];
    if(!b)continue;
    const t=hash(i*87),x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
    const near=map(x,y),dir=map(b[0],b[1]).subtract(map(a[0],a[1])).normalize();
    // Bridge lanterns stand on the parapet; street lanterns on the kerb, clear of houses.
    const bridge=isBridge(road),side=i%2?1:-1;
    const across=new BABYLON.Vector3(dir.z,0,-dir.x).scale(side);
    const at=near.add(across.scale(bridge?road.width/2+.27:road.width/2+1.2));
    const q=pct(at);
    if(!bridge&&(!inside(q.x,q.y,islandOutline)||collisions.some(c=>hitsCollider(c,at.x,at.z,.35))))continue;
    const base=bridge?.04+bridgeRiseAt(x,y)+1.15:0,height=bridge?2.6:4.2;
    const yaw=Math.atan2(-across.x,-across.z);
    const lx=(u,v,w)=>at.add(new BABYLON.Vector3(-across.x*u,v,-across.z*u)).add(new BABYLON.Vector3(0,base,0));
    box('street lantern post '+i,.16,height,.16,lx(0,height/2,0),mats.timber);
    box('lantern bracket '+i,.08,.08,.8,lx(.36,height-.12,0),mats.timber).rotation.y=yaw;
    box('street lantern glass '+i,.28,.4,.28,lx(.7,height-.45,0),mats.lantern);
    box('lantern cap '+i,.38,.08,.38,lx(.7,height-.22,0),mats.timber);
  }

  const keys=new Set();
  let mouseSensitivity=.0035;
  let pointerWarmup=0;
  let active=false,dragging=false,lastDragX=0,lastDragY=0,hadPointerLock=false;
  const mapPanel=document.getElementById('map-panel');
  const prompt=document.getElementById('center-prompt');
  const districtLabel=document.getElementById('district-label');
  const placeName=document.getElementById('place-name');
  const locationLine=document.getElementById('location-line');
  const playerDot=document.getElementById('player-dot');
  const mapFrame=document.getElementById('map-frame');
  function enter() { if(aerial||mapOpen)return;active=true;canvas.focus();updatePrompt(); }
  function toggleMouseLock() {
    if(document.pointerLockElement===canvas){document.exitPointerLock();return;}
    enter();
    if(canvas.requestPointerLock)Promise.resolve(canvas.requestPointerLock()).catch(()=>{});
  }
  function updatePrompt() { prompt.style.display=active||aerial||mapOpen?'none':'block'; }
  canvas.addEventListener('click',enter);
  prompt.addEventListener('click',enter);
  prompt.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')enter();});
  canvas.addEventListener('pointerdown',e=>{enter();dragging=true;lastDragX=e.clientX;lastDragY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  document.addEventListener('pointerup',e=>{dragging=false;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);});
  document.addEventListener('pointerlockchange',()=>{
    if(document.pointerLockElement===canvas){hadPointerLock=true;active=true;pointerWarmup=2;}
    else if(hadPointerLock){active=false;hadPointerLock=false;dragging=false;keys.clear();}
    document.getElementById('lock-button').textContent=document.pointerLockElement===canvas?'Release mouse · L':'Mouse lock · L';
    updatePrompt();
  });
  document.addEventListener('pointermove',e=>{
    if(!active||aerial||mapOpen)return;
    const locked=document.pointerLockElement===canvas;
    if(!locked&&!dragging)return;
    if(locked&&pointerWarmup>0){pointerWarmup--;return;}
    const dx=locked?e.movementX:e.clientX-lastDragX;
    const dy=locked?e.movementY:e.clientY-lastDragY;
    lastDragX=e.clientX;lastDragY=e.clientY;
    const turned=navigation.look(camera.rotation.y,camera.rotation.x,dx,dy,locked?mouseSensitivity:mouseSensitivity*1.3);
    camera.rotation.y=turned.yaw;
    camera.rotation.x=turned.pitch;
  });
  function setMap(open) {
    mapOpen=open;mapPanel.classList.toggle('open',open);
    if(open&&document.pointerLockElement===canvas)document.exitPointerLock();
    if(open){active=false;dragging=false;keys.clear();}
    updatePrompt();
  }
  // Collapse the city into one mesh per material: thousands of boxes become a
  // few dozen draw calls, which is what makes shadows affordable.
  function finishCity() {
    batches.forEach((B,mat)=>{
      const mesh=new BABYLON.Mesh(mat.name+' city geometry',scene),data=new BABYLON.VertexData();
      data.positions=B.p;data.normals=B.n;data.uvs=B.uv;data.indices=B.i;data.applyToMesh(mesh);
      mesh.material=mat;mesh.isPickable=false;
    });
    batches.clear();
    collisions.forEach(c=>{if(c.yaw===undefined)c.yaw=c.mesh?c.mesh.rotation.y:0;delete c.mesh;});
    const standalone=new Set([sky,ground,waterPlane,griffonloch]),groups=new Map();
    scene.meshes.slice().forEach(mesh=>{
      if(standalone.has(mesh)||!(mesh instanceof BABYLON.Mesh)||!mesh.material||mesh.material===mats.water||!mesh.getTotalVertices())return;
      if(!groups.has(mesh.material))groups.set(mesh.material,[]);
      groups.get(mesh.material).push(mesh);
    });
    const merged=[];
    groups.forEach((list,mat)=>{
      let mesh=list[0];
      if(list.length>1) {
        try { mesh=BABYLON.Mesh.MergeMeshes(list,true,true); } catch(e) { mesh=null; }
        if(!mesh){merged.push(...list);return;}
        mesh.name=mat.name+' merged';
      } else mesh.bakeCurrentTransformIntoVertices();
      const tile=tileSizes.get(mat);
      if(tile) {
        const p=mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),n=mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        const uv=new Float32Array(p.length/3*2);
        for(let i=0;i<p.length/3;i++){
          const t=projectUV({x:p[i*3],y:p[i*3+1],z:p[i*3+2]},{x:n[i*3],y:n[i*3+1],z:n[i*3+2]},tile);
          uv[i*2]=t[0];uv[i*2+1]=t[1];
        }
        mesh.setVerticesData(BABYLON.VertexBuffer.UVKind,uv,false);
      }
      mesh.isPickable=false;mesh.freezeWorldMatrix();merged.push(mesh);
    });
    return merged;
  }
  const cityMeshes=finishCity();
  const flatGround=new Set([mats.earth,mats.park,mats.paving,mats.bridge,mats.grassBlade,mats.flagstone,mats.gutter,mats.courtyard]);
  const shadows=engine.webGLVersion>=2&&BABYLON.CascadedShadowGenerator
    ?new BABYLON.CascadedShadowGenerator(2048,sun):new BABYLON.ShadowGenerator(2048,sun);
  if(shadows instanceof BABYLON.CascadedShadowGenerator) {
    shadows.numCascades=4;shadows.lambda=.86;shadows.shadowMaxZ=240;
    shadows.stabilizeCascades=true;shadows.cascadeBlendPercentage=.06;shadows.depthClamp=true;
  }
  shadows.usePercentageCloserFiltering=true;
  shadows.filteringQuality=BABYLON.ShadowGenerator.QUALITY_MEDIUM;
  shadows.bias=.0025;shadows.normalBias=.018;shadows.darkness=0;
  cityMeshes.forEach(mesh=>{
    mesh.receiveShadows=true;
    if(!flatGround.has(mesh.material))shadows.addShadowCaster(mesh,false);
  });
  // Ambient occlusion darkens corners, eaves and doorways; the grade adds
  // anti-aliasing, a soft bloom on sunlit stone, gentle contrast and a vignette.
  if(BABYLON.SSAO2RenderingPipeline&&BABYLON.SSAO2RenderingPipeline.IsSupported) {
    const ssao=new BABYLON.SSAO2RenderingPipeline('ambient occlusion',scene,{ssaoRatio:.5,blurRatio:1},[camera]);
    ssao.radius=1.4;ssao.totalStrength=1.15;ssao.base=.08;ssao.samples=16;ssao.maxZ=140;ssao.minZAspect=.4;
    ssao.expensiveBlur=true;
  }
  const grade=new BABYLON.DefaultRenderingPipeline('city grade',true,scene,[camera]);
  grade.samples=4;grade.fxaaEnabled=true;
  grade.bloomEnabled=true;grade.bloomThreshold=.8;grade.bloomWeight=.16;grade.bloomKernel=48;grade.bloomScale=.5;
  grade.sharpenEnabled=true;grade.sharpen.edgeAmount=.22;
  grade.imageProcessingEnabled=true;
  grade.imageProcessing.contrast=1.14;grade.imageProcessing.exposure=1.0;
  grade.imageProcessing.vignetteEnabled=true;grade.imageProcessing.vignetteWeight=1.6;
  grade.imageProcessing.vignetteColor=new BABYLON.Color4(.05,.03,.02,0);
  // Measured when the view switches, so street life added later hides too.
  let streetMeshes=[];
  ground.setEnabled(false);
  function setAerial(on) {
    if(on===aerial)return;
    aerial=on;
    if(on){active=false;dragging=false;keys.clear();}
    if(on) streetMeshes=scene.meshes.filter(mesh=>mesh!==ground&&mesh!==sky&&mesh.isEnabled());
    streetMeshes.forEach(mesh=>mesh.setEnabled(!on));
    ground.setEnabled(on);
    if(on) {
      walkingPosition=camera.position.clone();walkingRotation=camera.rotation.clone();
      if(document.pointerLockElement===canvas)document.exitPointerLock();
      camera.upVector.set(0,0,-1);
      camera.position=map(50,51,275);camera.setTarget(map(50,51,0));camera.rotation.z=Math.PI;
      scene.fogDensity=.00035;
    } else {
      camera.upVector.set(0,1,0);
      camera.position=walkingPosition.clone();camera.rotation=walkingRotation.clone();
      scene.fogDensity=.0027;
    }
    document.getElementById('view-button').textContent=on?'Street view · V':'Aerial view · V';
    updatePrompt();
  }
  function reset() {
    if(aerial)setAerial(false);
    camera.position=start.clone();camera.setTarget(map(70,29,2));
    setMap(false);
  }
  function bridgeRiseAt(x,y) {
    let best={distance:Infinity,rise:0};
    for(const road of roads) {
      if(!road.name.includes('Bridge')&&road.name!=='Historic Crossway')continue;
      road.path.slice(1).forEach((end,index)=>{
        const start=road.path[index],dx=end[0]-start[0],dy=end[1]-start[1];
        const t=Math.max(0,Math.min(1,((x-start[0])*dx+(y-start[1])*dy)/(dx*dx+dy*dy)));
        const distance=Math.hypot(x-start[0]-dx*t,y-start[1]-dy*t);
        if(distance<best.distance)best={distance,rise:2.45*Math.sin(Math.PI*(index+t)/(road.path.length-1))};
      });
    }
    return best.distance<1.6?best.rise:0;
  }
  function goTo(x,y,standOff=0) {
    const near=nearestRoad(x,y);
    const destination=near.distance<8?near:{x,y};
    if(aerial)setAerial(false);
    let arrival=map(destination.x,destination.y,EYE_HEIGHT);
    const target=map(x,y,EYE_HEIGHT);
    const away=arrival.subtract(target);away.y=0;
    if(standOff&&away.lengthSquared()<standOff*standOff) {
      if(away.lengthSquared()<1) away.copyFrom(map(50,48).subtract(target));
      away.y=0;away.normalize();
      arrival=target.add(away.scale(standOff));
    }
    if(blocked(arrival)) {
      outer: for(const radius of [1,2,3,4,6,8,11]) {
        for(let step=0;step<16;step++) {
          const angle=step*Math.PI/8;
          const candidate=arrival.add(new BABYLON.Vector3(Math.cos(angle)*radius,0,Math.sin(angle)*radius));
          if(!blocked(candidate)){arrival=candidate;break outer;}
        }
      }
    }
    const arrivalMap=pct(arrival);
    arrival.y=EYE_HEIGHT+bridgeRiseAt(arrivalMap.x,arrivalMap.y);
    camera.position=arrival;
    const focus=standOff?map(x,y,EYE_HEIGHT+bridgeRiseAt(x,y)+2):map(50,48,EYE_HEIGHT+1);
    camera.setTarget(BABYLON.Vector3.DistanceSquared(arrival,focus)>16?focus:map(70,29,EYE_HEIGHT));
    setMap(false);
  }
  document.getElementById('map-button').addEventListener('click',()=>setMap(!mapOpen));
  document.getElementById('map-close').addEventListener('click',()=>setMap(false));
  document.getElementById('view-button').addEventListener('click',()=>setAerial(!aerial));
  document.getElementById('lock-button').addEventListener('click',toggleMouseLock);
  document.getElementById('reset-button').addEventListener('click',reset);
  document.addEventListener('keydown',e=>{
    const key=e.key.toLowerCase();
    if(['w','a','s','d','shift','l','m','v','r'].includes(key))e.preventDefault();
    keys.add(key);
    if(e.repeat)return;
    if(key==='m')setMap(!mapOpen);
    if(key==='v')setAerial(!aerial);
    if(key==='l')toggleMouseLock();
    if(key==='r')reset();
    if(key==='escape'){
      if(mapOpen)setMap(false);
      active=false;dragging=false;keys.clear();updatePrompt();
    }
  });
  document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur',()=>keys.clear());
  mapFrame.addEventListener('click',e=>{
    if(e.target.closest('button'))return;
    const b=mapFrame.getBoundingClientRect();
    goTo((e.clientX-b.left)/b.width*100,(e.clientY-b.top)/b.height*100);
  });
  const list=document.getElementById('landmark-list');
  city.pins.forEach(pin=>{
    const marker=document.createElement('button');marker.type='button';marker.className='map-pin';
    marker.style.left=pin.x+'%';marker.style.top=pin.y+'%';marker.title=pin.name;
    marker.setAttribute('aria-label','Go to '+pin.name);
    marker.addEventListener('click',e=>{e.stopPropagation();goTo(pin.x,pin.y,17);});
    mapFrame.appendChild(marker);
    if(majorNames.has(pin.n)) {
      const button=document.createElement('button');button.type='button';button.className='landmark-button';
      button.textContent=pin.name;button.addEventListener('click',()=>goTo(pin.x,pin.y,17));list.appendChild(button);
    }
  });
  const requestedPin=Number(new URLSearchParams(window.location.search).get('pin'));
  const entryPin=city.pins.find(pin=>pin.n===requestedPin);
  if(entryPin)goTo(entryPin.x,entryPin.y,17);

  function isWalkable(v) {
    const q=pct(v);
    if(inside(q.x,q.y,islandOutline))return true;
    return roads.some(r=>(r.name.includes('Bridge')||r.name==='Historic Crossway')&&r.path.slice(1).some((end,i)=>segmentDistance(q.x,q.y,r.path[i],end).distance<1.6));
  }
  function blocked(v) {
    if(!isWalkable(v))return true;
    // Street life (people, moving carts) blocks the player too; basctdelm-life.js supplies it.
    const moving=window.BasctdelmWalk&&window.BasctdelmWalk.dynamicBlocked;
    if(moving&&moving(v.x,v.z,camera.position.x,camera.position.z))return true;
    return collisions.some(c=>hitsCollider(c,v.x,v.z,.6));
  }
  function updateWalk(delta) {
    if(aerial||mapOpen||!active)return;
    const forward=(keys.has('w')?1:0)-(keys.has('s')?1:0);
    const strafe=(keys.has('d')?1:0)-(keys.has('a')?1:0);
    if(!forward&&!strafe)return;
    const step=navigation.walkingDelta(camera.rotation.y,forward,strafe,keys.has('shift')?7.2:3.6,delta);
    const dx=step.x,dz=step.z;
    const tryX=camera.position.clone();tryX.x+=dx;
    const tryZ=camera.position.clone();tryZ.z+=dz;
    if(!blocked(tryX))camera.position.x=tryX.x;
    if(!blocked(tryZ))camera.position.z=tryZ.z;
    const where=pct(camera.position);
    camera.position.y=EYE_HEIGHT+bridgeRiseAt(where.x,where.y);
  }
  function updateHud() {
    const q=pct(camera.position);
    playerDot.style.left=q.x+'%';playerDot.style.top=q.y+'%';
    let district=districts.find(d=>inside(q.x,q.y,d.poly));
    districtLabel.textContent=district?district.name:'Approach to Basctdelm';
    let closest=null,distance=Infinity;
    city.pins.forEach(p=>{
      const d=Math.hypot((p.x-q.x)*MAP_WIDTH/100,(p.y-q.y)*MAP_DEPTH/100);
      if(d<distance){distance=d;closest=p;}
    });
    const road=nearestRoad(q.x,q.y);
    placeName.textContent=distance<24&&closest?closest.name:road.distance<5?road.road:'The capital';
    locationLine.textContent='Map position '+q.x.toFixed(1)+'% E · '+q.y.toFixed(1)+'% S';
  }
  let previous=performance.now(),hudTime=0;
  engine.runRenderLoop(()=>{
    const now=performance.now(),delta=Math.min((now-previous)/1000,.05);previous=now;
    updateWalk(delta);
    if(now-hudTime>130){updateHud();hudTime=now;}
    scene.render();
  });
  window.addEventListener('resize',()=>engine.resize());
  const reveal=()=>document.getElementById('loading').classList.add('done');
  scene.executeWhenReady(reveal);
  // Babylon can keep an off-screen material in its pending list indefinitely.
  // Keep the street playable once the first render has had time to settle.
  setTimeout(reveal,5000);
  updateHud();
  window.BasctdelmWalk={scene,camera,roads,districts,goTo,setAerial,isAerial:()=>aerial,
    roadLines,roadClearance,collisions,hitsCollider,blocked,shadows,map,pct,hash,bridgeRiseAt,mats,stalls,docks,pinPoints,EYE_HEIGHT};
})();
