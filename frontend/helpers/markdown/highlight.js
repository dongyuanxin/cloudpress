import hljs from 'highlight.js'
import { md } from './index'

export const highlight = (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="hljs"><code>' +
                hljs.highlight(lang, str, true).value +
            '</code></pre>'
        } catch (_) {}
    }
  
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
}