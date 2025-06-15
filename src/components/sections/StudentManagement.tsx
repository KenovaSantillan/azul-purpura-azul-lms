
const StudentManagement = () => (
  <div className="p-6 animate-fade-in">
    <h1 className="text-3xl font-bold mb-4">Gestión de Estudiantes</h1>
    <p className="text-muted-foreground mb-6">Próximamente: Sistema completo de gestión de estudiantes con drag & drop</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
          <div className="w-12 h-12 bg-primary rounded-full mb-3"></div>
          <h3 className="font-medium">Estudiante {i + 1}</h3>
          <p className="text-sm text-muted-foreground">1° A - Programación</p>
        </div>
      ))}
    </div>
  </div>
);
export default StudentManagement;
