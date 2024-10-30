Decimal.prototype.clone = function() {return this}

function E(x) {return new Decimal(x)}

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

function writeLocked(amount, str) {
  return `[UNLOCKS AT ${format(amount)} ${str.toUpperCase()}]`
}

function writeStringCondition(str1, str2, condition) {
  if (condition) return str1
  return str2
}

function writeLog(base, eqn) {
  return `log${subscript(base)}(${eqn})`
}

function writeExp(exp, eqn, brackets = false) {
  if (brackets) return `(${eqn})${superscript(exp)}`
  return `${eqn}${superscript(exp)}`
}