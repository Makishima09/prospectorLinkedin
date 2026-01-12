import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import {
  FileText,
  Plus,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  Settings,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  leadsCount: number;
  messagesSent: number;
  responseRate: number;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campaña de Bienvenida',
    description: 'Mensajes iniciales para nuevos contactos',
    status: 'active',
    leadsCount: 45,
    messagesSent: 128,
    responseRate: 34,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Seguimiento Q1 2024',
    description: 'Seguimiento trimestral con leads existentes',
    status: 'active',
    leadsCount: 32,
    messagesSent: 89,
    responseRate: 28,
    createdAt: '2024-01-08',
  },
  {
    id: '3',
    name: 'Webinar Invitaciones',
    description: 'Invitaciones para webinar de producto',
    status: 'paused',
    leadsCount: 78,
    messagesSent: 156,
    responseRate: 42,
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    name: 'Prospección Tech',
    description: 'Enfocada en empresas tecnológicas',
    status: 'draft',
    leadsCount: 0,
    messagesSent: 0,
    responseRate: 0,
    createdAt: '2024-01-15',
  },
];

const getStatusBadge = (status: Campaign['status']) => {
  const statusConfig = {
    active: { label: 'Activa', variant: 'success' as const },
    paused: { label: 'Pausada', variant: 'warning' as const },
    completed: { label: 'Completada', variant: 'default' as const },
    draft: { label: 'Borrador', variant: 'secondary' as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const Campaigns = () => {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campañas</h2>
          <p className="text-muted-foreground">
            Gestiona tus campañas de prospección en LinkedIn
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campañas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">Todas las campañas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c) => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">En progreso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((acc, c) => acc + c.leadsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">En todas las campañas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mensajes Enviados
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((acc, c) => acc + c.messagesSent, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No tienes campañas aún"
          description="Crea tu primera campaña para comenzar a prospectar de manera organizada"
          action={{
            label: 'Nueva Campaña',
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </div>
                  {getStatusBadge(campaign.status)}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Leads
                    </div>
                    <div className="text-2xl font-bold">
                      {campaign.leadsCount}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      Mensajes
                    </div>
                    <div className="text-2xl font-bold">
                      {campaign.messagesSent}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Tasa de respuesta
                    </div>
                    <span className="font-medium">
                      {campaign.responseRate}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${campaign.responseRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Creada el{' '}
                  {new Date(campaign.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar
                </Button>
                <Button
                  variant={
                    campaign.status === 'active' ? 'outline' : 'default'
                  }
                  className="flex-1"
                  size="sm"
                >
                  {campaign.status === 'active' ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Iniciar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Crear Nueva Campaña</Dialog.Title>
            <Dialog.Description>
              Configura una nueva campaña de prospección en LinkedIn
            </Dialog.Description>
          </Dialog.Header>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="campaign-name" className="text-sm font-medium">
                Nombre de la campaña
              </label>
              <Input
                id="campaign-name"
                placeholder="Ej: Prospección Tech Q1"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="campaign-description"
                className="text-sm font-medium"
              >
                Descripción
              </label>
              <Input
                id="campaign-description"
                placeholder="Breve descripción de la campaña"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="campaign-objective"
                className="text-sm font-medium"
              >
                Objetivo
              </label>
              <Input
                id="campaign-objective"
                placeholder="Ej: Generar 50 leads calificados"
              />
            </div>
          </div>
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              Crear Campaña
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default Campaigns;
