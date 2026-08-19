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

  function currentVals(){
    var vals = {};
    f.vars.forEach(function(v){
      var el = document.getElementById("in-"+v.key);
      var n = el ? parseFloat(el.value) : v.def;
      vals[v.key] = isFinite(n) ? n : 0;
    });
    return vals;
  }

  function recompute(){
    var vals = currentVals();
    var res;
    try { res = f.compute(vals); } catch(err){ res = NaN; }
    document.getElementById("result-val").textContent = fmt(res);
    updateChart(vals);
  }

  var chartSelect = document.getElementById("chart-var");
  chartSelect.innerHTML = f.vars.map(function(v, i){
    return '<option value="'+v.key+'"'+(i===0?" selected":"")+'>'+v.sym+' ('+v.unit+')</option>';
  }).join("");

  var chart = null;
  function updateChart(vals){
    var xKey = chartSelect.value;
    var xVar = f.vars.filter(function(v){ return v.key === xKey; })[0];
    if (!xVar) return;
    var N = 60;
    var points = [];
    for (var i = 0; i <= N; i++){
      var x = xVar.min + (xVar.max - xVar.min) * (i / N);
      var v2 = {};
      for (var k in vals){ v2[k] = vals[k]; }
      v2[xKey] = x;
      var y;
      try { y = f.compute(v2); } catch(e){ y = null; }
      points.push({x:x, y:y});
    }
    var markerX = vals[xKey];
    var markerY;
    try { markerY = f.compute(vals); } catch(e){ markerY = null; }

    var config = {
      type: "line",
      data: {
        datasets: [
          {
            data: points, borderColor: "#8FD3E8", backgroundColor: "rgba(143,211,232,0.08)",
            borderWidth: 2, pointRadius: 0, tension: 0.15, fill: true
          },
          {
            data: [{x:markerX, y:markerY}], showLine: false, pointRadius: 6,
            pointBackgroundColor: "#E8A33D", pointBorderColor: "#E8A33D"
          }
        ]
      },
      options: {
        responsive: true, animation: false,
        plugins: { legend: { display:false } },
        scales: {
          x: {
            type: "linear",
            title: { display:true, text: xVar.sym + " (" + xVar.unit + ")", color:"#8FA9BE" },
            ticks: { color:"#8FA9BE" }, grid: { color:"rgba(159,196,224,0.08)" }
          },
          y: {
            title: { display:true, text: f.out.sym + " (" + f.out.unit + ")", color:"#8FA9BE" },
            ticks: { color:"#8FA9BE" }, grid: { color:"rgba(159,196,224,0.08)" }
          }
        }
      }
    };

    if (chart){ chart.data = config.data; chart.options = config.options; chart.update(); }
    else { chart = new Chart(document.getElementById("chart-canvas").getContext("2d"), config); }
  }

  chartSelect.addEventListener("change", recompute);
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
