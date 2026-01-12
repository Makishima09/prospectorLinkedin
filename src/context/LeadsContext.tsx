import React, { createContext, useContext, useEffect, useState } from 'react';
import { Lead, LeadFormData, LeadStatus } from '@/types';
import { localStorageService } from '@/services/localStorage';

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  addLead: (leadData: LeadFormData) => Promise<Lead>;
  updateLead: (id: string, leadData: LeadFormData) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

const mockInitialLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Martínez',
    position: 'CEO',
    company: 'Tech Solutions SA',
    linkedinUrl: 'https://www.linkedin.com/in/carlosmartinez',
    email: 'carlos@techsolutions.com',
    phone: '+34 612 345 678',
    status: LeadStatus.NEW,
    tags: ['CEO', 'Tech', 'B2B'],
    notes: 'Interesado en soluciones de automatización',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastContactDate: undefined,
  },
  {
    id: '2',
    name: 'María García',
    position: 'CTO',
    company: 'Innovate Corp',
    linkedinUrl: 'https://www.linkedin.com/in/mariagarcia',
    email: 'maria@innovatecorp.com',
    status: LeadStatus.CONTACTED,
    tags: ['CTO', 'Innovation', 'SaaS'],
    notes: 'Contactada el lunes pasado, pendiente de respuesta',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Juan López',
    position: 'Director de Marketing',
    company: 'Digital Agency',
    linkedinUrl: 'https://www.linkedin.com/in/juanlopez',
    email: 'juan@digitalagency.com',
    phone: '+34 623 456 789',
    status: LeadStatus.RESPONDED,
    tags: ['Marketing', 'Digital', 'Agency'],
    notes: 'Muy interesado, programar demo para la próxima semana',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Ana Rodríguez',
    position: 'VP de Ventas',
    company: 'Sales Pro',
    linkedinUrl: 'https://www.linkedin.com/in/anarodriguez',
    email: 'ana@salespro.com',
    status: LeadStatus.CONVERTED,
    tags: ['VP Sales', 'Enterprise', 'Qualified'],
    notes: 'Cliente convertido exitosamente. Contrato firmado.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      const storedLeads = localStorageService.getLeads();

      if (storedLeads.length === 0) {
        localStorageService.saveLeads(mockInitialLeads);
        setLeads(mockInitialLeads);
      } else {
        setLeads(storedLeads);
      }
    } catch (err) {
      setError('Error al cargar los leads');
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLead = async (leadData: LeadFormData): Promise<Lead> => {
    try {
      setError(null);

      const newLead: Lead = {
        id: crypto.randomUUID(),
        ...leadData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedLeads = [...leads, newLead];
      setLeads(updatedLeads);
      localStorageService.saveLeads(updatedLeads);

      return newLead;
    } catch (err) {
      const errorMessage = 'Error al agregar el lead';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateLead = async (
    id: string,
    leadData: LeadFormData
  ): Promise<Lead> => {
    try {
      setError(null);

      const existingLead = leads.find((lead) => lead.id === id);
      if (!existingLead) {
        throw new Error('Lead no encontrado');
      }

      const updatedLead: Lead = {
        ...existingLead,
        ...leadData,
        updatedAt: new Date().toISOString(),
        lastContactDate:
          leadData.status !== existingLead.status &&
          (leadData.status === LeadStatus.CONTACTED ||
            leadData.status === LeadStatus.RESPONDED)
            ? new Date().toISOString()
            : existingLead.lastContactDate,
      };

      const updatedLeads = leads.map((lead) =>
        lead.id === id ? updatedLead : lead
      );

      setLeads(updatedLeads);
      localStorageService.saveLeads(updatedLeads);

      return updatedLead;
    } catch (err) {
      const errorMessage = 'Error al actualizar el lead';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteLead = async (id: string): Promise<void> => {
    try {
      setError(null);

      const updatedLeads = leads.filter((lead) => lead.id !== id);
      setLeads(updatedLeads);
      localStorageService.saveLeads(updatedLeads);
    } catch (err) {
      const errorMessage = 'Error al eliminar el lead';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getLeadById = (id: string): Lead | undefined => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        loading,
        error,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = (): LeadsContextType => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads debe ser usado dentro de un LeadsProvider');
  }
  return context;
};
