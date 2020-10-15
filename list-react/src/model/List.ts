import { ListItem } from "./ListItem";
export interface List {
  id: number;
  name: string;
  description: string;
  items: ListItem[];
}
