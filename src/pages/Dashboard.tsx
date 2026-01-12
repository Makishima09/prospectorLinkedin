import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Users, TrendingUp, MessageSquare, Target, UserPlus, Clock } from 'lucide-react';
import { useLeads } from '@/context/LeadsContext';
import { LeadStatus } from '@/types';

const Dashboard = () => {
  const { leads, loading } = useLeads();

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalLeads = leads.length;
    const convertedLeads = leads.filter((l) => l.status === LeadStatus.CONVERTED).length;
    const messagesCount = leads.filter(
      (l) => l.status === LeadStatus.CONTACTED || l.status === LeadStatus.RESPONDED
    ).length;

    const conversionRate =
      totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

    const recentLeads = leads.filter(
      (l) => new Date(l.createdAt) > thirtyDaysAgo
    ).length;

    const previousMonthLeads = leads.filter((l) => {
      const createdDate = new Date(l.createdAt);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      return createdDate > sixtyDaysAgo && createdDate <= thirtyDaysAgo;
    }).length;

    const leadsTrend =
      previousMonthLeads > 0
        ? `+${Math.round(((recentLeads - previousMonthLeads) / previousMonthLeads) * 100)}%`
        : '+0%';

    return [
      {
        title: 'Total Leads',
        value: totalLeads.toString(),
        description: 'Leads en tu base de datos',
        icon: Users,
        trend: leadsTrend,
      },
      {
        title: 'Tasa de Conversión',
        value: `${conversionRate}%`,
        description: 'Leads convertidos exitosamente',
        icon: TrendingUp,
        trend: convertedLeads > 0 ? `${convertedLeads} convertidos` : 'Sin conversiones',
      },
      {
        title: 'Mensajes Enviados',
        value: messagesCount.toString(),
        description: 'Leads contactados',
        icon: MessageSquare,
        trend: `${messagesCount} contactados`,
      },
      {
        title: 'Leads Recientes',
        value: recentLeads.toString(),
        description: 'Últimos 30 días',
        icon: Target,
        trend: leadsTrend,
      },
    ];
  }, [leads]);

  const recentActivity = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map((lead) => {
        const isNew = new Date(lead.createdAt).getTime() === new Date(lead.updatedAt).getTime();
        const action = isNew ? 'agregado' : 'actualizado';

        return {
          id: lead.id,
          lead,
          action,
          timestamp: lead.updatedAt,
        };
      });
  }, [leads]);

  const upcomingActions = useMemo(() => {
    const actions = leads
      .filter(
        (l) =>
          l.status === LeadStatus.NEW ||
          l.status === LeadStatus.CONTACTED ||
          l.status === LeadStatus.RESPONDED
      )
      .map((lead) => {
        let action = '';
        let priority: 'high' | 'medium' | 'low' = 'medium';

        if (lead.status === LeadStatus.NEW) {
          action = 'Contactar por primera vez';
          priority = 'high';
        } else if (lead.status === LeadStatus.CONTACTED) {
          action = 'Hacer seguimiento';
          priority = 'medium';
        } else if (lead.status === LeadStatus.RESPONDED) {
          action = 'Programar demo o reunión';
          priority = 'high';
        }

        return {
          id: lead.id,
          lead,
          action,
          priority,
        };
      })
      .slice(0, 5);

    return actions;
  }, [leads]);

  const getStatusBadge = (status: LeadStatus) => {
    const statusConfig = {
      [LeadStatus.NEW]: { label: 'Nuevo', variant: 'info' as const },
      [LeadStatus.CONTACTED]: { label: 'Contactado', variant: 'warning' as const },
      [LeadStatus.RESPONDED]: { label: 'Respondió', variant: 'default' as const },
      [LeadStatus.QUALIFIED]: { label: 'Calificado', variant: 'success' as const },
      [LeadStatus.CONVERTED]: { label: 'Convertido', variant: 'success' as const },
      [LeadStatus.LOST]: { label: 'Perdido', variant: 'destructive' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;

    return past.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimos cambios en tus leads
                </CardDescription>
              </div>
              <Link to="/leads">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay actividad reciente
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {activity.lead.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lead {activity.action} - {activity.lead.company}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.lead.status)}
                        {activity.lead.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {upcomingActions.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <Target className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay acciones pendientes
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingActions.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-md border ${getPriorityColor(
                      item.priority
                    )}`}
                  >
                    <Clock className="h-4 w-4 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs">
                        {item.lead.name} - {item.lead.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {leads.length === 0 ? (
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
                  <Link to="/leads">
                    <Button variant="outline" size="sm" className="mt-2">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Ir a Leads
                    </Button>
                  </Link>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Estado</CardTitle>
            <CardDescription>
              Distribución de tus leads por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.values(LeadStatus).map((status) => {
                const count = leads.filter((l) => l.status === status).length;
                const percentage =
                  leads.length > 0
                    ? ((count / leads.length) * 100).toFixed(0)
                    : '0';

                return (
                  <div
                    key={status}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border"
                  >
                    {getStatusBadge(status)}
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-xs text-muted-foreground">
                      {percentage}% del total
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
