import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select, SelectOption } from '@/components/common/Select';
import { Dialog } from '@/components/common/Dialog';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Users,
  UserPlus,
  MessageSquare,
  CheckCircle,
  Search,
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  position: string;
  company: string;
  status: 'new' | 'contacted' | 'responded' | 'converted' | 'lost';
  date: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Martínez',
    position: 'CEO',
    company: 'Tech Solutions SA',
    status: 'new',
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'María García',
    position: 'CTO',
    company: 'Innovate Corp',
    status: 'contacted',
    date: '2024-01-14',
  },
  {
    id: '3',
    name: 'Juan López',
    position: 'Director de Marketing',
    company: 'Digital Agency',
    status: 'responded',
    date: '2024-01-13',
  },
  {
    id: '4',
    name: 'Ana Rodríguez',
    position: 'VP de Ventas',
    company: 'Sales Pro',
    status: 'converted',
    date: '2024-01-12',
  },
  {
    id: '5',
    name: 'Pedro Sánchez',
    position: 'Gerente General',
    company: 'Business Hub',
    status: 'contacted',
    date: '2024-01-11',
  },
];

const statusOptions: SelectOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Nuevos', value: 'new' },
  { label: 'Contactados', value: 'contacted' },
  { label: 'Respondieron', value: 'responded' },
  { label: 'Convertidos', value: 'converted' },
  { label: 'Perdidos', value: 'lost' },
];

const getStatusBadge = (status: Lead['status']) => {
  const statusConfig = {
    new: { label: 'Nuevo', variant: 'info' as const },
    contacted: { label: 'Contactado', variant: 'warning' as const },
    responded: { label: 'Respondió', variant: 'default' as const },
    converted: { label: 'Convertido', variant: 'success' as const },
    lost: { label: 'Perdido', variant: 'destructive' as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const Leads = () => {
  const [leads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddLeadDialogOpen, setIsAddLeadDialogOpen] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Leads',
      value: leads.length.toString(),
      icon: Users,
      description: 'En tu base de datos',
    },
    {
      title: 'Nuevos',
      value: leads.filter((l) => l.status === 'new').length.toString(),
      icon: UserPlus,
      description: 'Sin contactar',
    },
    {
      title: 'Respondieron',
      value: leads.filter((l) => l.status === 'responded').length.toString(),
      icon: MessageSquare,
      description: 'Con respuesta',
    },
    {
      title: 'Convertidos',
      value: leads.filter((l) => l.status === 'converted').length.toString(),
      icon: CheckCircle,
      description: 'Exitosos',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            Gestiona tus contactos de LinkedIn
          </p>
        </div>
        <Button onClick={() => setIsAddLeadDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Agregar Lead
        </Button>
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

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Lista de Leads</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  className="pl-8 sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filtrar por estado"
                className="sm:w-[180px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No se encontraron leads"
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer lead para empezar a prospectar'
              }
              action={
                !searchQuery && statusFilter === 'all'
                  ? {
                      label: 'Agregar Lead',
                      onClick: () => setIsAddLeadDialogOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.position}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      {new Date(lead.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isAddLeadDialogOpen}
        onOpenChange={setIsAddLeadDialogOpen}
      >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Agregar Nuevo Lead</Dialog.Title>
            <Dialog.Description>
              Completa la información del contacto de LinkedIn
            </Dialog.Description>
          </Dialog.Header>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre completo
              </label>
              <Input id="name" placeholder="Ej: Carlos Martínez" />
            </div>
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">
                Cargo
              </label>
              <Input id="position" placeholder="Ej: CEO" />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Empresa
              </label>
              <Input id="company" placeholder="Ej: Tech Solutions SA" />
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium">
                URL de LinkedIn
              </label>
              <Input
                id="linkedin"
                placeholder="https://www.linkedin.com/in/..."
              />
            </div>
          </div>
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => setIsAddLeadDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={() => setIsAddLeadDialogOpen(false)}>
              Agregar Lead
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default Leads;
