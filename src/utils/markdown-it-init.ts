import markdownit from 'markdown-it'

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true
})

// 扩展渲染器为表格添加 style
// table
md.renderer.rules.table_open = function (tokens: any, idx: number, options: any, env: any, self: any) {
  tokens[idx].attrJoin('style', 'border: 1px solid #ccc;')
  return self.renderToken(tokens, idx, options)
}
// td
md.renderer.rules.td_open = function (tokens: any, idx: number, options: any, env: any, self: any) {
  tokens[idx].attrJoin('style', 'border: 1px solid #ccc; padding: 0 10px;')
  return self.renderToken(tokens, idx, options)
}
// th
md.renderer.rules.th_open = function (tokens: any, idx: number, options: any, env: any, self: any) {
  tokens[idx].attrJoin('style', 'border: 1px solid #ccc; padding: 0 10px;')
  return self.renderToken(tokens, idx, options)
}
export default md
