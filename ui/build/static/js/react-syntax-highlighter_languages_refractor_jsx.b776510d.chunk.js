"use strict";(self.webpackChunkcreate_react_app=self.webpackChunkcreate_react_app||[]).push([[4657],{765:function(t){function e(t){!function(t){var e=t.util.clone(t.languages.javascript);t.languages.jsx=t.languages.extend("markup",e),t.languages.jsx.tag.pattern=/<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^}]*\}|[^{}])*\}|[^{}])+\}))?|\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}))*\s*\/?)?>/i,t.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/i,t.languages.jsx.tag.inside["attr-value"].pattern=/=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i,t.languages.jsx.tag.inside.tag.inside["class-name"]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,t.languages.insertBefore("inside","attr-name",{spread:{pattern:/\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}/,inside:{punctuation:/\.{3}|[{}.]/,"attr-value":/\w+/}}},t.languages.jsx.tag),t.languages.insertBefore("inside","attr-value",{script:{pattern:/=(\{(?:\{(?:\{[^}]*\}|[^}])*\}|[^}])+\})/i,inside:{"script-punctuation":{pattern:/^=(?={)/,alias:"punctuation"},rest:t.languages.jsx},alias:"language-javascript"}},t.languages.jsx.tag);var n=function t(e){return e?"string"===typeof e?e:"string"===typeof e.content?e.content:e.content.map(t).join(""):""},a=function e(a){for(var s=[],g=0;g<a.length;g++){var i=a[g],o=!1;if("string"!==typeof i&&("tag"===i.type&&i.content[0]&&"tag"===i.content[0].type?"</"===i.content[0].content[0].content?s.length>0&&s[s.length-1].tagName===n(i.content[0].content[1])&&s.pop():"/>"===i.content[i.content.length-1].content||s.push({tagName:n(i.content[0].content[1]),openedBraces:0}):s.length>0&&"punctuation"===i.type&&"{"===i.content?s[s.length-1].openedBraces++:s.length>0&&s[s.length-1].openedBraces>0&&"punctuation"===i.type&&"}"===i.content?s[s.length-1].openedBraces--:o=!0),(o||"string"===typeof i)&&s.length>0&&0===s[s.length-1].openedBraces){var p=n(i);g<a.length-1&&("string"===typeof a[g+1]||"plain-text"===a[g+1].type)&&(p+=n(a[g+1]),a.splice(g+1,1)),g>0&&("string"===typeof a[g-1]||"plain-text"===a[g-1].type)&&(p=n(a[g-1])+p,a.splice(g-1,1),g--),a[g]=new t.Token("plain-text",p,null,p)}i.content&&"string"!==typeof i.content&&e(i.content)}};t.hooks.add("after-tokenize",(function(t){"jsx"!==t.language&&"tsx"!==t.language||a(t.tokens)}))}(t)}t.exports=e,e.displayName="jsx",e.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_jsx.b776510d.chunk.js.map