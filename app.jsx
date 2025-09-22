// EPC Playbook — Lego Planner
const { useEffect, useMemo, useState } = React;
const root = ReactDOM.createRoot(document.getElementById('root'));

const STATUSES = ["Planned","In Progress","Blocked","Done"];
const COLORS = ["indigo","emerald","rose","amber","sky","violet","slate"];
const uid = () => Math.random().toString(36).slice(2,9);
const colorClass = (c) => c ? `bg-${c}-500` : "bg-zinc-200";

// ---------- Шаблон фаз и блоков ----------
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

// ---------- Компоненты ----------
function LegoBlock({ block }) {
  return (
    <div className={`select-none rounded-2xl p-3 shadow-sm ring-2 ring-black/10 ${colorClass(block.color)} text-white`}>
      <div className="font-semibold text-sm">{block.title}</div>
      {block.notes && <div className="text-xs opacity-85 mt-1">{block.notes}</div>}
      <div className="mt-2 text-[10px] opacity-90">{block.status}</div>
    </div>
  );
}

function App(){
  const [phases] = useState(initialPhases());
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">EPC Playbook — Lego Planner</h1>
      {phases.map(phase => (
        <div key={phase.id}>
          <h2 className="text-lg font-semibold mb-2">{phase.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {phase.blocks.map(b => <LegoBlock key={b.id} block={b} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

root.render(<App />);
