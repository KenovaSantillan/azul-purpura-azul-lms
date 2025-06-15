
const Announcements = () => (
  <div className="p-6 animate-fade-in">
    <h1 className="text-3xl font-bold mb-4">Tablón de Avisos</h1>
    <p className="text-muted-foreground mb-6">Centro de comunicaciones y anuncios</p>
    <div className="space-y-4">
      {['Bienvenidos al nuevo semestre', 'Horarios de exámenes', 'Actividades extracurriculares'].map((announcement, i) => (
        <div key={i} className="p-4 border rounded-lg bg-accent/20 animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
          <h3 className="font-medium">{announcement}</h3>
          <p className="text-sm text-muted-foreground">Publicado hace 2 días</p>
        </div>
      ))}
    </div>
  </div>
);
export default Announcements;
