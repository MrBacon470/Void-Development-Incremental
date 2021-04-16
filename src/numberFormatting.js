import Decimal from './break_eternity.js'

function exponentialFormat(num, precision, mantissa = true) {
	let e = num.log10().floor();
	let m = num.div(Decimal.pow(10, e));
	if(m.toStringWithDecimalPlaces(precision) === 10) {
		m = new Decimal(1);
		e = e.add(1);
	}
	e = commaFormat(e);
	if (mantissa) {
		return m.toStringWithDecimalPlaces(precision)+"e"+e;
	} else {
		return "e"+e;
	}
}

function commaFormat(num, precision) {
	if (num === null || num === undefined) {
		return "NaN";
	}
	if (num.mag < 0.001) {
		return (0).toFixed(precision);
	}
	if (precision === null || precision === undefined) {
		if (num.layer > 1) {
			let firstPart = new Decimal(num);
			firstPart.mag = Math.floor(num.mag);
			let secondPart = new Decimal(num);
			secondPart.layer = 0;
			secondPart.mag = num.mag - firstPart.mag;
			return firstPart.floor().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + secondPart.toStringWithDecimalPlaces(2).substr(1);
		}
		return num.floor().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}
	return num.toStringWithDecimalPlaces(precision).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function regularFormat(num, precision) {
	if (num === null || num === undefined) {
		return "NaN";
	}
	if (num.eq(0)) {
		return (0).toFixed(precision);
	}
	if (num.mag < 0.001) {
		return num.toExponential(precision);
	}
	return num.toStringWithDecimalPlaces(precision);
}

function format(decimal, precision=2,) {
	decimal = new Decimal(decimal);
	if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
		return "NaN";
	}
	if (decimal.sign<0) {
		return "-"+format(decimal.neg(), precision);
	}
	if (decimal.mag === Number.POSITIVE_INFINITY) {
		return "Infinity";
	}
	if (decimal.gte("eeee1000")) {
		const slog = decimal.slog();
		if (slog.gte(1e6)) {
			return "F" + format(slog.floor());
		} else {
			return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0);
		}
	} else if (decimal.gte("1e100000")) {
		return exponentialFormat(decimal, 0, false);
	} else if (decimal.gte("1e1000")) {
		return exponentialFormat(decimal, 0);
	} else if (decimal.gte(1e6)) {
		return exponentialFormat(decimal, precision);
	} else if (decimal.gte(1e3)) {
		return commaFormat(decimal, 0);
	} else {
		return regularFormat(decimal, precision);
	}
}

function formatWhole(decimal) {
	decimal = new Decimal(decimal).floor();
	if (decimal.gte(1e6)) {
		return format(decimal, 2);
	}
	if (decimal.lte(0.98) && !decimal.eq(0)) {
		return format(decimal, 2);
	}
	return format(decimal, 0);
}

function formatTime(s) {
	if (s<60) {
		return format(s)+"s";
	} else if (s<3600) {
		return formatWhole(Math.floor(s/60))+"m "+format(s%60)+"s";
	} else if (s<86400) {
		return formatWhole(Math.floor(s/3600))+"h "+formatWhole(Math.floor(s/60)%60)+"m "+format(s%60)+"s";
	} else if (s<31536000) {
		return formatWhole(Math.floor(s/84600)%365)+"d " + formatWhole(Math.floor(s/3600)%24)+"h "+formatWhole(Math.floor(s/60)%60)+"m "+format(s%60)+"s";
	} else {
		return formatWhole(Math.floor(s/31536000))+"y "+formatWhole(Math.floor(s/84600)%365)+"d " + formatWhole(Math.floor(s/3600)%24)+"h "+formatWhole(Math.floor(s/60)%60)+"m "+format(s%60)+"s";
	}
}

window.format = format;
window.formatWhole = formatWhole;
window.formatTime = formatTime;

export { format, formatWhole, formatTime };
