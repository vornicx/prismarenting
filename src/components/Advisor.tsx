"use client";
import { useState } from "react";

const questions = [
  {q:"¿Para quién es el renting?", options:["Particular","Autónomo","Empresa","Flota"]},
  {q:"¿Qué presupuesto mensual tienes?", options:["Hasta 300 €","300–450 €","450–650 €","Más de 650 €"]},
  {q:"¿Cuántos kilómetros haces al año?", options:["Menos de 10.000","10.000–15.000","15.000–25.000","Más de 25.000"]},
  {q:"¿Cuándo necesitas el coche?", options:["Lo antes posible","En 1–2 meses","En 3–6 meses","Estoy comparando"]},
];
export default function Advisor(){
 const [step,setStep]=useState(0); const [selected,setSelected]=useState<string[]>([]);
 const pick=(v:string)=>{const next=[...selected];next[step]=v;setSelected(next)};
 return <section className="advisor" id="asesor"><div className="shell advisor-grid">
  <div className="advisor-intro"><span className="eyebrow">Asesor PRISMA</span><h2>No hace falta que sepas qué coche quieres.</h2><p>Dinos cómo lo vas a usar. En menos de un minuto tendremos la información necesaria para que un asesor pueda buscar alternativas útiles de verdad.</p></div>
  <div className="wizard"><div className="wizard-progress">Paso {step+1} de {questions.length}</div><h3>{questions[step].q}</h3><div className="wizard-options">{questions[step].options.map(o=><button className={selected[step]===o?"selected":""} onClick={()=>pick(o)} key={o}>{o}</button>)}</div><div className="wizard-actions"><button disabled={!step} onClick={()=>setStep(Math.max(0,step-1))}>Atrás</button>{step<questions.length-1?<button disabled={!selected[step]} onClick={()=>setStep(step+1)}>Continuar →</button>:<button className="button dark" disabled={!selected[step]}>Recibir propuestas</button>}</div></div>
 </div></section>
}
