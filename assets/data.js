var TOPICS = [
  {key:"mech", label:"Mechanics"},
  {key:"em", label:"Electricity & Magnetism"},
  {key:"wave", label:"Waves & Oscillations"},
  {key:"thermo", label:"Thermodynamics"}
];

var SUP = {"0":"\u2070","1":"\u00b9","2":"\u00b2","3":"\u00b3","4":"\u2074","5":"\u2075","6":"\u2076","7":"\u2077","8":"\u2078","9":"\u2079","-":"\u207b"};
function toSup(s){ return String(s).split("").map(function(c){ return SUP[c] || c; }).join(""); }

function fmt(x){
  if (x === null || x === undefined || !isFinite(x)) return "\u2014";
  var a = Math.abs(x);
  if (a !== 0 && (a < 0.001 || a >= 100000)){
    var exp = x.toExponential(2);
    var parts = exp.split("e");
    var mant = parseFloat(parts[0]).toString();
    var e = parseInt(parts[1], 10);
    return mant + " \u00d7 10" + toSup(e);
  }
  var s = x.toPrecision(4);
  if (s.indexOf(".") !== -1){ s = s.replace(/0+$/,"").replace(/\.$/,""); }
  return s;
}

var G = 6.674e-11, K_COUL = 8.99e9, R_GAS = 8.314;

