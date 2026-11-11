import { describe, it, expect, beforeAll } from "vitest";
import { leerLibro, type Libro } from "@/import/libro";
import { analizarLibro, type AnalisisLibro } from "@/import/analizar";
import { proponerMapeo, procesar, OPCIONES_DEFAULT } from "@/import/procesar";
import { detectarMes, proponerCampo } from "@/import/diccionario";
import { planillaPrueba } from "../fixtures/planilla";

let libro: Libro;
let analisis: AnalisisLibro;

beforeAll(async () => {
  libro = await leerLibro(await planillaPrueba());
  analisis = analizarLibro(libro);
});

describe("diccionario", () => {
  it("propone campos por sinónimos", () => {
    expect(proponerCampo("Monto Alquiler Actual").campo).toBe("contrato.alquiler");
    expect(proponerCampo("Pago Mes Junio").campo).toBe("periodo.pagoTotal");
    expect(proponerCampo("Pago Expensas Junio").campo).toBe("periodo.expensas");
    expect(proponerCampo("NIS ANDE").campo).toBe("unidad.medidorAnde");
    expect(proponerCampo("Columna rara").campo).toBe("ignorar");
    // columnas reales que NO deben confundirse
    expect(proponerCampo("Monto Factura ANDE").campo).not.toBe("unidad.medidorAnde");
    expect(proponerCampo("Agua Incluido en el valor de las Expensas").campo).not.toBe("periodo.expensas");
    expect(proponerCampo("Impuesto Municipal Incluido en el valor de las Expensas").campo).not.toBe("periodo.expensas");
  });
  it("detecta meses en nombres de hoja y encabezados", () => {
    expect(detectarMes("Estructura Ing DetalladaJunio26")).toEqual({ mes: 6, anio: 2026 });
    expect(detectarMes("Pago Mes Julio")).toEqual({ mes: 7, anio: undefined });
  });
});

describe("análisis del libro", () => {
  it("lee todas las hojas, encabezado, rango de datos, período y metadatos", () => {
    expect(analisis.hojas).toHaveLength(3);
    const t = analisis.hojas[0].tabla!;
    expect(t.filaEncabezado).toBe(10);
    expect(t.filaInicio).toBe(11);
    expect(t.filaFin).toBe(14);
    expect(t.filaTotales).toBe(15);
    expect(t.periodo.valor).toBe("2026-03");
    expect(t.metadatos.filter((m) => m.clave === "edificio")).toHaveLength(2); // celda combinada contada una vez
    expect(t.bloquesNoTabulares.length).toBeGreaterThan(0);
    expect(analisis.hojas[0].totalFormulas).toBeGreaterThan(0);
  });
});

describe("procesamiento y validación", () => {
  it("sin moneda identificada la importación queda bloqueada", () => {
    const inf = procesar(libro, analisis, proponerMapeo(analisis), { ...OPCIONES_DEFAULT, moneda: null });
    expect(inf.bloqueante).toBe(true);
    expect(inf.problemasGenerales.some((p) => p.codigo === "MONEDA_NO_IDENTIFICADA")).toBe(true);
  });

  it("detecta vacantes, inconsistencias, duplicados y hojas copiadas", () => {
    const inf = procesar(libro, analisis, proponerMapeo(analisis), { ...OPCIONES_DEFAULT, moneda: "PYG", tasaIvaControlPct: 5 });
    expect(inf.bloqueante).toBe(false);
    expect(inf.resumen.periodos).toEqual(["2026-03", "2026-04", "2026-05"]);
    expect(inf.resumen.unidadesDetectadas).toBe(4);
    expect(inf.resumen.inquilinosDetectados).toBe(2);
    const codigos = new Set([...inf.problemasGenerales, ...inf.registros.flatMap((r) => r.problemas)].map((p) => p.codigo));
    expect(codigos).toContain("MARCA_OK_SIN_PAGO"); // abril, unidad 3
    expect(codigos).toContain("PERIODO_INCONSISTENTE"); // hoja de mayo con encabezado "Abril"
    expect(codigos).toContain("MEDIDOR_COMPARTIDO"); // mismo NIS en unidades 3 y 4
    expect(codigos).not.toContain("CANTIDAD_UNIDADES_NO_COINCIDE"); // declara 3+1 = 4 y hay 4 filas
    expect(codigos).toContain("PAGO_DUPLICADO_PROBABLE"); // mayo repite el pago de abril de la unidad 2
    const vacantes = inf.registros.filter((r) => r.vacante);
    expect(vacantes.every((r) => r.inquilino === null)).toBe(true);
    const dup = inf.registros.find((r) => r.estado === "DUPLICADO")!;
    expect(dup.periodo).toBe("2026-05");
    expect(dup.unidad.identificador).toBe("2");
  });

  it("advierte cuando la cantidad declarada no coincide con las filas", () => {
    const a2 = structuredClone(analisis);
    a2.hojas[0].tabla!.metadatos = a2.hojas[0].tabla!.metadatos.map((m) => (m.clave === "descripcion" ? { ...m, valor: "Cuenta con un total de 13 departamentos más 1 salón comercial." } : m));
    const inf = procesar(libro, a2, proponerMapeo(a2), { ...OPCIONES_DEFAULT, moneda: "PYG" });
    expect(inf.problemasGenerales.some((p) => p.codigo === "CANTIDAD_UNIDADES_NO_COINCIDE")).toBe(true);
  });

  it("rechaza un campo asignado a dos columnas", () => {
    const mp = proponerMapeo(analisis);
    mp[0].columnas = { ...mp[0].columnas, F: "periodo.expensas", G: "periodo.expensas" };
    const inf = procesar(libro, analisis, mp, { ...OPCIONES_DEFAULT, moneda: "PYG" });
    expect(inf.bloqueante).toBe(true);
    expect(inf.problemasGenerales.some((p) => p.codigo === "CAMPO_MAPEADO_DOS_VECES")).toBe(true);
  });

  it("conserva los períodos originales de cada hoja", () => {
    const inf = procesar(libro, analisis, proponerMapeo(analisis), { ...OPCIONES_DEFAULT, moneda: "PYG" });
    expect(new Set(inf.registros.map((r) => r.periodo))).toEqual(new Set(["2026-03", "2026-04", "2026-05"]));
  });
});
