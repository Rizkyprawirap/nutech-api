export function QueryGetMembershipBalance() {
  return `
      SELECT
         balance
      FROM
         users_balance
      WHERE 
         user_id = $1
      FOR UPDATE;
   `;
}

export function QueryAddToBalance() {
  return `
      UPDATE 
         users_balance
      SET 
         balance = balance + $1,
         updated_at = NOW()
      WHERE 
         user_id = $2
      RETURNING 
         balance;
   `;
}

export function QueryAddTransaction() {
  return `
      INSERT INTO user_transactions (
         invoice_number,
         user_id,
         transaction_type,
         total_amount,
         created_on
      ) VALUES (
         $1, 
         $2, 
         $3, 
         $4, 
         NOW()
      );
   `;
}

export function QueryGetServiceByCode() {
  return `
      SELECT 
         service_code,
         service_name,
         service_icon,
         service_tariff
      FROM 
         services
      WHERE 
         service_code = $1
   `;
}

export function QueryLockUserBalance() {
  return `
      SELECT
         balance 
      FROM 
         users_balance
      WHERE 
         user_id = $1
      FOR UPDATE
   `;
}

export function QueryDeductBalance() {
  return `
      UPDATE 
         users_balance
      SET 
         balance = balance - $1,
         updated_at = NOW()
      WHERE    
         user_id = $2
      RETURNING balance;
   `;
}

export function QueryInsertServiceTransaction() {
  return `
      INSERT INTO user_transactions (
         invoice_number,
         user_id,
         service_code,
         transaction_type,
         description,
         total_amount,
         created_on
      ) VALUES (
         $1,
         $2,
         $3,
         $4,
         $5,
         $6,
         NOW()
      ) RETURNING id
   `;
}

export function QueryInsertBalanceHistory() {
  return `
      INSERT INTO users_balance_history (
         user_id,
         old_balance,
         new_balance,
         amount,
         action_type,
         reference_transaction
      ) VALUES (
         $1, 
         $2, 
         $3, 
         $4, 
         $5, 
         $6
      )
   `;
}

export function QueryGetTransactionHistory() {
  return `
   SELECT
      invoice_number,
      transaction_type,
      description,
      total_amount,
      created_on
   FROM 
      user_transactions
   WHERE 
      user_id = $1
   ORDER BY 
      created_on DESC
   LIMIT $2
   OFFSET $3
`;
}
