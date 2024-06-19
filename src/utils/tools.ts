export function stringify(object: any) {
  return JSON.stringify(object, null, 2)
}

export function delScriptJsonBlock(content: string) {
  const jsonBlockReg = /<script\s[\w\s]*(name=["']json["']|type=["']application\/json["'])(\s|[\w\s])*>[\s\S]*<\/script>/
  return content.replace(jsonBlockReg, '')
}
