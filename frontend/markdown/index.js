import Markdownit from 'markdown-it'
import { highlight } from './highlight';
import { plugins } from './plugin'

const md = Markdownit({
    highlight
})

plugins.forEach((plugin) => md.use(...plugin))

export { md }