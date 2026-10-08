"""Números, montos y fechas en letras (español, convención notarial paraguaya)."""
import datetime as dt
from decimal import Decimal, ROUND_HALF_UP

_U = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
      'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
      'veinte', 'veintiún', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
      'veintisiete', 'veintiocho', 'veintinueve']
_D = {30: 'treinta', 40: 'cuarenta', 50: 'cincuenta', 60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa'}
_C = {100: 'ciento', 200: 'doscientos', 300: 'trescientos', 400: 'cuatrocientos', 500: 'quinientos',
      600: 'seiscientos', 700: 'setecientos', 800: 'ochocientos', 900: 'novecientos'}
MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
         'octubre', 'noviembre', 'diciembre']


def _menor_mil(n):
    if n < 30:
        return _U[n]
    if n < 100:
        d, u = divmod(n, 10)
        return _D[d * 10] + ('' if u == 0 else ' y ' + _U[u])
    if n == 100:
        return 'cien'
    c, r = divmod(n, 100)
    return _C[c * 100] + ('' if r == 0 else ' ' + _menor_mil(r))


def letras(n):
    """Entero no negativo < 1.000.000 en letras. 'un' apocopado (un mes, veintiún días)."""
    n = int(n)
    if n < 1000:
        s = _menor_mil(n)
    else:
        m, r = divmod(n, 1000)
        s = ('mil' if m == 1 else _menor_mil(m) + ' mil') + ('' if r == 0 else ' ' + _menor_mil(r))
    return s


def letras_pleno(n):
    """Como letras() pero 'uno' al final (para cantidades sueltas: '(1) uno')."""
    s = letras(n)
    if s.endswith('veintiún'):
        return s[:-len('veintiún')] + 'veintiuno'
    return s[:-2] + 'uno' if s.endswith('un') else s


def redondear(x, nd=2):
    return Decimal(str(x)).quantize(Decimal(1).scaleb(-nd), rounding=ROUND_HALF_UP)


def monto(x):
    """Decimal → '950', '1.900', '31,67' (miles con punto, decimales con coma)."""
    x = redondear(x)
    ent, dec = divmod(x, 1)
    s = f'{int(ent):,}'.replace(',', '.')
    return s if dec == 0 else s + ',' + f'{x:.2f}'.split('.')[1]


def monto_letras(x, moneda='USD'):
    nombre = {'USD': 'dólares estadounidenses', 'PYG': 'guaraníes'}.get(moneda, moneda)
    x = redondear(x)
    ent, dec = divmod(x, 1)
    s = f'{nombre} {letras(int(ent))}'
    if dec:
        s += f' con {int(dec * 100):02d}/100'
    return s


def fecha_larga(d: dt.date):
    return f'{d.day} de {MESES[d.month - 1]} de {d.year}'


def anio_letras(y):
    return letras_pleno(y)


def fecha_comparecencia(d: dt.date):
    """'a los 7 (siete) días del mes de septiembre del año dos mil veintiséis'."""
    dia = 'al 1 (primer) día' if d.day == 1 else f'a los {d.day} ({letras_pleno(d.day)}) días'
    return f'{dia} del mes de {MESES[d.month - 1]} del año {anio_letras(d.year)}'


def fecha_cierre(d: dt.date):
    """'a los 7 días del mes de septiembre del año dos mil veintiséis'."""
    dia = 'al 1 día' if d.day == 1 else f'a los {d.day} días'
    return f'{dia} del mes de {MESES[d.month - 1]} del año {anio_letras(d.year)}'


def sumar_meses(d: dt.date, meses: int):
    y, m = divmod(d.month - 1 + meses, 12)
    y += d.year
    m += 1
    import calendar
    return dt.date(y, m, min(d.day, calendar.monthrange(y, m)[1]))
