import { useState, useMemo, useCallback } from 'react';
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
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useLeads } from '@/context/LeadsContext';
import { useToast } from '@/context/ToastContext';
import { Lead, LeadFormData, LeadStatus } from '@/types';

const statusOptions: SelectOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Nuevos', value: LeadStatus.NEW },
  { label: 'Contactados', value: LeadStatus.CONTACTED },
  { label: 'Respondieron', value: LeadStatus.RESPONDED },
  { label: 'Calificados', value: LeadStatus.QUALIFIED },
  { label: 'Convertidos', value: LeadStatus.CONVERTED },
  { label: 'Perdidos', value: LeadStatus.LOST },
];

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

const initialFormState: LeadFormData = {
  name: '',
  position: '',
  company: '',
  linkedinUrl: '',
  email: '',
  phone: '',
  status: LeadStatus.NEW,
  tags: [],
  notes: '',
};

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  linkedinUrl?: string;
  phone?: string;
}

const Leads = () => {
  const { leads, loading, addLead, updateLead, deleteLead } = useLeads();
  const { success, error: showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState<LeadFormData>(initialFormState);
  const [currentTag, setCurrentTag] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    leads.forEach((lead) => {
      lead.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.position?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

      const matchesTag = !tagFilter || lead.tags.includes(tagFilter);

      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [leads, searchQuery, statusFilter, tagFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newLeads = leads.filter(
      (l) => new Date(l.createdAt) > sevenDaysAgo
    ).length;

    return [
      {
        title: 'Total Leads',
        value: leads.length.toString(),
        icon: Users,
        description: 'En tu base de datos',
      },
      {
        title: 'Nuevos (7 días)',
        value: newLeads.toString(),
        icon: UserPlus,
        description: 'Últimos 7 días',
      },
      {
        title: 'Respondieron',
        value: leads.filter((l) => l.status === LeadStatus.RESPONDED).length.toString(),
        icon: MessageSquare,
        description: 'Con respuesta',
      },
      {
        title: 'Convertidos',
        value: leads.filter((l) => l.status === LeadStatus.CONVERTED).length.toString(),
        icon: CheckCircle,
        description: 'Exitosos',
      },
    ];
  }, [leads]);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'El nombre es requerido (mínimo 2 caracteres)';
    }

    if (!formData.company.trim() || formData.company.trim().length < 2) {
      errors.company = 'La empresa es requerida (mínimo 2 caracteres)';
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Email inválido';
      }
    }

    if (formData.linkedinUrl && formData.linkedinUrl.trim()) {
      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/;
      if (!linkedinRegex.test(formData.linkedinUrl.trim())) {
        errors.linkedinUrl = 'URL de LinkedIn inválida';
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone.trim()) || formData.phone.trim().length < 8) {
        errors.phone = 'Teléfono inválido';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleOpenAddDialog = useCallback(() => {
    setFormData(initialFormState);
    setFormErrors({});
    setCurrentTag('');
    setIsAddDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback((lead: Lead) => {
    setFormData({
      name: lead.name,
      position: lead.position || '',
      company: lead.company,
      linkedinUrl: lead.linkedinUrl || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status,
      tags: lead.tags,
      notes: lead.notes || '',
    });
    setFormErrors({});
    setCurrentTag('');
    setEditingLeadId(lead.id);
    setIsEditDialogOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((leadId: string) => {
    setDeletingLeadId(leadId);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && currentTag.trim()) {
      e.preventDefault();
      const newTag = currentTag.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setCurrentTag('');
    }
  }, [currentTag, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleSubmitAdd = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addLead(formData);
      success('Lead agregado exitosamente');
      setIsAddDialogOpen(false);
      setFormData(initialFormState);
    } catch (err) {
      showError('Error al agregar el lead');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, addLead, success, showError]);

  const handleSubmitEdit = useCallback(async () => {
    if (!validateForm() || !editingLeadId) return;

    setIsSubmitting(true);
    try {
      await updateLead(editingLeadId, formData);
      success('Lead actualizado exitosamente');
      setIsEditDialogOpen(false);
      setFormData(initialFormState);
      setEditingLeadId(null);
    } catch (err) {
      showError('Error al actualizar el lead');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingLeadId, validateForm, updateLead, success, showError]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingLeadId) return;

    try {
      await deleteLead(deletingLeadId);
      success('Lead eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setDeletingLeadId(null);
    } catch (err) {
      showError('Error al eliminar el lead');
    }
  }, [deletingLeadId, deleteLead, success, showError]);

  const deletingLead = leads.find((l) => l.id === deletingLeadId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            Gestiona tus contactos de LinkedIn
          </p>
        </div>
        <Button onClick={handleOpenAddDialog}>
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
              {allTags.length > 0 && (
                <Select
                  options={[
                    { label: 'Todos los tags', value: '' },
                    ...allTags.map((tag) => ({ label: tag, value: tag })),
                  ]}
                  value={tagFilter}
                  onChange={setTagFilter}
                  placeholder="Filtrar por tag"
                  className="sm:w-[180px]"
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No se encontraron leads"
              description={
                searchQuery || statusFilter !== 'all' || tagFilter
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer lead para empezar a prospectar'
              }
              action={
                !searchQuery && statusFilter === 'all' && !tagFilter
                  ? {
                      label: 'Agregar Lead',
                      onClick: handleOpenAddDialog,
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
                  <TableHead>Tags</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.position || '-'}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {lead.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{lead.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDialog(lead)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(lead.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <Dialog.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Header>
            <Dialog.Title>Agregar Nuevo Lead</Dialog.Title>
            <Dialog.Description>
              Completa la información del contacto de LinkedIn
            </Dialog.Description>
          </Dialog.Header>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre completo <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="Ej: Carlos Martínez"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Empresa <span className="text-destructive">*</span>
                </label>
                <Input
                  id="company"
                  placeholder="Ej: Tech Solutions SA"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                />
                {formErrors.company && (
                  <p className="text-xs text-destructive">{formErrors.company}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">
                Cargo
              </label>
              <Input
                id="position"
                placeholder="Ej: CEO, Director de Marketing"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="linkedinUrl" className="text-sm font-medium">
                URL de LinkedIn
              </label>
              <Input
                id="linkedinUrl"
                placeholder="https://www.linkedin.com/in/..."
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    linkedinUrl: e.target.value,
                  }))
                }
              />
              {formErrors.linkedinUrl && (
                <p className="text-xs text-destructive">{formErrors.linkedinUrl}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@empresa.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  placeholder="+34 612 345 678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Estado
              </label>
              <Select
                options={statusOptions.filter((opt) => opt.value !== 'all')}
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as LeadStatus }))
                }
                placeholder="Seleccionar estado"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <Input
                id="tags"
                placeholder="Escribe un tag y presiona Enter o coma"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <p className="text-xs text-muted-foreground">
                Presiona Enter o coma para agregar tags
              </p>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notas
              </label>
              <textarea
                id="notes"
                placeholder="Notas adicionales sobre el lead..."
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitAdd} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Agregar Lead'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Header>
            <Dialog.Title>Editar Lead</Dialog.Title>
            <Dialog.Description>
              Actualiza la información del contacto
            </Dialog.Description>
          </Dialog.Header>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nombre completo <span className="text-destructive">*</span>
                </label>
                <Input
                  id="edit-name"
                  placeholder="Ej: Carlos Martínez"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-company" className="text-sm font-medium">
                  Empresa <span className="text-destructive">*</span>
                </label>
                <Input
                  id="edit-company"
                  placeholder="Ej: Tech Solutions SA"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                />
                {formErrors.company && (
                  <p className="text-xs text-destructive">{formErrors.company}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-position" className="text-sm font-medium">
                Cargo
              </label>
              <Input
                id="edit-position"
                placeholder="Ej: CEO, Director de Marketing"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-linkedinUrl" className="text-sm font-medium">
                URL de LinkedIn
              </label>
              <Input
                id="edit-linkedinUrl"
                placeholder="https://www.linkedin.com/in/..."
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    linkedinUrl: e.target.value,
                  }))
                }
              />
              {formErrors.linkedinUrl && (
                <p className="text-xs text-destructive">{formErrors.linkedinUrl}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="email@empresa.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="edit-phone"
                  placeholder="+34 612 345 678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-status" className="text-sm font-medium">
                Estado
              </label>
              <Select
                options={statusOptions.filter((opt) => opt.value !== 'all')}
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as LeadStatus }))
                }
                placeholder="Seleccionar estado"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-tags" className="text-sm font-medium">
                Tags
              </label>
              <Input
                id="edit-tags"
                placeholder="Escribe un tag y presiona Enter o coma"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <p className="text-xs text-muted-foreground">
                Presiona Enter o coma para agregar tags
              </p>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-notes" className="text-sm font-medium">
                Notas
              </label>
              <textarea
                id="edit-notes"
                placeholder="Notas adicionales sobre el lead..."
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitEdit} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Confirmar Eliminación</Dialog.Title>
            <Dialog.Description>
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>{deletingLead?.name}</strong> de {deletingLead?.company}?
              Esta acción no se puede deshacer.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar Lead
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default Leads;
