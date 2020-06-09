import hljs from 'highlight.js'

export const highlight = (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="hljs" style="background: #f8fafc; border-radius: 10px;padding: 14px;"><code>' +
                hljs.highlight(lang, str, true).value +
            '</code></pre>'
        } catch (_) {}
    }
  
    return '<pre class="hljs" style="background: #f8fafc; border-radius: 10px;padding: 15px;"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
}