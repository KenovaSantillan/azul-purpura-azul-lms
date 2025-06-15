
const ProgressTracking = () => (
  <div className="p-6 animate-fade-in">
    <h1 className="text-3xl font-bold mb-4">Seguimiento de Progreso</h1>
    <p className="text-muted-foreground mb-6">Monitoreo del rendimiento académico por estudiante</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Estudiante {i + 1}</h3>
            <span className="text-2xl font-bold text-primary">{85 + i * 2}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${85 + i * 2}%`, animationDelay: `${i * 200}ms` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default ProgressTracking;
