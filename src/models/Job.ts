export type JobStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

type Contact = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
};

export type Job = {
  id: string;
  name: string;
  status?: JobStatus;
  url?: string;
  mainContact?: Contact;
  salary?: number | [number, number];
  notes?: string;
  tags?: string[];
};
