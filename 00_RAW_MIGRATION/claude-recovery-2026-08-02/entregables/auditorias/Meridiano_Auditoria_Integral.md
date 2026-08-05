# Auditoría Integral del Sistema Meridiano Capital

> **Propósito:** revisar todo lo desarrollado antes de avanzar al Investment Memorandum, para no arrastrar errores. Incluye el análisis de Urbannit (presentación recién aportada). Fecha: 31-jul-2026.
>
> **Veredicto general:** la base es sólida y coherente en lo esencial (dos modelos, hurdle+carry, firma canónica, P04, tarifario). Los hallazgos se concentran en dos focos — (1) la identidad y relación de **Urbannit** con Meridiano, y (2) la reconciliación de los números de **renta temporal**. Ninguno invalida lo hecho; todos son corregibles antes del IM. Se clasifican por severidad: 🔴 decisión de fondo · 🟠 corrección · 🟡 aclaración.

---

## 1. URBANNIT — el bloque que más necesita definición

La presentación de Urbannit es excelente en diseño y tono (coherente con la paleta petróleo/dorado y el registro Sabio+Gobernante). Pero, cruzada con el resto del sistema, abre preguntas de fondo:

**🔴 1.1 — ¿Qué es Urbannit respecto de Meridiano?** En la memoria y las skills, Urbannit es la **sub-marca de Meridiano** para renta temporal. Pero la presentación se sostiene sola, como una **agencia independiente**, sin una sola mención a Meridiano. Hay que decidir y unificar: ¿Urbannit es (a) sub-marca de Meridiano operada por vos, (b) un operador aliado independiente, o (c) una sociedad aparte? De esto depende cómo se presenta, quién factura y cómo se estructura la comisión.

**🔴 1.2 — La historia de origen no coincide.** La presentación dice *"Empezamos en 2010, en Barcelona... +15 años de experiencia... sistema probado en Barcelona"*. Pero el deck de Coinversión (Red de Aliados) describe al *"Operador de Renta Temporal · 20+ años"*. Son dos relatos distintos: Barcelona/15 años vs 20+ años. ¿Es la misma persona/entidad? ¿El origen Barcelona es real o narrativo? Hay que fijar una sola historia verdadera y usarla en todos lados.

**🟠 1.3 — El email es un gmail.** `Urbannit4@gmail.com` desentona con una marca premium y con el dominio profesional de Meridiano (`@meridianocapital.net`). Además "Urbannit4" (¿por qué 4?) resta seriedad. Recomendación: `hola@urbannit.com` o `urbannit@meridianocapital.net`.

**🟡 1.4 — Teléfono compartido.** Urbannit usa el mismo número que vos (+595 982 853 111). Coherente si sos el operador; pero si Urbannit se presenta como agencia con 15 años de historia propia en Barcelona, compartir tu teléfono personal es una señal que un inversor atento nota.

**🟡 1.5 — Identidad visual sin codificar.** El logo "URBAN**N**IT" (con la N estilizada) y su sistema no están en la skill de marca todavía. Si Urbannit es sub-marca, su identidad debe vivir en `meridiano-capital-identity` como sistema derivado.

---

## 2. RENTA TEMPORAL — reconciliar los números (no hay error, hay ambigüedad)

**🟡 2.1 — Bruto vs neto sin etiquetar.** Tres fuentes, tres números que hay que alinear:
- Deck de Coinversión: renta temporal *"bruta de referencia 10-16%+"*.
- P07 (skill): piso *"temporal depto 14%"* — sin etiquetar si es bruto o neto.
- Urbannit (presentación): *"8-11% rentabilidad **neta**"* y caso real *9,3% neto*.

No se contradicen si se leen bien: temporal **bruto 10-16%** → **neto 8-11%** (tras opex, limpieza, channel manager, comisiones de plataforma). Pero P07 no dice si su 14% es bruto o neto. **Corrección:** etiquetar explícitamente cada piso de P07 como bruto o neto, y dejar escrito que Urbannit comunica NETO al propietario.

**🟠 2.2 — Ocupación: mi codificación quedó corta para Urbannit.** Codifiqué en P07 *"ocupación realista 55-65%, nunca 90%+"*. La presentación de Urbannit muestra: media de mercado 53-69%, **gestionadas top 76-88%+**, techo 92,8%. Mi número era el de mercado sin gestión — correcto para underwriting conservador, pero subestima una propiedad **gestionada por Urbannit**. **Corrección:** distinguir dos ocupaciones en P07 — *underwriting base* (55-69%, conservador) vs *Urbannit-gestionada estabilizada* (76-88%). El "90%+" queda como techo aspiracional, nunca como base.

