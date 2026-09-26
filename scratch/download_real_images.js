import fs from 'fs';
import path from 'path';

const imagesToDownload = [
  // --- Destinations ---
  {
    target: 'public/images/destinations/udaipur.jpg',
    urls: [
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=85',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/City_Palace_Udaipur.jpg/1280px-City_Palace_Udaipur.jpg'
    ]
  },
  {
    target: 'public/images/destinations/ooty.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Nilgiri_Mountain_Railway_X_class_loco.jpg/1280px-Nilgiri_Mountain_Railway_X_class_loco.jpg'
    ]
  },
  {
    target: 'public/images/destinations/pondicherry.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/French_Quarter%2C_Pondicherry.jpg/1280px-French_Quarter%2C_Pondicherry.jpg'
    ]
  },
  {
    target: 'public/images/destinations/mumbai.jpg',
    urls: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Gateway_of_India_and_Taj_Mahal_Palace.jpg/1280px-Gateway_of_India_and_Taj_Mahal_Palace.jpg'
    ]
  },
  {
    target: 'public/images/destinations/hampi.jpg',
    urls: [
      'https://images.unsplash.com/photo-1600100397608-f010f4438363?auto=format&fit=crop&w=1200&q=85',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Stone_Chariot_at_Vittala_Temple_Complex_Hampi.jpg/1280px-Stone_Chariot_at_Vittala_Temple_Complex_Hampi.jpg'
    ]
  },
  {
    target: 'public/images/destinations/andaman.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=85',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Radhanagar_Beach%2C_Havelock_Island.jpg/1280px-Radhanagar_Beach%2C_Havelock_Island.jpg'
    ]
  },

  // --- Udaipur Attractions ---
  {
    target: 'public/images/attractions/udaipur_city_palace.jpg',
    urls: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/udaipur_lake_pichola.jpg',
    urls: [
      'https://images.unsplash.com/photo-1609137144820-221e7d8f375c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/udaipur_monsoon_palace.jpg',
    urls: [
      'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/udaipur_saheliyon.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // --- Ooty Attractions ---
  {
    target: 'public/images/attractions/ooty_toy_train.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/ooty_botanical.jpg',
    urls: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/ooty_doddabetta.jpg',
    urls: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/ooty_lake.jpg',
    urls: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // --- Pondicherry Attractions ---
  {
    target: 'public/images/attractions/pondicherry_white_town.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/pondicherry_promenade.jpg',
    urls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/pondicherry_auroville.jpg',
    urls: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/pondicherry_paradise.jpg',
    urls: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // --- Mumbai Attractions ---
  {
    target: 'public/images/attractions/mumbai_gateway.jpg',
    urls: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be86c53210f?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/mumbai_marine_drive.jpg',
    urls: [
      'https://images.unsplash.com/photo-1566552881560-0be86c53210f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/mumbai_elephanta.jpg',
    urls: [
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/mumbai_sea_link.jpg',
    urls: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be86c53210f?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // --- Hampi Attractions ---
  {
    target: 'public/images/attractions/hampi_chariot.jpg',
    urls: [
      'https://images.unsplash.com/photo-1600100397608-f010f4438363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/hampi_virupaksha.jpg',
    urls: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010f4438363?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/hampi_matanga.jpg',
    urls: [
      'https://images.unsplash.com/photo-1609137144820-221e7d8f375c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/hampi_lotus_mahal.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010f4438363?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // --- Andaman Attractions ---
  {
    target: 'public/images/attractions/andaman_radhanagar.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/andaman_cellular_jail.jpg',
    urls: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/andaman_elephant_beach.jpg',
    urls: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    target: 'public/images/attractions/andaman_neil_island.jpg',
    urls: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1000&q=80'
    ]
  }
];

async function downloadAll() {
  for (const item of imagesToDownload) {
    const destPath = path.resolve(item.target);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    let success = false;
    for (const url of item.urls) {
      try {
        console.log(`Downloading ${path.basename(item.target)} from ${url.substring(0, 45)}...`);
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(destPath, buffer);
          console.log(`✓ Saved ${item.target} (${Math.round(buffer.length / 1024)} KB)`);
          success = true;
          break;
        }
      } catch (err) {
        console.warn(`  Failed from ${url.substring(0, 30)}: ${err.message}`);
      }
    }
    if (!success) {
      console.error(`❌ Could not download ${item.target}`);
    }
  }
  console.log('All downloads completed!');
}

downloadAll();

