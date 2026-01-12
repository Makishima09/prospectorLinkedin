import { Lead } from '@/types';

const STORAGE_KEY = 'prospector-linkedin-leads';

export const localStorageService = {
  getLeads: (): Lead[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const leads = JSON.parse(stored);
      return Array.isArray(leads) ? leads : [];
    } catch (error) {
      console.error('Error loading leads from localStorage:', error);
      return [];
    }
  },

  saveLeads: (leads: Lead[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (error) {
      console.error('Error saving leads to localStorage:', error);
      throw new Error('No se pudieron guardar los leads');
    }
  },

  addLead: (lead: Lead): void => {
    const leads = localStorageService.getLeads();
    leads.push(lead);
    localStorageService.saveLeads(leads);
  },

  updateLead: (updatedLead: Lead): void => {
    const leads = localStorageService.getLeads();
    const index = leads.findIndex((lead) => lead.id === updatedLead.id);

    if (index !== -1) {
      leads[index] = updatedLead;
      localStorageService.saveLeads(leads);
    }
  },

  deleteLead: (leadId: string): void => {
    const leads = localStorageService.getLeads();
    const filteredLeads = leads.filter((lead) => lead.id !== leadId);
    localStorageService.saveLeads(filteredLeads);
  },

  getLeadById: (leadId: string): Lead | undefined => {
    const leads = localStorageService.getLeads();
    return leads.find((lead) => lead.id === leadId);
  },

  clearLeads: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
