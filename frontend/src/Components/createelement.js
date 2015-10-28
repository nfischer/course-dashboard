import React from 'react';

import * as RENDERERS from './renderer.js';

export default function getRenderedElement(tag: string, node: Object){
  let renderer = node.renderer.trim() === '' ? "Renderer" : node.renderer;
  let renderClass = RENDERERS.hasOwnProperty(renderer) ?
                      RENDERERS[renderer] :
                      RENDERERS["Renderer"];
  return React.createElement(renderClass,
                             {
                               className: "node",
                               tag: tag,
                               node: node
                             },
                             []);
}
