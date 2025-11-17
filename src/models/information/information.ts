export function QueryGetInformationBanner() {
  return `
      SELECT 
         id,
         banner_name,
         banner_image,
         description,
         created_at,
         updated_at
      FROM  banners
      LIMIT $1
   `;
}

export function QueryGetInformationService() {
  return `
      SELECT 
         id,
         service_code,
         service_name,
         service_icon,
         service_tariff,
         created_at,
         updated_at
      FROM services
      LIMIT $1
   `;
}
