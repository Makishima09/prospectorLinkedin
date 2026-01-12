import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Users, TrendingUp, MessageSquare, Target } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Leads',
      value: '0',
      description: 'Leads en tu base de datos',
      icon: Users,
      trend: '+0%',
    },
    {
      title: 'Tasa de Conversión',
      value: '0%',
      description: 'Últimos 30 días',
      icon: TrendingUp,
      trend: '+0%',
    },
    {
      title: 'Mensajes Enviados',
      value: '0',
      description: 'Este mes',
      icon: MessageSquare,
      trend: '+0%',
    },
    {
      title: 'Campañas Activas',
      value: '0',
      description: 'Campañas en progreso',
      icon: Target,
      trend: '0',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen de tu actividad de prospección en LinkedIn
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              No hay actividad reciente para mostrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">
                Comienza agregando tus primeros leads
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximas Acciones</CardTitle>
            <CardDescription>
              Tareas pendientes y seguimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">
                No hay acciones pendientes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comienza a Prospectar</CardTitle>
          <CardDescription>
            Sigue estos pasos para comenzar tu estrategia de prospección
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Agrega tus primeros leads</h4>
                <p className="text-sm text-muted-foreground">
                  Importa o agrega manualmente contactos de LinkedIn
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Crea una campaña</h4>
                <p className="text-sm text-muted-foreground">
                  Define tu estrategia de mensajes y seguimiento
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Realiza seguimiento</h4>
                <p className="text-sm text-muted-foreground">
                  Monitorea respuestas y ajusta tu estrategia
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
