import React, { useState } from 'react'
import convertSvgToPng from '../../utils/convertSvgToPng'

const DownloadImagePanel = ({ ...props }) => {

  const [fileType, setFileType] = useState('SVG')

  const handleDownload = async () => {
    switch (fileType) {
      case 'SVG':
        downloadSVG()
        break;
      case 'PNG':
        try {
          await convertSvgToPng(document.getElementsByTagName('svg')[0].outerHTML)
          console.log('done')
        } catch (err) {
          console.log(err)
        }
        break;
      default:
        downloadSVG()
    }
  }

  const downloadPNG = () => {
    downloadPNG()

  }

  // const downloadPNG = () => {
  //
  //   console.log(
  //     document.getElementsByTagName('svg')[0]
  //   )
  //   dlSvg(document.getElementsByTagName('svg')[0], 'mapImage.png')
  //
  //   function copyStylesInline(destinationNode, sourceNode) {
  //     var containerElements = ["svg","g"];
  //     for (var cd = 0; cd < destinationNode.childNodes.length; cd++) {
  //       var child = destinationNode.childNodes[cd];
  //       if (containerElements.indexOf(child.tagName) != -1) {
  //             copyStylesInline(child, sourceNode.childNodes[cd]);
  //             continue;
  //       }
  //       var style = sourceNode.childNodes[cd].currentStyle || window.getComputedStyle(sourceNode.childNodes[cd]);
  //       if (style == "undefined" || style == null) continue;
  //       for (var st = 0; st < style.length; st++){
  //           child.style.setProperty(style[st], style.getPropertyValue(style[st]));
  //       }
  //     }
  //   }
  //
  //   function triggerDownload (imgURI, fileName) {
  //     var evt = new MouseEvent("click", {
  //       view: window,
  //       bubbles: false,
  //       cancelable: true
  //     });
  //     var a = document.createElement("a");
  //     a.setAttribute("download", fileName);
  //     a.setAttribute("href", imgURI);
  //     a.setAttribute("target", '_blank');
  //     a.dispatchEvent(evt);
  //   }
  //
  //   function dlSvg(svg, fileName) {
  //     var copy = svg.cloneNode(true);
  //     copyStylesInline(copy, svg);
  //     var canvas = document.createElement("canvas");
  //     var bbox = svg.getBBox();
  //     canvas.width = bbox.width;
  //     canvas.height = bbox.height;
  //     var ctx = canvas.getContext("2d");
  //     ctx.clearRect(0, 0, bbox.width, bbox.height);
  //     var data = (new XMLSerializer()).serializeToString(copy);
  //     var DOMURL = window.URL || window.webkitURL || window;
  //     var img = new Image();
  //     var svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
  //     var url = DOMURL.createObjectURL(svgBlob);
  //     img.onload = function () {
  //       ctx.drawImage(img, 0, 0);
  //       DOMURL.revokeObjectURL(url);
  //       if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
  //         var blob = canvas.msToBlob();
  //         navigator.msSaveOrOpenBlob(blob, fileName);
  //       } else {
  //         var imgURI = canvas
  //             .toDataURL("image/png")
  //             .replace("image/png", "image/octet-stream");
  //             triggerDownload(imgURI, fileName);
  //       }
  //       document.removeChild(canvas);
  //     };
  //     img.src = url;
  //   }
  //
  // }

  const downloadSVG = () => {
    var svgData = document.getElementsByTagName('svg')[0].outerHTML;
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${props.type}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (<>
    <div
      className='col-med'
      style={{
        width:'200px',
        height:'100vh',
        backgroundColor: 'white',
        boxShadow: 'inset 10px 0 10px -10px rgba(0,0,0,0.2)',
      }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
        <div
          style={{
            margin: '50% 0 0 10%',
            padding: '0 10% 0 10%',
          }}>
          <div className='map-type-title'>
            {props.label}
          </div>
          <select
            onChange={e => setFileType(e.target.value)}>
            <option value='SVG'>SVG</option>
            <option value='PNG'>PNG</option>
            <option value='PDF'>PDF</option>
          </select>
          <button
            onClick={handleDownload}>
            Download {fileType}
          </button>
        </div>
      </div>
      <br/>
    </div>
  </>)

}

export default DownloadImagePanel
