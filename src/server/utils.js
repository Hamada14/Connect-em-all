function substituteParams(str, params) {
  for(let i = 0; i < params.length; i++) {
    str = str.replace("{" + i + "}", params[i])
  }
  return str
}

module.exports = {
  substituteParams
}