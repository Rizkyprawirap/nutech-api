CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    password    VARCHAR(255) NOT NULL,
	url 		VARCHAR(255)  null,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ NULL
);




CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_name VARCHAR(100) NOT NULL,
  banner_image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE services (
  service_code VARCHAR(50) PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  service_icon TEXT NOT NULL,
  service_tariff INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE users_balance (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  balance BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE user_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),

  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  service_code VARCHAR(50),           
  transaction_type VARCHAR(20) NOT NULL, 
  description TEXT,

  total_amount BIGINT NOT NULL,

  created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users_balance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  old_balance BIGINT NOT NULL,
  new_balance BIGINT NOT NULL,
  amount BIGINT NOT NULL,            
  action_type VARCHAR(20) NOT NULL,  
  reference_transaction UUID,        
  created_on TIMESTAMP DEFAULT NOW()
);




