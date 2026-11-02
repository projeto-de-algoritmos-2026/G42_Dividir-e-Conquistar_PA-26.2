import React, { useState } from 'react';

const COORDENADAS = [
    { id: "Centro de Distribuicao", x: 44.0, y: 47.0 },
    { id: "Asa Sul", x: 53.0, y: 59.0 },
    { id: "Taguatinga", x: 25.0, y: 65.0 },
    { id: "Samambaia", x: 20.0, y: 89.0 },
    { id: "Ceilandia", x: 13.0, y: 74.0 },
    { id: "Sudoeste", x: 34.0, y: 51.0 },
    { id: "Asa Norte", x: 51.0, y: 35.0 },
    { id: "Lago Norte", x: 63.0, y: 25.0 },
    { id: "Lago Sul", x: 67.0, y: 67.0 },
    { id: "Jardim Botanico", x: 78.0, y: 80.0 },
    { id: "Sobradinho", x: 57.0, y: 9.0 },
    { id: "Deposito Isolado", x: 87.0, y: 13.0 }
];

export default function App() {
    const [mode, setMode] = useState('routing');

    const [source, setSource] = useState('Centro de Distribuicao');
    const [target, setTarget] = useState('Lago Sul');
    const [routeResult, setRouteResult] = useState(null);
    const [routeError, setRouteError] = useState('');
    const [routeLoading, setRouteLoading] = useState(false);

    const [taskDestination, setTaskDestination] = useState('');
    const [taskStart, setTaskStart] = useState('');
    const [taskEnd, setTaskEnd] = useState('');
    const [customTasks, setCustomTasks] = useState([]);
    const [scheduleResult, setScheduleResult] = useState(null);
    const [scheduleError, setScheduleError] = useState('');
    const [scheduleLoading, setScheduleLoading] = useState(false);

    const [customPoints, setCustomPoints] = useState([]);
    const [cpSourceId, setCpSourceId] = useState('');
    const [cpPointX, setCpPointX] = useState('');
    const [cpPointY, setCpPointY] = useState('');
    const [cpResult, setCpResult] = useState(null);
    const [cpError, setCpError] = useState('');
    const [cpLoading, setCpLoading] = useState(false);

    const handleCalculateRoute = async () => {
        setRouteLoading(true);
        setRouteError('');
        setRouteResult(null);
        try {
            const res = await fetch('http://localhost:3000/api/route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source, target })
            });
            const data = await res.json();
            if (data.status === 'error') throw new Error(data.message);
            setRouteResult(data);
        } catch (err) {
            setRouteError(err.message);
        } finally {
            setRouteLoading(false);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!taskDestination || !taskStart || !taskEnd) return;
        const newId = `T${customTasks.length + 1}`;
        setCustomTasks([...customTasks, { id: newId, destination: taskDestination, startTime: parseInt(taskStart), endTime: parseInt(taskEnd) }]);
        setTaskDestination('');
        setTaskStart('');
        setTaskEnd('');
    };

    const handleCalculateSchedule = async () => {
        setScheduleLoading(true);
        setScheduleError('');
        setScheduleResult(null);
        try {
            const res = await fetch('http://localhost:3000/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: customTasks })
            });
            const data = await res.json();
            if (data.status === 'error') throw new Error(data.message);
            setScheduleResult(data);
        } catch (err) {
            setScheduleError(err.message);
        } finally {
            setScheduleLoading(false);
        }
    };

    const handleAddPoint = (e) => {
        e.preventDefault();
        if (!cpSourceId || !cpPointX || !cpPointY) return;
        if (customPoints.find(p => p.id === cpSourceId)) return;
        setCustomPoints([...customPoints, { id: cpSourceId, x: parseFloat(cpPointX), y: parseFloat(cpPointY) }]);
        setCpSourceId('');
        setCpPointX('');
        setCpPointY('');
    };

    const handleRemovePoint = (id) => {
        setCustomPoints(customPoints.filter(p => p.id !== id));
    };

    const handleClosestPair = async () => {
        setCpLoading(true);
        setCpError('');
        setCpResult(null);
        try {
            const res = await fetch('http://localhost:3000/api/closest-pair', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points: customPoints })
            });
            const data = await res.json();
            if (data.status === 'error') throw new Error(data.message);
            setCpResult(data);
        } catch (err) {
            setCpError(err.message);
        } finally {
            setCpLoading(false);
        }
    };

    const cpPointsToDraw = customPoints.length > 0 ? customPoints : COORDENADAS;

    return (
        <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
            <aside className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-tight">UrbanRoutingDelivery</h1>
                    <p className="text-sm text-gray-400 mt-1">Sistema Logistico</p>
                </div>

                <div className="flex p-4 gap-2 bg-gray-800/50">
                    <button
                        onClick={() => setMode('routing')}
                        className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${mode === 'routing' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Rotas
                    </button>
                    <button
                        onClick={() => setMode('scheduling')}
                        className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${mode === 'scheduling' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Agenda
                    </button>
                    <button
                        onClick={() => setMode('closestPair')}
                        className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${mode === 'closestPair' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Agrupar
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {mode === 'routing' && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Origem</label>
                                <input
                                    type="text"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">Destino</label>
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button
                                onClick={handleCalculateRoute}
                                disabled={routeLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                            >
                                {routeLoading ? 'Calculando...' : 'Calcular Rota'}
                            </button>
                            {routeError && (
                                <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-md text-red-400 text-sm">
                                    {routeError}
                                </div>
                            )}
                        </>
                    )}

                    {mode === 'scheduling' && (
                        <>
                            <form onSubmit={handleAddTask} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">Destino</label>
                                    <input
                                        type="text"
                                        value={taskDestination}
                                        onChange={(e) => setTaskDestination(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Início</label>
                                        <input
                                            type="number"
                                            value={taskStart}
                                            onChange={(e) => setTaskStart(e.target.value)}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Fim</label>
                                        <input
                                            type="number"
                                            value={taskEnd}
                                            onChange={(e) => setTaskEnd(e.target.value)}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    Adicionar Tarefa
                                </button>
                            </form>
                            <div className="space-y-2">
                                {customTasks.map((t, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs bg-gray-950 p-2 rounded border border-gray-800">
                                        <span>{t.destination} ({t.startTime}-{t.endTime})</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleCalculateSchedule}
                                disabled={scheduleLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                            >
                                {scheduleLoading ? 'Otimizando...' : 'Otimizar Agenda'}
                            </button>
                            {scheduleError && (
                                <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-md text-red-400 text-sm">
                                    {scheduleError}
                                </div>
                            )}
                        </>
                    )}

                    {mode === 'closestPair' && (
                        <>
                            <form onSubmit={handleAddPoint} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">ID do Ponto</label>
                                    <input
                                        type="text"
                                        value={cpSourceId}
                                        onChange={(e) => setCpSourceId(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        placeholder="Ex: Cliente A"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Coord X</label>
                                        <input
                                            type="number"
                                            value={cpPointX}
                                            onChange={(e) => setCpPointX(e.target.value)}
                                            min="0"
                                            max="100"
                                            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Coord Y</label>
                                        <input
                                            type="number"
                                            value={cpPointY}
                                            onChange={(e) => setCpPointY(e.target.value)}
                                            min="0"
                                            max="100"
                                            className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    Adicionar Ponto
                                </button>
                            </form>
                            <div className="space-y-2">
                                {customPoints.map((p) => (
                                    <div key={p.id} className="flex justify-between items-center text-xs bg-gray-950 p-2 rounded border border-gray-800">
                                        <span className="truncate">{p.id} ({p.x}, {p.y})</span>
                                        <button
                                            onClick={() => handleRemovePoint(p.id)}
                                            className="text-gray-500 hover:text-red-400 px-2 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleClosestPair}
                                disabled={cpLoading}
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 mt-4"
                            >
                                {cpLoading ? 'Buscando...' : 'Encontrar Par Mais Próximo'}
                            </button>
                            {cpError && (
                                <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-md text-red-400 text-sm">
                                    {cpError}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </aside>

            <main className="flex-1 bg-gray-950 p-8 relative flex flex-col">
                {mode === 'routing' && routeResult && (
                    <div className="mb-6 p-6 bg-gray-900 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-2">Rota Encontrada</h2>
                        <p className="text-gray-400 mb-4">Distância Total: <span className="text-indigo-400 font-bold">{routeResult.distance}</span> km</p>
                        <div className="flex flex-wrap gap-2">
                            {routeResult.path.map((node, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-xs">{node}</span>
                            ))}
                        </div>
                    </div>
                )}

                {mode === 'scheduling' && scheduleResult && (
                    <div className="mb-6 p-6 bg-gray-900 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-2">Agenda Otimizada</h2>
                        <p className="text-gray-400 mb-4">Tarefas Agendadas: <span className="text-indigo-400 font-bold">{scheduleResult.total_scheduled}</span></p>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-emerald-400 mb-2">Aceitas:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {scheduleResult.scheduled.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-emerald-900/30 border border-emerald-800 rounded text-xs text-emerald-300">
                                            {t.id}: {t.destination} ({t.startTime}-{t.endTime})
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {scheduleResult.rejected && scheduleResult.rejected.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-rose-400 mb-2">Rejeitadas (Conflito):</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {scheduleResult.rejected.map((t, i) => (
                                            <span key={i} className="px-3 py-1 bg-rose-900/30 border border-rose-800 rounded text-xs text-rose-300">
                                                {t.id}: {t.destination} ({t.startTime}-{t.endTime})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {mode === 'closestPair' && cpResult && (
                    <div className="mb-6 p-6 bg-gray-900 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-2">Par Mais Próximo Encontrado</h2>
                        <p className="text-gray-400">
                            Distância Mínima: <span className="text-rose-400 font-bold">{cpResult.distance.toFixed(4)}</span> km
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="px-4 py-2 bg-gray-800 rounded border border-gray-700 flex-1 text-center">
                                <span className="block text-xs text-gray-500 mb-1">Ponto A</span>
                                <span className="font-medium text-sm text-gray-300">{cpResult.pointA.id}</span>
                            </div>
                            <div className="text-gray-600 font-bold">↔</div>
                            <div className="px-4 py-2 bg-gray-800 rounded border border-gray-700 flex-1 text-center">
                                <span className="block text-xs text-gray-500 mb-1">Ponto B</span>
                                <span className="font-medium text-sm text-gray-300">{cpResult.pointB.id}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden relative">
                    {mode === 'closestPair' && (
                        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                            {cpResult && (
                                <line
                                    x1={cpResult.pointA.x}
                                    y1={cpResult.pointA.y}
                                    x2={cpResult.pointB.x}
                                    y2={cpResult.pointB.y}
                                    stroke="#f43f5e"
                                    strokeWidth="0.5"
                                    strokeDasharray="1,1"
                                />
                            )}
                            {cpPointsToDraw.map(p => {
                                const isHighlighted = cpResult && (p.id === cpResult.pointA.id || p.id === cpResult.pointB.id);
                                return (
                                    <g key={p.id}>
                                        {isHighlighted && (
                                            <circle cx={p.x} cy={p.y} r="3" fill="#f43f5e" opacity="0.3" />
                                        )}
                                        <circle cx={p.x} cy={p.y} r={isHighlighted ? "1.5" : "1"} fill={isHighlighted ? "#f43f5e" : "#4B5563"} />
                                        <text
                                            x={p.x}
                                            y={p.y - 2}
                                            fontSize="2"
                                            fill={isHighlighted ? "#f43f5e" : "#9CA3AF"}
                                            textAnchor="middle"
                                            fontWeight={isHighlighted ? "bold" : "normal"}
                                        >
                                            {p.id}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    )}
                    {mode !== 'closestPair' && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                            O mapa visual está ativo na aba "Agrupar".
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}