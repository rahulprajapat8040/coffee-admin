export interface ILoggedInUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentOrganizationId?: string;
  organizationMembers: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  role: string;
  organizationId: string;
  organization: Organization;
}

export interface Organization {
  name: string;
  slug: string;
  brandColor: string;
  logo?: string;
}
