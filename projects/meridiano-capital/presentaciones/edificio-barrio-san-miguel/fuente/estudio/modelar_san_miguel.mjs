import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const d = JSON.parse(fs.readFileSync(path.join(dir, 'Datos_mercado_San_Miguel.json'), 'utf8'));
const fx = d.fx.pyg_per_usd;
const s = d.subject;
const round = (v) => Math.round((v + Number.EPSILON) * 100) / 100;
const gross = s.monthly_gross_income_pyg;
const costs = s.monthly_expenses_reported_pyg;
const balance = gross - costs;
const scenarios = [
  {id:'base', label:'Flujo actual informado', gross, costs, assumption:'Sin ajuste; ocupación total declarada, no auditada'},
  {id:'conservador', label:'Ingresos -10%; gastos +10%', gross:gross*.9, costs:costs*1.1, assumption:'Pérdida agregada de ingresos, no un número de unidades vacantes; prueba hipotética'},
  {id:'estres', label:'Ingresos -20%; gastos constantes', gross:gross*.8, costs, assumption:'Prueba hipotética; no predicción'},
  {id:'mejora_sensibilidad', label:'Ingresos +10%; gastos +10%', gross:gross*1.1, costs:costs*1.1, assumption:'Solo sensibilidad; incremento no respaldado por comparables, CAPEX y plazo desconocidos'}
];
const prices = [s.asking_price_usd, s.quick_sale_price_usd];
const cases = [];
for (const sc of scenarios) for (const price of prices) {
  const annualGrossUSD=sc.gross*12/fx;
  const annualBalanceUSD=(sc.gross-sc.costs)*12/fx;
  cases.push({
    scenario:sc.id, label:sc.label, assumption:sc.assumption,
    building_purchase_price_usd:price,
    parking_included:false,
    monthly_gross_pyg:round(sc.gross), monthly_expenses_pyg:round(sc.costs),
    monthly_reported_balance_pyg:round(sc.gross-sc.costs),
    annual_gross_usd:round(annualGrossUSD),
    annual_reported_balance_usd:round(annualBalanceUSD),
    gross_yield_pct:round(annualGrossUSD/price*100),
    reported_balance_yield_pct:round(annualBalanceUSD/price*100),
    acquisition_costs_usd:null, capex_usd:null, debt_service_usd:null,
    verified_net_yield_pct:null, irr:null,
    gross_price_to_annual_rent_multiple:round(price/annualGrossUSD),
    hypothetical:sc.id!=='base'
  });
}
const optionalCases = prices.map(price=>{
  const total=price+d.optional_parking.asking_price_usd;
  return {
    building_price_usd:price, optional_parking_price_usd:d.optional_parking.asking_price_usd,
    combined_purchase_price_usd:total,
    assumed_incremental_monthly_parking_income_pyg:0,
    actual_incremental_monthly_parking_income_pyg:null,
    additional_parking_expenses_pyg:null,
    warning:'Caso mecánico sin renta incremental y antes de gastos adicionales del estacionamiento; no es NOI combinado validado',
    gross_yield_no_incremental_income_pct:round(gross*12/fx/total*100),
    building_reported_balance_over_combined_price_pct:round(balance*12/fx/total*100),
    incremental_parking_monthly_gross_to_preserve_building_gross_yield_pyg:round(gross*d.optional_parking.asking_price_usd/price),
    incremental_parking_monthly_operating_balance_to_preserve_building_reported_yield_pyg:round(balance*d.optional_parking.asking_price_usd/price)
  };
});
const normalize = c => {
  const usd=c.currency==='USD'?c.price:c.price/fx;
  const pyg=c.currency==='PYG'?c.price:c.price*fx;
  const area=c.area_m2??c.built_area_m2??null;
  return {...c,price_usd:round(usd),price_pyg:round(pyg),price_usd_per_m2:area?round(usd/area):null,price_pyg_per_m2:area?round(pyg/area):null};
};
const data = {
  schema_version:'1.0.0', analysis_date:d.analysis_date, fx:d.fx,
  definitions:{
    reported_balance:'Ingresos menos gastos declarados; no NOI auditado ni beneficio neto definitivo',
    gross_yield:'Ingreso bruto anual convertido a USD / precio de compra en USD * 100',
    reported_balance_yield:'Saldo anual después de gastos informados convertido a USD / precio de compra * 100',
    price_to_rent:'Precio / renta bruta anual; múltiplo estático, no plazo real de recuperación',
    unknown:'null no equivale a cero',
    optional_parking:'No forma parte del caso base ni de los ingresos actuales'
  },
  operating_summary:{
    monthly_gross_pyg:gross, monthly_expenses_pyg:costs, monthly_reported_balance_pyg:balance,
    annual_gross_pyg:gross*12, annual_expenses_pyg:costs*12, annual_reported_balance_pyg:balance*12,
    monthly_gross_usd:round(gross/fx), monthly_expenses_usd:round(costs/fx),monthly_reported_balance_usd:round(balance/fx),
    annual_gross_usd:round(gross*12/fx), annual_expenses_usd:round(costs*12/fx),annual_reported_balance_usd:round(balance*12/fx),
    reported_expense_ratio_pct:round(costs/gross*100),
    quick_sale_discount_pct:round((prices[0]-prices[1])/prices[0]*100),
    built_price_usd_per_m2:prices.map(price=>({price_usd:price,usd_per_m2:round(price/s.built_area_m2_approx)}))
  },
  building_scenarios:cases,
  optional_parking_scenarios:optionalCases,
  parking_hurdle_sensitivities:[.09,.10,.12].map(rate=>({
    hypothetical_annual_operating_yield_pct:rate*100,
    required_monthly_operating_balance_pyg:round(d.optional_parking.asking_price_usd*rate*fx/12),
    market_rent_estimate:false
  })),
  income_capitalization_sensitivity:{
    is_market_valuation:false,
    rate_market_evidence_available:false,
    description:'Sensibilidad matemática sobre saldo declarado, no tasa de capitalización acreditada',
    rows:[.08,.09,.10,.11,.12].map(rate=>({hypothetical_rate_pct:round(rate*100),implied_price_usd:round(balance*12/fx/rate)}))
  },
  market_conclusions:{
    independently_estimated_market_value_usd:null,
    estimated_market_monthly_rent_pyg:null,
    estimated_monthly_rent_gap_pyg:null,
    recommended_market_publication_price_usd:null,
    asking_price_owner_usd:350000,
    quick_sale_price_owner_usd:290000,
    reason:'Muestra no homologable y rent roll ausente; precios del propietario no equivalen a tasación independiente',
    no_automatic_rent_increase:true
  },
  normalized_rental_comparables:d.rental_comparables.map(normalize),
  normalized_sale_comparables:d.sale_comparables.map(normalize),
  normalized_land_context:d.land_context.map(c=>({...normalize(c),land_price_usd_per_m2:round((c.currency==='USD'?c.price:c.price/fx)/c.land_area_m2)}))
};
const header = ['unit_id','unit_type','bedrooms','bathrooms','area_m2','area_basis','rent_amount','rent_currency','monthly_rent_pyg','iva_included','expensas_amount','expensas_currency','services_included','furnished','parking_included','occupancy_status','lease_start','lease_end','reajuste','monthly_collected_pyg','source_document','notes'];
const unit = (unit_id, unit_type, bedrooms, notes) => ({unit_id,unit_type,bedrooms,occupancy_status:'ocupada_segun_propietario',notes});
const units = [
  ...Array.from({length:7},(_,i)=>unit(`DEP-${String(i+1).padStart(2,'0')}`,'departamento','','Asignar dormitorios 1 2 o 4 solo con confirmacion individual')),
  ...Array.from({length:3},(_,i)=>unit(`MON-${String(i+1).padStart(2,'0')}`,'monoambiente',0,'Adicional a los siete departamentos')),
  unit('COM-01','salon_comercial','','Frente'),
  unit('CAS-01','casa_independiente',2,'Parte posterior')
];
assert.equal(s.unit_mix.reduce((a,c)=>a+c.count,0),12);
assert.equal(units.length,12);
assert.equal(gross-costs,17300000);
assert.equal(d.optional_parking.included_in_current_building_rents,false);
assert.equal(d.optional_parking.base_investment_includes_parking,false);
assert.equal(cases.find(c=>c.scenario==='base'&&c.building_purchase_price_usd===350000).gross_yield_pct,11.93);
assert.equal(cases.find(c=>c.scenario==='base'&&c.building_purchase_price_usd===290000).reported_balance_yield_pct,12.45);
assert.equal(optionalCases[0].combined_purchase_price_usd,470000);
assert.equal(optionalCases[1].combined_purchase_price_usd,410000);
assert.equal(data.market_conclusions.independently_estimated_market_value_usd,null);
for(const c of [...d.rental_comparables,...d.sale_comparables,...d.land_context]) assert.ok(c.url.startsWith('https://'));
fs.writeFileSync(path.join(dir,'Modelo_inversion_San_Miguel.json'),JSON.stringify(data,null,2)+'\n');
const csvPath=path.join(dir,'Rent_roll_San_Miguel_para_completar.csv');
const csvCell=v=>{const t=String(v??'');return /[",\n]/.test(t)?`"${t.replaceAll('"','""')}"`:t;};
if(!fs.existsSync(csvPath)) fs.writeFileSync(csvPath,[header,...units.map(u=>header.map(k=>u[k]??''))].map(row=>row.map(csvCell).join(',')).join('\n')+'\n');
else console.log('Rent roll existente conservado sin sobrescribir.');
console.log(JSON.stringify({validation:'OK',units:units.length,rental_records:d.rental_comparables.length,sale_records:d.sale_comparables.length,base_cases:cases.filter(c=>c.scenario==='base'),parking_cases:optionalCases},null,2));
