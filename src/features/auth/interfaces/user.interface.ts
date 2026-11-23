export interface ILoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string;
  countryCode?: string | null;
  phoneNo?: string | null;
  profilePic?: string | null;
}
