// Admin DTOs — mirror the ASP.NET Core Admin* responses (camelCase JSON, enums as names).

export type Paged<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminProfile = { id: number; email: string; displayName: string; lastLoginAt: string | null };

export type AuthResponse = { accessToken: string; accessTokenExpiresAt: string; admin: AdminProfile };

export type ProjectListItem = {
  id: number;
  titleAr: string;
  titleEn: string;
  slugAr: string;
  slugEn: string | null;
  coverImageUrl: string | null;
  isReal: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  imagesCount: number;
  createdAt: string;
  updatedAt: string | null;
};

export type ProjectImage = { id: number; url: string; altAr: string; altEn: string; displayOrder: number };

export type ProjectAdmin = {
  id: number;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  slugAr: string;
  slugEn: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  coverImageUrl: string | null;
  isReal: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
  images: ProjectImage[];
};

export type ArticleListItem = {
  id: number;
  titleAr: string;
  titleEn: string;
  slugAr: string;
  slugEn: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  viewsCount: number;
  createdAt: string;
  updatedAt: string | null;
};

export type ArticleAdmin = {
  id: number;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  slugAr: string;
  slugEn: string | null;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescriptionAr: string;
  seoDescriptionEn: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  viewsCount: number;
  createdAt: string;
  updatedAt: string | null;
};

export type ServiceType =
  | "WebDevelopment"
  | "ApiDevelopment"
  | "SystemArchitecture"
  | "ProcessAutomation"
  | "Consulting"
  | "Maintenance"
  | "Other";

export type InquiryListItem = {
  id: number;
  clientName: string;
  email: string;
  serviceType: ServiceType;
  preview: string;
  createdAt: string;
  isRead: boolean;
};

export type Inquiry = {
  id: number;
  clientName: string;
  email: string;
  phone: string | null;
  serviceType: ServiceType;
  details: string;
  language: "Ar" | "En";
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
};

export type DashboardStats = {
  projectsTotal: number;
  projectsPublished: number;
  projectsFeatured: number;
  articlesTotal: number;
  articlesPublished: number;
  articleViewsTotal: number;
  inquiriesTotal: number;
  inquiriesUnread: number;
  topArticles: { id: number; titleAr: string; titleEn: string; viewsCount: number }[];
};