var FORMULAS = [
  {
    id:"m01", topic:"mech", code:"M-01", title:"Kinematics — velocity",
    tex:"v = v_0 + a t",
    vars:[
      {key:"v0", sym:"v\u2080", unit:"m/s", def:0, step:0.5, min:-20, max:20},
      {key:"a", sym:"a", unit:"m/s\u00b2", def:9.8, step:0.1, min:-20, max:20},
      {key:"t", sym:"t", unit:"s", def:2, step:0.1, min:0, max:20}
    ],
    out:{sym:"v", unit:"m/s"},
    compute:function(v){ return v.v0 + v.a*v.t; },
    insight:"The constant-acceleration case, found by integrating a = dv/dt once. Set a to \u22129.8 for something launched upward under gravity, or a = 0 to recover straight-line motion at constant speed."
  },
  {
    id:"m02", topic:"mech", code:"M-02", title:"Kinematics — position",
    tex:"x = x_0 + v_0 t + \\tfrac{1}{2} a t^2",
    vars:[
      {key:"x0", sym:"x\u2080", unit:"m", def:0, step:1, min:-50, max:50},
      {key:"v0", sym:"v\u2080", unit:"m/s", def:0, step:0.5, min:-20, max:20},
      {key:"a", sym:"a", unit:"m/s\u00b2", def:9.8, step:0.1, min:-20, max:20},
      {key:"t", sym:"t", unit:"s", def:2, step:0.1, min:0, max:20}
    ],
    out:{sym:"x", unit:"m"},
    compute:function(v){ return v.x0 + v.v0*v.t + 0.5*v.a*v.t*v.t; },
    insight:"Integrate velocity once more and out falls position. The one-half factor is not a fudge \u2014 it drops straight out of integrating v\u2080 + at with respect to time."
  },
  {
    id:"m03", topic:"mech", code:"M-03", title:"Newton's second law",
    tex:"F = m a",
    vars:[
      {key:"m", sym:"m", unit:"kg", def:10, step:1, min:0.1, max:100},
      {key:"a", sym:"a", unit:"m/s\u00b2", def:2, step:0.1, min:-20, max:20}
    ],
    out:{sym:"F", unit:"N"},
    compute:function(v){ return v.m*v.a; },
    insight:"Force as the rate of change of momentum, restricted to constant mass. Nearly every dynamics problem starts with a free-body diagram and this one line."
  },
  {
    id:"m04", topic:"mech", code:"M-04", title:"Kinetic energy",
    tex:"KE = \\tfrac{1}{2} m v^2",
    vars:[
      {key:"m", sym:"m", unit:"kg", def:10, step:1, min:0.1, max:100},
      {key:"v", sym:"v", unit:"m/s", def:5, step:0.5, min:0, max:50}
    ],
    out:{sym:"KE", unit:"J"},
    compute:function(v){ return 0.5*v.m*v.v*v.v; },
    insight:"Because energy scales with v\u00b2, doubling speed quadruples the energy that needs to go somewhere when you stop \u2014 a large part of why braking distance and crash severity grow so fast with speed."
  },
  {
    id:"m05", topic:"mech", code:"M-05", title:"Gravitational PE",
    tex:"PE = m g h",
    vars:[
      {key:"m", sym:"m", unit:"kg", def:10, step:1, min:0.1, max:100},
      {key:"g", sym:"g", unit:"m/s\u00b2", def:9.8, step:0.1, min:0, max:20},
      {key:"h", sym:"h", unit:"m", def:5, step:0.5, min:0, max:100}
    ],
    out:{sym:"PE", unit:"J"},
    compute:function(v){ return v.m*v.g*v.h; },
    insight:"A linear approximation that only holds near a planet's surface, where g is treated as constant. The zero point of height is arbitrary \u2014 only differences in PE have physical meaning."
  },
  {
    id:"m06", topic:"mech", code:"M-06", title:"Momentum",
    tex:"p = m v",
    vars:[
      {key:"m", sym:"m", unit:"kg", def:10, step:1, min:0.1, max:100},
      {key:"v", sym:"v", unit:"m/s", def:5, step:0.5, min:0, max:50}
    ],
    out:{sym:"p", unit:"kg\u00b7m/s"},
    compute:function(v){ return v.m*v.v; },
    insight:"Conserved in any closed system with no external force \u2014 the real workhorse of collision problems, since kinetic energy is often lost to heat and sound but momentum never is."
  },
  {
    id:"m07", topic:"mech", code:"M-07", title:"Universal gravitation",
    tex:"F = \\dfrac{G m_1 m_2}{r^2}",
    vars:[
      {key:"m1", sym:"m\u2081", unit:"kg", def:1000, step:10, min:1, max:10000},
      {key:"m2", sym:"m\u2082", unit:"kg", def:1000, step:10, min:1, max:10000},
      {key:"r", sym:"r", unit:"m", def:10, step:0.5, min:0.1, max:100}
    ],
    out:{sym:"F", unit:"N"},
    compute:function(v){ return G*v.m1*v.m2/(v.r*v.r); },
    insight:"The inverse-square law that unified falling apples with orbiting moons. G is minuscule, which is why gravity between everyday objects is unnoticeable \u2014 it only dominates at planetary scale."
  },
  {
    id:"m08", topic:"mech", code:"M-08", title:"Centripetal force",
    tex:"F = \\dfrac{m v^2}{r}",
    vars:[
      {key:"m", sym:"m", unit:"kg", def:10, step:1, min:0.1, max:100},
      {key:"v", sym:"v", unit:"m/s", def:5, step:0.5, min:0, max:50},
      {key:"r", sym:"r", unit:"m", def:2, step:0.5, min:0.1, max:100}
    ],
    out:{sym:"F", unit:"N"},
    compute:function(v){ return v.m*v.v*v.v/v.r; },
    insight:"Not a new kind of force \u2014 it's the net inward force required to keep a mass on a circular path. Whatever supplies it (tension, gravity, friction) is doing the actual work of turning the path."
  },
  {
    id:"m09", topic:"mech", code:"M-09", title:"SHM period",
    tex:"T = 2\\pi\\sqrt{\\dfrac{m}{k}}",
    vars:[
      {key:"m", sym:"m", unit:"kg", def:1, step:0.1, min:0.01, max:50},
      {key:"k", sym:"k", unit:"N/m", def:10, step:0.5, min:0.1, max:200}
    ],
    out:{sym:"T", unit:"s"},
    compute:function(v){ return 2*Math.PI*Math.sqrt(v.m/v.k); },
    insight:"Notice period doesn't depend on amplitude \u2014 a wider swing covers more distance but also moves faster, and for ideal SHM the two effects cancel exactly."
  },
  {
    id:"e01", topic:"em", code:"E-01", title:"Coulomb's law",
    tex:"F = \\dfrac{k q_1 q_2}{r^2}",
    vars:[
      {key:"q1", sym:"q\u2081", unit:"\u00b5C", def:1, step:0.1, min:-10, max:10},
      {key:"q2", sym:"q\u2082", unit:"\u00b5C", def:1, step:0.1, min:-10, max:10},
      {key:"r", sym:"r", unit:"m", def:0.5, step:0.05, min:0.01, max:5}
    ],
    out:{sym:"F", unit:"N"},
    compute:function(v){ var q1=v.q1*1e-6, q2=v.q2*1e-6; return K_COUL*q1*q2/(v.r*v.r); },
    insight:"The electrical analogue of Newtonian gravity, except charge comes in two signs, so the force can repel as well as attract. k is roughly ten billion times larger than G, which is why electric forces dominate at human scales."
  },
  {
    id:"e02", topic:"em", code:"E-02", title:"Electric field (point charge)",
    tex:"E = \\dfrac{k Q}{r^2}",
    vars:[
      {key:"Q", sym:"Q", unit:"\u00b5C", def:1, step:0.1, min:-10, max:10},
      {key:"r", sym:"r", unit:"m", def:0.5, step:0.05, min:0.01, max:5}
    ],
    out:{sym:"E", unit:"N/C"},
    compute:function(v){ var Q=v.Q*1e-6; return K_COUL*Q/(v.r*v.r); },
    insight:"The field is what's 'there' even before a test charge shows up \u2014 multiply by any charge q placed at that point and you get the force on it, F = qE."
  },
  {
    id:"e03", topic:"em", code:"E-03", title:"Ohm's law",
    tex:"V = I R",
    vars:[
      {key:"I", sym:"I", unit:"A", def:2, step:0.1, min:0, max:50},
      {key:"R", sym:"R", unit:"\u03a9", def:10, step:1, min:0.1, max:1000}
    ],
    out:{sym:"V", unit:"V"},
    compute:function(v){ return v.I*v.R; },
    insight:"Strictly an empirical law rather than a fundamental one \u2014 it holds for ohmic materials like metals at constant temperature, but breaks down for diodes and other nonlinear devices."
  },
  {
    id:"e04", topic:"em", code:"E-04", title:"Electrical power",
    tex:"P = I V",
    vars:[
      {key:"I", sym:"I", unit:"A", def:2, step:0.1, min:0, max:50},
      {key:"V", sym:"V", unit:"V", def:12, step:1, min:0, max:240}
    ],
    out:{sym:"P", unit:"W"},
    compute:function(v){ return v.I*v.V; },
    insight:"Combine with Ohm's law to get P = I\u00b2R or P = V\u00b2/R \u2014 this is why thin wires overheat under high current, and why power lines run at high voltage and low current to cut I\u00b2R losses."
  },
  {
    id:"e05", topic:"em", code:"E-05", title:"Capacitor energy",
    tex:"U = \\tfrac{1}{2} C V^2",
    vars:[
      {key:"C", sym:"C", unit:"mF", def:1, step:0.1, min:0.001, max:100},
      {key:"V", sym:"V", unit:"V", def:12, step:1, min:0, max:240}
    ],
    out:{sym:"U", unit:"J"},
    compute:function(v){ var C=v.C*1e-3; return 0.5*C*v.V*v.V; },
    insight:"A capacitor stores energy in its electric field, not as charge sitting still. That's why capacitors can release energy far faster than batteries, which store it chemically."
  },
  {
    id:"w01", topic:"wave", code:"W-01", title:"Wave speed",
    tex:"v = f \\lambda",
    vars:[
      {key:"f", sym:"f", unit:"Hz", def:440, step:10, min:1, max:20000},
      {key:"lambda", sym:"\u03bb", unit:"m", def:0.78, step:0.01, min:0.001, max:10}
    ],
    out:{sym:"v", unit:"m/s"},
    compute:function(v){ return v.f*v.lambda; },
    insight:"Holds for any periodic wave \u2014 sound, light, water. Fix the medium (which fixes v) and frequency and wavelength become inversely tied: raise the pitch, shorten the wavelength."
  },
  {
    id:"t01", topic:"thermo", code:"T-01", title:"Ideal gas law",
    tex:"PV = nRT",
    vars:[
      {key:"n", sym:"n", unit:"mol", def:1, step:0.1, min:0.01, max:50},
      {key:"T", sym:"T", unit:"K", def:298, step:1, min:1, max:2000},
      {key:"V", sym:"V", unit:"L", def:22.4, step:0.5, min:0.1, max:1000}
    ],
    out:{sym:"P", unit:"Pa"},
    compute:function(v){ var Vm3 = v.V/1000; return v.n*R_GAS*v.T/Vm3; },
    insight:"A limiting case assuming point-like molecules with no intermolecular forces. Remarkably good for real gases at everyday pressures, but it breaks down as a gas nears condensation."
  }
];

function topicLabel(key){
  for (var i=0;i<TOPICS.length;i++){ if (TOPICS[i].key===key) return TOPICS[i].label; }
  return key;
}
function formulaById(id){
  for (var i=0;i<FORMULAS.length;i++){ if (FORMULAS[i].id===id) return FORMULAS[i]; }
  return null;
}
