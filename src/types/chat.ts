export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  avatar: string;
}

export interface User {
  id?: string;
  name: string;
  avatar: string;
  is_anonymous?: boolean;
}