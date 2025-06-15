
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Legal = () => {
  return (
    <div className="p-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Avisos Legales</CardTitle>
          <CardDescription>
            Información importante sobre privacidad y protección de datos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="privacy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="privacy">Aviso de Privacidad Simplificado</TabsTrigger>
              <TabsTrigger value="data-protection">Protección de Datos Personales</TabsTrigger>
            </TabsList>
            <TabsContent value="privacy" className="pt-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <h3 className="text-lg font-semibold text-foreground">Aviso de Privacidad Simplificado</h3>
                <p>
                  Kenova, con domicilio en [Dirección de la Institución], es responsable del tratamiento de sus datos personales.
                </p>
                <p>
                  <strong>Datos que recabamos:</strong> Nombre, correo electrónico, rol (docente, alumno, etc.), y datos de progreso académico.
                </p>
                <p>
                  <strong>Finalidades:</strong> Utilizamos sus datos para la gestión académica, comunicación, seguimiento del progreso y mejora de nuestros servicios educativos.
                </p>
                <p>
                  No se realizarán transferencias de datos personales, salvo aquéllas que sean necesarias para atender requerimientos de información de una autoridad competente, que estén debidamente fundados y motivados.
                </p>
                <p>
                  Puede ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) a través del correo electrónico [correo de contacto].
                </p>
                <p>
                  Para consultar el aviso de privacidad integral, por favor diríjase a [enlace o lugar físico].
                </p>
              </div>
            </TabsContent>
            <TabsContent value="data-protection" className="pt-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <h3 className="text-lg font-semibold text-foreground">Protección de Datos Personales</h3>
                <p>
                  En Kenova, nos comprometemos a proteger su información personal de acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                </p>
                <p>
                  <strong>Medidas de seguridad:</strong> Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos contra daño, pérdida, alteración, destrucción o el uso, acceso o tratamiento no autorizado.
                </p>
                <p>
                  <strong>Confidencialidad:</strong> Todo nuestro personal está sujeto a obligaciones de confidencialidad con respecto a los datos personales que tratan.
                </p>
                <p>
                  <strong>Uso de cookies:</strong> Utilizamos cookies para mejorar su experiencia en nuestra plataforma. Puede gestionar sus preferencias de cookies en la configuración de su navegador.
                </p>
                <p>
                  Cualquier cambio a nuestro aviso de privacidad será notificado a través de esta plataforma.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Legal;
