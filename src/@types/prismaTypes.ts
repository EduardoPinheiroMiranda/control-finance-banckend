export type Installment = {
    id: string;
    installment_number: number;
    installment_value: number;
    due_date: Date;
    shopping_id: string;
    total_installments: number;
};