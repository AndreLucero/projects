export type Uuid = `${string}-${string}-${string}-${string}-${string}`;

export type TailwindColor = 'red'|'yellow'|'blue'|'sky'|'purple'|'violet'|'green'| 'pink'|'gray'|'orange'|'amber'|'cyan'|'emerald'|'indigo'| 'lime'|'rose'|'slate'|'teal';

export type Url = `http://${string}` | `https://${string}`;

export type PrimeNgSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';



/******************** RESPONSES ********************/
export interface GenericResponse{
    status: boolean;
    message: string;
    result?: any
}