["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/dom/asserts.js"],"~:js","goog.provide(\"goog.dom.asserts\");\ngoog.require(\"goog.asserts\");\ngoog.dom.asserts.assertIsLocation = function(o) {\n  if (goog.asserts.ENABLE_ASSERTS) {\n    var win = goog.dom.asserts.getWindow_(o);\n    if (win) {\n      if (!o || !(o instanceof win.Location) && o instanceof win.Element) {\n        goog.asserts.fail(\"Argument is not a Location (or a non-Element mock); got: %s\", goog.dom.asserts.debugStringForType_(o));\n      }\n    }\n  }\n  return o;\n};\ngoog.dom.asserts.assertIsElementType_ = function(o, typename) {\n  if (goog.asserts.ENABLE_ASSERTS) {\n    var win = goog.dom.asserts.getWindow_(o);\n    if (win && typeof win[typename] != \"undefined\") {\n      if (!o || !(o instanceof win[typename]) && (o instanceof win.Location || o instanceof win.Element)) {\n        goog.asserts.fail(\"Argument is not a %s (or a non-Element, non-Location mock); \" + \"got: %s\", typename, goog.dom.asserts.debugStringForType_(o));\n      }\n    }\n  }\n  return o;\n};\ngoog.dom.asserts.assertIsHTMLAnchorElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLAnchorElement\");\n};\ngoog.dom.asserts.assertIsHTMLButtonElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLButtonElement\");\n};\ngoog.dom.asserts.assertIsHTMLLinkElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLLinkElement\");\n};\ngoog.dom.asserts.assertIsHTMLImageElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLImageElement\");\n};\ngoog.dom.asserts.assertIsHTMLAudioElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLAudioElement\");\n};\ngoog.dom.asserts.assertIsHTMLVideoElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLVideoElement\");\n};\ngoog.dom.asserts.assertIsHTMLInputElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLInputElement\");\n};\ngoog.dom.asserts.assertIsHTMLTextAreaElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLTextAreaElement\");\n};\ngoog.dom.asserts.assertIsHTMLCanvasElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLCanvasElement\");\n};\ngoog.dom.asserts.assertIsHTMLEmbedElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLEmbedElement\");\n};\ngoog.dom.asserts.assertIsHTMLFormElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLFormElement\");\n};\ngoog.dom.asserts.assertIsHTMLFrameElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLFrameElement\");\n};\ngoog.dom.asserts.assertIsHTMLIFrameElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLIFrameElement\");\n};\ngoog.dom.asserts.assertIsHTMLObjectElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLObjectElement\");\n};\ngoog.dom.asserts.assertIsHTMLScriptElement = function(o) {\n  return goog.dom.asserts.assertIsElementType_(o, \"HTMLScriptElement\");\n};\ngoog.dom.asserts.debugStringForType_ = function(value) {\n  if (goog.isObject(value)) {\n    try {\n      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);\n    } catch (e) {\n      return \"\\x3cobject could not be stringified\\x3e\";\n    }\n  } else {\n    return value === undefined ? \"undefined\" : value === null ? \"null\" : typeof value;\n  }\n};\ngoog.dom.asserts.getWindow_ = function(o) {\n  try {\n    var doc = o && o.ownerDocument;\n    var win = doc && (doc.defaultView || doc.parentWindow);\n    win = win || goog.global;\n    if (win.Element && win.Location) {\n      return win;\n    }\n  } catch (ex) {\n  }\n  return null;\n};\n","~:source","// Copyright 2017 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\ngoog.provide('goog.dom.asserts');\n\ngoog.require('goog.asserts');\n\n/**\n * @fileoverview Custom assertions to ensure that an element has the appropriate\n * type.\n *\n * Using a goog.dom.safe wrapper on an object on the incorrect type (via an\n * incorrect static type cast) can result in security bugs: For instance,\n * g.d.s.setAnchorHref ensures that the URL assigned to the .href attribute\n * satisfies the SafeUrl contract, i.e., is safe to dereference as a hyperlink.\n * However, the value assigned to a HTMLLinkElement's .href property requires\n * the stronger TrustedResourceUrl contract, since it can refer to a stylesheet.\n * Thus, using g.d.s.setAnchorHref on an (incorrectly statically typed) object\n * of type HTMLLinkElement can result in a security vulnerability.\n * Assertions of the correct run-time type help prevent such incorrect use.\n *\n * In some cases, code using the DOM API is tested using mock objects (e.g., a\n * plain object such as {'href': url} instead of an actual Location object).\n * To allow such mocking, the assertions permit objects of types that are not\n * relevant DOM API objects at all (for instance, not Element or Location).\n *\n * Note that instanceof checks don't work straightforwardly in older versions of\n * IE, or across frames (see,\n * http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object,\n * http://stackoverflow.com/questions/26248599/instanceof-htmlelement-in-iframe-is-not-element-or-object).\n *\n * Hence, these assertions may pass vacuously in such scenarios. The resulting\n * risk of security bugs is limited by the following factors:\n *  - A bug can only arise in scenarios involving incorrect static typing (the\n *    wrapper methods are statically typed to demand objects of the appropriate,\n *    precise type).\n *  - Typically, code is tested and exercised in multiple browsers.\n */\n\n/**\n * Asserts that a given object is a Location.\n *\n * To permit this assertion to pass in the context of tests where DOM APIs might\n * be mocked, also accepts any other type except for subtypes of {!Element}.\n * This is to ensure that, for instance, HTMLLinkElement is not being used in\n * place of a Location, since this could result in security bugs due to stronger\n * contracts required for assignments to the href property of the latter.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!Location}\n */\ngoog.dom.asserts.assertIsLocation = function(o) {\n  if (goog.asserts.ENABLE_ASSERTS) {\n    var win = goog.dom.asserts.getWindow_(o);\n    if (win) {\n      if (!o || (!(o instanceof win.Location) && o instanceof win.Element)) {\n        goog.asserts.fail(\n            'Argument is not a Location (or a non-Element mock); got: %s',\n            goog.dom.asserts.debugStringForType_(o));\n      }\n    }\n  }\n  return /** @type {!Location} */ (o);\n};\n\n\n/**\n * Asserts that a given object is either the given subtype of Element\n * or a non-Element, non-Location Mock.\n *\n * To permit this assertion to pass in the context of tests where DOM\n * APIs might be mocked, also accepts any other type except for\n * subtypes of {!Element}.  This is to ensure that, for instance,\n * HTMLScriptElement is not being used in place of a HTMLImageElement,\n * since this could result in security bugs due to stronger contracts\n * required for assignments to the src property of the latter.\n *\n * The DOM type is looked up in the window the object belongs to.  In\n * some contexts, this might not be possible (e.g. when running tests\n * outside a browser, cross-domain lookup). In this case, the\n * assertions are skipped.\n *\n * @param {?Object} o The object whose type to assert.\n * @param {string} typename The name of the DOM type.\n * @return {!Element} The object.\n * @private\n */\n// TODO(bangert): Make an analog of goog.dom.TagName to correctly handle casts?\ngoog.dom.asserts.assertIsElementType_ = function(o, typename) {\n  if (goog.asserts.ENABLE_ASSERTS) {\n    var win = goog.dom.asserts.getWindow_(o);\n    if (win && typeof win[typename] != 'undefined') {\n      if (!o ||\n          (!(o instanceof win[typename]) &&\n           (o instanceof win.Location || o instanceof win.Element))) {\n        goog.asserts.fail(\n            'Argument is not a %s (or a non-Element, non-Location mock); ' +\n                'got: %s',\n            typename, goog.dom.asserts.debugStringForType_(o));\n      }\n    }\n  }\n  return /** @type {!Element} */ (o);\n};\n\n/**\n * Asserts that a given object is a HTMLAnchorElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not of type Location nor a subtype\n * of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLAnchorElement}\n */\ngoog.dom.asserts.assertIsHTMLAnchorElement = function(o) {\n  return /** @type {!HTMLAnchorElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLAnchorElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLButtonElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLButtonElement}\n */\ngoog.dom.asserts.assertIsHTMLButtonElement = function(o) {\n  return /** @type {!HTMLButtonElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLButtonElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLLinkElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLLinkElement}\n */\ngoog.dom.asserts.assertIsHTMLLinkElement = function(o) {\n  return /** @type {!HTMLLinkElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLLinkElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLImageElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLImageElement}\n */\ngoog.dom.asserts.assertIsHTMLImageElement = function(o) {\n  return /** @type {!HTMLImageElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLImageElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLAudioElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLAudioElement}\n */\ngoog.dom.asserts.assertIsHTMLAudioElement = function(o) {\n  return /** @type {!HTMLAudioElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLAudioElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLVideoElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLVideoElement}\n */\ngoog.dom.asserts.assertIsHTMLVideoElement = function(o) {\n  return /** @type {!HTMLVideoElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLVideoElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLInputElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLInputElement}\n */\ngoog.dom.asserts.assertIsHTMLInputElement = function(o) {\n  return /** @type {!HTMLInputElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLInputElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLTextAreaElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLTextAreaElement}\n */\ngoog.dom.asserts.assertIsHTMLTextAreaElement = function(o) {\n  return /** @type {!HTMLTextAreaElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLTextAreaElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLCanvasElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLCanvasElement}\n */\ngoog.dom.asserts.assertIsHTMLCanvasElement = function(o) {\n  return /** @type {!HTMLCanvasElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLCanvasElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLEmbedElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLEmbedElement}\n */\ngoog.dom.asserts.assertIsHTMLEmbedElement = function(o) {\n  return /** @type {!HTMLEmbedElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLEmbedElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLFormElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLFormElement}\n */\ngoog.dom.asserts.assertIsHTMLFormElement = function(o) {\n  return /** @type {!HTMLFormElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLFormElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLFrameElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLFrameElement}\n */\ngoog.dom.asserts.assertIsHTMLFrameElement = function(o) {\n  return /** @type {!HTMLFrameElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLFrameElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLIFrameElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLIFrameElement}\n */\ngoog.dom.asserts.assertIsHTMLIFrameElement = function(o) {\n  return /** @type {!HTMLIFrameElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLIFrameElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLObjectElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLObjectElement}\n */\ngoog.dom.asserts.assertIsHTMLObjectElement = function(o) {\n  return /** @type {!HTMLObjectElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLObjectElement'));\n};\n\n/**\n * Asserts that a given object is a HTMLScriptElement.\n *\n * To permit this assertion to pass in the context of tests where elements might\n * be mocked, also accepts objects that are not a subtype of Element.\n *\n * @param {?Object} o The object whose type to assert.\n * @return {!HTMLScriptElement}\n */\ngoog.dom.asserts.assertIsHTMLScriptElement = function(o) {\n  return /** @type {!HTMLScriptElement} */ (\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLScriptElement'));\n};\n\n/**\n * Returns a string representation of a value's type.\n *\n * @param {*} value An object, or primitive.\n * @return {string} The best display name for the value.\n * @private\n */\ngoog.dom.asserts.debugStringForType_ = function(value) {\n  if (goog.isObject(value)) {\n    try {\n      return value.constructor.displayName || value.constructor.name ||\n          Object.prototype.toString.call(value);\n    } catch (e) {\n      return '<object could not be stringified>';\n    }\n  } else {\n    return value === undefined ? 'undefined' :\n                                 value === null ? 'null' : typeof value;\n  }\n};\n\n/**\n * Gets window of element.\n * @param {?Object} o\n * @return {?Window}\n * @private\n * @suppress {strictMissingProperties} ownerDocument not defined on Object\n */\ngoog.dom.asserts.getWindow_ = function(o) {\n  try {\n    var doc = o && o.ownerDocument;\n    // This can throw “Blocked a frame with origin \"chrome-extension://...\" from\n    // accessing a cross-origin frame” in Chrome extension.\n    var win =\n        doc && /** @type {?Window} */ (doc.defaultView || doc.parentWindow);\n    win = win || /** @type {!Window} */ (goog.global);\n    // This can throw “Permission denied to access property \"Element\" on\n    // cross-origin object”.\n    if (win.Element && win.Location) {\n      return win;\n    }\n  } catch (ex) {\n  }\n  return null;\n};\n","~:compiled-at",1611538338288,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.dom.asserts.js\",\n\"lineCount\":93,\n\"mappings\":\"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\",\n\"sources\":[\"goog/dom/asserts.js\"],\n\"sourcesContent\":[\"// Copyright 2017 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\ngoog.provide('goog.dom.asserts');\\n\\ngoog.require('goog.asserts');\\n\\n/**\\n * @fileoverview Custom assertions to ensure that an element has the appropriate\\n * type.\\n *\\n * Using a goog.dom.safe wrapper on an object on the incorrect type (via an\\n * incorrect static type cast) can result in security bugs: For instance,\\n * g.d.s.setAnchorHref ensures that the URL assigned to the .href attribute\\n * satisfies the SafeUrl contract, i.e., is safe to dereference as a hyperlink.\\n * However, the value assigned to a HTMLLinkElement's .href property requires\\n * the stronger TrustedResourceUrl contract, since it can refer to a stylesheet.\\n * Thus, using g.d.s.setAnchorHref on an (incorrectly statically typed) object\\n * of type HTMLLinkElement can result in a security vulnerability.\\n * Assertions of the correct run-time type help prevent such incorrect use.\\n *\\n * In some cases, code using the DOM API is tested using mock objects (e.g., a\\n * plain object such as {'href': url} instead of an actual Location object).\\n * To allow such mocking, the assertions permit objects of types that are not\\n * relevant DOM API objects at all (for instance, not Element or Location).\\n *\\n * Note that instanceof checks don't work straightforwardly in older versions of\\n * IE, or across frames (see,\\n * http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object,\\n * http://stackoverflow.com/questions/26248599/instanceof-htmlelement-in-iframe-is-not-element-or-object).\\n *\\n * Hence, these assertions may pass vacuously in such scenarios. The resulting\\n * risk of security bugs is limited by the following factors:\\n *  - A bug can only arise in scenarios involving incorrect static typing (the\\n *    wrapper methods are statically typed to demand objects of the appropriate,\\n *    precise type).\\n *  - Typically, code is tested and exercised in multiple browsers.\\n */\\n\\n/**\\n * Asserts that a given object is a Location.\\n *\\n * To permit this assertion to pass in the context of tests where DOM APIs might\\n * be mocked, also accepts any other type except for subtypes of {!Element}.\\n * This is to ensure that, for instance, HTMLLinkElement is not being used in\\n * place of a Location, since this could result in security bugs due to stronger\\n * contracts required for assignments to the href property of the latter.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!Location}\\n */\\ngoog.dom.asserts.assertIsLocation = function(o) {\\n  if (goog.asserts.ENABLE_ASSERTS) {\\n    var win = goog.dom.asserts.getWindow_(o);\\n    if (win) {\\n      if (!o || (!(o instanceof win.Location) && o instanceof win.Element)) {\\n        goog.asserts.fail(\\n            'Argument is not a Location (or a non-Element mock); got: %s',\\n            goog.dom.asserts.debugStringForType_(o));\\n      }\\n    }\\n  }\\n  return /** @type {!Location} */ (o);\\n};\\n\\n\\n/**\\n * Asserts that a given object is either the given subtype of Element\\n * or a non-Element, non-Location Mock.\\n *\\n * To permit this assertion to pass in the context of tests where DOM\\n * APIs might be mocked, also accepts any other type except for\\n * subtypes of {!Element}.  This is to ensure that, for instance,\\n * HTMLScriptElement is not being used in place of a HTMLImageElement,\\n * since this could result in security bugs due to stronger contracts\\n * required for assignments to the src property of the latter.\\n *\\n * The DOM type is looked up in the window the object belongs to.  In\\n * some contexts, this might not be possible (e.g. when running tests\\n * outside a browser, cross-domain lookup). In this case, the\\n * assertions are skipped.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @param {string} typename The name of the DOM type.\\n * @return {!Element} The object.\\n * @private\\n */\\n// TODO(bangert): Make an analog of goog.dom.TagName to correctly handle casts?\\ngoog.dom.asserts.assertIsElementType_ = function(o, typename) {\\n  if (goog.asserts.ENABLE_ASSERTS) {\\n    var win = goog.dom.asserts.getWindow_(o);\\n    if (win && typeof win[typename] != 'undefined') {\\n      if (!o ||\\n          (!(o instanceof win[typename]) &&\\n           (o instanceof win.Location || o instanceof win.Element))) {\\n        goog.asserts.fail(\\n            'Argument is not a %s (or a non-Element, non-Location mock); ' +\\n                'got: %s',\\n            typename, goog.dom.asserts.debugStringForType_(o));\\n      }\\n    }\\n  }\\n  return /** @type {!Element} */ (o);\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLAnchorElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not of type Location nor a subtype\\n * of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLAnchorElement}\\n */\\ngoog.dom.asserts.assertIsHTMLAnchorElement = function(o) {\\n  return /** @type {!HTMLAnchorElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLAnchorElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLButtonElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLButtonElement}\\n */\\ngoog.dom.asserts.assertIsHTMLButtonElement = function(o) {\\n  return /** @type {!HTMLButtonElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLButtonElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLLinkElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLLinkElement}\\n */\\ngoog.dom.asserts.assertIsHTMLLinkElement = function(o) {\\n  return /** @type {!HTMLLinkElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLLinkElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLImageElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLImageElement}\\n */\\ngoog.dom.asserts.assertIsHTMLImageElement = function(o) {\\n  return /** @type {!HTMLImageElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLImageElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLAudioElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLAudioElement}\\n */\\ngoog.dom.asserts.assertIsHTMLAudioElement = function(o) {\\n  return /** @type {!HTMLAudioElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLAudioElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLVideoElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLVideoElement}\\n */\\ngoog.dom.asserts.assertIsHTMLVideoElement = function(o) {\\n  return /** @type {!HTMLVideoElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLVideoElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLInputElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLInputElement}\\n */\\ngoog.dom.asserts.assertIsHTMLInputElement = function(o) {\\n  return /** @type {!HTMLInputElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLInputElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLTextAreaElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLTextAreaElement}\\n */\\ngoog.dom.asserts.assertIsHTMLTextAreaElement = function(o) {\\n  return /** @type {!HTMLTextAreaElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLTextAreaElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLCanvasElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLCanvasElement}\\n */\\ngoog.dom.asserts.assertIsHTMLCanvasElement = function(o) {\\n  return /** @type {!HTMLCanvasElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLCanvasElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLEmbedElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLEmbedElement}\\n */\\ngoog.dom.asserts.assertIsHTMLEmbedElement = function(o) {\\n  return /** @type {!HTMLEmbedElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLEmbedElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLFormElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLFormElement}\\n */\\ngoog.dom.asserts.assertIsHTMLFormElement = function(o) {\\n  return /** @type {!HTMLFormElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLFormElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLFrameElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLFrameElement}\\n */\\ngoog.dom.asserts.assertIsHTMLFrameElement = function(o) {\\n  return /** @type {!HTMLFrameElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLFrameElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLIFrameElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLIFrameElement}\\n */\\ngoog.dom.asserts.assertIsHTMLIFrameElement = function(o) {\\n  return /** @type {!HTMLIFrameElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLIFrameElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLObjectElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLObjectElement}\\n */\\ngoog.dom.asserts.assertIsHTMLObjectElement = function(o) {\\n  return /** @type {!HTMLObjectElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLObjectElement'));\\n};\\n\\n/**\\n * Asserts that a given object is a HTMLScriptElement.\\n *\\n * To permit this assertion to pass in the context of tests where elements might\\n * be mocked, also accepts objects that are not a subtype of Element.\\n *\\n * @param {?Object} o The object whose type to assert.\\n * @return {!HTMLScriptElement}\\n */\\ngoog.dom.asserts.assertIsHTMLScriptElement = function(o) {\\n  return /** @type {!HTMLScriptElement} */ (\\n      goog.dom.asserts.assertIsElementType_(o, 'HTMLScriptElement'));\\n};\\n\\n/**\\n * Returns a string representation of a value's type.\\n *\\n * @param {*} value An object, or primitive.\\n * @return {string} The best display name for the value.\\n * @private\\n */\\ngoog.dom.asserts.debugStringForType_ = function(value) {\\n  if (goog.isObject(value)) {\\n    try {\\n      return value.constructor.displayName || value.constructor.name ||\\n          Object.prototype.toString.call(value);\\n    } catch (e) {\\n      return '<object could not be stringified>';\\n    }\\n  } else {\\n    return value === undefined ? 'undefined' :\\n                                 value === null ? 'null' : typeof value;\\n  }\\n};\\n\\n/**\\n * Gets window of element.\\n * @param {?Object} o\\n * @return {?Window}\\n * @private\\n * @suppress {strictMissingProperties} ownerDocument not defined on Object\\n */\\ngoog.dom.asserts.getWindow_ = function(o) {\\n  try {\\n    var doc = o && o.ownerDocument;\\n    // This can throw \\u201cBlocked a frame with origin \\\"chrome-extension://...\\\" from\\n    // accessing a cross-origin frame\\u201d in Chrome extension.\\n    var win =\\n        doc && /** @type {?Window} */ (doc.defaultView || doc.parentWindow);\\n    win = win || /** @type {!Window} */ (goog.global);\\n    // This can throw \\u201cPermission denied to access property \\\"Element\\\" on\\n    // cross-origin object\\u201d.\\n    if (win.Element && win.Location) {\\n      return win;\\n    }\\n  } catch (ex) {\\n  }\\n  return null;\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"dom\",\"asserts\",\"assertIsLocation\",\"goog.dom.asserts.assertIsLocation\",\"o\",\"ENABLE_ASSERTS\",\"win\",\"getWindow_\",\"Location\",\"Element\",\"fail\",\"debugStringForType_\",\"assertIsElementType_\",\"goog.dom.asserts.assertIsElementType_\",\"typename\",\"assertIsHTMLAnchorElement\",\"goog.dom.asserts.assertIsHTMLAnchorElement\",\"assertIsHTMLButtonElement\",\"goog.dom.asserts.assertIsHTMLButtonElement\",\"assertIsHTMLLinkElement\",\"goog.dom.asserts.assertIsHTMLLinkElement\",\"assertIsHTMLImageElement\",\"goog.dom.asserts.assertIsHTMLImageElement\",\"assertIsHTMLAudioElement\",\"goog.dom.asserts.assertIsHTMLAudioElement\",\"assertIsHTMLVideoElement\",\"goog.dom.asserts.assertIsHTMLVideoElement\",\"assertIsHTMLInputElement\",\"goog.dom.asserts.assertIsHTMLInputElement\",\"assertIsHTMLTextAreaElement\",\"goog.dom.asserts.assertIsHTMLTextAreaElement\",\"assertIsHTMLCanvasElement\",\"goog.dom.asserts.assertIsHTMLCanvasElement\",\"assertIsHTMLEmbedElement\",\"goog.dom.asserts.assertIsHTMLEmbedElement\",\"assertIsHTMLFormElement\",\"goog.dom.asserts.assertIsHTMLFormElement\",\"assertIsHTMLFrameElement\",\"goog.dom.asserts.assertIsHTMLFrameElement\",\"assertIsHTMLIFrameElement\",\"goog.dom.asserts.assertIsHTMLIFrameElement\",\"assertIsHTMLObjectElement\",\"goog.dom.asserts.assertIsHTMLObjectElement\",\"assertIsHTMLScriptElement\",\"goog.dom.asserts.assertIsHTMLScriptElement\",\"goog.dom.asserts.debugStringForType_\",\"value\",\"isObject\",\"constructor\",\"displayName\",\"name\",\"Object\",\"prototype\",\"toString\",\"call\",\"e\",\"undefined\",\"goog.dom.asserts.getWindow_\",\"doc\",\"ownerDocument\",\"defaultView\",\"parentWindow\",\"global\",\"ex\"]\n}\n"]