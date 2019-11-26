const downloadSVG = (type) => {
  var svgData = document.getElementsByTagName('svg')[0].outerHTML;
  var svgBlob = new Blob([svgData], { type:"image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = `${type}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

const downloadPNG = (type, resolution) => {

  dlSvg(document.getElementsByTagName('svg')[0], `${type}.png`)

  function copyStylesInline(destinationNode, sourceNode) {
    var containerElements = ["svg","g"];
    for (var cd = 0; cd < destinationNode.childNodes.length; cd++) {
      var child = destinationNode.childNodes[cd];
      if (containerElements.indexOf(child.tagName) != -1) {
            copyStylesInline(child, sourceNode.childNodes[cd]);
            continue;
      }
      var style = sourceNode.childNodes[cd].currentStyle || window.getComputedStyle(sourceNode.childNodes[cd]);
      if (style == "undefined" || style == null) continue;
      for (var st = 0; st < style.length; st++){
          child.style.setProperty(style[st], style.getPropertyValue(style[st]));
      }
    }
  }

  function triggerDownload (imgURI, fileName) {
    var evt = new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: true
    });
    var a = document.createElement("a");
    a.setAttribute("download", fileName);
    a.setAttribute("href", imgURI);
    a.setAttribute("target", '_blank');
    a.dispatchEvent(evt);
  }

  function dlSvg(svg, fileName) {
    var copy = svg.cloneNode(true);
    copyStylesInline(copy, svg);
    var canvas = document.createElement("canvas");
    canvas.width = (innerHeight * 1.25) * resolution
    canvas.height = innerHeight * resolution
    // var bbox = svg.getBBox();
    // canvas.width = bbox.width;
    // canvas.height = bbox.height;
    var ctx = canvas.getContext("2d");
    ctx.scale(resolution, resolution)
    ctx.clearRect(0, 0, (innerHeight * 1.25), innerHeight);
    var data = (new XMLSerializer()).serializeToString(copy);
    var DOMURL = window.URL || window.webkitURL || window;
    var img = new Image();
    var svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svgBlob);
    img.onload = function () {
      ctx.drawImage(img, 0, 0, (innerHeight * 1.25), innerHeight);
      DOMURL.revokeObjectURL(url);
      if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        var blob = canvas.msToBlob();
        navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        var imgURI = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
            triggerDownload(imgURI, fileName);
      }
      // document.removeChild(canvas);
    };
    img.src = url;
  }

}

export {
  downloadSVG,
  downloadPNG
}
