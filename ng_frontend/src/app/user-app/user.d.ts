import { PrimeNgSeverity } from '@lib/definitions';

export interface ToastMessage {
    type: PrimeNgSeverity;
    message: string;
}