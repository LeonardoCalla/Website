function renderMenu(el, depth, currentId){
  var prefix = depth === 0 ? "formulas/" : "";
  var html = "";
  TOPICS.forEach(function(t){
    var items = FORMULAS.filter(function(f){ return f.topic === t.key; });
    if (!items.length) return;
    html += '<div class="menu-group"><h3>' + t.label + '</h3>';
    items.forEach(function(f){
      var cls = (f.id === currentId) ? ' class="current"' : '';
      html += '<a href="' + prefix + f.id + '.html"' + cls + '>' + f.code + ' \u2014 ' + f.title + '</a>';
    });
    html += '</div>';
  });
  el.innerHTML = html;
}

function wireSearchRedirect(input, homeHref){
  input.addEventListener("keydown", function(e){
    if (e.key !== "Enter") return;
    var q = encodeURIComponent(input.value.trim());
    window.location.href = homeHref + (q ? ("?q=" + q) : "");
  });
}
