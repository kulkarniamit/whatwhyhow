/** Hack the anchor links and task list as github */
var linkifyAnchors = function (level, containingElement) {
  var headers = containingElement.getElementsByTagName("h" + level);
  for (var h = 0; h < headers.length; h++) {
    var header = headers[h];
    if (typeof header.id !== "undefined" && header.id !== "") {
      header.innerHTML = "<a id=\"user-content-" + header.id + "\" class=\"anchor\" href=\"#" + header.id + "\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" role=\"img\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1h-1c-1.5 0-3-1.69-3-3.5s1.55-3.5 3-3.5h4c1.45 0 3 1.69 3 3.5 0 1.41-0.91 2.72-2 3.25v-1.16c0.58-0.45 1-1.27 1-2.09 0-1.28-1.02-2.5-2-2.5H4c-0.98 0-2 1.22-2 2.5s1 2.5 2 2.5z m9-3h-1v1h1c1 0 2 1.22 2 2.5s-1.02 2.5-2 2.5H9c-0.98 0-2-1.22-2-2.5 0-0.83 0.42-1.64 1-2.09v-1.16c-1.09 0.53-2 1.84-2 3.25 0 1.81 1.55 3.5 3 3.5h4c1.45 0 3-1.69 3-3.5s-1.5-3.5-3-3.5z\"></path></svg></a>" + header.innerHTML;
    }
  }
};
var listTasks = function (containingElement) {
  var uls = containingElement.getElementsByTagName("ul");
  for (var i = 0; i < uls.length; i++) {
    var ul = uls[i];
    var lis = ul.getElementsByTagName("li");
    var isTask = false;
    for (var j = 0; j < lis.length; j++) {
      var li = lis[j];
      var s = li.innerHTML;
      var k = s.substring(0, 3);
      if (k == '[ ]') {
        isTask = true;
        li.className = 'task-list-item';
        li.innerHTML = '<input type="checkbox" class="task-list-item-checkbox" disabled="disabled">' + s.substring(3);
      } else if (k == '[x]') {
        isTask = true;
        li.className = 'task-list-item';
        li.innerHTML = '<input type="checkbox" class="task-list-item-checkbox" checked="checked" disabled="disabled">' + s.substring(3);
      }
    }
    if (isTask) {
      ul.className = 'task-list';
    }
  }
};
document.onreadystatechange = function () {
  if (this.readyState === "complete") {
    var contentBlock = document.getElementById("markdown-body");
    if (!contentBlock) return;
    
    // Anchor links
    for (var level = 2; level <= 6; level++) {
      linkifyAnchors(level, contentBlock);
    }
    // Task list
    listTasks(contentBlock);
  }
};