Decimal.prototype.clone = function() {return this}

const DARK = "#000"
const LIGHT = "#fff"

function E(x) {return new Decimal(x)}

function expPow(a,b) { return Decimal.pow(10,Decimal.max(a,1).log10().add(1).pow(b).sub(1)) }
function revExpPow(a,b) { return Decimal.pow(10,Decimal.max(a,1).log10().add(1).root(b).sub(1)) }

function simpleCost(x,type,...arg) {
  x = E(x)

  switch(type) {
    case "EA": { // a*(1+b*x)*c^x, b > 0, c > 1
      let [base, inc, exp] = arg
      return Decimal.pow(exp, x).mul(Decimal.mul(x, inc).add(1)).mul(base)
    }
    case "EAI": { // inverse of EA
      let [base,increment,exponent] = arg
      let ln = Decimal.ln(exponent)
      return ln.mul(x).mul(Decimal.root(exponent,increment)).div(base).div(increment).lambertw().mul(increment).sub(ln).div(ln).div(increment)
    }
    case "E": {
      let [base, exp] = arg
      return Decimal.pow(exp, x).mul(base)
    }
    case "EI": {
      let [base, exp] = arg
      return Decimal.div(x, base).log(exp)
    }
  }
}

function scale(x, s, p, type, inv=false) {
  x = E(x)
  if (Decimal.lte(x, s)) return x

  switch (type) {
    case "L": // Linear (x-s)*p+s
      return inv ? x.sub(s).div(p).add(s) : x.sub(s).mul(p).add(s)
    case "P": // Power (x/s)^p*s
      return inv ? x.div(s).root(p).mul(s) : x.div(s).pow(p).mul(s)
    case "E1": // Exponential1 p^(x-s)*s
      return inv ? x.div(s).log(p).add(s) : Decimal.pow(p, x.sub(s)).mul(s)
  }
}

Decimal.prototype.scale = function(s, p, type, inv=false) {
  var x = this.clone()
  return scale(x, s, p, type, inv)
}

Decimal.prototype.softcap = function(start, power, mode, dis=false) {
  var x = this.clone()
  if (!dis&&x.gte(start)) {
    if ([0, "pow"].includes(mode)) x = x.div(start).max(1).pow(power).mul(start)
    if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
    if ([2, "exp"].includes(mode)) x = expPow(x.div(start), power).mul(start)
    if ([3, "log"].includes(mode)) x = x.div(start).log(power).add(1).mul(start)
  }
  return x
}

function writeScaled(x, s) {
  if (Decimal.lte(x, s)) return ""
  return color("(Scaled)", "#900")
}

function writeSC(x, s) {
  if (Decimal.lte(x, s)) return ""
  return color("(Softcapped)", "#900")
}

function writeScale(x, s, p, type) {
  x = E(x)
  if (Decimal.lte(x, s)) return ""

  switch (type) {
    case "L": // Linear (x-s)*p+s
      return `Scaling starts at ${format(s, 0)}, Scaling Formula: x = (${format(x, 0)}-${format(s, 0)})*${format(p)}+${format(s, 0)}, x = ${format(scale(x, s, p, type))}<br>`
    case "P": // Power (x/s)^p*s
      return `Scaling starts at ${format(s, 0)}, Scaling Formula: x = (${format(x, 0)}/${format(s, 0)})${superscript(format(p))}*${format(s, 0)}, x = ${format(scale(x, s, p, type))}<br>`
    case "E1": // Exponential1 p^(x-s)*s
      return `Scaling starts at ${format(s, 0)}, Scaling Formula: x = ${format(p)}${superscript(format(x, 0)+"-"+format(s, 0))}*${format(s, 0)}, x = ${format(scale(x, s, p, type))}<br>`
  }
}

function writeSCForm(x, s, p, type, dis=false) {
  x = E(x)
  if (Decimal.lte(x, s)||dis) return ""

  let text = `Softcap starts at ${format(s)}, Softcap formula: x = `

  if (x.gte(s)) {
    if ([0, "pow"].includes(type)) text += `max(x / ${format(s)}, 1)${superscript(format(p))} * ${format(s)}`// x = x.div(start).max(1).pow(power).mul(start)
    if ([1, "mul"].includes(type)) text += `(x - ${format(s)}) / ${format(p)} + ${format(s)}` // x = x.sub(start).div(power).add(start)
    if ([2, "exp"].includes(type)) text += `10${superscript('log'+subscript('10')+'(max('+'x / '+format(s)+', 1) + 1)'+superscript(format(p))+' - 1')} * ${format(s)}`// x = expPow(x.div(start), power).mul(start) // Decimal.pow(10,Decimal.max(a,1).log10().add(1).pow(b).sub(1)) - expPow
    if ([3, "log"].includes(type)) text += `(log${subscript(format(p))}(x / ${format(s)}) + 1) * ${format(s)}`// x = x.div(start).log(power).add(1).mul(start)
  }
  return text
}

function writeLocked(amount, str) {
  return `[UNLOCKS AT ${format(amount)} ${str.toUpperCase()}]`
}

function writeStringCondition(str1, str2, condition) {
  if (condition) return str1
  return str2
}

function writeLog(base, eqn, logColor) {
  return `log${subscript(format(base), logColor)}(${eqn})`
}

function writeExp(exp, eqn, expColor, brackets = false) {
  if (brackets) {
    if (typeof exp == 'string') return `(${eqn})${superscript(exp, expColor)}`
    else return `(${eqn})${superscript(format(exp), expColor)}`
  }
  if (typeof exp == 'string') return `${eqn}${superscript(exp, expColor)}`
  return `${eqn}${superscript(format(exp), expColor)}`
}

function writeRoot(rt, eqn, brackets = false) {
  if (brackets) return `${format(rt)}√(${eqn})`
  return `${format(rt)}√${eqn}`
}

function writeGainPS(gain, time) {
  let gainPS = Decimal.div(gain, time)
  let text = `<br>`
  if (gainPS.lte(1/60)) text += `${format(gainPS.mul(3600))}/hr`
  else if (gainPS.lte(1)) text += `${format(gainPS.mul(60))}/min`
  else text += `${format(gainPS)}/s`
  return text
}

function rowMultipleUnlocked(row) {
  let rowLayers = []
  let a = 0
  for (let layer in layers) {
    if (layers[layer].row == row) rowLayers.push(layer)
  }
  for (let i in rowLayers) {
    let lyr = rowLayers[i]
    a += player[lyr].unlocked
  }
  return (a >= 2)
}

function rowAllUnlocked(row) {
  let rowLayers = []
  let a = 0
  for (let layer in layers) {
    if (layers[layer].row == row) rowLayers.push(layer)
  }
  for (let i in rowLayers) {
    let lyr = rowLayers[i]
    a += player[lyr].unlocked
  }
  return (a == rowLayers.length)
}

function prodOfEff(...effects) {
  let effs = effects
  let totalMult = E(1)
  for (let i in effs) {
    totalMult = totalMult.mul(effs[i])
  }
  return totalMult
}

function sumOfGeometricSeries(n, a, r) {
  [n, a, r] = [E(n), E(a), E(r)]
  if (r.eq(1)) return E(1) // r =/= 1
  if (r.gt(1)) return (a.mul(r.pow(n).sub(1))).div(r.sub(1)) // a(r^n - 1) / (r - 1)
  if (r.lt(1)) return (a.mul(Decimal.sub(1, r.pow(n)))).div(Decimal.sub(1, r)) // a(1 - r^n) / (1 - r)
}