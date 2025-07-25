export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  avatar: string;
}

export interface User {
  name: string;
  avatar: string;
}