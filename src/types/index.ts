export interface Lead {
  id: string;
  name: string;
  email?: string;
  company?: string;
  position?: string;
  linkedinUrl: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  RESPONDED = 'responded',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  REJECTED = 'rejected',
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
