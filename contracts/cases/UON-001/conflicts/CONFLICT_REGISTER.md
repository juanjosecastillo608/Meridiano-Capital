# UON-001 — CONFLICT REGISTER
Migrado desde `UON-001_DISCOVERY_REPORT.md`, Sección 8 (Step 4 del `contracts/V2_IMPLEMENTATION_BLUEPRINT.md`). Mismo contenido, sin re-analizar — se agrega `Estado` formal (catálogo en `contracts/config/`) y, en `CONFLICT-002`, una observación de Fase 1 que ya se había verificado pero nunca se había escrito en ningún documento (se preserva acá para no perderla).

**Regla dura (Sección 14/18 del prompt maestro V2):** ningún conflicto se resuelve eligiendo una fuente arbitrariamente. Los tres quedan `OPEN` hasta que una acción externa (respuesta del arquitecto o del vendedor) los cierre — Claude no decide cuál dato es el correcto.

**Estados:** `OPEN` · `INVESTIGATING` · `RESOLVED` · `ACCEPTED` (se documenta la discrepancia pero se decide convivir con ella) · `SUPERSEDED`.

---

## CONFLICT-001 — Cantidad total de cocheras/motos del edificio
**Dato:** total de cocheras y motos del Edificio UON Calathea.

| Fuente | Valor |
|---|---|
| `Edificio Solar- Planos Aprobados.pdf` (planta baja, escala 1/50) | **19 autos, 7 motos** |
| `EDIFICIO UON CALATHEA- PLANTA BAJApdf.pdf` (planta baja, escala 1/100, numerada 01–15 + M01–M06) | **15 autos, 6 motos** |
| `_Planilla de Copopiedad...pdf` / fotos de planilla | **14 autos (E01–E14) + 6 motos (M01–M06)** |

**Diferencia:** tres cifras distintas entre tres documentos técnicos, ninguna coincide con otra.
**Impacto:** no afecta directamente a la Cochera N°10 (consistente como E10 en las tres fuentes que la mencionan — ver FACT-003/004), pero cuestiona cuál plano de planta baja es el vigente y la confiabilidad general del archivo "Edificio Solar" como fuente actual.
**Causa posible:** el archivo "Edificio Solar" podría corresponder a una etapa anterior del proyecto, con más cocheras en el diseño original que las que terminaron construyéndose (nombre de archivo y escala distintos a los otros dos planos, que sí coinciden en nomenclatura "UON Calathea").
**Acción requerida:** solicitar al arquitecto/estudio (Zulmira Fernández, según Planilla) confirmación de cuál es el plano de planta baja definitivo y aprobado, y aclarar el origen y vigencia del archivo "Solar".
**Responsable:** Meridiano Capital (coordinación técnica) → Vendedor/Estudio de arquitectura.
**Estado:** `OPEN`
**Resolución:** —

---

## CONFLICT-002 — Nombre de calle transversal del predio
**Dato:** nombre de la calle transversal a Prof. Manuel Riquelme, en el predio del edificio.

| Fuente | Calle transversal declarada |
|---|---|
| `Edificio Solar- Planos Aprobados.pdf`, página 1 (planta baja) | "Emilio Da Silva Lovera" |
| `Edificio Solar- Planos Aprobados.pdf`, página 3 (planta de terraza) | "Cecilio Da Silva Lovera" — **⚠️ observación de Fase 1, no registrada antes:** el mismo archivo PDF usa dos nombres distintos en dos láminas distintas, lo que sugiere error de tipeo/plantilla más que dos edificios distintos |
| `Cómputo Métrico...pdf` | "Cecilio Da Silva Lovera" |
| `_Planilla de Copopiedad...pdf` | "Calle Cecilio Da Silva Lovera" |
| `Construcción.pdf` (Resolución 334) | "Prof. Dr. Cirilo Caceres Zorrilla" (calle distinta a las anteriores) |
| Boleto (ambas versiones) | "calle Profesor Manuel Riquelme número 1444" (sin mencionar la transversal) |

**Diferencia:** "Emilio" vs. "Cecilio" (probable error de tipeo del mismo nombre) + un tercer nombre no relacionado textualmente ("Cirilo Caceres Zorrilla") en la Resolución municipal.
**Impacto:** bajo/documental — no afecta la identificación de la cuenta catastral (coincide en todas las fuentes, FACT-005), pero es una inconsistencia formal que debería aclararse antes de escriturar.
**Causa posible:** "Emilio"/"Cecilio" es casi con certeza el mismo nombre mal tipeado en una de las dos láminas del plano "Solar" — la coincidencia de 3 fuentes en "Cecilio" lo hace más probable como el nombre correcto. "Cirilo Caceres Zorrilla" podría ser la misma calle con nombre distinto (común en Asunción) o una calle realmente distinta — no se debe asumir.
**Acción requerida:** confirmar con el estudio de arquitectura o la Municipalidad el nombre correcto de la calle transversal, y si "Cirilo Caceres Zorrilla" es la misma calle que "(C/C)ecilio Da Silva Lovera".
**Responsable:** Meridiano Capital → Vendedor/Estudio de arquitectura.
**Estado:** `OPEN` — riesgo documental bajo.
**Resolución:** —

---

## CONFLICT-003 — Nombre del proyecto en un documento técnico ("Solar" vs. "UON Calathea")
**Dato:** identidad del proyecto al que corresponde `Edificio Solar- Planos Aprobados.pdf`.

**Diferencia:** el archivo corresponde, por titular (ADESA E.A.S.), dirección y cuenta catastral (15-0411-27, FACT-005), al mismo inmueble que el resto del expediente — pero el nombre de archivo/proyecto difiere de "UON Calathea".
**Impacto:** bajo si se confirma que es el mismo proyecto en una etapa de denominación anterior; sería un impacto documental relevante si en realidad hay dos desarrollos cuyos planos se mezclaron por error.
**Causa posible:** nombre comercial o de proyecto anterior del mismo edificio (hipótesis razonable, no confirmada).
**Acción requerida:** confirmación expresa del vendedor de que "Solar" y "UON Calathea" son el mismo proyecto en distintas etapas de denominación.
**Responsable:** Meridiano Capital → Vendedor.
**Estado:** `OPEN` — pendiente de confirmación simple.
**Resolución:** —
