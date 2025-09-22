
const { useEffect, useMemo, useState, Fragment } = React;
const root = ReactDOM.createRoot(document.getElementById('root'));

const STATUSES = ["Planned","In Progress","Blocked","Done"];
const COLORS = ["indigo","emerald","rose","amber","sky","violet","slate"];

const uid = () => Math.random().toString(36).slice(2,9);
const colorClass = (c) => c ? `bg-${c}-500` : "bg-zinc-200";

function initialPhases(){
  return [
    { id: "phase-init", title: "Инициация", blocks: [
      { id:"b1", title:"Contract Review", notes:"Выявить риски, сроки, платежи", color:"indigo", status:"Planned" },
      { id:"b2", title:"Obligations Register", notes:"Реестр обязательств", color:"emerald", status:"Planned" },
      { id:"b3", title:"Training", notes:"Обучение команды по условиям", color:"sky", status:"Planned" },
      { id:"b4", title:"Календарь обязательств", notes:"Milestones vs contract", color:"amber", status:"Planned" },
      { id:"b5", title:"Документооборот", notes:"Система переписки/архива", color:"slate", status:"Planned" },
      { id:"b6", title:"Команда и RACI", notes:"Подбор ролей, Charter, kick-off", color:"violet", status:"Planned" },
    ]},
    { id: "phase-plan", title: "Планирование", blocks: [
      { id:"b7", title:"Интеграция дат", notes:"Контрактные даты в графике", color:"indigo" },
      { id:"b8", title:"Change Mgmt", notes:"Процедура вариаций", color:"rose" },
      { id:"b9", title:"Claim Mgmt", notes:"Процедура претензий", color:"slate" },
      { id:"b10", title:"График платежей", notes:"Условия акцепта", color:"emerald" },
      { id:"b11", title:"Уведомления", notes:"О сроках/нарушениях", color:"amber" },
      { id:"b12", title:"Compliance", notes:"Юр./регуляторные требования", color:"sky" },
    ]},
    { id: "phase-exec", title: "Реализация", blocks: [
      { id:"b13", title:"Мониторинг", notes:"Сроки/объём/качество", color:"emerald" },
      { id:"b14", title:"Реестр изменений", notes:"Влияние на цену/срок", color:"indigo" },
      { id:"b15", title:"Claims", notes:"Уведомления, переговоры", color:"rose" },
      { id:"b16", title:"Платежи", notes:"Документы/соответствие", color:"amber" },
      { id:"b17", title:"Корреспонденция", notes:"Журнал писем", color:"slate" },
      { id:"b18", title:"Отчётность", notes:"Регулярные отчёты", color:"sky" },
      { id:"b19", title:"Субподрядчики", notes:"Соответствие EPC", color:"violet" },
    ]},
    { id: "phase-close", title: "Закрытие", blocks: [
      { id:"b20", title:"Приёмка/документы", notes:"Deliverables, dossiers", color:"sky" },
      { id:"b21", title:"Фин. закрытие", notes:"Расчёты, гарантии", color:"emerald" },
      { id:"b22", title:"Урегулирование claims", notes:"Закрыть споры", color:"rose" },
      { id:"b23", title:"Closure Report", notes:"Итоговый отчёт", color:"indigo" },
      { id:"b24", title:"Lessons Learned", notes:"Что улучшить", color:"violet" },
      { id:"b25", title:"Архив", notes:"Передача пакета", color:"slate" },
    ]},
  ];
}

const defaultLibrary = [
  { id:"lib-1", title:"Risk Workshop", notes:"Сессия рисков" },
  { id:"lib-2", title:"КПЭ/KPI", notes:"Метрики контракта" },
  { id:"lib-3", title:"Supplier Onboarding", notes:"Ввод субов" },
  { id:"lib-4", title:"QA/QC Plan", notes:"Качество" },
  { id:"lib-5", title:"HSE пакет", notes:"Требования HSE" },
  { id:"lib-6", title:"Бюджет отклонений", notes:"Contingency" },
];

