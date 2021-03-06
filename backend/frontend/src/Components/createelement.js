import React from 'react';

import * as RENDERERS from './renderer.js';

//dynamically creates an element of a specified class based on if that class is available in the renderer module
export default function getRenderedElement(tag: string, node: Object, ui: Object){
  let renderer = node.renderer.trim() === '' ? "Renderer" : node.renderer;
  let renderClass = RENDERERS.hasOwnProperty(renderer) ?
                      RENDERERS[renderer] :
                      RENDERERS["Renderer"];
  return React.createElement(renderClass,
                             {
                               className: "node",
                               key: node.id, //this should work because a node cannot link to another node twice
                               tag,
                               node,
                               ui
                             },
                             []);
}