**🟡 2.3 — ADR consistente.** Urbannit $50/noche; modelos Austria/hotel $40-45. Rango coherente; sin acción.

---

## 3. MARCA Y CONTACTO — estado

**✅ 3.1** Firma canónica de Meridiano homogénea (módulo 16): Juan José Castillo · Operador Técnico y Legal de Inversiones Inmobiliarias. Consistente en decks y P04.
**✅ 3.2** Contacto Meridiano correcto y unificado: `juancastillo@meridianocapital.net` · +595 982 853 111.
**✅ 3.3** Origen de clientes: Europa, Argentina, Brasil, Chile (Alemania eliminado). Consistente.
**🟠 3.4** Falta definir la **firma/cierre de Urbannit** (¿usa la firma canónica de Meridiano, o una propia?). Depende de 1.1.

---

## 4. MODELOS DE NEGOCIO Y DECISIONES — estado

**✅ 4.1** Dos modelos (A Individual / B Coinversión) separados y puros. Consistente.
**✅ 4.2** Decisión hurdle+carry registrada y aplicada. Consistente en deck, memoria, plan.
**✅ 4.3** Cartera A/B y las tres categorías de gestión (pasiva / Urbannit temporal / operación hotelera) codificadas en P07.
**🟠 4.4** Los manuales de financiamiento y estructuración siguen en paradigma **TIR objetivo** — hay que reencuadrarlos a hurdle+carry (ya diagnosticado; el waterfall de la prelación ya está, falta el split 80/20).
**🟡 4.5** El deck de Coinversión menciona *"aliado de 20+ años"* en renta temporal — mismo punto que 1.2 (¿ese aliado es Urbannit?). Alinear una vez resuelto 1.1/1.2.

---

## 5. ERRORES YA DETECTADOS — registro de estado

| Ítem | Hallazgo | Estado |
|---|---|---|
| Modelo fideicomiso (939 fórmulas) | Inviable + errores de lógica (hard cost s/vendible, retorno obra inflado, IRE 25%) | Auditado. Pendiente: reconstruir con datos reales |
| Manual de compliance | Genérico/argentino (UIF/CUIT/DNI) | ✅ Reconstruido como P04 (Paraguay) |
| Planilla Edificio Austria | IVA/IRE definidos pero no aplicados; Airbnb inconsistente entre hojas | Advertido (modelo de cliente, no de Meridiano) |
| Planilla Hotel Plaza Uruguaya | "Inversión total" omite los $370k del edificio; opex no restado | Advertido; reencuadre a Urbannit 100% Airbnb propuesto |
| Config rentabilidad | Administración 8%→10%, alquiler 1→0,5 mes | ✅ Corregido |
| Manuales financiamiento/estructuración | TIR objetivo | Pendiente: reencuadrar a hurdle+carry |

---

## 6. DECISIONES QUE NECESITO DE VOS (para cerrar la auditoría)

1. **Urbannit — relación con Meridiano:** ¿sub-marca de Meridiano, operador aliado independiente, o sociedad aparte? *(define todo lo demás de Urbannit)*
2. **Urbannit — historia de origen:** ¿el origen Barcelona/2010/15 años es real? ¿Es la misma entidad que el "aliado de 20+ años" del deck? Fijemos una sola versión verdadera.
3. **Urbannit — email profesional:** ¿migramos de `Urbannit4@gmail.com` a un dominio propio?
4. **P07 — pisos bruto o neto:** ¿los pisos por tipología son brutos o netos? (para etiquetarlos y que no choquen con el 8-11% neto de Urbannit)

---

## 7. PLAN DE CORRECCIÓN (orden sugerido)

1. Resolver las 4 decisiones de la sección 6.
2. Con eso: **estandarizar Urbannit** en la skill de marca (identidad, historia única, contacto, firma) y **etiquetar/ajustar P07** (bruto/neto + ocupación base vs gestionada).
3. Reencuadrar los manuales de financiamiento y estructuración a hurdle+carry.
4. Recién entonces: **estructura e índice del Investment Memorandum**, y construirlo sobre un proyecto real del pipeline.
5. En paralelo, cuando quieras: **instrucciones de web para Claude Design** bajo el manual de marca.

*Documento de trabajo interno — Meridiano Capital.*
