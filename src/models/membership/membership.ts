export function QueryInsertMembership() {
  return `
      INSERT INTO users (
        id,
        email,
        password,
        first_name,
        last_name,
        created_at,
        updated_at
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        NOW(),
        NOW()
      )
  `;
}

export function QueryInsertMembershipBalance() {
  return `
      INSERT INTO users_balance (
        user_id,
        balance,
        updated_at
      ) VALUES (
        $1,
        $2,
        NOW()
      )
  `;
}

export function QueryGetMembershipByEmail() {
  return `
      SELECT 
        id,
        email,
        password,
        first_name,
        last_name,
        created_at,
        updated_at
      FROM  users
      WHERE email = $1
  `;
}

export function QueryUpdateMembershipProfile(fields: string[]) {
  const sets = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

  return `
    UPDATE users
    SET ${sets}, updated_at = NOW()
    WHERE email = $${fields.length + 1}
  `;
}

export function QueryGetMembershipWithProfileImageByID() {
  return `
      SELECT 
        u.email,
        u.password,
        u.first_name,
        u.last_name,
        u.created_at,
        u.updated_at,
        u.url AS profile_image
      FROM users u
      WHERE u.email = $1
  `;
}

export function QueryUpdateMembershipProfileImage() {
  return `
    UPDATE users
    SET url = $1, updated_at = NOW()
    WHERE email = $2
  `;
}
