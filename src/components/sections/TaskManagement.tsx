
const TaskManagement = () => (
  <div className="p-6 animate-fade-in">
    <h1 className="text-3xl font-bold mb-4">Gestión de Tareas</h1>
    <p className="text-muted-foreground mb-6">Sistema de asignación de tareas colectivas, grupales e individuales</p>
    <div className="space-y-4">
      {['Proyecto Final HTML/CSS', 'Ejercicios de JavaScript', 'Trabajo en Equipo'].map((task, i) => (
        <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
          <h3 className="font-medium">{task}</h3>
          <p className="text-sm text-muted-foreground">Pendiente • 1° A Programación</p>
        </div>
      ))}
    </div>
  </div>
);
export default TaskManagement;