function LegoBlock({ block, onClick }){
  return (
    <div className={`select-none rounded-2xl p-3 shadow-sm ring-2 ring-black/10 ${colorClass(block.color)} text-white`}
         onClick={onClick}
         draggable={false}>
      <div className="font-semibold text-sm leading-tight">{block.title}</div>
      {block.notes && <div className="text-xs opacity-85 mt-1 line-clamp-2">{block.notes}</div>}
      <div className="mt-2 flex items-center gap-2 text-[10px] opacity-90">
        {block.owner && <span className="px-1.5 py-0.5 rounded bg-white/20">{block.owner}</span>}
        {block.status && <span className="px-1.5 py-0.5 rounded bg-white/20">{block.status}</span>}
        {block.due && <span className="px-1.5 py-0.5 rounded bg-white/20">{new Date(block.due).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}

function EditDrawer({ open, onClose, block, onSave }){
  const [draft, setDraft] = React.useState(block);
  React.useEffect(()=> setDraft(block), [block]);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-4 shadow-2xl max-h-[80vh] overflow-auto">
        <div className="h-1 w-12 bg-zinc-300 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Редактирование блока</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-full border">Закрыть</button>
        </div>
        {draft && (
          <div className="grid grid-cols-1 gap-3 mt-4">
            <label className="grid gap-1">
              <span className="text-sm">Название</span>
              <input className="border rounded-xl px-3 py-2" value={draft.title} onChange={(e)=>setDraft({...draft,title:e.target.value})} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Заметки</span>
              <textarea className="border rounded-xl px-3 py-2" rows={3} value={draft.notes||""} onChange={(e)=>setDraft({...draft,notes:e.target.value})} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm">Владелец</span>
                <input className="border rounded-xl px-3 py-2" value={draft.owner||""} onChange={(e)=>setDraft({...draft,owner:e.target.value})} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">Срок</span>
                <input type="date" className="border rounded-xl px-3 py-2" value={draft.due||""} onChange={(e)=>setDraft({...draft,due:e.target.value})} />
              </label>
            </div>
            <label className="grid gap-1">
              <span className="text-sm">Статус</span>
              <select className="border rounded-xl px-3 py-2" value={draft.status||"Planned"} onChange={(e)=>setDraft({...draft,status:e.target.value})}>
                {STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Цвет</span>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={()=>setDraft({...draft,color:c})} className={`h-7 w-7 rounded-full border bg-${c}-500`} />
                ))}
              </div>
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl border">Отмена</button>
              <button onClick={()=>onSave(draft)} className="px-4 py-2 rounded-xl bg-black text-white">Сохранить</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Library({ onAdd }){
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(defaultLibrary);
  const filtered = useMemo(()=> items.filter(i => i.title.toLowerCase().includes(query.toLowerCase())),[query, items]);
  return (
    <div className="p-3">
      <div className="text-sm font-semibold mb-2">Библиотека блоков</div>
      <input placeholder="Поиск блока" className="w-full border rounded-xl px-3 py-2 mb-3" value={query} onChange={(e)=>setQuery(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        {filtered.map(b => (
          <button key={b.id} onClick={()=> onAdd({ ...b, id: uid(), color: COLORS[Math.floor(Math.random()*COLORS.length)] })} className={`text-left rounded-2xl p-3 border hover:shadow bg-sky-500 text-white`}>
            <div className="text-sm font-semibold">{b.title}</div>
            {b.notes && <div className="text-xs opacity-90">{b.notes}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Simple persistent store
function usePhases(){
  const [phases, setPhases] = useState(()=>{
    try {
      const saved = localStorage.getItem("epc-phases");
      return saved ? JSON.parse(saved) : initialPhases();
    } catch(e){
      return initialPhases();
    }
  });
  useEffect(()=>{
    localStorage.setItem("epc-phases", JSON.stringify(phases));
  }, [phases]);
  return [phases, setPhases];
}

// Initialize SortableJS on a list container
function useSortableList(ref, onUpdate){
  useEffect(()=>{
    if(!ref.current) return;
    const el = ref.current;
    const sortable = new Sortable(el, {
      group: 'blocks',
      animation: 150,
      ghostClass: 'opacity-50',
      dragClass: 'ring-2 ring-black',
      onEnd: (evt) => {
        onUpdate(evt);
      }
    });
    return () => sortable.destroy();
  }, [ref, onUpdate]);
}

function App(){
  const [phases, setPhases] = usePhases();
  const [layout, setLayout] = useState("board");
  const [editTarget, setEditTarget] = useState(null);
  const [jsonOpen, setJsonOpen] = useState(false);

  function addPhase(){
    setPhases(prev => [...prev, { id: `phase-${uid()}`, title: `Новая фаза`, blocks: [] }]);
  }
  function addBlock(phaseId){
    const b = { id: uid(), title: "Новый блок", notes: "", color: COLORS[Math.floor(Math.random()*COLORS.length)], status: "Planned" };
    setPhases(prev => prev.map(p => p.id===phaseId ? ({...p, blocks: [...p.blocks, b]}) : p));
  }
  function deleteBlock(phaseId, id){
    setPhases(prev => prev.map(p => p.id===phaseId ? ({...p, blocks: p.blocks.filter(b=>b.id!==id)}) : p));
  }
  function editBlock(phaseId, block){
    setEditTarget({ phaseId, block });
  }
  function saveEdit(draft){
    if(!editTarget) return;
    setPhases(prev => prev.map(p => p.id===editTarget.phaseId ? ({...p, blocks: p.blocks.map(b => b.id===draft.id ? draft : b)}) : p));
    setEditTarget(null);
  }
  function clearAll(){
    if(confirm("Очистить план?")) setPhases(initialPhases());
  }
  function exportJson(){
    const data = JSON.stringify(phases, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "epc-planner.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  function importJson(file){
    const reader = new FileReader();
    reader.onload = () => {
      try { setPhases(JSON.parse(reader.result)); }
      catch(e){ alert("Некорректный JSON"); }
    };
    reader.readAsText(file);
  }
  function addFromLibrary(block){
    setPhases(prev => prev.map((p, i) => i===0 ? ({...p, blocks: [...p.blocks, { ...block, id: uid() }]}) : p));
  }

  // Create refs and Sortable handlers for each phase
  const containers = phases.map(()=> React.useRef(null));
  phases.forEach((phase, idx)=>{
    useSortableList(containers[idx], (evt) => {
      const fromIdx = idx;
      const toIdx = containers.findIndex(ref => ref.current === evt.to);
      const fromPhase = phases[fromIdx];
      const toPhase = phases[toIdx];
      const itemId = evt.item.getAttribute('data-id');

      const item = fromPhase.blocks.find(b => b.id === itemId);
      if(!item) return;

      const newFromBlocks = fromPhase.blocks.filter(b => b.id !== itemId);
      const newToBlocks = [...toPhase.blocks];
      newToBlocks.splice(evt.newIndex, 0, item);

      setPhases(prev => prev.map((p, i)=> {
        if(i===fromIdx) return {...p, blocks: newFromBlocks};
        if(i===toIdx) return {...p, blocks: newToBlocks};
        return p;
      }));
    });
  });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-400" />
            <div>
              <div className="font-semibold">EPC Playbook — Lego Planner</div>
              <div className="text-xs text-zinc-500">Соберите свой план из блоков</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl border" onClick={()=>setLayout(l=> l==='board'?'list':'board')}>{layout==='board'?'Вид: Доска':'Вид: Список'}</button>
            <button className="px-3 py-1.5 rounded-xl border" onClick={addPhase}>+ Фаза</button>
            <button className="px-3 py-1.5 rounded-xl border" onClick={clearAll}>Сброс</button>
            <button className="px-3 py-1.5 rounded-xl border" onClick={exportJson}>Экспорт JSON</button>
            <label className="px-3 py-1.5 rounded-xl border cursor-pointer">
              Импорт JSON
              <input type="file" accept="application/json" className="hidden" onChange={(e)=> e.target.files[0] && importJson(e.target.files[0])} />
            </label>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 grid md:grid-cols-[1fr_320px] gap-4">
        <section className="min-h-[60vh]">
          {layout === 'board' ? (
            <div className="flex gap-4 overflow-x-auto pb-8">
              {phases.map((phase, i) => (
                <div key={phase.id} className="flex-1 min-w-[280px]">
                  <div className="flex items-center justify-between mb-2">
                    <input className="font-semibold text-base bg-transparent rounded px-2 py-1 hover:bg-zinc-100" value={phase.title}
                           onChange={(e)=> setPhases(prev=> prev.map(p=> p.id===phase.id ? ({...p, title:e.target.value}) : p))} />
                    <button className="px-2 py-1 rounded-lg border" onClick={()=>addBlock(phase.id)}>+ Блок</button>
                  </div>
                  <div className="rounded-2xl border bg-white p-3 grid gap-3" ref={containers[i]}>
                    {phase.blocks.map((b, idx) => (
                      <div key={b.id} data-id={b.id} className="relative group">
                        <LegoBlock block={b} onClick={()=> editBlock(phase.id, b)} />
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={()=>deleteBlock(phase.id, b.id)} className="h-7 w-7 rounded-full bg-white border shadow">×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {phases.map(phase => (
                <div key={phase.id} className="rounded-2xl border bg-white p-3">
                  <div className="flex items-center justify-between mb-2">
                    <input className="font-semibold text-base bg-transparent rounded px-2 py-1 hover:bg-zinc-100" value={phase.title}
                           onChange={(e)=> setPhases(prev=> prev.map(p=> p.id===phase.id ? ({...p, title:e.target.value}) : p))} />
                    <button className="px-2 py-1 rounded-lg border" onClick={()=>addBlock(phase.id)}>+ Блок</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.blocks.map(b => (
                      <div key={b.id} className="rounded-xl border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{b.title}</div>
                          <div className={`h-3 w-3 rounded-full ${colorClass(b.color)}`} />
                        </div>
                        {b.notes && <div className="text-sm text-zinc-600 mt-1">{b.notes}</div>}
                        <div className="text-xs mt-2 flex flex-wrap gap-2">
                          {b.owner && <span className="px-1.5 py-0.5 rounded bg-zinc-100">{b.owner}</span>}
                          {b.status && <span className="px-1.5 py-0.5 rounded bg-zinc-100">{b.status}</span>}
                          {b.due && <span className="px-1.5 py-0.5 rounded bg-zinc-100">{new Date(b.due).toLocaleDateString()}</span>}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button className="px-2 py-1 rounded-lg border" onClick={()=> editBlock(phase.id, b)}>Редактировать</button>
                          <button className="px-2 py-1 rounded-lg border" onClick={()=> deleteBlock(phase.id, b.id)}>Удалить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border bg-white">
          <Library onAdd={addFromLibrary} />
          <hr />
          <div className="p-3 space-y-2 text-sm">
            <div className="font-semibold">Подсказки</div>
            <ul className="list-disc pl-5 space-y-1 text-zinc-700">
              <li>Перетаскивайте блоки между фазами как «лего».</li>
              <li>Клик по блоку — редактирование цвета, статуса, владельца, срока.</li>
              <li>Экспортируйте/импортируйте план как JSON.</li>
              <li>Добавляйте собственные фазы и блоки под проект.</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-3 inset-x-0 px-4 z-40">
        <div className="mx-auto max-w-2xl rounded-2xl shadow-xl border bg-white p-2 flex items-center justify-around">
          <button className="px-3 py-2 rounded-xl border" onClick={()=> setLayout(l=> l==='board'?'list':'board')}>{layout==='board'? 'Список' : 'Доска'}</button>
          <button className="px-3 py-2 rounded-xl border" onClick={addPhase}>+ Фаза</button>
          <button className="px-3 py-2 rounded-xl border" onClick={()=> setPhases(prev => prev.slice(0,-1))}>− Фаза</button>
          <button className="px-3 py-2 rounded-xl border" onClick={()=> setPhases(initialPhases())}>Шаблон</button>
          <button className="px-3 py-2 rounded-xl border" onClick={exportJson}>JSON</button>
        </div>
      </div>

      <EditDrawer open={!!editTarget} onClose={()=>setEditTarget(null)} block={editTarget?.block} onSave={saveEdit} />
    </div>
  );
}

root.render(<App />);
