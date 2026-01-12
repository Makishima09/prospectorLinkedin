export interface Lead {
  id: string;
  name: string;
  position?: string;
  company: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  RESPONDED = 'responded',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  LOST = 'lost',
}

export interface LeadFormData {
  name: string;
  position?: string;
  company: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  tags: string[];
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  leadsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}
