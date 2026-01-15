/**
 * Script: admin:approve-device
 *
 * Approuve un device en attente (status: pending → active)
 *
 * Usage:
 *   pnpm admin:approve-device <deviceId>
 *
 * Environnement:
 *   API_URL      - URL de l'API (défaut: http://localhost:3000)
 *   ADMIN_API_KEY - Clé API admin (requis)
 */

const API_URL = process.env.API_URL ?? "http://localhost:3000";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

const main = async () => {
  // Vérifier les arguments
  const deviceId = process.argv[2];

  if (!deviceId) {
    console.error("❌ Usage: pnpm admin:approve-device <deviceId>");
    process.exit(1);
  }

  if (!ADMIN_API_KEY) {
    console.error("❌ Variable d'environnement ADMIN_API_KEY manquante");
    process.exit(1);
  }

  console.log(`🔄 Approbation du device ${deviceId}...`);

  try {
    const response = await fetch(
      `${API_URL}/admin/devices/${deviceId}/approve`,
      {
        method: "POST",
        headers: {
          "x-api-key": ADMIN_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as { message?: string };

      if (response.status === 404) {
        console.error(`❌ Device non trouvé: ${deviceId}`);
      } else if (response.status === 401) {
        console.error(`❌ Clé API invalide`);
      } else {
        console.error(`❌ Erreur ${response.status}: ${response.statusText}`);
        if (errorData.message) {
          console.error(`   ${errorData.message}`);
        }
      }
      process.exit(1);
    }

    await response.json();
    console.log(`✅ Device approuvé avec succès`);
    console.log(`   Device ID: ${deviceId}`);
    console.log(`   Status: active`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Erreur de connexion: ${error.message}`);
    } else {
      console.error(`❌ Erreur inconnue`);
    }
    process.exit(1);
  }
};

main();
