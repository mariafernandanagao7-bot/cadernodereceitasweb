import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import logoAsset from '@/assets/recipe-logo.asset.json';
import tartAsset from '@/assets/recipe-tart.asset.json';

const logoImage = logoAsset.url;
const tartImage = tartAsset.url;

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Torta Rústica de Frutas Vermelhas — Caderno de Receitas' },
    { name: 'description', content: 'Prepare uma torta rústica de frutas vermelhas com ingredientes ajustáveis, etapas guiadas e temporizadores.' },
    { property: 'og:title', content: 'Torta Rústica de Frutas Vermelhas — Caderno de Receitas' },
    { property: 'og:description', content: 'Receita de torta com massa sablée, frutas frescas e preparo passo a passo.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: RecipePage,
});

const ingredients = [
  { section: 'Massa Sablée Artesanal', items: [
    { amount: 200, unit: 'g', name: 'Farinha de trigo especial', note: '(peneirada)' },
    { amount: 100, unit: 'g', name: 'Manteiga sem sal', note: '(bem gelada em cubinhos)' },
    { amount: 50, unit: 'g', name: 'Açúcar de confeiteiro impalpável' },
    { amount: 1, unit: 'unidade', name: 'Gema de ovo caipira' },
    { amount: 0, unit: '1 pitada', name: 'Sal marinho fino', note: '(a gosto)' },
  ] },
  { section: 'Recheio & Frutas Frescas', items: [
    { amount: 300, unit: 'g', name: 'Frutas vermelhas frescas', note: '(amoras, framboesas, mirtilos)' },
    { amount: 80, unit: 'g', name: 'Açúcar cristal orgânico' },
    { amount: 1, unit: 'colher sopa', name: 'Amido de milho' },
    { amount: 1, unit: 'colher chá', name: 'Extrato puro de baunilha' },
    { amount: 0, unit: 'a gosto', name: 'Folhas frescas de hortelã', note: '(para guarnecer)' },
  ] },
];
const steps = [
  { title: 'Preparo da Massa Sablée', text: <>Em uma tigela ampla, coloque a farinha peneirada e a manteiga gelada em cubos. Com as pontas dos dedos, esfarele delicadamente até obter uma consistência de <strong>areia úmida</strong>. Em seguida, incorpore o açúcar de confeiteiro, a pitada de sal e a gema. Agregue tudo rapidamente sem sovar para manter a crocância delicada.</>, note: 'Dica: Não aqueça a manteiga com as mãos.' },
  { title: 'Descanso e Moldagem', text: <>Modele a massa em formato de disco achatado, envolva em filme plástico e leve à geladeira para firmar por <strong>30 minutos</strong>. Depois de gelada, abra a massa com o rolo entre duas folhas de papel manteiga e forre uma forma canelada de 22cm. Faça furinhos no fundo com um garfo.</>, timer: { minutes: 30, label: 'Tempo de descanso na geladeira', icon: 'timer' }, note: 'Massa bem gelada = textura crocante' },
  { title: 'O Recheio de Frutas Aveludado', text: <>Em uma tigela média, envolva delicadamente as frutas vermelhas frescas com o açúcar cristal, o amido de milho e o extrato de baunilha. O amido garantirá que o suco natural das frutas se transforme em uma calda brilhante e encorpada sem amolecer a crosta. Distribua tudo generosamente sobre a massa crua.</>, note: 'Misture com delicadeza para preservar as frutas' },
  { title: 'Forno e Ponto Dourado', text: <>Asse em forno pré-aquecido a <strong>180°C por aproximadamente 35 minutos</strong>. A borda da torta deve ficar dourada e crocante, e a calda central das frutas deve começar a borbulhar suavemente.</>, timer: { minutes: 35, label: 'Temporizador de Forno (180°C)', icon: 'local_fire_department' }, note: 'Verifique os últimos 5 minutos' },
  { title: 'Finalização e Servir', text: <>Retire do forno e deixe esfriar sobre uma grade por pelo menos 15 minutos antes de desenformar. Guarneça com folhinhas de hortelã fresca e polvilhe uma nuvem suave de açúcar de confeiteiro sobre as bordas. Sirva morna com sorvete de baunilha ou creme chantilly fresco.</>, note: 'Pronta para encantar!' },
];
function Icon({ children, className = '' }: { children?: string | undefined; className?: string }) { return <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{children}</span>; }
function formatQuantity(amount: number, unit: string, servings: number) {
  if (!amount) return unit;
  const n = amount * servings / 4;
  if (unit === 'g') return `${Math.round(n)}g`;
  const rounded = Math.round(n * 10) / 10;
  const whole = Math.floor(rounded);
  const fraction = Math.abs(rounded - whole - .5) < .01 ? `${whole ? `${whole} ` : ''}½` : `${rounded}`;
  return `${fraction} ${unit === 'unidade' ? 'un' : unit}`;
}
function Timer({ minutes, label, icon, notify }: { minutes: number; label: string; icon: string; notify: (message: string) => void }) {
  const [remaining, setRemaining] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setRemaining(previous => Math.max(0, previous - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [running]);
  useEffect(() => { if (remaining === 0 && running) { setRunning(false); notify(`O tempo de ${label.toLowerCase()} terminou!`); } }, [remaining, running, label, notify]);
  const time = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  return <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-primary-border bg-primary-soft/60 p-3.5">
    <div className="flex items-center gap-2"><Icon className="text-primary">{icon}</Icon><span className="text-xs font-semibold">{label}</span></div>
    <div className="flex items-center gap-2"><span className="rounded-lg border border-primary-border bg-card px-2.5 py-1 font-mono text-sm font-bold text-primary">{time}</span>
      <Button variant="primary" onClick={() => setRunning(!running)}><Icon className="text-sm">{running ? 'pause' : 'play_arrow'}</Icon>{running ? 'Pausar' : remaining === minutes * 60 ? `Iniciar ${minutes} min` : 'Continuar'}</Button>
      <Button variant="soft" title="Reiniciar temporizador" aria-label="Reiniciar temporizador" className="h-8 w-8 !p-0" onClick={() => { setRunning(false); setRemaining(minutes * 60); }}>↺</Button>
    </div>
  </div>;
}
function RecipePage() {
  const [servings, setServings] = useState(4);
  const [checked, setChecked] = useState<number[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [nav, setNav] = useState('Minhas Receitas');
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(timeout); }, [toast]);
  const notify = (message: string) => setToast(message);
  const share = async () => { try { if (navigator.share) await navigator.share({ title: document.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); notify('Link da receita copiado!'); } } catch { notify('Não foi possível compartilhar agora.'); } };
  const toggleKitchen = async () => {
    if (kitchen) { await document.exitFullscreen?.(); setKitchen(false); notify('Modo Cozinha desativado'); }
    else { try { await document.documentElement.requestFullscreen?.(); } catch { /* Fullscreen may be unavailable; keep the screen mode active. */ } setKitchen(true); notify('Modo Cozinha ativado'); }
  };
  return <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-40 border-b border-primary-border bg-card/95 backdrop-blur-md"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><img src={logoImage} alt="Logo Caderno de Receitas" className="h-10 w-10 rounded-xl object-contain shadow-sm" /><div><div className="font-heading text-xl font-bold text-primary-dark">Caderno de Receitas</div><span className="block text-xs font-medium text-primary">Cozinha prática & intuitiva</span></div></div>
      <nav aria-label="Navegação principal" className="hidden items-center gap-1 rounded-full border border-primary-border bg-primary-soft/70 p-1.5 md:flex">{['Minhas Receitas','Favoritos','Planejador','Dicas do Chef'].map(item => <Button key={item} variant={nav === item ? 'outline' : 'ghost'} className="!border-0 !px-4 !py-1.5 !text-sm" onClick={() => { setNav(item); if (item !== 'Minhas Receitas') notify(`${item}: continue explorando esta receita`); }}>{item}</Button>)}</nav>
      <Button variant="soft" aria-label="Meu Perfil" title="Meu Perfil" className="!h-10 !w-10 !p-0 !text-sm" onClick={() => notify('Perfil de Usuário: Chef Confeiteiro')}>CR</Button>
    </div></header>
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"><span>Confeitaria Artesanal</span><span>•</span><span>Sobremesas com Frutas</span><span>•</span><span className="flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 normal-case text-primary-dark"><Icon className="text-sm">verified</Icon>Receita Verificada</span></div>
      <div className="recipe-card mb-8 p-6 sm:p-8"><div className="grid items-center gap-8 lg:grid-cols-12"><div className="flex h-full flex-col justify-between lg:col-span-7"><div>
        <h1 className="mb-4 font-heading text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">Torta Rústica de Frutas Vermelhas com Creme</h1>
        <p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg">Uma massa sablée amanteigada que derrete na boca, coberta com framboesas, amoras e mirtilos frescos em calda suave aromática. A sobremesa perfeita para qualquer mesa de celebração.</p>
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['schedule','Preparo','45 min'],['local_fire_department','Forno','35 min'],['equalizer','Dificuldade','Fácil'],['group','Base Padrão','4 pessoas']].map(([icon,label,value]) => <div key={label} className="flex flex-col rounded-2xl border border-primary-border bg-primary-soft/80 p-3"><span className="flex items-center gap-1 text-xs font-semibold text-primary"><Icon className="text-base">{icon}</Icon>{label}</span><span className={`mt-0.5 font-heading text-lg font-bold ${label === 'Dificuldade' ? 'text-success' : 'text-foreground'}`}>{value}</span></div>)}</div></div>
        <div className="flex flex-wrap items-center gap-3 border-t border-primary-border pt-4"><Button variant="soft" onClick={() => { setFavorite(!favorite); notify(favorite ? 'Removida dos favoritos' : 'Receita salva nos favoritos!'); }}><Icon className="text-lg">{favorite ? 'favorite' : 'favorite_border'}</Icon>{favorite ? 'Salva nos Favoritos' : 'Salvar nos Favoritos'}</Button><Button onClick={share}><Icon className="text-lg">share</Icon>Compartilhar</Button><Button variant="soft" className="sm:ml-auto" onClick={toggleKitchen}><Icon className="text-lg">light_mode</Icon>{kitchen ? 'Sair do Modo Cozinha' : 'Modo Cozinha (Tela Ativa)'}</Button></div>
      </div><div className="relative overflow-hidden rounded-2xl shadow-xl lg:col-span-5"><img src={tartImage} alt="Torta Rústica de Frutas Vermelhas fresca" className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1.5 text-xs font-semibold shadow-sm"><span className="h-2 w-2 rounded-full bg-success" />Ingredientes 100% frescos</div></div></div></div>
      <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-12"><section className="flex min-w-0 flex-col gap-6 lg:col-span-5"><div className="recipe-card border-2 border-primary-border bg-primary-soft p-6"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-heading text-base font-bold text-primary-dark"><Icon className="text-primary">tune</Icon>Ajustar Porções</h2><Button variant="ghost" onClick={() => { setServings(4); notify('Porções restauradas para o padrão (4 pessoas).'); }}><Icon className="text-sm">refresh</Icon>Padrão (4)</Button></div>
        <div className="flex items-center justify-between rounded-2xl border border-primary-border bg-card p-3 shadow-sm"><Button variant="soft" aria-label="Diminuir porções" className="!h-12 !w-12 !rounded-xl !p-0 !text-2xl" onClick={() => { setServings(Math.max(1,servings-1)); if (servings === 1) notify('O mínimo é 1 porção.'); }}>−</Button><div className="flex flex-col items-center"><strong className="font-heading text-3xl font-extrabold text-primary-dark">{servings}</strong><span className="text-xs font-semibold uppercase text-primary">pessoas</span><small className="text-[10px] text-muted-foreground">Quantidade calculada</small></div><Button variant="primary" aria-label="Aumentar porções" className="!h-12 !w-12 !rounded-xl !p-0 !text-2xl" onClick={() => setServings(Math.min(30,servings+1))}>+</Button></div><div className="mt-3 flex justify-between gap-2 px-1 text-xs text-primary-dark"><span>Calculado proporcionalmente para <strong>{servings} pessoas</strong></span><span className="whitespace-nowrap rounded-full bg-secondary px-2">• Base: 4</span></div>
      </div><div className="recipe-card p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-primary-border pb-4"><h2 className="flex flex-wrap items-center gap-2 font-heading text-xl font-bold">Ingredientes <span className={`rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${checked.length === 10 ? 'bg-success-soft text-success' : 'bg-primary-soft text-primary-dark'}`}>{checked.length} de 10 marcados</span></h2><Button variant="ghost" onClick={() => setChecked(checked.length === 10 ? [] : Array.from({length:10},(_,i)=>i))}><Icon className="text-base">select_all</Icon>{checked.length === 10 ? 'Desmarcar todos' : 'Marcar todos'}</Button></div>
        {ingredients.map((group, sectionIndex) => <div className="mb-6 last:mb-0" key={group.section}><h3 className="recipe-label mb-3">{group.section}</h3><div className="space-y-3">{group.items.map((item,index) => { const id = sectionIndex * 5 + index; return <label className="ingredient-row" key={item.name}><input type="checkbox" checked={checked.includes(id)} onChange={() => setChecked(checked.includes(id) ? checked.filter(i=>i!==id) : [...checked,id])} /><div className="text-sm"><strong className="mr-1.5 font-mono text-base text-primary">{formatQuantity(item.amount,item.unit,servings)}</strong><span className="ingredient-name font-medium">{item.name}</span>{item.note && <span className={`text-xs text-muted-foreground ${item.name === 'Frutas vermelhas frescas' ? 'mt-0.5 block' : 'ml-1'}`}>{item.note}</span>}</div></label>; })}</div></div>)}
      </div></section><section className="flex min-w-0 flex-col gap-6 lg:col-span-7"><div className="recipe-card p-6"><div className="mb-3 flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-heading text-2xl font-bold">Modo de Preparo Passo a Passo</h2><p className="text-sm text-muted-foreground">Siga cada etapa na ordem para a textura perfeita</p></div><span className="rounded-full border border-primary-border bg-primary-soft px-3 py-1 text-xs font-bold text-primary-dark">{completed.length} de 5 etapas concluídas</span></div><div className="h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${completed.length * 20}%` }} /></div>{completed.length === 5 && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success bg-success-soft p-4"><div><h3 className="text-sm font-bold text-success">🎉 Receita Concluída com Sucesso!</h3><p className="text-xs text-success">Sua Torta Rústica de Frutas Vermelhas está pronta para encantar a mesa.</p></div><Button variant="success" onClick={share}>Compartilhar Foto</Button></div>}</div>
        <div className="space-y-4">{steps.map((step,index) => { const done = completed.includes(index); return <article key={step.title} className={`recipe-card p-6 transition-colors ${done ? 'step-done' : ''}`}><div className="flex items-start gap-4"><div className="step-number flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft font-heading text-lg font-bold text-primary-dark">{index+1}</div><div className="min-w-0 flex-1"><h3 className="mb-2 font-heading text-lg font-bold">{step.title}</h3><p className="mb-4 text-sm leading-relaxed text-muted-foreground">{step.text}</p>{step.timer && <Timer {...step.timer} notify={notify} />}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"><span className={`text-xs ${index === 0 ? 'rounded-lg bg-warning-soft px-2.5 py-1 font-medium text-warning' : 'text-muted-foreground'}`}>{index === 0 && <Icon className="mr-1 align-middle text-sm">tips_and_updates</Icon>}{step.note}</span><Button variant={done ? 'success' : 'outline'} onClick={() => { setCompleted(done ? completed.filter(i=>i!==index) : [...completed,index]); if (!done) notify(`Etapa ${index+1} concluída!`); }}><Icon className="text-base">{done ? 'task_alt' : 'check_circle'}</Icon>{done ? 'Concluída' : 'Marcar etapa'}</Button></div></div></div></article>; })}</div>
      </section></div>
    </main><footer className="mt-16 border-t border-primary-border bg-card py-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8"><div className="flex items-center gap-3"><img src={logoImage} alt="" className="h-6 w-6 object-contain" /><span className="font-heading text-sm font-bold text-primary-dark">Caderno de Receitas Digital</span></div><p className="text-center text-xs text-muted-foreground">Desenvolvido com carinho para entusiastas e amantes da gastronomia.</p><div className="flex gap-4">{['Sobre','Termos','Ajuda'].map(item=><Button key={item} variant="ghost" onClick={()=>notify(item === 'Sobre' ? 'Caderno de Receitas v2.4' : item === 'Termos' ? 'Termos de Uso Culinário' : 'Central de Dúvidas & Suporte')}>{item}</Button>)}</div></div></footer>{toast && <div role="status" className="toast">{toast}</div>}
  </div>;
}
