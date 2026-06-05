import Papa from 'papaparse';
import { VetClinic } from '../types';

// Using Google Sheets CSV export
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_7qn9VFA2juS2A3k4RSxorZDApwrYP6ZHAagAuiGLRdjA1XDr31Fm2Ms9qQWDBWyhBIVkQxup_kM2/pub?output=csv";

export const fetchVetData = async (): Promise<VetClinic[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.data.length > 0) {
              console.log("CSV First Row:", results.data[0]);
              console.log("CSV Keys:", Object.keys(results.data[0] as object));
          }
          
          const clinics: VetClinic[] = results.data
            // Ensure essential rows exist
            .filter((row: any) => row['Latitude'] && row['Longitude'] && row['Sağlık Tesisi Adı'])
            .map((row: any, index) => {
              // Parse coordinates carefully, handle comma as decimal if present from Turkish formats
              const latStr = String(row['Latitude']).replace(',', '.');
              const lngStr = String(row['Longitude']).replace(',', '.');
              
              // Robustly look for media column
              let mediaRaw = null;
              for (const key in row) {
                if (key.trim().toLowerCase() === 'media') {
                  mediaRaw = row[key];
                  break;
                }
              }
              
              return {
                id: `vet-${index}`,
                name: row['Sağlık Tesisi Adı'].trim(),
                category: row['Ana Kategori']?.trim() || '',
                subCategory: row['Alt Kategori']?.trim() || '',
                district: row['İlçe Adı']?.trim() || '',
                neighborhood: row['Mahalle Adı']?.trim() || '',
                address: row['ADRES']?.trim() || '',
                lat: parseFloat(latStr),
                lng: parseFloat(lngStr),
                media: mediaRaw ? String(mediaRaw).trim() : null
              };
            });
          
          console.log(`Parsed ${clinics.length} clinics. Sample Media:`, clinics.find(c => c.media)?.media);
          resolve(clinics);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
