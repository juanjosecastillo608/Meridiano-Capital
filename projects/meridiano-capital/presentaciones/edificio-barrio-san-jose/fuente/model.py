import os
import json
TC=5694
precio_gs=1_600_000_000
P=precio_gs/TC
renta_m=11_000_000
G=renta_m*12/TC
iva,vac,adm,man=0.05,0.04,0.08,0.05
fijos_gs=6_000_000; F=fijos_gs/TC
ire=0.10
def neto(g):
    pre=g*(1-iva-vac-adm-man)-F
    return pre, pre*(1-ire)
pre,net=neto(G)
def irr(cfs):
    lo,hi=-0.9,1.0
    for _ in range(200):
        m=(lo+hi)/2; v=sum(c/(1+m)**i for i,c in enumerate(cfs))
        if v>0: lo=m
        else: hi=m
    return m
out=dict(P=P,G=G,F=F,pre=pre,net=net,bruta=G/P,neta_pre=pre/P,neta=net/P,veces=P/G,
  iva=G*iva,vac=G*vac,adm=G*adm,man=G*man,ire=pre*ire,net_mes=net/12,
  usd_m2=P/600,costo_nuevo=600*650,pct_costo=P/(600*650),usd_unidad=P/11)
proj={}
for name,gr,val in [('Conservador',.03,.02),('Base',.05,.035),('Optimista',.08,.05)]:
    nets=[neto(G*(1+gr)**k)[1] for k in range(5)]
    V=P*(1+val)**5; ivav=V*0.015
    cfs=[-P]+nets[:4]+[nets[4]+V-ivav]
    proj[name]=dict(nets=nets,V=V,plus=V-P,ivav=ivav,acum=sum(nets),total=V-P-ivav+sum(nets),tir=irr(cfs))
out['proj']=proj
# upside (received projection, not validated)
for k,m in [('act',11e6),('int',8*1.8e6+3e6+1e6),('inf',19.4e6),('sup',19.9e6)]:
    out['up_'+k]=dict(m=m,usd=m/TC,anual=m*12,bruta=m*12/precio_gs,ret=precio_gs/(m*12))
print(json.dumps(out,indent=1))
json.dump(out,open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'model.json'),'w'))
