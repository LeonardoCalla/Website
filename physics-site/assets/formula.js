(function(){
  "use strict";

  var f = formulaById(FORMULA_ID);
  if (!f) return;

  renderMenu(document.getElementById("menu-panel"), 1, f.id);
  wireSearchRedirect(document.getElementById("search"), "../index.html");

  document.title = f.code + " — " + f.title + " · Field Reference";
  document.getElementById("crumb-topic").textContent = topicLabel(f.topic);
  document.getElementById("card-code").textContent = f.code;
  document.getElementById("card-topic").textContent = topicLabel(f.topic);
  document.getElementById("card-title").textContent = f.title;
  document.getElementById("result-sym").textContent = f.out.sym + " =";
  document.getElementById("result-unit").textContent = f.out.unit;
  document.getElementById("insight-text").textContent = f.insight;

  var texEl = document.getElementById("tex-main");
  if (window.katex){
    try { katex.render(f.tex, texEl, { throwOnError:false, displayMode:true }); }
    catch(e){ texEl.textContent = f.tex; }
  }

  var varsEl = document.getElementById("vars");
  varsEl.innerHTML = f.vars.map(function(v){
    return '<div class="var-field">' +
      '<label for="in-'+v.key+'">'+v.sym+' <span class="unit">('+v.unit+')</span></label>' +
      '<input type="number" step="'+v.step+'" value="'+v.def+'" id="in-'+v.key+'" data-key="'+v.key+'">' +
    '</div>';
  }).join("");

  function recompute(){
    var vals = {};
    f.vars.forEach(function(v){
      var el = document.getElementById("in-"+v.key);
      var n = el ? parseFloat(el.value) : v.def;
      vals[v.key] = isFinite(n) ? n : 0;
    });
    var res;
    try { res = f.compute(vals); } catch(err){ res = NaN; }
    document.getElementById("result-val").textContent = fmt(res);
  }
  varsEl.addEventListener("input", recompute);
  recompute();

  var idx = FORMULAS.findIndex(function(x){ return x.id === f.id; });
  var prevF = FORMULAS[(idx - 1 + FORMULAS.length) % FORMULAS.length];
  var nextF = FORMULAS[(idx + 1) % FORMULAS.length];
  var prevLink = document.getElementById("prev-link");
  var nextLink = document.getElementById("next-link");
  prevLink.href = prevF.id + ".html";
  prevLink.textContent = "\u2190 " + prevF.code + " " + prevF.title;
  nextLink.href = nextF.id + ".html";
  nextLink.textContent = nextF.code + " " + nextF.title + " \u2192";
})();
